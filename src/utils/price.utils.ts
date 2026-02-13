export class Price {
    static getPrice(bid: number, ask: number) {
        if (bid !== undefined && ask !== undefined) {
            return (bid + ask) / 2 / 100000;
        } else if (bid !== undefined) {
            return bid / 100000;
        } else if (ask !== undefined) {
            return ask / 100000;
        }
        return null;
    }
}
