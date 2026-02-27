import { BaseProto } from '../../../../../models/proto/base-proto';

export class ProtoOAOrderErrorEvent extends BaseProto {
    /**
     * The name of the ProtoErrorCode or the other custom ErrorCodes (e.g. ProtoCHErrorCode).
     */
    errorCode: string;

    /**
     * The unique ID of the order.
     */
    orderId?: number;

    /**
     * The unique ID of the position.
     */
    positionId?: number;

    /**
     * The error description.
     */
    description?: string;
}
