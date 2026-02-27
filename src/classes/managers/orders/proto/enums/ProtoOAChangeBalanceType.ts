/**
 * Balance operation entity.
 * Covers all cash movement operations related to account, trading, IB operations, mirroring, etc.
 */
export enum ProtoOAChangeBalanceType {
    /**
     * Cash deposit.
     */
    BALANCE_DEPOSIT = 0,

    /**
     * Cash withdrawal.
     */
    BALANCE_WITHDRAW = 1,

    /**
     * Received mirroring commission.
     */
    BALANCE_DEPOSIT_STRATEGY_COMMISSION_INNER = 3,

    /**
     * Paid mirroring commission.
     */
    BALANCE_WITHDRAW_STRATEGY_COMMISSION_INNER = 4,

    /**
     * For IB account. Commissions paid by trader.
     */
    BALANCE_DEPOSIT_IB_COMMISSIONS = 5,

    /**
     * For IB account. Withdrawal of commissions shared with broker.
     */
    BALANCE_WITHDRAW_IB_SHARED_PERCENTAGE = 6,

    /**
     * For IB account. Commissions paid by sub-ibs.
     */
    BALANCE_DEPOSIT_IB_SHARED_PERCENTAGE_FROM_SUB_IB = 7,

    /**
     * For IB account. Commissions paid by broker.
     */
    BALANCE_DEPOSIT_IB_SHARED_PERCENTAGE_FROM_BROKER = 8,

    /**
     * Deposit rebate for trading volume for period.
     */
    BALANCE_DEPOSIT_REBATE = 9,

    /**
     * Withdrawal of rebate.
     */
    BALANCE_WITHDRAW_REBATE = 10,

    /**
     * Mirroring commission.
     */
    BALANCE_DEPOSIT_STRATEGY_COMMISSION_OUTER = 11,

    /**
     * Mirroring commission.
     */
    BALANCE_WITHDRAW_STRATEGY_COMMISSION_OUTER = 12,

    /**
     * For IB account. Share commission with the Broker.
     */
    BALANCE_WITHDRAW_BONUS_COMPENSATION = 13,

    /**
     * IB commissions.
     */
    BALANCE_WITHDRAW_IB_SHARED_PERCENTAGE_TO_BROKER = 14,

    /**
     * Deposit dividends payments.
     */
    BALANCE_DEPOSIT_DIVIDENDS = 15,

    /**
     * Negative dividend charge for short position.
     */
    BALANCE_WITHDRAW_DIVIDENDS = 16,

    /**
     * Charge for guaranteedStopLoss.
     */
    BALANCE_WITHDRAW_GSL_CHARGE = 17,

    /**
     * Charge of rollover fee for Shariah compliant accounts.
     */
    BALANCE_WITHDRAW_ROLLOVER = 18,

    /**
     * Broker's operation to deposit bonus.
     */
    BALANCE_DEPOSIT_NONWITHDRAWABLE_BONUS = 19,

    /**
     * Broker's operation to withdrawal bonus.
     */
    BALANCE_WITHDRAW_NONWITHDRAWABLE_BONUS = 20,

    /**
     * Deposits of negative SWAP.
     */
    BALANCE_DEPOSIT_SWAP = 21,

    /**
     * SWAP charges.
     */
    BALANCE_WITHDRAW_SWAP = 22,

    /**
     * Mirroring commission.
     */
    BALANCE_DEPOSIT_MANAGEMENT_FEE = 27,

    /**
     * Mirroring commission. Deprecated since 7.1 in favor of BALANCE_WITHDRAW_COPY_FEE (34).
     */
    BALANCE_WITHDRAW_MANAGEMENT_FEE = 28,

    /**
     * Mirroring commission.
     */
    BALANCE_DEPOSIT_PERFORMANCE_FEE = 29,

    /**
     * Withdraw for subaccount creation (cTrader Copy).
     */
    BALANCE_WITHDRAW_FOR_SUBACCOUNT = 30,

    /**
     * Deposit to subaccount on creation (cTrader Copy).
     */
    BALANCE_DEPOSIT_TO_SUBACCOUNT = 31,

    /**
     * Manual user's withdraw from subaccount (cTrader Copy), to parent account.
     */
    BALANCE_WITHDRAW_FROM_SUBACCOUNT = 32,

    /**
     * Manual user's deposit to subaccount (cTrader Copy), from parent account.
     */
    BALANCE_DEPOSIT_FROM_SUBACCOUNT = 33,

    /**
     * Withdrawal fees to Strategy Provider.
     */
    BALANCE_WITHDRAW_COPY_FEE = 34,

    /**
     * Withdraw of inactivity fee from the balance.
     */
    BALANCE_WITHDRAW_INACTIVITY_FEE = 35,

    /**
     * Deposit within the same server (from another account).
     */
    BALANCE_DEPOSIT_TRANSFER = 36,

    /**
     * Withdraw within the same server (to another account).
     */
    BALANCE_WITHDRAW_TRANSFER = 37,

    /**
     * Bonus being converted from virtual bonus to real deposit.
     */
    BALANCE_DEPOSIT_CONVERTED_BONUS = 38,

    /**
     * Applies if negative balance protection is configured by broker, should make balance = 0.
     */
    BALANCE_DEPOSIT_NEGATIVE_BALANCE_PROTECTION = 39,
}
