import { CTraderConnection } from '@himalaya-quant/ctrader-layer';
import { ILogger, Logger } from './logger';
import { AuthenticationManager } from './managers/authentication/authentication.manager';
import { Config } from '../config/config';
import { ConnectionError } from './errors/connection.error';
import { cTraderXError } from './models/ctrader-x-error.model';
import { IConfiguration } from './models/client-configuration.model';
import { SymbolsManager } from './managers/symbols/symbols.manager';
import { ClientNotConnectedError } from './errors/client-not-connected.error';
import { SymbolsUpdatesManager } from './managers/symbols/symbols-updates.manager';
import { ICredentials } from './managers/models/credentials.model';
import { OrdersManager } from './managers/orders/orders.manager';

export class cTraderX {
    private readonly port = 5035;
    private readonly host: string;
    private readonly debug: boolean;
    private readonly logger: ILogger;
    private readonly credentials: ICredentials;
    private connection: CTraderConnection;

    private ordersManager: OrdersManager;
    private symbolsManager: SymbolsManager;
    private authManager: AuthenticationManager;
    private symbolsUpdatesManager: SymbolsUpdatesManager;

    private isConnected = false;

    constructor(config?: IConfiguration) {
        this.host = config?.live
            ? `live.ctraderapi.com`
            : `demo.ctraderapi.com`;
        this.debug = !!config?.debug;
        this.logger = config?.logger || new Logger();

        this.credentials = {
            clientId: config?.clientId || Config.SPOTWARE_CLIENT_ID,
            accessToken: config?.accessToken || Config.SPOTWARE_ACCESS_TOKEN,
            clientSecret: config?.clientSecret || Config.SPOTWARE_CLIENT_SECRET,
            ctidTraderAccountId:
                config?.ctidTraderAccountId ||
                Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
        };

        this.createConnection();
    }

    get orders() {
        this.ensureConnectedOrThrow();
        return this.ordersManager;
    }

    get symbols() {
        this.ensureConnectedOrThrow();
        return this.symbolsManager;
    }

    get symbolsUpdates() {
        this.ensureConnectedOrThrow();
        return this.symbolsUpdatesManager;
    }

    disconnect() {
        this.isConnected = false;
        this.connection.close();
        this.connection = null;
    }

    async connect(): Promise<void> {
        if (this.isConnected) return;

        this.createConnection();
        this.initializeCoreManagers();

        try {
            await this.connection.open();
            await this.authManager.authenticateApp();
            await this.authManager.authenticateUser();

            this.initializeSecondaryManagers();

            this.isConnected = true;
            this.sendHeartbeat();
        } catch (e) {
            const message = cTraderXError.getMessageError(e);
            this.logger.error(`Error opening connection: ${message}`);
            throw new ConnectionError(message);
        }
    }

    private sendHeartbeat() {
        if (!this.isConnected) return;
        this.connection.sendHeartbeat();
        if (this.debug) {
            this.logger.debug(`Heartbeat event sent`);
        }
        setTimeout(() => {
            this.sendHeartbeat();
        }, 1000 * 5);
    }

    private ensureConnectedOrThrow() {
        if (!this.isConnected) throw new ClientNotConnectedError();
    }

    private createConnection() {
        this.connection = new CTraderConnection({
            host: this.host,
            port: this.port,
        });
    }

    private initializeCoreManagers() {
        this.authManager = new AuthenticationManager(
            this.credentials,
            this.connection,
            this.logger,
        );
    }

    private async initializeSecondaryManagers() {
        this.ordersManager = new OrdersManager(
            this.credentials,
            this.connection,
            this.logger,
        );
        this.symbolsManager = new SymbolsManager(
            this.credentials,
            this.connection,
            this.logger,
        );
        this.symbolsUpdatesManager = new SymbolsUpdatesManager(
            this.credentials,
            this.connection,
            this.logger,
        );
    }
}
