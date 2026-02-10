import { BaseProto } from '../../base-proto';
import { ProtoOALightSymbol } from '../../models/ProtoOALightSymbol';

export class ProtoOASymbolsListRes extends BaseProto {
    /**
     * Unique identifier of the trader's account. Used to match responses to trader's accounts.
     */
    ctidTraderAccountId: number;

    /**
     * The list of symbols.
     */
    symbol: ProtoOALightSymbol[];

    /**
     * The list of archived symbols.
     */
    archivedSymbol: ProtoOALightSymbol[];
}
