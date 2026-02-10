import { CTraderConnection } from '@reiryoku/ctrader-layer';
import { ILogger, Logger } from './logger';
import { AuthenticationManager } from './managers/authentication.manager';
import { Config } from '../config/config';
import { ConnectionError } from '../errors/connection.error';
import { cTraderXError } from '../errors/ctrader-x.error';

export interface Configuration {
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
     * Will prevent the auto connection from occurring.
     * When disabling the auto connection feature, you will need to manually
     * call the connect method before interacting with the client.
     *
     * Any call made before connecting the client, will result in an error.
     */
    disableAutoconnect?: boolean;

    /**
     * Custom logger implementation
     */
    logger?: ILogger;
}

export class cTraderX {
    private readonly port = 5035;
    private readonly host: string;
    private readonly logger: ILogger;
    private readonly connection: CTraderConnection;

    private readonly authManager: AuthenticationManager;

    private isConnected = false;

    constructor(config?: Configuration) {
        this.host = config?.live ? `live.ctraderapi.com` : `demo.ctraderapi.com`;
        this.logger = config?.logger || new Logger();

        const credentials = {
            clientId: config?.clientId || Config.SPOTWARE_CLIENT_ID,
            accessToken: config?.accessToken || Config.SPOTWARE_ACCESS_TOKEN,
            clientSecret: config?.clientSecret || Config.SPOTWARE_CLIENT_SECRET,
            ctidTraderAccountId:
                config?.ctidTraderAccountId ||
                Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
        };

        this.connection = new CTraderConnection({
            host: this.host,
            port: this.port,
        });

        this.authManager = new AuthenticationManager(
            credentials,
            this.connection,
            this.logger,
        );

        if (!config?.disableAutoconnect) {
            this.connect();
        }
    }

    async connect(): Promise<void> {
        if (this.isConnected) return;

        try {
            await this.connection.open();
            await this.authManager.authenticateApp();
            await this.authManager.authenticateUser();
            this.isConnected = true;
        } catch (e) {
            const message = cTraderXError.getMessageError(e);
            this.logger.error(`Error opening connection: ${message}`);
            throw new ConnectionError(message);
        }
    }
}
