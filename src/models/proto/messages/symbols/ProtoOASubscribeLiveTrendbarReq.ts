import { BaseProto } from '../../base-proto';
import { ProtoOATrendbarPeriod } from '../../models/ProtoOATrendbarPeriod';

export class ProtoOASubscribeLiveTrendbarReq extends BaseProto {
    symbolId: number;
    period: ProtoOATrendbarPeriod;
}