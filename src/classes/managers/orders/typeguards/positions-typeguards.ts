import { ProtoOAOrderStatus } from '../proto/enums/ProtoOAOrderStatus';
import { ProtoOAOrder } from '../proto/models/ProtoOAOrder';

export function isAcceptedOrder(order: ProtoOAOrder): boolean {
    return (
        order.orderStatus ===
        ProtoOAOrderStatus[ProtoOAOrderStatus.ORDER_STATUS_ACCEPTED]
    );
}

export function isFilledOrder(order: ProtoOAOrder): boolean {
    return (
        order.orderStatus ===
        ProtoOAOrderStatus[ProtoOAOrderStatus.ORDER_STATUS_FILLED]
    );
}

export function isRejectedOrder(order: ProtoOAOrder): boolean {
    return (
        order.orderStatus ===
        ProtoOAOrderStatus[ProtoOAOrderStatus.ORDER_STATUS_REJECTED]
    );
}

export function isCancelledOrder(order: ProtoOAOrder): boolean {
    return (
        order.orderStatus ===
        ProtoOAOrderStatus[ProtoOAOrderStatus.ORDER_STATUS_CANCELLED]
    );
}

export function isExpiredOrder(order: ProtoOAOrder): boolean {
    return (
        order.orderStatus ===
        ProtoOAOrderStatus[ProtoOAOrderStatus.ORDER_STATUS_EXPIRED]
    );
}
