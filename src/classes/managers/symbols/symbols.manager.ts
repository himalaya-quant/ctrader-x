import { CTraderConnection } from '@himalaya-quant/ctrader-layer';
import { ILogger } from '../../logger';
import { BaseManager } from '../models/base.manager';
import { ProtoOASymbolsListReq } from './proto/messages/ProtoOASymbolsListReq';
import { ICredentials } from '../models/credentials.model';
import { ProtoOASymbolsListRes } from './proto/messages/ProtoOASymbolsListRes';
import { GetSymbolsListError } from './errors/get-symbols-list.error';
import { ProtoOAGetTrendbarsRes } from './proto/messages/ProtoOAGetTrendbarsRes';
import { ProtoOAGetTrendbarsReq } from './proto/messages/ProtoOAGetTrendbarsReq';
import { GetTrendBarsError } from './errors/get-trend-bars.error';
import { ProtoOASymbolByIdRes } from './proto/messages/ProtoOASymbolByIdRes';
import { ProtoOASymbolByIdReq } from './proto/messages/ProtoOASymbolByIdReq';
import { GetSymbolsDetailsError } from './errors/get-symbols-details.error';
import { ProtoOASymbol } from '../../../models/proto/models/ProtoOASymbol';
import { ProtoOALightSymbol } from '../../../models/proto/models/ProtoOALightSymbol';
import { TrendBarUtils } from '../../../utils/trendbar.utils';
import { OHLCV } from '../../../models/common/ohlcv';
import { ProtoOATrendbarPeriod } from '../../../models/proto/models/ProtoOATrendbarPeriod';

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
}
