import { tap } from 'rxjs';
import { cTraderX } from '../classes/client';
import { ProtoOATrendbarPeriod } from '../models/proto/models/ProtoOATrendbarPeriod';

// Subscribe live bars
(async () => {
    const client = new cTraderX();

    await client.connect();
    client.symbols
        .subscribeLiveTrendBars({
            period: ProtoOATrendbarPeriod.M1,
            // symbolId: 1, // EURUSD
            symbolId: 10026, // BTCUSD
        })
        .pipe(tap((event) => console.log(event)))
        .subscribe();
})();
