import { CTraderConnection } from '@reiryoku/ctrader-layer';
import { ILogger } from '../../logger';
import { BaseManager } from '../models/base.manager';
import { ProtoOASymbolsListReq } from '../../../models/proto/messages/symbols/ProtoOASymbolsListReq';
import { ICredentials } from '../models/credentials.model';
import { ProtoOASymbolsListRes } from '../../../models/proto/messages/symbols/ProtoOASymbolsListRes';
import { GetSymbolsListError } from './errors/get-symbols-list.error';
import { ProtoOAGetTrendbarsRes } from '../../../models/proto/messages/symbols/ProtoOAGetTrendbarsRes';
import { ProtoOAGetTrendbarsReq } from '../../../models/proto/messages/symbols/ProtoOAGetTrendbarsReq';
import { GetTrendBarsError } from './errors/get-trend-bars.error';
import { ProtoOASymbolByIdRes } from '../../../models/proto/messages/symbols/ProtoOASymbolByIdRes';
import { ProtoOASymbolByIdReq } from '../../../models/proto/messages/symbols/ProtoOASymbolByIdReq';
import { GetSymbolsDetailsError } from './errors/get-symbols-details.error';
import { ProtoOASymbol } from '../../../models/proto/models/ProtoOASymbol';
import { ProtoOALightSymbol } from '../../../models/proto/models/ProtoOALightSymbol';
import { ProtoOASubscribeLiveTrendbarReq } from '../../../models/proto/messages/symbols/ProtoOASubscribeLiveTrendbarReq';
import { from, Subject, switchMap } from 'rxjs';
import { ProtoOASubscribeSpotsReq } from '../../../models/proto/messages/common/ProtoOASubscribeSpotsReq';
import { ProtoOASubscribeSpotsRes } from '../../../models/proto/messages/common/ProtoOASubscribeSpotsRes';
import { SubscribeSpotEventsError } from './errors/subscribe-spot-events.error';
import { ProtoOASubscribeLiveTrendbarRes } from '../../../models/proto/messages/symbols/ProtoOASubscribeLiveTrendbarRes';
import { SubscribeLiveTrendBarsInternalError } from './errors/subscribe-live-trend-bars.error';
import { ProtoOASpotEvent } from '../../../models/proto/models/ProtoOASpotEvent';
import { CTraderLayerEvent } from '@reiryoku/ctrader-layer/build/src/core/events/CTraderLayerEvent';
import { ProtoOAPayloadType } from '../../../models/proto/payload-types/payload-types.enum';
import { TrendBarUtils } from '../../../utils/trendbar.utils';
import { OHLCV, OHLCVPositions } from '../../../models/common/ohlcv';
import { Price } from '../../../utils/price.utils';
import { TimeFrame } from '../../../utils/timeframe.utils';
import { ProtoOATrendbarPeriod } from '../../../models/proto/models/ProtoOATrendbarPeriod';

export interface ISubscribeBarsOptions extends ProtoOASubscribeLiveTrendbarReq {}

export interface IGetSymbolsListOptions {
    includeArchivedSymbols?: boolean;
}

export type GetSymbolsListResult = (ProtoOASymbol & ProtoOALightSymbol)[];

export interface SubscribeLiveTrendBarsEvent {
    symbolId: number;
    ohlcv: OHLCV;
    lastBarTime: number;
    period: ProtoOATrendbarPeriod;
}

export class SymbolsManager extends BaseManager {
    constructor(
        protected readonly credentials: ICredentials,
        protected readonly connection: CTraderConnection,
        protected readonly logger: ILogger,
    ) {
        super();
    }

    async getSymbolsList(
        opts?: IGetSymbolsListOptions,
    ): Promise<GetSymbolsListResult> {
        this.logCallAttempt(this.getSymbolsList);

        const payload: ProtoOASymbolsListReq = {
            includeArchivedSymbols: opts?.includeArchivedSymbols,
            ctidTraderAccountId: this.credentials.ctidTraderAccountId,
        };

        let result: ProtoOASymbolsListRes;
        try {
            result = (await this.connection.sendCommand(
                ProtoOASymbolsListReq.name,
                payload,
            )) as ProtoOASymbolsListRes;
        } catch (e) {
            throw this.handleCTraderCallError(
                e,
                this.getSymbolsList,
                new GetSymbolsListError(e),
            );
        }

        this.logCallAttemptSuccess(this.getSymbolsList);

        const fullSymbols = await this.getSymbolsDetails(
            result.symbol.map(({ symbolId }) => +symbolId),
        );

        return fullSymbols.symbol.map((symbol) => ({
            ...symbol,
            ...result.symbol.find((s) => s.symbolId === symbol.symbolId),
        }));
    }

    async getSymbolsDetails(
        symbolsIds: number[],
    ): Promise<ProtoOASymbolByIdRes> {
        this.logCallAttempt(this.getSymbolsDetails);

        const payload: ProtoOASymbolByIdReq = {
            symbolId: symbolsIds,
            ctidTraderAccountId: this.credentials.ctidTraderAccountId,
        };

        let result: ProtoOASymbolByIdRes;
        try {
            result = (await this.connection.sendCommand(
                ProtoOASymbolByIdReq.name,
                payload,
            )) as ProtoOASymbolByIdRes;
        } catch (e) {
            throw this.handleCTraderCallError(
                e,
                this.getSymbolsDetails,
                new GetSymbolsDetailsError(e),
            );
        }

        this.logCallAttemptSuccess(this.getSymbolsDetails);
        return result;
    }

    async getTrendBars(
        opts: Omit<ProtoOAGetTrendbarsReq, 'ctidTraderAccountId'>,
    ): Promise<OHLCV[]> {
        this.logCallAttempt(this.getTrendBars);
        let result: ProtoOAGetTrendbarsRes;
        try {
            const payload: ProtoOAGetTrendbarsReq = {
                ...opts,
                ctidTraderAccountId: this.credentials.ctidTraderAccountId,
            };
            result = (await this.connection.sendCommand(
                ProtoOAGetTrendbarsReq.name,
                payload,
            )) as ProtoOAGetTrendbarsRes;
        } catch (e) {
            throw this.handleCTraderCallError(
                e,
                this.getTrendBars,
                new GetTrendBarsError(e),
            );
        }

        this.logCallAttemptSuccess(this.getTrendBars);

        const symbolInfo = await this.getSymbolsDetails([opts.symbolId]);
        const precision = +symbolInfo.symbol[0].digits;
        return TrendBarUtils.mapTrendbarsToOHLCV(result.trendbar, precision);
    }

    subscribeLiveTrendBars(opts: ISubscribeBarsOptions) {
        return from(
            this.subscribeSpotEvents({
                symbolId: opts.symbolId,
                ctidTraderAccountId: this.credentials.ctidTraderAccountId,
            }),
        ).pipe(
            switchMap(() => this.subscribeLiveTrendBarsInternal(opts)),
            switchMap(() => {
                const subject = new Subject<
                    Omit<SubscribeLiveTrendBarsEvent, 'lastBarTime'>
                >();
                let lastBar: OHLCV | null = null;
                let lastBarTime: number | null = null;
                this.connection.on(ProtoOASpotEvent.name, (event) => {
                    if (this.isSubscribeLiveTrendBarsEvent(event, opts)) {
                        const update =
                            this.spotEventDescriptorToSubscribeLiveBarsEvent(
                                event,
                                opts.period,
                                lastBar,
                                lastBarTime,
                            );
                        if (!update) return;
                        lastBar = update.ohlcv;
                        lastBarTime = update.lastBarTime;
                        subject.next({
                            ohlcv: update.ohlcv,
                            period: update.period,
                            symbolId: update.symbolId,
                        });
                    }
                });
                return subject;
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
            this.logger.debug(
                `🆕 New Bar! ${new Date(barTimestamp).toLocaleString()}`,
            );
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

    private isSubscribeLiveTrendBarsEvent(
        event: CTraderLayerEvent,
        opts: ISubscribeBarsOptions,
    ) {
        const sameAccountId =
            +event.descriptor.ctidTraderAccountId ===
            this.credentials.ctidTraderAccountId;
        const sameSymbolId = +event.descriptor.symbolId === opts.symbolId;
        const isSpotEvent =
            event.type === ProtoOAPayloadType.PROTO_OA_SPOT_EVENT;
        return isSpotEvent && sameSymbolId && sameAccountId;
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
            return result;
        } catch (e) {
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
            return result;
        } catch (e) {
            throw this.handleCTraderCallError(
                e,
                this.subscribeLiveTrendBarsInternal,
                new SubscribeLiveTrendBarsInternalError(e),
            );
        }
    }
}
