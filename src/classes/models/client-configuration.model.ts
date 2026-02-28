import { ILogger } from '../logger';

export interface IConfiguration {
    /**
     * Will connect to the live API instead of the demo API
     * By default the demo API is used.
     */
    live?: boolean;

    /**
     * The Spotware client id.
     * If not specified will attempt loading from env
     */
    clientId?: string;

    /**
     * The Spotware client secret.
     * If not specified will attempt loading from env
     */
    clientSecret?: string;

    /**
     * The Spotware access token.
     * If not specified will attempt loading from env
     */
    accessToken?: string;

    /**
     * The Spotware ctid trader account id.
     * In the sandbox environment can be found under the Trading accounts tab
     * If not specified will attempt loading from env
     */
    ctidTraderAccountId?: number;

    /**
     * Custom logger implementation
     */
    logger?: ILogger;

    /**
     * Enables additional verbose logs details
     */
    debug?: boolean;

    /**
     * Choose wether to let the client detect abnormally long server inactivity
     * periods, by tracking the server sent heartbeats, and reconnect automatically
     * when too much time passed since the last received heartbeat.
     *
     * @default true
     */
    autoReconnect?: boolean;
}
