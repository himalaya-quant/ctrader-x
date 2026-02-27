import { BaseProto } from '../../../../../models/proto/base-proto';

export class ProtoOAClosePositionReq extends BaseProto {
    /**
     * The unique ID of the position to close.
     */
    positionId: number;

    /**
     * Volume to close, represented in 0.01 of a unit (e.g. 1000 in protocol means 10.00 units).
     */
    volume: number;
}
