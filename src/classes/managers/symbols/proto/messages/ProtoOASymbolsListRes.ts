import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOALightSymbol } from '../../../../../models/proto/models/ProtoOALightSymbol';

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
