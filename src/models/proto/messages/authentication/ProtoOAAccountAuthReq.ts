import { BaseProto } from '../../base-proto';

export class ProtoOAAccountAuthReq extends BaseProto {
    /**
     * The Access Token issued for providing access to the Trader's Account.
     */
    accessToken: string;

    /**
     * The unique identifier of the trader's account in cTrader platform.
     */
    ctidTraderAccountId: number;
}
