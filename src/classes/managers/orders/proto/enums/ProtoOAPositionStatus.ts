/**
 * Position status ENUM.
 */
export enum ProtoOAPositionStatus {
    POSITION_STATUS_OPEN = 1,
    POSITION_STATUS_CLOSED = 2,
    /**
     * Empty position is created for pending order.
     */
    POSITION_STATUS_CREATED = 3,
    POSITION_STATUS_ERROR = 4,
}
