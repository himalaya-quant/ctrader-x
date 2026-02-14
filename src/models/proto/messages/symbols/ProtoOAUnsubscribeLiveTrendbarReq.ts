import { BaseProto } from '../../base-proto';
import { ProtoOATrendbarPeriod } from '../../models/ProtoOATrendbarPeriod';

export class ProtoOAUnsubscribeLiveTrendbarReq extends BaseProto {
    period: ProtoOATrendbarPeriod;
    symbolId: number;
}