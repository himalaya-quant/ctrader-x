import { CTraderConnection } from '@reiryoku/ctrader-layer';
import { ILogger } from '../../logger';
import { BaseManager } from '../models/base.manager';
import { ICredentials } from '../models/credentials.model';
import { ProtoOASubscribeLiveTrendbarReq } from '../../../models/proto/messages/symbols/ProtoOASubscribeLiveTrendbarReq';
import {
    tap,
    from,
    Subject,
    switchMap,
    catchError,
    BehaviorSubject,
    of,
} from 'rxjs';
import { ProtoOASubscribeSpotsReq } from '../../../models/proto/messages/common/ProtoOASubscribeSpotsReq';
import { ProtoOASubscribeSpotsRes } from '../../../models/proto/messages/common/ProtoOASubscribeSpotsRes';
import { SubscribeSpotEventsError } from './errors/subscribe-spot-events.error';
import { ProtoOASubscribeLiveTrendbarRes } from '../../../models/proto/messages/symbols/ProtoOASubscribeLiveTrendbarRes';
import { SubscribeLiveTrendBarsInternalError } from './errors/subscribe-live-trend-bars.error';
import { ProtoOASpotEvent } from '../../../models/proto/models/ProtoOASpotEvent';
import { CTraderLayerEvent } from '@reiryoku/ctrader-layer/build/src/core/events/CTraderLayerEvent';
import { OHLCV, OHLCVPositions } from '../../../models/common/ohlcv';
import { Price } from '../../../utils/price.utils';
import { TimeFrame } from '../../../utils/timeframe.utils';
import { ProtoOATrendbarPeriod } from '../../../models/proto/models/ProtoOATrendbarPeriod';
import { ProtoOAUnsubscribeLiveTrendbarReq } from '../../../models/proto/messages/symbols/ProtoOAUnsubscribeLiveTrendbarReq';
import { cTraderXError } from '../../models/ctrader-x-error.model';
import { ProtoOAUnsubscribeLiveTrendbarRes } from '../../../models/proto/messages/symbols/ProtoOAUnsubscribeLiveTrendbarRes';
import { UnsubscribeLiveTrendBarsError } from './errors/unsubscribe-live-trend-bars.error';

export interface ISubscribeBarsOptions extends ProtoOASubscribeLiveTrendbarReq {}
export interface IUnsubscribeBarsOptions extends ProtoOAUnsubscribeLiveTrendbarReq {}

export interface SubscribeLiveTrendBarsEvent {
    symbolId: number;
    ohlcv: OHLCV;
    lastBarTime: number;
    period: ProtoOATrendbarPeriod;
}

export interface ILiveBarsSubscriber {
    period: number;
    lastBar: OHLCV | null;
    lastBarTime: number | null;
    subscriber: Subject<unknown>;
}

export interface ILiveBarsSubscribers {
    symbolId: number;
    subscribers: ILiveBarsSubscriber[];
}

export class SymbolsUpdatesManager extends BaseManager {
    private readonly liveBarsSubscriptions$: BehaviorSubject<
        ILiveBarsSubscribers[]
    > = new BehaviorSubject([]);

    private readonly liveBarsSubscriptionsMapper$ =
        this.liveBarsSubscriptions$.pipe(
            tap((values) =>
                values.forEach(({ symbolId }, idx) => {
                    this.liveBarsSubsSymbolsToSubscribersMap.set(symbolId, idx);
                }),
            ),
        );

    private liveBarsSubsSymbolsToSubscribersMap = new Map<number, number>();

    constructor(
        protected readonly credentials: ICredentials,
        protected readonly connection: CTraderConnection,
        protected readonly logger: ILogger,
    ) {
        super();
        this.liveBarsSubscriptionsMapper$.subscribe();

        this.connection.on(ProtoOASpotEvent.name, (event) => {
            if (this.isTrackedSubscribeLiveTrendBarsDescriptor(event)) {
                const { subscribers, idx } =
                    this.getSubscribeLiveTrendBarsSubscriptions(
                        +event.descriptor.symbolId,
                    );
                if (idx === null) return;

                subscribers.subscribers.forEach(
                    ({ lastBar, lastBarTime, period, subscriber }, idx) => {
                        const update =
                            this.spotEventDescriptorToSubscribeLiveBarsEvent(
                                event,
                                period,
                                lastBar,
                                lastBarTime,
                            );
                        if (!update) return;

                        lastBar = update.ohlcv;
                        lastBarTime = update.lastBarTime;
                        subscriber.next({
                            ohlcv: update.ohlcv,
                            period: update.period,
                            symbolId: update.symbolId,
                        });

                        subscribers.subscribers[idx].lastBar = lastBar;
                        subscribers.subscribers[idx].lastBarTime = lastBarTime;
                    },
                );

                this.updateSubscribeLiveTrendBarsSubscriptions(
                    subscribers,
                    idx,
                );
            }
        });
    }

    async unsubscribeLiveTrendBars(opts: IUnsubscribeBarsOptions) {
        this.removeSubscribeLiveTrendBarsSubscription(
            opts.symbolId,
            opts.period,
        );

        const symbolSubscriptions = this.getSubscribeLiveTrendBarsSubscriptions(
            +opts.symbolId,
        );
        if (!symbolSubscriptions.subscribers.subscribers.length) {
            this.logCallAttempt(this.unsubscribeLiveTrendBars, opts);

            const payload: ProtoOAUnsubscribeLiveTrendbarReq = {
                ...opts,
                ctidTraderAccountId: this.credentials.ctidTraderAccountId,
            };

            try {
                await this.connection.sendCommand(
                    ProtoOAUnsubscribeLiveTrendbarReq.name,
                    payload,
                );
            } catch (e) {
                throw this.handleCTraderCallError(
                    e,
                    this.unsubscribeLiveTrendBars,
                    new UnsubscribeLiveTrendBarsError(e),
                );
            }
            this.logCallAttemptSuccess(this.unsubscribeLiveTrendBars, opts);
        }
    }

    subscribeLiveTrendBars(opts: ISubscribeBarsOptions) {
        const subject = new Subject<
            Omit<SubscribeLiveTrendBarsEvent, 'lastBarTime'>
        >();
        this.addSubscribeLiveTrendBarsSubscription(opts.symbolId, {
            lastBar: null,
            lastBarTime: null,
            period: opts.period,
            subscriber: subject,
        });

        return from(
            this.subscribeSpotEvents({
                symbolId: opts.symbolId,
                ctidTraderAccountId: this.credentials.ctidTraderAccountId,
            }),
        ).pipe(
            switchMap(() => this.subscribeLiveTrendBarsInternal(opts)),
            switchMap(() => subject),
            catchError((e) => {
                this.logger.error(
                    `[Symbol: ${opts.symbolId} Period: ${opts.period}] Error subscribing to live trend bars: ${cTraderXError.getMessageError(e)}`,
                );
                this.removeSubscribeLiveTrendBarsSubscription(
                    opts.symbolId,
                    opts.period,
                );
                throw e;
            }),
        );
    }

    private spotEventDescriptorToSubscribeLiveBarsEvent(
        event: CTraderLayerEvent,
        period: ProtoOATrendbarPeriod,
        lastBar: OHLCV | null,
        lastBarTime: number | null,
    ): SubscribeLiveTrendBarsEvent | null {
        let lastBarClone = structuredClone(lastBar);
        let lastBarTimeClone = structuredClone(lastBarTime);

        const price = Price.getPrice(
            +event.descriptor.bid,
            +event.descriptor.ask,
        );
        if (price === null) return null;

        // Calculate at which bar time this tick corresponds
        const barTimestamp = TimeFrame.roundToTimeFrame(
            event.descriptor.timestamp,
            ProtoOATrendbarPeriod[period],
        );

        // If bar timestamp has changed, the previous bar has closed.
        if (lastBarTimeClone && barTimestamp !== lastBarTimeClone) {
            lastBarClone = null; // Reset
        }

        // Initialize new bar if necessary
        if (!lastBarClone) {
            lastBarClone = [barTimestamp, price, price, price, price, 0];
            lastBarTimeClone = barTimestamp;
        }

        // Update current bar
        lastBarClone[OHLCVPositions.HIGH] = Math.max(
            lastBarClone[OHLCVPositions.HIGH],
            price,
        );
        lastBarClone[OHLCVPositions.LOW] = Math.min(
            lastBarClone[OHLCVPositions.LOW],
            price,
        );
        lastBarClone[OHLCVPositions.CLOSE] = price;

        // If there's a trendbar, update the volume, since we cannot calculate it
        if (event.descriptor.trendbar && event.descriptor.trendbar.length > 0) {
            lastBarClone[OHLCVPositions.VOLUME] =
                +event.descriptor.trendbar[0].volume;
        }

        return {
            period,
            ohlcv: lastBarClone,
            symbolId: event.descriptor.symbolId,
            lastBarTime: lastBarClone[OHLCVPositions.TIME],
        };
    }

    private isTrackedSubscribeLiveTrendBarsDescriptor(
        event: CTraderLayerEvent,
    ) {
        return this.liveBarsSubsSymbolsToSubscribersMap.has(
            +event.descriptor.symbolId,
        );
    }

    private getSubscribeLiveTrendBarsSubscriptions(symbolId: number) {
        const idx = this.liveBarsSubsSymbolsToSubscribersMap.get(symbolId);
        if (idx === undefined) {
            this.logger.warn(
                `Received LiveTrendBars update, but no subscriber was found.`,
            );
            return {
                idx: null,
                subscribers: <ILiveBarsSubscribers>{
                    symbolId,
                    subscribers: [],
                },
            };
        }

        return {
            subscribers: this.liveBarsSubscriptions$.getValue()[idx!],
            idx,
        };
    }

    private removeSubscribeLiveTrendBarsSubscription(
        symbolId: number,
        period: ProtoOATrendbarPeriod,
    ) {
        const subscriptionIdx =
            this.liveBarsSubsSymbolsToSubscribersMap.get(symbolId);
        if (subscriptionIdx === undefined) return;

        const symbolSubscriptions =
            this.liveBarsSubscriptions$.getValue()[subscriptionIdx];
        symbolSubscriptions.subscribers =
            symbolSubscriptions.subscribers.filter((s) => {
                if (s.period === period) {
                    s.subscriber.complete();
                    return false;
                }

                return true;
            });

        const allSubscriptions = this.liveBarsSubscriptions$.getValue();
        allSubscriptions[subscriptionIdx] = symbolSubscriptions;
        this.liveBarsSubscriptions$.next([...allSubscriptions]);
    }

    private addSubscribeLiveTrendBarsSubscription(
        symbolId: number,
        subscriber: ILiveBarsSubscriber,
    ) {
        const allSubscriptions = this.liveBarsSubscriptions$.getValue();
        const existingSubscriptionIdx =
            this.liveBarsSubsSymbolsToSubscribersMap.get(symbolId);
        if (existingSubscriptionIdx === undefined) {
            allSubscriptions.push({
                symbolId,
                subscribers: [subscriber],
            });
        } else {
            const existingSubscriberIdx = allSubscriptions[
                existingSubscriptionIdx
            ].subscribers.findIndex(
                ({ period }) => period === subscriber.period,
            );
            if (existingSubscriberIdx !== -1) {
                const existingSubscriber =
                    allSubscriptions[existingSubscriberIdx].subscribers[
                        existingSubscriberIdx
                    ];
                this.logger.warn(
                    `[Symbol: ${symbolId} Period: ${subscriber.period}] Completing previous subscriber subscription in favor of new subscriber`,
                );
                existingSubscriber.subscriber.complete();
                existingSubscriber.subscriber = subscriber.subscriber;
            } else {
                allSubscriptions[existingSubscriptionIdx].subscribers.push(
                    subscriber,
                );
            }
        }

        this.liveBarsSubscriptions$.next([...allSubscriptions]);
    }

    private updateSubscribeLiveTrendBarsSubscriptions(
        subscribers: ILiveBarsSubscribers,
        idx: number,
    ) {
        const allSubscriptions = this.liveBarsSubscriptions$.getValue();
        allSubscriptions[idx] = subscribers;
        this.liveBarsSubscriptions$.next([...allSubscriptions]);
    }

    private async subscribeSpotEvents(opts: ProtoOASubscribeSpotsReq) {
        this.logCallAttempt(this.subscribeSpotEvents);
        const optsClone = structuredClone(opts);
        optsClone.ctidTraderAccountId = this.credentials.ctidTraderAccountId;
        optsClone.subscribeToSpotTimestamp = true;
        try {
            const result = (await this.connection.sendCommand(
                ProtoOASubscribeSpotsReq.name,
                optsClone,
            )) as ProtoOASubscribeSpotsRes;
            this.logCallAttemptSuccess(this.subscribeSpotEvents);
            return result;
        } catch (e) {
            if (cTraderXError.isProtoOAErrorRes(e)) {
                if (e.errorCode === 'ALREADY_SUBSCRIBED')
                    return of<ProtoOASubscribeLiveTrendbarRes>({
                        ctidTraderAccountId: optsClone.ctidTraderAccountId,
                    });
            }
            throw this.handleCTraderCallError(
                e,
                this.subscribeSpotEvents,
                new SubscribeSpotEventsError(e),
            );
        }
    }

    private async subscribeLiveTrendBarsInternal(
        opts: ProtoOASubscribeLiveTrendbarReq,
    ) {
        this.logCallAttempt(this.subscribeLiveTrendBarsInternal);
        const optsClone = structuredClone(opts);
        optsClone.ctidTraderAccountId = this.credentials.ctidTraderAccountId;
        try {
            const result = (await this.connection.sendCommand(
                ProtoOASubscribeLiveTrendbarReq.name,
                optsClone,
            )) as ProtoOASubscribeLiveTrendbarRes;
            this.logCallAttemptSuccess(this.subscribeLiveTrendBarsInternal);
            return result;
        } catch (e) {
            if (cTraderXError.isProtoOAErrorRes(e)) {
                if (e.errorCode === 'ALREADY_SUBSCRIBED')
                    return of<ProtoOASubscribeLiveTrendbarRes>({
                        ctidTraderAccountId: optsClone.ctidTraderAccountId,
                    });
            }
            throw this.handleCTraderCallError(
                e,
                this.subscribeLiveTrendBarsInternal,
                new SubscribeLiveTrendBarsInternalError(e),
            );
        }
    }
}
