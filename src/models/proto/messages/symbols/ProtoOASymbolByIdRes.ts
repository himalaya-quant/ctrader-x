import { BaseProto } from '../../base-proto';
import { ProtoOAArchivedSymbol } from '../../models/ProtoOAArchivedSymbol';
import { ProtoOASymbol } from '../../models/ProtoOASymbol';

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
