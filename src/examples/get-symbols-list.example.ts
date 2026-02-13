import { cTraderX } from '../classes/client';

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
