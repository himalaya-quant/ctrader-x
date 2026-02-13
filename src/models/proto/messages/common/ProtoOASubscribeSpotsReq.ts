import { BaseProto } from '../../base-proto';

export class ProtoOASubscribeSpotsReq extends BaseProto {
    symbolId: number;
    subscribeToSpotTimestamp?: boolean;
}
