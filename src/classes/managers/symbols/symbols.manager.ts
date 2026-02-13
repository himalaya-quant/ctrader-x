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
import { ProtoOATrendbar } from '../../../models/proto/models/ProtoOATrendbar';
import { CTraderLayerEvent } from '@reiryoku/ctrader-layer/build/src/core/events/CTraderLayerEvent';
import { ProtoOAPayloadType } from '../../../models/proto/payload-types/payload-types.enum';

export interface ISubscribeBarsOptions extends ProtoOASubscribeLiveTrendbarReq {}

export interface IGetSymbolsListOptions {
    includeArchivedSymbols?: boolean;
}

export type GetSymbolsListResult = (ProtoOASymbol & ProtoOALightSymbol)[];

export type SubscribeLiveTrendBarsEvent = {
    bid?: number;
    ask?: number;
    symbolId: number;
    timestamp?: number;
    sessionClose?: number;
    trendbar: ProtoOATrendbar[];
};

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
    ): Promise<ProtoOAGetTrendbarsRes> {
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

        for (let i = 0; i < result.trendbar.length; i++) {
            result.trendbar[i].utcTimestampInMinutes =
                result.trendbar[i].utcTimestampInMinutes! * 60000;
        }
        return result;
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
                const subject = new Subject<SubscribeLiveTrendBarsEvent>();
                this.connection.on(ProtoOASpotEvent.name, (event) => {
                    if (this.isSubscribeLiveTrendBarsEvent(event, opts)) {
                        subject.next(
                            this.spotEventDescriptorToSubscribeLiveBarsEvent(
                                event,
                            ),
                        );
                    }
                });
                return subject;
            }),
        );
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

    private spotEventDescriptorToSubscribeLiveBarsEvent(
        event: CTraderLayerEvent,
    ): SubscribeLiveTrendBarsEvent {
        return {
            symbolId: +event.descriptor.symbolId,
            timestamp: event.descriptor.timestamp
                ? +event.descriptor.timestamp
                : undefined,
            sessionClose: event.descriptor.sessionClose
                ? +event.descriptor.sessionClose
                : undefined,
            ask: event.descriptor.ask ? +event.descriptor.ask : undefined,
            bid: event.descriptor.bid ? +event.descriptor.bid : undefined,
            trendbar: (event.descriptor.trendbar as ProtoOATrendbar[]).map(
                (t) => ({
                    period: t.period,
                    volume: +t.volume,
                    low: t.low ? +t.low : undefined,
                    utcTimestampInMinutes: t.utcTimestampInMinutes,
                    deltaOpen: t.deltaOpen ? +t.deltaOpen : undefined,
                    deltaHigh: t.deltaHigh ? +t.deltaHigh : undefined,
                    deltaClose: t.deltaClose ? +t.deltaClose : undefined,
                }),
            ),
        };
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
