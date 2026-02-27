import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOATrendbarPeriod } from '../../../../../models/proto/models/ProtoOATrendbarPeriod';

export class ProtoOASubscribeLiveTrendbarReq extends BaseProto {
    symbolId: number;
    period: ProtoOATrendbarPeriod;
}
