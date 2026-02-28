import { BaseProto } from '../../../../../models/proto/base-proto';

export class ProtoOASubscribeSpotsReq extends BaseProto {
    symbolId: number;
    subscribeToSpotTimestamp?: boolean;
}
