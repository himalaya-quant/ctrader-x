import { tap } from 'rxjs';

import { cTraderX } from '../classes/client';
import { LotsUtil } from '../classes/managers/orders/utils/lots.util';

import { ProtoOAOrderType } from '../classes/managers/orders/proto/enums/ProtoOAOrderType';
import { ProtoOATradeSide } from '../classes/managers/orders/proto/enums/ProtoOATradeSide';

// Subscribe orders events
(async () => {
    const client = new cTraderX();

    await client.connect();

    client.orders
        .subscribeOrdersEvents()
        .pipe(
            tap((event) => {
                console.log(
                    `Received order event: ${Object.prototype.constructor(event.constructor.name)}`,
                );
            }),
        )
        .subscribe();

    await client.orders.newOrder({
        symbolId: 1,
        clientOrderId: 'my-cool-order',
        tradeSide: ProtoOATradeSide.BUY,
        orderType: ProtoOAOrderType.MARKET,
        volume: LotsUtil.lotsToVolume(0.01), // use this utility to calculate correct sizing
    });

    setTimeout(() => client.disconnect(), 5000);
})();
