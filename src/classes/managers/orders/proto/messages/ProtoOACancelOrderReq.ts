import { BaseProto } from '../../../../../models/proto/base-proto';

/**
 * Request for cancelling existing pending order.
 * Allowed only if the accessToken has "trade" permissions for the trading account.
 */
export class ProtoOACancelOrderReq extends BaseProto {
    /**
     * The unique ID of the order.
     */
    orderId: number;
}
