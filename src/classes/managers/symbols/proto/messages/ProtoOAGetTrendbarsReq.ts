import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOATrendbarPeriod } from '../models/ProtoOATrendbarPeriod';

export class ProtoOAGetTrendbarsReq extends BaseProto {
    /**
     * The Unix time in milliseconds from which the search starts. Must be bigger or equal to zero (1st Jan 1970).
     */
    fromTimestamp?: number;

    /**
     * The Unix time in milliseconds of finishing the search. Smaller or equal to 2147483646000 (19th Jan 2038).
     */
    toTimestamp?: number;

    /**
     * Specifies period of trend bar series (e.g. M1, M10, etc.).
     */
    period: ProtoOATrendbarPeriod;

    /**
     * Unique identifier of the Symbol in cTrader platform.
     */
    symbolId: number;

    /**
     * Limit number of trend bars in response back from toTimestamp.
     */
    count?: number;
}
