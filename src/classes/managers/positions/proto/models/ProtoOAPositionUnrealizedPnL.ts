export class ProtoOAPositionUnrealizedPnL {
    /**
     * The position ID.
     */
    positionId: number;

    /**
     * The gross unrealized PnL of the position denoted in the account deposit currency.
     */
    grossUnrealizedPnL: number;

    /**
     * The net unrealized PnL of the position denoted in the account deposit currency. It does not include potential closing commission.
     */
    netUnrealizedPnL: number;
}
