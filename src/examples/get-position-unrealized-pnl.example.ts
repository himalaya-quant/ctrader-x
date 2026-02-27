import { cTraderX } from '../classes/client';

// Get position unrealized PnL example
(async () => {
    const client = new cTraderX();

    await client.connect();
    const result = await client.orders.getPositionUnrealizedPnL();
    console.log(result);

    setTimeout(() => {
        client.disconnect();
    }, 1000);
})();
