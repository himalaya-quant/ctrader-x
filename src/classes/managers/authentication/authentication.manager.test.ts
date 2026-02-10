// tests/managers/authentication.manager.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CTraderConnection } from '@reiryoku/ctrader-layer';
import { Config } from '../../../config/config';
import { ApplicationAuthenticationError } from './errors/application-auth.error';
import { UserAuthenticationError } from './errors/user-auth.error';
import { Logger } from '../../logger';
import { AuthenticationManager } from './authentication.manager';

describe('AuthenticationManager - Integration Tests', () => {
    let connection: CTraderConnection;
    let authManager: AuthenticationManager;
    let logger: Logger;

    const host = 'demo.ctraderapi.com';
    const port = 5035;

    beforeAll(async () => {
        logger = new Logger();

        connection = new CTraderConnection({
            host,
            port,
        });

        const credentials = {
            clientId: Config.SPOTWARE_CLIENT_ID,
            clientSecret: Config.SPOTWARE_CLIENT_SECRET,
            accessToken: Config.SPOTWARE_ACCESS_TOKEN,
            ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
        };

        authManager = new AuthenticationManager(
            credentials,
            connection,
            logger,
        );

        // Apri la connessione prima dei test
        await connection.open();
    });

    afterAll(async () => {
        // Chiudi la connessione dopo i test
        await connection.close();
    });

    describe('authenticateApp', () => {
        it('should authenticate application successfully', async () => {
            await expect(authManager.authenticateApp()).resolves.not.toThrow();
        });

        it('should throw ApplicationAuthenticationError with invalid credentials', async () => {
            const invalidConnection = new CTraderConnection({
                host,
                port,
            });

            await invalidConnection.open();

            const invalidCredentials = {
                clientId: 'invalid_client_id',
                clientSecret: 'invalid_client_secret',
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            };

            const invalidAuthManager = new AuthenticationManager(
                invalidCredentials,
                invalidConnection,
                logger,
            );

            await expect(invalidAuthManager.authenticateApp()).rejects.toThrow(
                ApplicationAuthenticationError,
            );

            await invalidConnection.close();
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate user successfully after app authentication', async () => {
            // Prima autentica l'app
            // await authManager.authenticateApp();

            // Poi autentica l'utente
            await expect(authManager.authenticateUser()).resolves.not.toThrow();
        });

        it('should throw UserAuthenticationError with invalid access token', async () => {
            const invalidConnection = new CTraderConnection({
                host,
                port,
            });

            await invalidConnection.open();

            const validAppCredentials = {
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: 'invalid_access_token',
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            };

            const invalidAuthManager = new AuthenticationManager(
                validAppCredentials,
                invalidConnection,
                logger,
            );

            // Autentica prima l'app (che dovrebbe funzionare)
            await invalidAuthManager.authenticateApp();

            // Poi prova ad autenticare l'utente (che dovrebbe fallire)
            await expect(invalidAuthManager.authenticateUser()).rejects.toThrow(
                UserAuthenticationError,
            );

            await invalidConnection.close();
        });

        it('should throw UserAuthenticationError with invalid ctidTraderAccountId', async () => {
            const invalidConnection = new CTraderConnection({
                host,
                port,
            });

            await invalidConnection.open();

            const invalidCredentials = {
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: 999999999, // ID non valido
            };

            const invalidAuthManager = new AuthenticationManager(
                invalidCredentials,
                invalidConnection,
                logger,
            );

            await invalidAuthManager.authenticateApp();

            await expect(invalidAuthManager.authenticateUser()).rejects.toThrow(
                UserAuthenticationError,
            );

            await invalidConnection.close();
        });
    });

    describe('Full authentication flow', () => {
        it('should complete full authentication flow successfully', async () => {
            const newConnection = new CTraderConnection({
                host,
                port,
            });

            await newConnection.open();

            const credentials = {
                clientId: Config.SPOTWARE_CLIENT_ID,
                clientSecret: Config.SPOTWARE_CLIENT_SECRET,
                accessToken: Config.SPOTWARE_ACCESS_TOKEN,
                ctidTraderAccountId: Config.SPOTWARE_CTID_TRADER_ACCOUNT_ID,
            };

            const newAuthManager = new AuthenticationManager(
                credentials,
                newConnection,
                logger,
            );

            // Test del flusso completo
            await expect(
                newAuthManager.authenticateApp(),
            ).resolves.not.toThrow();
            await expect(
                newAuthManager.authenticateUser(),
            ).resolves.not.toThrow();

            await newConnection.close();
        });
    });
});
