import { Subject } from 'rxjs';
import { CTraderConnection } from '@himalaya-quant/ctrader-layer';

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

import { ProtoOANewOrderReq } from './proto/messages/ProtoOANewOrderReq';
import { ProtoOAExecutionEvent } from './proto/events/ProtoOAExecutionEvent';
import { ProtoOAOrderErrorEvent } from './proto/events/ProtoOAOrderErrorEvent';
import { ProtoOAGetPositionUnrealizedPnLReq } from './proto/messages/ProtoOAGetPositionUnrealizedPnLReq';
import { ProtoOAGetPositionUnrealizedPnLRes } from './proto/messages/ProtoOAGetPositionUnrealizedPnLRes';
import { GetPositionUnrealizedPnLError } from './errors/get-position-unrealized-pnl.error';
import { ProtoOAPayloadType } from '../../../models/proto/payload-types/payload-types.enum';
import { CTraderLayerEvent } from '@himalaya-quant/ctrader-layer/build/src/core/events/CTraderLayerEvent';
import { ProtoOAClosePositionReq } from '../symbols/proto/messages/ProtoOAClosePositionReq';
import { ClosePositionError } from './errors/close-position.error';
import { ProtoOAReconcileReq } from './proto/messages/ProtoOAReconcileReq';
import { ProtoOAReconcileRes } from './proto/messages/ProtoOAReconcileRes';

type BaseProto = 'payloadType' | 'ctidTraderAccountId';

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

export class OrdersManager extends BaseManager {
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

    async newOrder(req: Omit<ProtoOANewOrderReq, BaseProto>) {
        this.logCallAttempt(this.newOrder);
        const payload: ProtoOANewOrderReq = {
            ...req,
            ctidTraderAccountId: this.credentials.ctidTraderAccountId,
        };

        try {
            await this.connection.sendCommand(ProtoOANewOrderReq.name, payload);
        } catch (e) {
            throw this.handleCTraderCallError(
                e,
                this.newOrder,
                new OpenOrderError(e),
            );
        }

        this.logCallAttemptSuccess(this.newOrder);
    }

    async closePosition(req: Omit<ProtoOAClosePositionReq, BaseProto>) {
        this.logCallAttempt(this.closePosition);

        const payload: ProtoOAClosePositionReq = {
            ...req,
            ctidTraderAccountId: this.credentials.ctidTraderAccountId,
        };

        try {
            await this.connection.sendCommand(
                ProtoOAClosePositionReq.name,
                payload,
            );
        } catch (e) {
            throw this.handleCTraderCallError(
                e,
                this.closePosition,
                new ClosePositionError(e),
            );
        }

        this.logCallAttemptSuccess(this.closePosition);
    }

    /**
     * Request for getting Trader's current open positions and pending orders data.
     */
    async getOpenPositions(
        req?: Omit<ProtoOAReconcileReq, BaseProto>,
    ): Promise<Omit<ProtoOAReconcileRes, 'payloadType'>> {
        this.logCallAttempt(this.getOpenPositions);

        const payload: ProtoOAReconcileReq = {
            ...req,
            ctidTraderAccountId: this.credentials.ctidTraderAccountId,
        };

        let result: ProtoOAReconcileRes;
        try {
            result = (await this.connection.sendCommand(
                ProtoOAReconcileReq.name,
                payload,
            )) as ProtoOAReconcileRes;
        } catch (e) {
            throw this.handleCTraderCallError(
                e,
                this.getOpenPositions,
                new ClosePositionError(e),
            );
        }

        this.logCallAttemptSuccess(this.getOpenPositions);
        return {
            order: result.order,
            position: result.position,
            ctidTraderAccountId: result.ctidTraderAccountId,
        };
    }

    async getPositionUnrealizedPnL() {
        this.logCallAttempt(this.getPositionUnrealizedPnL);

        const payload: ProtoOAGetPositionUnrealizedPnLReq = {
            ctidTraderAccountId: this.credentials.ctidTraderAccountId,
        };

        let result: ProtoOAGetPositionUnrealizedPnLRes;
        try {
            result = (await this.connection.sendCommand(
                ProtoOAGetPositionUnrealizedPnLReq.name,
                payload,
            )) as ProtoOAGetPositionUnrealizedPnLRes;
        } catch (e) {
            throw this.handleCTraderCallError(
                e,
                this.getPositionUnrealizedPnL,
                new GetPositionUnrealizedPnLError(e),
            );
        }

        this.logCallAttemptSuccess(this.getPositionUnrealizedPnL);
        return result;
    }

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
