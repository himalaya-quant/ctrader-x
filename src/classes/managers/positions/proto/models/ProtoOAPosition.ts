import { ProtoOATradeData } from './ProtoOATradeData';
import { ProtoOAPositionStatus } from '../enums/ProtoOAPositionStatus';
import { ProtoOAOrderTriggerMethod } from '../enums/ProtoOAOrderTriggerMethod';

/**
 * Trade position entity.
 */
export class ProtoOAPosition {
    /**
     * The unique ID of the position. Note: trader might have two positions with the same id if positions are taken from accounts from different brokers.
     */
    positionId: number;

    /**
     * Position details. See ProtoOATradeData for details.
     */
    tradeData: ProtoOATradeData;

    /**
     * Current status of the position.
     */
    positionStatus: ProtoOAPositionStatus;

    /**
     * Total amount of charged swap on open position.
     */
    swap: number;

    /**
     * VWAP price of the position based on all executions (orders) linked to the position.
     */
    price?: number;

    /**
     * Current stop loss price.
     */
    stopLoss?: number;

    /**
     * Current take profit price.
     */
    takeProfit?: number;

    /**
     * The Unix time in milliseconds of the last change of the position, including amend SL/TP of the position, execution of related order, cancel or related order, etc.
     */
    utcLastUpdateTimestamp?: number;

    /**
     * Current unrealized commission related to the position.
     */
    commission?: number;

    /**
     * Rate for used margin computation. Represented as Base/Deposit.
     */
    marginRate?: number;

    /**
     * Amount of unrealized commission related to following of strategy provider.
     */
    mirroringCommission?: number;

    /**
     * If TRUE then position's stop loss is guaranteedStopLoss.
     */
    guaranteedStopLoss?: boolean;

    /**
     * Amount of margin used for the position in deposit currency.
     */
    usedMargin?: number;

    /**
     * Stop trigger method for SL/TP of the position.
     */
    stopLossTriggerMethod?: ProtoOAOrderTriggerMethod;

    /**
     * Specifies the exponent of the monetary values. E.g. moneyDigits = 8 must be interpret as business value multiplied by 10^8, then real balance would be 10053099944 / 10^8 = 100.53099944. Affects swap, commission, mirroringCommission, usedMargin.
     */
    moneyDigits?: number;

    /**
     * If TRUE then the Trailing Stop Loss is applied.
     */
    trailingStopLoss?: boolean;
}
