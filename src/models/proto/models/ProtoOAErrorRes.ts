import { BaseProto } from '../base-proto';

export class ProtoOAErrorRes extends BaseProto {
    /**
     * The name of the ProtoErrorCode or the other custom ErrorCodes (e.g. ProtoCHErrorCode).
     */
    errorCode: string;

    description?: string;

    /**
     * The Unix time in seconds when the current maintenance session will be ended.
     */
    maintenanceEndTimestamp?: number;

    /**
     * When you hit rate limit with errorCode=BLOCKED_PAYLOAD_TYPE, this field will contain amount of seconds until related payload type will be unlocked.
     */
    retryAfter?: number;
}