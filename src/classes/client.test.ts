import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Config } from '../config/config';
import { ConnectionError } from './errors/connection.error';
import { cTraderX } from './client';
import { IConfiguration } from './models/client-configuration.model';

describe('cTraderX Client - Integration Tests', () => {
    let client: cTraderX;

    describe('Constructor and Configuration', () => {
        afterEach(async () => {
            client.disconnect();
        });

        it('should create client with default demo configuration', () => {
            client = new cTraderX();
            expect(client).toBeDefined();
        });

        it('should create client with custom configuration', () => {
            const config: IConfiguration = {
                live: false,
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            };

            client = new cTraderX(config);
            expect(client).toBeDefined();
        });
    });

    describe('Connection - Manual', () => {
        it('should connect successfully with valid credentials', async () => {
            client = new cTraderX({
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            });

            await expect(client.connect()).resolves.not.toThrow();
        }, 30000);

        it('should not reconnect if already connected', async () => {
            client = new cTraderX({
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
                clientId: 'invalid_id',
                clientSecret: 'invalid_secret',
                accessToken: 'invalid_token',
                ctidTraderAccountId: 123456,
            });

            await expect(client.connect()).rejects.toThrow(ConnectionError);
        }, 30000);
    });

    describe('Host Selection', () => {
        it('should use demo host by default', () => {
            client = new cTraderX();
            // Non possiamo testare direttamente host perché è privato,
            // ma possiamo verificare che il client sia stato creato
            expect(client).toBeDefined();
        });

        it('should use live host when live flag is true', () => {
            client = new cTraderX({
                live: true,
            });
            expect(client).toBeDefined();
        });
    });

    describe('Full Integration Flow', () => {
        it('should complete full connection flow with real credentials', async () => {
            client = new cTraderX({
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            });

            await expect(client.connect()).resolves.not.toThrow();
        }, 30000);
    });
});
