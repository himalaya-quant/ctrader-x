/**
 * Trading details for closing deal.
 */
export class ProtoOAClosePositionDetail {
    /**
     * Position price at the moment of filling the closing order.
     */
    entryPrice: number;

    /**
     * Amount of realized gross profit after closing deal execution.
     */
    grossProfit: number;

    /**
     * Amount of realized swap related to closed volume.
     */
    swap: number;

    /**
     * Amount of realized commission related to closed volume.
     */
    commission: number;

    /**
     * Account balance after closing deal execution.
     */
    balance: number;

    /**
     * Quote/Deposit currency conversion rate on the time of closing deal execution.
     */
    quoteToDepositConversionRate?: number;

    /**
     * Closed volume in cents.
     */
    closedVolume?: number;

    /**
     * Balance version of the account related to closing deal operation.
     */
    balanceVersion?: number;

    /**
     * Specifies the exponent of the monetary values. E.g. moneyDigits = 8 must be interpret as business value multiplied by 10^8, then real balance would be 10053099944 / 10^8 = 100.53099944. Affects grossProfit, swap, commission, balance, pnlConversionFee.
     */
    moneyDigits?: number;

    /**
     * Fee for conversion applied to the Deal in account's ccy when trader symbol's quote asset id <> ProtoOATrader.depositAssetId.
     */
    pnlConversionFee?: number;
}
