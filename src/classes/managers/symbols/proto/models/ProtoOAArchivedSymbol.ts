export class ProtoOAArchivedSymbol {
    /**
     * The unique identifier of the symbol in specific server environment within cTrader platform. Different brokers might have different IDs.
     */
    symbolId: number;

    /**
     * 	Name of the symbol (e.g. EUR/USD).
     */
    name: string;

    /**
     * The Unix time in milliseconds of the last update of the symbol.
     */
    utcLastUpdateTimestamp: number;

    /**
     * Description of the symbol.
     */
    description?: string;
}
