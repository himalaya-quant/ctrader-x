import { cTraderX } from '../classes/client';

const client = new cTraderX();
(async () => {
    await client.connect();
    console.log(`Connected!`);
})();
