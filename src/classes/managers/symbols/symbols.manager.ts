import { CTraderConnection } from '@reiryoku/ctrader-layer';
import { ILogger } from '../../logger';
import { BaseManager } from '../models/base.manager';
import { ProtoOASymbolsListReq } from '../../../models/proto/messages/symbols/ProtoOASymbolsListReq';
import { ICredentials } from '../models/credentials.model';
import { ProtoOASymbolsListRes } from '../../../models/proto/messages/symbols/ProtoOASymbolsListRes';
import { GetSymbolsListError } from './errors/get-symbols-list.error';
import { cTraderXError } from '../../models/ctrader-x-error.model';

export interface IGetSymbolsListOptions {
    includeArchivedSymbols?: boolean;
}

export class SymbolsManager extends BaseManager {
    constructor(
        private readonly credentials: ICredentials,
        private readonly connection: CTraderConnection,
        protected readonly logger: ILogger,
    ) {
        super();
    }

    async getSymbolsList(opts?: IGetSymbolsListOptions): Promise<ProtoOASymbolsListRes> {
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
            const message = cTraderXError.getMessageError(e);
            this.logCallAttemptFailure(this.getSymbolsList, message);
            throw new GetSymbolsListError(message);
        }

        this.logCallAttemptSuccess(this.getSymbolsList);
        return result;
    }
}
