export class LotsUtil {
    private static UNITS_PER_LOT = 100_000;
    private static PROTOCOL_MULTIPLIER = 100; // centesimi di unità

    /**
     * Converts lots in cTrader volume protocol (0.01 of units).
     *
     * @param lots - Number of lots (es. 0.01 for micro, 0.1 for mini, 1 for standard)
     * @returns Volume in cTrader's protocol format
     *
     * @example
     * lotsToVolume(0.01) // → 100_000   (micro)
     * lotsToVolume(0.1)  // → 1_000_000 (mini)
     * lotsToVolume(1)    // → 10_000_000 (standard)
     */
    static lotsToVolume(lots: number): number {
        return Math.round(lots * this.UNITS_PER_LOT * this.PROTOCOL_MULTIPLIER);
    }

    /**
     * Converts cTrader volume protocol in lots.
     *
     * @param volume - Volume in cTrader protocol format
     * @returns Number of lots
     *
     * @example
     * volumeToLots(100_000)    // → 0.01
     * volumeToLots(1_000_000)  // → 0.1
     * volumeToLots(10_000_000) // → 1
     */
    static volumeToLots(volume: number): number {
        return volume / (this.UNITS_PER_LOT * this.PROTOCOL_MULTIPLIER);
    }
}
