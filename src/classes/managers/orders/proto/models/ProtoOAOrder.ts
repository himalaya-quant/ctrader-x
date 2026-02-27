import { ProtoOATradeData } from './ProtoOATradeData';
import { BaseProto } from '../../../../../models/proto/base-proto';

import { ProtoOATimeInForce } from '../enums/ProtoOATimeInForce';
import { ProtoOAOrderTriggerMethod } from '../enums/ProtoOAOrderTriggerMethod';
import { ProtoOAOrderType } from '../enums/ProtoOAOrderType';
import { ProtoOAOrderStatus } from '../enums/ProtoOAOrderStatus';

export class ProtoOAOrder extends BaseProto {
    /**
     * The unique ID of the order. Note: trader might have two orders with the same id if orders are taken from accounts from different brokers.
     */
    orderId: number;

    /**
     * Detailed trader data.
     */
    tradeData: ProtoOATradeData;

    /**
     * Order type.
     * The keys of the enum ProtoOAOrderType.
     *
     * cTrader wants the numeric value
     * of the enum when sending the order, but replies with the enum key when
     * emitting events
     */
    orderType: keyof ProtoOAOrderType;

    /**
     * Order status.
     * The keys of the enum ProtoOAOrderStatus.
     *
     * cTrader wants the numeric value
     * of the enum when sending the order, but replies with the enum key when
     * emitting events
     */
    orderStatus: keyof ProtoOAOrderStatus;

    /**
     * The Unix time in milliseconds of expiration if the order has time in force GTD.
     */
    expirationTimestamp?: number;

    /**
     * Price at which an order was executed. For order with FILLED status.
     */
    executionPrice?: number;

    /**
     * Part of the volume that was filled in cents (e.g. 1000 in protocol means 10.00 units).
     */
    executedVolume?: number;

    /**
     * The Unix time in milliseconds of the last update of the order.
     */
    utcLastUpdateTimestamp?: number;

    /**
     * Used for Market Range order with combination of slippageInPoints to specify price range were order can be executed.
     */
    baseSlippagePrice?: number;

    /**
     * Used for Market Range and STOP_LIMIT orders to to specify price range were order can be executed.
     */
    slippageInPoints?: number;

    /**
     * If TRUE then the order is closing part of whole position. Must have specified positionId.
     */
    closingOrder?: boolean;

    /**
     * Valid only for LIMIT orders.
     */
    limitPrice?: number;

    /**
     * Valid only for STOP and STOP_LIMIT orders.
     */
    stopPrice?: number;

    /**
     * Absolute stopLoss price.
     */
    stopLoss?: number;

    /**
     * Absolute takeProfit price.
     */
    takeProfit?: number;

    /**
     * Optional ClientOrderId. Max Length = 50 chars.
     */
    clientOrderId?: string;

    /**
     * Order's time in force. Depends on order type.
     * The keys of the enum ProtoOATimeInForce.
     *
     * cTrader wants the numeric value
     * of the enum when sending the order, but replies with the enum key when
     * emitting events
     */
    timeInForce?: keyof ProtoOATimeInForce;

    /**
     * ID of the position linked to the order (e.g. closing order, order that increase volume of a specific position, etc.).
     */
    positionId?: number;

    /**
     * Relative stopLoss that can be specified instead of absolute as one. Specified in 1/100000 of unit of a price. (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782) For BUY stopLoss = entryPrice - relativeStopLoss, for SELL stopLoss = entryPrice + relativeStopLoss.
     */
    relativeStopLoss?: number;

    /**
     * Relative takeProfit that can be specified instead of absolute one. Specified in 1/100000 of unit of a price. (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782) ForBUY takeProfit = entryPrice + relativeTakeProfit, for SELL takeProfit = entryPrice - relativeTakeProfit.
     */
    relativeTakeProfit?: number;

    /**
     * If TRUE then order was stopped out from server side.
     */
    isStopOut?: boolean;

    /**
     * If TRUE then order is trailingStopLoss. Valid for STOP_LOSS_TAKE_PROFIT order.
     */
    trailingStopLoss?: boolean;

    /**
     * Trigger method for the order. Valid only for STOP and STOP_LIMIT orders.
     * The keys of the enum ProtoOAOrderTriggerMethod.
     *
     * cTrader wants the numeric value
     * of the enum when sending the order, but replies with the enum key when
     * emitting events
     */
    stopTriggerMethod?: keyof ProtoOAOrderTriggerMethod;
}
