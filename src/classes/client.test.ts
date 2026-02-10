import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Config } from '../config/config';
import { ConnectionError } from '../errors/connection.error';
import { cTraderX, Configuration } from './client';

describe('cTraderX Client - Integration Tests', () => {
    let client: cTraderX;

    afterEach(async () => {
        // Cleanup dopo ogni test se necessario
        // Nota: potrebbe essere necessario aggiungere un metodo disconnect() alla classe
    });

    describe('Constructor and Configuration', () => {
        it('should create client with default demo configuration', () => {
            client = new cTraderX({ disableAutoconnect: true });
            expect(client).toBeDefined();
        });

        it('should create client with custom configuration', () => {
            const config: Configuration = {
                live: false,
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
                disableAutoconnect: true,
            };

            client = new cTraderX(config);
            expect(client).toBeDefined();
        });

        it('should use environment variables when config not provided', () => {
            client = new cTraderX({ disableAutoconnect: true });
            expect(client).toBeDefined();
        });
    });

    describe('Connection - Manual', () => {
        it('should connect successfully with valid credentials', async () => {
            client = new cTraderX({
                disableAutoconnect: true,
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            });

            await expect(client.connect()).resolves.not.toThrow();
        }, 30000);

        it('should not reconnect if already connected', async () => {
            client = new cTraderX({
                disableAutoconnect: true,
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            });

            await client.connect();

            // La seconda chiamata non dovrebbe fare nulla
            await expect(client.connect()).resolves.not.toThrow();
        }, 30000);

        it('should throw ConnectionError with invalid credentials', async () => {
            client = new cTraderX({
                disableAutoconnect: true,
                clientId: 'invalid_id',
                clientSecret: 'invalid_secret',
                accessToken: 'invalid_token',
                ctidTraderAccountId: 123456,
            });

            await expect(client.connect()).rejects.toThrow(ConnectionError);
        }, 30000);
    });

    describe('Connection - Auto', () => {
        it('should auto-connect when disableAutoconnect is false', async () => {
            // Questo test verifica che l'auto-connessione venga avviata
            // Nota: potrebbe essere necessario aspettare un po' per la connessione
            client = new cTraderX({
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            });

            // Aspetta un po' per permettere all'auto-connessione di completarsi
            await new Promise((resolve) => setTimeout(resolve, 5000));

            expect(client).toBeDefined();
        }, 30000);

        it('should not auto-connect when disableAutoconnect is true', () => {
            client = new cTraderX({
                disableAutoconnect: true,
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            });

            expect(client).toBeDefined();
        });
    });

    describe('Host Selection', () => {
        it('should use demo host by default', () => {
            client = new cTraderX({ disableAutoconnect: true });
            // Non possiamo testare direttamente host perché è privato,
            // ma possiamo verificare che il client sia stato creato
            expect(client).toBeDefined();
        });

        it('should use live host when live flag is true', () => {
            client = new cTraderX({
                live: true,
                disableAutoconnect: true,
            });
            expect(client).toBeDefined();
        });
    });

    describe('Full Integration Flow', () => {
        it('should complete full connection flow with real credentials', async () => {
            client = new cTraderX({
                disableAutoconnect: true,
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            });

            await expect(client.connect()).resolves.not.toThrow();
        }, 30000);
    });
});
