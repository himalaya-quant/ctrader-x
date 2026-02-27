import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOAArchivedSymbol } from '../../../../../models/proto/models/ProtoOAArchivedSymbol';
import { ProtoOASymbol } from '../../../../../models/proto/models/ProtoOASymbol';

export class ProtoOASymbolByIdRes extends BaseProto {
    /**
     * Symbols entities with the full set of fields.
     */
    symbol: ProtoOASymbol[];

    /**
     * Archived symbols
     */
    archivedSymbol: ProtoOAArchivedSymbol[];
}
