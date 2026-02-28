import { BaseProto } from '../base-proto';

/**
 * Event that is sent when the connection with the client application is cancelled by the server.
 * All the sessions for the traders' accounts will be terminated.
 */
export class ProtoOAClientDisconnectEvent extends BaseProto {
    /**
     * The disconnection reason explained. For example: The application access was blocked by cTrader Administrator.
     */
    reason?: string;
}
