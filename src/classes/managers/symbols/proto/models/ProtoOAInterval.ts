import { BaseProto } from '../../../../../models/proto/base-proto';

/**
 * Trading interval/schedule for a symbol.
 */
export class ProtoOAInterval extends BaseProto {
    /**
     * Start time of the interval in seconds from the beginning of the week.
     */
    startSecond: number;

    /**
     * End time of the interval in seconds from the beginning of the week.
     */
    endSecond: number;
}
