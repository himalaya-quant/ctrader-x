import { ProtoOAChangeBalanceType } from '../enums/ProtoOAChangeBalanceType';

export class ProtoOADepositWithdraw {
    /**
     * Type of the operation. Deposit/Withdrawal.
     */
    operationType: ProtoOAChangeBalanceType;

    /**
     * The unique ID of the deposit/withdrawal operation.
     */
    balanceHistoryId: number;

    /**
     * Account balance after the operation was executed.
     */
    balance: number;

    /**
     * Amount of deposit/withdrawal operation.
     */
    delta: number;

    /**
     * The Unix time in milliseconds when deposit/withdrawal operation was executed.
     */
    changeBalanceTimestamp: number;

    /**
     * Note added to operation. Visible to the trader.
     */
    externalNote?: string;

    /**
     * Balance version used to identify the final balance. Increments each time when the trader's account balance is changed.
     */
    balanceVersion?: number;

    /**
     * Total account's equity after balance operation was executed.
     */
    equity?: number;

    /**
     * Specifies the exponent of the monetary values. E.g. moneyDigits = 8 must be interpret as business value multiplied by 10^8, then real balance would be 10053099944 / 10^8 = 100.53099944. Affects balance, delta, equity.
     */
    moneyDigits?: number;
}
