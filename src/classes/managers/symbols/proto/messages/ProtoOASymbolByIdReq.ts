import { BaseProto } from '../../../../../models/proto/base-proto';

export class ProtoOASymbolByIdReq extends BaseProto {
    /**
     * Unique identifier of the symbols in cTrader platform.
     */
    symbolId: number[];
}
