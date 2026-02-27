import { Subject } from 'rxjs';
import { CTraderConnection } from '@reiryoku/ctrader-layer';
import { CTraderLayerEvent } from '@reiryoku/ctrader-layer/build/src/core/events/CTraderLayerEvent';

import { ILogger } from '../../logger';
import { BaseManager } from '../models/base.manager';
import { OpenOrderError } from './errors/open-order.error';
import { ICredentials } from '../models/credentials.model';

import {
    OrderEvent,
    OrderErrorEvent,
    OrderFilledEvent,
    OrderExpiredEvent,
    OrderAcceptedEvent,
    OrderRejectedEvent,
    OrderCancelledEvent,
} from './events/orders.events';

import {
    isFilledOrder,
    isExpiredOrder,
    isAcceptedOrder,
    isRejectedOrder,
    isCancelledOrder,
} from './typeguards/positions-typeguards';

import { ProtoOAOrder } from './proto/models/ProtoOAOrder';
import { ProtoOANewOrderReq } from './proto/messages/ProtoOANewOrderReq';
import { ProtoOAExecutionEvent } from './proto/events/ProtoOAExecutionEvent';
import { ProtoOAOrderErrorEvent } from './proto/events/ProtoOAOrderErrorEvent';

class OrdersEventsDispatcher {
    private static readonly ordersUpdates$ = new Subject<
        OrderEvent | OrderErrorEvent
    >();

    static dispatch(event: OrderEvent | OrderErrorEvent) {
        this.ordersUpdates$.next(event);
    }

    static subscribeEvents() {
        return this.ordersUpdates$.asObservable();
    }
}

export class PositionsManager extends BaseManager {
    constructor(
        protected readonly credentials: ICredentials,
        protected readonly connection: CTraderConnection,
        protected readonly logger: ILogger,
    ) {
        super();
        this.openExecutionListeners();
    }

    subscribeOrdersEvents() {
        return OrdersEventsDispatcher.subscribeEvents();
    }

    async openOrder(req: ProtoOANewOrderReq) {
        this.logCallAttempt(this.openOrder);
        const payload: ProtoOANewOrderReq = {
            ...req,
            ctidTraderAccountId: this.credentials.ctidTraderAccountId,
        };

        try {
            await this.connection.sendCommand(ProtoOANewOrderReq.name, payload);
        } catch (e) {
            throw this.handleCTraderCallError(
                e,
                this.openOrder,
                new OpenOrderError(e),
            );
        }

        this.logCallAttemptSuccess(this.openOrder);
    }

    close() {}

    getPositions() {}

    getUnrealizedPnL() {}

    private openExecutionListeners() {
        this.connection.on(
            ProtoOAOrderErrorEvent.name,
            this.handleOrderEventError.bind(this),
        );

        this.connection.on(
            ProtoOAExecutionEvent.name,
            this.handleOrderExecutionEvent.bind(this),
        );
    }

    private handleOrderExecutionEvent(event: CTraderLayerEvent): any {
        const { order } = event.descriptor as ProtoOAExecutionEvent;
        if (isAcceptedOrder(order)) {
            this.logger.debug(
                `Order ${order.clientOrderId || order.orderId} accepted`,
            );
            OrdersEventsDispatcher.dispatch(new OrderAcceptedEvent(order));
        }

        if (isFilledOrder(order)) {
            this.logger.debug(
                `Order ${order.clientOrderId || order.orderId} filled`,
            );
            OrdersEventsDispatcher.dispatch(new OrderFilledEvent(order));
        }

        if (isCancelledOrder(order)) {
            this.logger.debug(
                `Order ${order.clientOrderId || order.orderId} cancelled`,
            );
            OrdersEventsDispatcher.dispatch(new OrderCancelledEvent(order));
        }

        if (isExpiredOrder(order)) {
            this.logger.debug(
                `Order ${order.clientOrderId || order.orderId} expired`,
            );
            OrdersEventsDispatcher.dispatch(new OrderExpiredEvent(order));
        }

        if (isRejectedOrder(order)) {
            this.logger.debug(
                `Order ${order.clientOrderId || order.orderId} rejected`,
            );
            OrdersEventsDispatcher.dispatch(new OrderRejectedEvent(order));
        }
    }

    private handleOrderEventError(event: CTraderLayerEvent): any {
        const error = event.descriptor as ProtoOAOrderErrorEvent;
        OrdersEventsDispatcher.dispatch(new OrderErrorEvent(error));
    }
}
