export class Price {
    static getPrice(bid: number, ask: number): number | null {
        // Converti esplicitamente
        const bidNum =
            bid !== undefined && bid !== null ? Number(bid) : undefined;
        const askNum =
            ask !== undefined && ask !== null ? Number(ask) : undefined;

        let price: number | null = null;

        // Calcola il prezzo
        if (
            bidNum !== undefined &&
            askNum !== undefined &&
            bidNum > 0 &&
            askNum > 0
        ) {
            price = (bidNum + askNum) / 2 / 100000;
        } else if (bidNum !== undefined && bidNum > 0) {
            price = bidNum / 100000;
        } else if (askNum !== undefined && askNum > 0) {
            price = askNum / 100000;
        }

        // ⚠️ VALIDAZIONE CRITICA: verifica che il prezzo sia sensato
        if (
            price !== null &&
            (!isFinite(price) || price <= 0 || price > 1000000)
        ) {
            console.error('🚨 INVALID PRICE DETECTED:', {
                price,
                bid: bidNum,
                ask: askNum,
                originalBid: bid,
                originalAsk: ask,
            });
            return null;
        }

        return price;
    }
}
