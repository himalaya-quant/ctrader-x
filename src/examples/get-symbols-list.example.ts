import { cTraderX } from '../classes/client';

// Get symbols list
(async () => {
    const client = new cTraderX();

    await client.connect();
    const symbolsList = await client.symbols.getSymbolsList();

    symbolsList.forEach((symbol) => {
        console.log(`[${symbol.symbolId}] ${symbol.symbolName}`);
    });

    const details = await client.symbols.getSymbolsDetails([10026]);
    console.log(details.symbol[0].schedule);
    client.disconnect();
})();
