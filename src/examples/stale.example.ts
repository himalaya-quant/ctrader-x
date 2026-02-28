import { cTraderX } from '../classes/client';
import { Sleep } from '../utils/sleep.utils';

const client = new cTraderX();
(async () => {
    await client.connect();
    console.log(`Connected!`);

    console.log(`Sleeping 60s...`);
    await Sleep.s(220);

    await client.orders.getOpenPositions();
})();
