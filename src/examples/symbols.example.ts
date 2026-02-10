import { cTraderX } from '../classes/client';
import { ProtoOATrendbarPeriod } from '../models/proto/models/ProtoOATrendbarPeriod';

// Get symbols list
(async () => {
    const client = new cTraderX();

    await client.connect();
    const symbolsList = await client.symbols.getSymbolsList();
    client.disconnect();

    symbolsList.forEach((symbol) => {
        console.log(`[${symbol.symbolId}] ${symbol.symbolName}`);
    });
})();

// Get bars for symbol
(async () => {
    const client = new cTraderX();

    await client.connect();
    const symbolsList = await client.symbols.getSymbolsList();
    const trendBars = await client.symbols.getTrendBars({
        symbolId: symbolsList[0].symbolId,
        period: ProtoOATrendbarPeriod.M1,
        fromTimestamp: Date.now() - 1000 * 10000,
        toTimestamp: Date.now(),
    });
    client.disconnect();

    console.log(
        `Get trend bars result returned ${trendBars.trendbar.length} bars`,
    );
})();
