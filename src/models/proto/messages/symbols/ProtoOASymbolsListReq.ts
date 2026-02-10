import { BaseProto } from '../../base-proto';

export class ProtoOASymbolsListReq extends BaseProto {
    /**
     * Whether to include old archived symbols into response.
     */
    includeArchivedSymbols?: boolean;
}
