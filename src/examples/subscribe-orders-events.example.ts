import { tap } from 'rxjs';
import { cTraderX } from '../classes/client';
import { ProtoOAOrderType } from '../classes/managers/positions/proto/enums/ProtoOAOrderType';
import { ProtoOATradeSide } from '../classes/managers/positions/proto/enums/ProtoOATradeSide';
import { LotsUtil } from '../classes/managers/positions/utils/lots.util';

// New order example
(async () => {
    const client = new cTraderX();

    await client.connect();

    client.positions
        .subscribeOrdersEvents()
        .pipe(
            tap((event) => {
                console.log(
                    `Received order event: ${Object.prototype.constructor(event.constructor.name)}`,
                );
            }),
        )
        .subscribe();

    await client.positions.openOrder({
        symbolId: 1,
        clientOrderId: 'my-cool-order',
        tradeSide: ProtoOATradeSide.BUY,
        orderType: ProtoOAOrderType.MARKET,
        volume: LotsUtil.lotsToVolume(0.01), // use this utility to calculate correct sizing
    });

    setTimeout(() => client.disconnect(), 5000);
})();
