import { cTraderX } from '../classes/client';
import { Sleep } from '../utils/sleep.utils';

// Get open positions example
(async () => {
    const client = new cTraderX();

    await client.connect();
    const result = await client.orders.getOpenPositions();
    console.log(result);

    await Sleep.s(1);
    client.disconnect();
})();
