import { BaseProto } from '../../base-proto';

export class ProtoOAApplicationAuthReq extends BaseProto {
    /**
     * The unique Client ID provided during the registration.
     */
    clientId: string;

    /**
     * The unique Client Secret provided during the registration.
     */
    clientSecret: string;
}
