import { ProtoOADealStatus } from '../enums/ProtoOADealStatus';
import { ProtoOATradeSide } from '../enums/ProtoOATradeSide';
import { ProtoOAClosePositionDetail } from './ProtoOAClosePositionDetail';

export class ProtoOADeal {
    /**
     * The unique ID of the execution deal.
     */
    dealId: number;

    /**
     * Source order of the deal.
     */
    orderId: number;

    /**
     * Source position of the deal.
     */
    positionId: number;

    /**
     * Volume sent for execution, in cents.
     */
    volume: number;

    /**
     * Filled volume, in cents.
     */
    filledVolume: number;

    /**
     * The unique identifier of the symbol in specific server environment within cTrader platform. Different servers have different IDs.
     */
    symbolId: number;

    /**
     * The Unix time in milliseconds when the deal was sent for execution.
     */
    createTimestamp: number;

    /**
     * The Unix time in milliseconds when the deal was executed.
     */
    executionTimestamp: number;

    /**
     * The Unix time in milliseconds when the deal was created, executed or rejected.
     */
    utcLastUpdateTimestamp?: number;

    /**
     * Execution price.
     */
    executionPrice?: number;

    /**
     * Buy/Sell.
     */
    tradeSide: ProtoOATradeSide;

    /**
     * Status of the deal.
     */
    dealStatus: ProtoOADealStatus;

    /**
     * Rate for used margin computation. Represented as Base/Deposit.
     */
    marginRate?: number;

    /**
     * Amount of trading commission associated with the deal.
     */
    commission?: number;

    /**
     * Base to USD conversion rate on the time of deal execution.
     */
    baseToUsdConversionRate?: number;

    /**
     * Closing position detail. Valid only for closing deal.
     */
    closePositionDetail?: ProtoOAClosePositionDetail;

    /**
     * Specifies the exponent of the monetary values. E.g. moneyDigits = 8 must be interpret as business value multiplied by 10^8, then real balance would be 10053099944 / 10^8 = 100.53099944. Affects commission.
     */
    moneyDigits?: number;

    /**
     * Label field value from corresponding order. Used by cAlgo bots to identify its own orders. Max length 100
     */
    label?: string;

    /**
     * Comment field value from corresponding order
     */
    comment?: string;
}
