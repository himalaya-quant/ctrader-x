import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOAOrderTriggerMethod } from '../enums/ProtoOAOrderTriggerMethod';
import { ProtoOAOrderType } from '../enums/ProtoOAOrderType';
import { ProtoOATimeInForce } from '../enums/ProtoOATimeInForce';
import { ProtoOATradeSide } from '../enums/ProtoOATradeSide';

export class ProtoOANewOrderReq extends BaseProto {
    /**
     * The unique identifier of a symbol in cTrader platform.
     */
    symbolId: number;

    /**
     * The type of an order - MARKET, LIMIT, STOP, MARKET_RANGE, STOP_LIMIT.
     */
    orderType: ProtoOAOrderType;

    /**
     * The trade direction - BUY or SELL.
     */
    tradeSide: ProtoOATradeSide;

    /**
     * The volume represented in 0.01 of a unit
     * (e.g. 1000 in protocol means 10.00 units).
     */
    volume: number;

    /**
     * The limit price, can be specified for the LIMIT order only.
     */
    limitPrice?: number;

    /**
     * The stop price, can be specified for the STOP and STOP_LIMIT orders only.
     */
    stopPrice?: number;

    /**
     * The specific order execution or expiration instruction -
     * GOOD_TILL_DATE,
     * GOOD_TILL_CANCEL,
     * IMMEDIATE_OR_CANCEL,
     * FILL_OR_KILL,
     * MARKET_ON_OPEN.
     */
    timeInForce?: ProtoOATimeInForce;

    /**
     * The Unix time in milliseconds of Order expiration.
     * Should be set for the Good Till Date orders.
     */
    expirationTimestamp?: number;

    /**
     * The absolute Stop Loss price (1.23456 for example).
     * Not supported for MARKET orders.
     */
    stopLoss?: number;

    /**
     * The absolute Take Profit price (1.23456 for example).
     * Unsupported for MARKET orders.
     */
    takeProfit?: number;

    /**
     * User-specified comment. MaxLength = 512.
     */
    comment?: string;

    /**
     * Base price to calculate relative slippage price for MARKET_RANGE order.
     */
    baseSlippagePrice?: number;

    /**
     * Slippage distance for MARKET_RANGE and STOP_LIMIT order.
     */
    slippageInPoints?: number;

    /**
     * User-specified label. MaxLength = 100.
     */
    label?: string;

    /**
     * Reference to the existing position if the Order is intended to modify it.
     */
    positionId?: string;

    /**
     * Optional user-specific clientOrderId (similar to FIX ClOrderID).
     * MaxLength = 50.
     */
    clientOrderId?: string;

    /**
     * Relative Stop Loss that can be specified instead of the absolute as one.
     * Specified in 1/100000 of unit of a price.
     * (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782)
     *
     * For BUY stopLoss = entryPrice - relativeStopLoss.
     * For SELL stopLoss = entryPrice + relativeStopLoss.
     */
    relativeStopLoss?: number;

    /**
     * Relative Take Profit that can be specified instead of the absolute one.
     * Specified in 1/100000 of unit of a price.
     * (e.g. 123000 in protocol means 1.23, 53423782 means 534.23782)
     *
     * For BUY takeProfit = entryPrice + relativeTakeProfit.
     * For SELL takeProfit = entryPrice - relativeTakeProfit.
     */
    relativeTakeProfit?: number;

    /**
     * If TRUE then stopLoss is guaranteed.
     * Required to be set to TRUE for the Limited Risk accounts
     * (ProtoOATrader.isLimitedRisk=true).
     */
    guaranteedStopLoss?: boolean;

    /**
     * If TRUE then the Stop Loss is Trailing.
     */
    trailingStopLoss?: boolean;

    /**
     * Trigger method for the STOP or the STOP_LIMIT pending order.
     */
    stopTriggerMethod?: ProtoOAOrderTriggerMethod;
}
