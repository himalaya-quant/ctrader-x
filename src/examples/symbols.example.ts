import { cTraderX } from '../classes/client';

(async () => {
    const client = new cTraderX();

    await client.connect();
    const symbolsList = await client.symbols.getSymbolsList();

    symbolsList.symbol.forEach((symbol) => {
        console.log(`[${symbol.symbolId}] ${symbol.symbolName}`);
    });
})();
