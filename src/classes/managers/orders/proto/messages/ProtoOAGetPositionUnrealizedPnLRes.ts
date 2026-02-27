import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOAPositionUnrealizedPnL } from '../models/ProtoOAPositionUnrealizedPnL';

/**
 * Response to ProtoOAGetPositionUnrealizedPnLReq request.
 */
export class ProtoOAGetPositionUnrealizedPnLRes extends BaseProto {
    /**
     * Information about trader's positions' unrealized PnLs.
     */
    positionUnrealizedPnL: ProtoOAPositionUnrealizedPnL[];

    /**
     * Specifies the exponent of various monetary values.
     *
     * E.g., moneyDigits = 8
     * should be interpreted as the value multiplied by 10^8
     * with the 'real' value equal to 10053099944 / 10^8 = 100.53099944.
     *
     * Affects:
     * positionUnrealizedPnL.grossUnrealizedPnL,
     * positionUnrealizedPnL.netUnrealizedPnL.
     */
    moneyDigits: number;
}
