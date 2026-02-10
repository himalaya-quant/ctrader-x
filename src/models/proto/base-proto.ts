export class BaseProto {
    /**
     * Optional, for more details on which values to use, please visit:
     * https://help.ctrader.com/open-api/model-messages/#protooaordertype
     */
    payloadType?: number;

    /**
     * The unique identifier of the trader's account in cTrader platform.
     * Used to match responses to trader's accounts.
     */
    ctidTraderAccountId?: number;
}
