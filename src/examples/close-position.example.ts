import { takeWhile, tap } from 'rxjs';

import { Sleep } from '../utils/sleep.utils';
import { cTraderX } from '../classes/client';
import { LotsUtil } from '../classes/managers/orders/utils/lots.util';

import { ProtoOAOrderType } from '../classes/managers/orders/proto/enums/ProtoOAOrderType';
import { ProtoOATradeSide } from '../classes/managers/orders/proto/enums/ProtoOATradeSide';
import {
    OrderErrorEvent,
    OrderFilledEvent,
} from '../classes/managers/orders/events/orders.events';

// Close position
(async () => {
    const client = new cTraderX();

    await client.connect();
    let positionClosed = false;

    client.orders
        .subscribeOrdersEvents()
        .pipe(
            takeWhile(() => !positionClosed),
            tap(async (event) => {
                if (event instanceof OrderErrorEvent) {
                    console.log(`[Order Error] ${event.error.description}`);
                    positionClosed = true;
                }

                if (event instanceof OrderFilledEvent) {
                    console.log(`Order filled. Closing position in 2s`);

                    await Sleep.s(2);

                    await client.orders.closePosition({
                        positionId: event.order.positionId!,
                        volume: event.order.executedVolume!,
                    });

                    positionClosed = true;

                    await Sleep.s(2);

                    client.disconnect();
                }
            }),
        )
        .subscribe();

    await client.orders.newOrder({
        symbolId: 10026, // BTCUSD
        clientOrderId: 'my-cool-order',
        tradeSide: ProtoOATradeSide.BUY,
        orderType: ProtoOAOrderType.MARKET,
        volume: LotsUtil.lotsToVolume(0.0001), // use this utility to calculate correct sizing
    });
})();
