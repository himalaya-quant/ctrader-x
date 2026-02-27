import { ProtoOAChangeBonusType } from '../enums/ProtoOAChangeBonusType';

/**
 * Bonus deposit/withdrawal entity.
 */
export class ProtoOABonusDepositWithdraw {
    /**
     * Type of the operation. Deposit/Withdrawal.
     */
    operationType: ProtoOAChangeBonusType;

    /**
     * The unique ID of the bonus deposit/withdrawal operation.
     */
    bonusHistoryId: number;

    /**
     * Total amount of broker's bonus after the operation.
     */
    managerBonus: number;

    /**
     * Amount of bonus deposited/withdrew by manager.
     */
    managerDelta: number;

    /**
     * Total amount of introducing broker's bonus after the operation.
     */
    ibBonus: number;

    /**
     * Amount of bonus deposited/withdrew by introducing broker.
     */
    ibDelta: number;

    /**
     * The Unix time in milliseconds when the bonus operation was executed.
     */
    changeBonusTimestamp: number;

    /**
     * Note added to operation. Visible to the trader.
     */
    externalNote?: string;

    /**
     * ID of introducing broker who deposited/withdrew bonus.
     */
    introducingBrokerId?: number;

    /**
     * Specifies the exponent of the monetary values. E.g. moneyDigits = 8 must be interpret as business value multiplied by 10^8, then real balance would be 10053099944 / 10^8 = 100.53099944. Affects managerBonus, managerDelta, ibBonus, ibDelta.
     */
    moneyDigits?: number;
}
