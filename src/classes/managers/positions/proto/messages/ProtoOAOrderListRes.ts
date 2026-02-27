import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOAOrder } from '../models/ProtoOAOrder';

/**
 * The response to the ProtoOAOrderListReq request.
 */
export class ProtoOAOrderListRes extends BaseProto {
    /**
     * The list of the orders.
     */
    order: ProtoOAOrder[];

    /**
     * If TRUE then the number of records by filter is larger than chunkSize,
     * the response contains the number of records that is equal to chunkSize.
     */
    hasMore?: boolean;
}
