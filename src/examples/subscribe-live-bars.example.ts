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
            symbolId: 1,
        })
        .pipe(tap((event) => console.log(event)))
        .subscribe();
})();
