import { CTraderConnection } from '@reiryoku/ctrader-layer';
import { ILogger, Logger } from './logger';
import { AuthenticationManager } from './managers/authentication/authentication.manager';
import { Config } from '../config/config';
import { ConnectionError } from './errors/connection.error';
import { cTraderXError } from './models/ctrader-x-error.model';
import { IConfiguration } from './models/client-configuration.model';
import { SymbolsManager } from './managers/symbols/symbols.manager';
import { ClientNotConnectedError } from './errors/client-not-connected.error';
import { SymbolsUpdatesManager } from './managers/symbols/symbols-updates.manager';

export class cTraderX {
    private readonly port = 5035;
    private readonly host: string;
    private readonly debug: boolean;
    private readonly logger: ILogger;
    private readonly connection: CTraderConnection;

    private readonly symbolsManager: SymbolsManager;
    private readonly authManager: AuthenticationManager;
    private readonly symbolsUpdatesManager: SymbolsUpdatesManager;

    private isConnected = false;

    constructor(config?: IConfiguration) {
        this.host = config?.live
            ? `live.ctraderapi.com`
            : `demo.ctraderapi.com`;
        this.debug = !!config?.debug;
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

        this.symbolsManager = new SymbolsManager(
            credentials,
            this.connection,
            this.logger,
        );
        this.authManager = new AuthenticationManager(
            credentials,
            this.connection,
            this.logger,
        );
        this.symbolsUpdatesManager = new SymbolsUpdatesManager(
            credentials,
            this.connection,
            this.logger,
            this.symbolsManager,
        );
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
        this.connection.close();
    }

    async connect(): Promise<void> {
        if (this.isConnected) return;
        try {
            await this.connection.open();
            await this.authManager.authenticateApp();
            await this.authManager.authenticateUser();
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
}
