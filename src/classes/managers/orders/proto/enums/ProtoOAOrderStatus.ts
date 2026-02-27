export enum ProtoOAOrderStatus {
    /**
     * Order request validated and accepted for execution.
     */
    ORDER_STATUS_ACCEPTED = 1,

    /**
     * Order is fully filled.
     */
    ORDER_STATUS_FILLED = 2,

    /**
     * Order is rejected due to validation.
     */
    ORDER_STATUS_REJECTED = 3,

    /**
     * Order expired. Might be valid for orders with partially filled volume that were expired on LP.
     */
    ORDER_STATUS_EXPIRED = 4,

    /**
     * Order is cancelled. Might be valid for orders with partially filled volume that were cancelled by LP.
     */
    ORDER_STATUS_CANCELLED = 5,
}
