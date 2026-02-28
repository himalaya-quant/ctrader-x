import { BaseProto } from '../base-proto';

/**
 * Event that is sent when the established session for an account is dropped on the server side.
 * A new session must be authorized for the account.
 */
export class ProtoOAAccountDisconnectEvent extends BaseProto {}
