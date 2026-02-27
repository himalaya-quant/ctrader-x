/**
 * Deal status ENUM.
 */
export enum ProtoOADealStatus {
    /**
     * Deal filled.
     */
    FILLED = 2,

    /**
     * Deal is partially filled.
     */
    PARTIALLY_FILLED = 3,

    /**
     * Deal is correct but was rejected by liquidity provider (e.g. no liquidity).
     */
    REJECTED = 4,

    /**
     * Deal rejected by server (e.g. no price quotes).
     */
    INTERNALLY_REJECTED = 5,

    /**
     * Deal is rejected by LP due to error (e.g. symbol is unknown).
     */
    ERROR = 6,

    /**
     * Liquidity provider did not sent response on the deal during specified execution time period.
     */
    MISSED = 7,
}
