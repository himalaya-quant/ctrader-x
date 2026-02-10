export class ProtoOALightSymbol {
    /**
     * The unique identifier of the symbol in specific server environment within cTrader platform. Different brokers might have different IDs.
     */
    symbolId: number;

    /**
     * Name of the symbol (e.g. EUR/USD).
     */
    symbolName?: string;

    /**
     * If TRUE then symbol is visible for traders.
     */
    enabled?: boolean;

    /**
     * 	Base asset.
     */
    baseAssetId?: number;

    /**
     * Quote asset.
     */
    quoteAssetId?: number;

    /**
     * Id of the symbol category used for symbols grouping.
     */
    symbolCategoryId?: number;
    
    description?: string;

    /**
     * 	The number used for sorting Symbols in the UI (lowest number should appear at the top).
     */
    sortingNumber?: number;
}
