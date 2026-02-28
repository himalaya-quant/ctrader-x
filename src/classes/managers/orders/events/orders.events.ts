import { ProtoOAOrderErrorEvent } from '../proto/events/ProtoOAOrderErrorEvent';
import { ProtoOADeal } from '../proto/models/ProtoOADeal';
import { ProtoOAOrder } from '../proto/models/ProtoOAOrder';

export class OrderErrorEvent {
    constructor(readonly error: ProtoOAOrderErrorEvent) {}
}

export class OrderEvent {
    constructor(
        readonly order: ProtoOAOrder,
        readonly deal?: ProtoOADeal,
    ) {}
}
export class OrderAcceptedEvent extends OrderEvent {}
export class OrderRejectedEvent extends OrderEvent {}
export class OrderFilledEvent extends OrderEvent {}
export class OrderExpiredEvent extends OrderEvent {}
export class OrderCancelledEvent extends OrderEvent {}
