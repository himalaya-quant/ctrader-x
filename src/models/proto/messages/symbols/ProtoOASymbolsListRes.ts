import { BaseProto } from '../../base-proto';
import { ProtoOALightSymbol } from '../../models/ProtoOALightSymbol';

export class ProtoOASymbolsListRes extends BaseProto {
    /**
     * The list of symbols.
     */
    symbol: ProtoOALightSymbol[];

    /**
     * The list of archived symbols.
     */
    archivedSymbol: ProtoOALightSymbol[];
}
