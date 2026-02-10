import { cTraderX } from '../classes/client';

const client = new cTraderX({
    disableAutoconnect: true,
});

client.connect().then(() => {
    console.log(`Connected!`);
});
