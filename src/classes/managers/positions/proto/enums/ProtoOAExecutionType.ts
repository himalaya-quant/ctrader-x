/**
 * Execution event type ENUM.
 */
export enum ProtoOAExecutionType {
    /**
     * Order passed validation.
     */
    ORDER_ACCEPTED = 2,

    /**
     * Order filled.
     */
    ORDER_FILLED = 3,

    /**
     * Pending order is changed with a new one.
     */
    ORDER_REPLACED = 4,

    /**
     * Order cancelled.
     */
    ORDER_CANCELLED = 5,

    /**
     * Order with GTD time in force is expired.
     */
    ORDER_EXPIRED = 6,

    /**
     * Order is rejected due to validations.
     */
    ORDER_REJECTED = 7,

    /**
     * Cancel order request is rejected.
     */
    ORDER_CANCEL_REJECTED = 8,

    /**
     * Type related to SWAP execution events.
     */
    SWAP = 9,

    /**
     * Type related to event of deposit or withdrawal cash flow operation.
     */
    DEPOSIT_WITHDRAW = 10,

    /**
     * Order is partially filled.
     */
    ORDER_PARTIAL_FILL = 11,

    /**
     * Type related to event of bonus deposit or bonus withdrawal.
     */
    BONUS_DEPOSIT_WITHDRAW = 12,
}
