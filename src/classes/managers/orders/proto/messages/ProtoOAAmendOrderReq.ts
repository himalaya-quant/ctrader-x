import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOAOrderTriggerMethod } from '../enums/ProtoOAOrderTriggerMethod';

/**
 * Request for amending the existing pending order.
 * Allowed only if the Access Token has "trade" permissions for the trading account.
 */
export class ProtoOAAmendOrderReq extends BaseProto {
    /**
     * The unique ID of the order.
     */
    orderId: number;

    /**
     * Volume, represented in 0.01 of a unit (e.g. 1000 in protocol means 10.00 units).
     */
    volume?: number;

    /**
     * The Limit Price, can be specified for the LIMIT order only.
     */
    limitPrice?: number;

    /**
     * The Stop Price, can be specified for the STOP and the STOP_LIMIT orders.
     */
    stopPrice?: number;

    /**
     * The Unix timestamp in milliseconds of Order expiration. Should be set for the Good Till Date orders.
     */
    expirationTimestamp?: number;

    /**
     * The absolute Stop Loss price (e.g. 1.23456). Not supported for MARKET orders.
     */
    stopLoss?: number;

    /**
     * The absolute Take Profit price (e.g. 1.23456). Not supported for MARKET orders.
     */
    takeProfit?: number;

    /**
     * Slippage distance for the MARKET_RANGE and the STOP_LIMIT orders.
     */
    slippageInPoints?: number;

    /**
     * The relative Stop Loss can be specified instead of the absolute one. Specified in 1/100000 of a unit of price. (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782) For BUY stopLoss = entryPrice - relativeStopLoss, for SELL stopLoss = entryPrice + relativeStopLoss.
     */
    relativeStopLoss?: number;

    /**
     * The relative Take Profit can be specified instead of the absolute one. Specified in 1/100000 of a unit of price. (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782) For BUY takeProfit = entryPrice + relativeTakeProfit, for SELL takeProfit = entryPrice - relativeTakeProfit.
     */
    relativeTakeProfit?: number;

    /**
     * If TRUE then the Stop Loss is guaranteed. Available for the French Risk or the Guaranteed Stop Loss Accounts.
     */
    guaranteedStopLoss?: boolean;

    /**
     * If TRUE then the Trailing Stop Loss is applied.
     */
    trailingStopLoss?: boolean;

    /**
     * Trigger method for the STOP or the STOP_LIMIT pending order.
     */
    stopTriggerMethod?: ProtoOAOrderTriggerMethod;
}
