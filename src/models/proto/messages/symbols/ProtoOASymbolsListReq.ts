import { BaseProto } from '../../base-proto';

export class ProtoOASymbolsListReq extends BaseProto {
    /**
     * Unique identifier of the trader's account. Used to match responses to trader's accounts.
     */
    ctidTraderAccountId: number;

    /**
     * Whether to include old archived symbols into response.
     */
    includeArchivedSymbols?: boolean;
}
