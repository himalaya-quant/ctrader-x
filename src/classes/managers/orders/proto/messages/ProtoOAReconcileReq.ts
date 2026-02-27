import { BaseProto } from '../../../../../models/proto/base-proto';

export class ProtoOAReconcileReq extends BaseProto {
    /**
     * If TRUE, then current protection orders are returned separately,
     * otherwise you can use position.stopLoss and position.takeProfit fields.
     */
    returnProtectionOrders?: boolean;
}
