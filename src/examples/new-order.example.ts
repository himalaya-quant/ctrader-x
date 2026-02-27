import { cTraderX } from '../classes/client';
import { ProtoOAOrderType } from '../classes/managers/orders/proto/enums/ProtoOAOrderType';
import { ProtoOATradeSide } from '../classes/managers/orders/proto/enums/ProtoOATradeSide';
import { LotsUtil } from '../classes/managers/orders/utils/lots.util';

// New order example
(async () => {
    const client = new cTraderX();

    await client.connect();
    await client.orders.newOrder({
        orderType: ProtoOAOrderType.MARKET,
        symbolId: 1,
        tradeSide: ProtoOATradeSide.BUY,
        volume: LotsUtil.lotsToVolume(0.01),
        clientOrderId: 'my-cool-order',
    });

    console.log(`✅ Order placed successfully`);

    setTimeout(() => client.disconnect(), 5000);
})();
