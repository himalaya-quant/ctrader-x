import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOATrendbar } from '../models/ProtoOATrendbar';
import { ProtoOATrendbarPeriod } from '../models/ProtoOATrendbarPeriod';

export class ProtoOAGetTrendbarsRes extends BaseProto {
    /**
     * Specifies period of trend bar series (e.g. M1, M10, etc.).
     */
    period: ProtoOATrendbarPeriod;

    /**
     * Simply don't use this field, as your original request already contains toTimestamp
     */
    timestamp?: number;

    /**
     * The list of trend bars.
     */
    trendbar: ProtoOATrendbar[];

    /**
     * Unique identifier of the Symbol in cTrader platform.
     */
    symbolId?: number;

    /**
     * If TRUE then the number of records by filter is larger than chunkSize, the response contains the number of records that is equal to chunkSize.
     */
    hasMore?: boolean;
}
