import { ProtoOAOrderErrorEvent } from '../proto/events/ProtoOAOrderErrorEvent';
import { ProtoOAOrder } from '../proto/models/ProtoOAOrder';

export class OrderErrorEvent {
    constructor(readonly error: ProtoOAOrderErrorEvent) {}
}

export class OrderEvent {
    constructor(readonly order: ProtoOAOrder) {}
}
export class OrderAcceptedEvent extends OrderEvent {}
export class OrderRejectedEvent extends OrderEvent {}
export class OrderFilledEvent extends OrderEvent {}
export class OrderExpiredEvent extends OrderEvent {}
export class OrderCancelledEvent extends OrderEvent {}
