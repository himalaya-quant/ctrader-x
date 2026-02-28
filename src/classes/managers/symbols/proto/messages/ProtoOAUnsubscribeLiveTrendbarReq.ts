import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOATrendbarPeriod } from '../models/ProtoOATrendbarPeriod';

export class ProtoOAUnsubscribeLiveTrendbarReq extends BaseProto {
    /**
     * Set period to '*' to unsubscribe ALL the subscribers for any period on
     * this symbolId
     */
    period: ProtoOATrendbarPeriod | '*';
    symbolId: number;
}
