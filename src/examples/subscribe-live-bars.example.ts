import { tap } from 'rxjs';
import { cTraderX } from '../classes/client';
import { ProtoOATrendbarPeriod } from '../classes/managers/symbols/proto/models/ProtoOATrendbarPeriod';

// Subscribe live bars
(async () => {
    const client = new cTraderX();

    await client.connect();
    client.symbolsUpdates
        .subscribeLiveTrendBars({
            period: ProtoOATrendbarPeriod.M1,
            // symbolId: 1, // EURUSD
            symbolId: 10026, // BTCUSD
        })
        .pipe(tap((event) => console.log(`Sub 1: ${event}`)))
        .subscribe();

    setTimeout(() => {
        client.symbolsUpdates
            .subscribeLiveTrendBars({
                period: ProtoOATrendbarPeriod.M1,
                // symbolId: 1, // EURUSD
                symbolId: 10026, // BTCUSD
            })
            .pipe(tap((event) => console.log(`Sub 2: ${event}`)))
            .subscribe();
    }, 5000);

    setTimeout(async () => {
        await client.symbolsUpdates.unsubscribeLiveTrendBars({
            period: ProtoOATrendbarPeriod.M1,
            // symbolId: 1, // EURUSD
            symbolId: 10026, // BTCUSD
        });
        console.log(`Unsubscribed`);
    }, 8000);

    setTimeout(() => {
        client.symbolsUpdates
            .subscribeLiveTrendBars({
                period: ProtoOATrendbarPeriod.M1,
                // symbolId: 1, // EURUSD
                symbolId: 10026, // BTCUSD
            })
            .pipe(tap((event) => console.log(`Sub 3: ${event}`)))
            .subscribe();
    }, 10000);
})();
