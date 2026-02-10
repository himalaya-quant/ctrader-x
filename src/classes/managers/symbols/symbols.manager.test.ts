import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProtoOASymbolsListReq } from '../../../models/proto/messages/symbols/ProtoOASymbolsListReq';
import { ProtoOASymbolsListRes } from '../../../models/proto/messages/symbols/ProtoOASymbolsListRes';
import { GetSymbolsListError } from './errors/get-symbols-list.error';
import { SymbolsManager } from './symbols.manager';

describe('SymbolsManager - Unit Tests', () => {
    let symbolsManager: SymbolsManager;
    let mockConnection: any;
    let mockLogger: any;
    let mockCredentials: any;

    beforeEach(() => {
        mockConnection = {
            sendCommand: vi.fn(),
        };

        mockLogger = {
            debug: vi.fn(),
            error: vi.fn(),
        };

        mockCredentials = {
            clientId: 'test-client-id',
            clientSecret: 'test-client-secret',
            accessToken: 'test-access-token',
            ctidTraderAccountId: 12345,
        };

        symbolsManager = new SymbolsManager(
            mockCredentials,
            mockConnection,
            mockLogger,
        );
    });

    describe('getSymbolsList', () => {
        it('should return symbols list successfully', async () => {
            const mockResponse: ProtoOASymbolsListRes = {
                ctidTraderAccountId: 12345,
                symbol: [
                    {
                        symbolId: 1,
                        symbolName: 'EURUSD',
                        enabled: true,
                        baseAssetId: 10,
                        quoteAssetId: 11,
                    },
                ],
                archivedSymbol: [],
            };

            mockConnection.sendCommand.mockResolvedValue(mockResponse);

            const result = await symbolsManager.getSymbolsList();

            expect(result).toEqual(mockResponse);
            expect(mockConnection.sendCommand).toHaveBeenCalledWith(
                ProtoOASymbolsListReq.name,
                {
                    includeArchivedSymbols: undefined,
                    ctidTraderAccountId: 12345,
                },
            );
        });

        it('should pass includeArchivedSymbols option correctly', async () => {
            const mockResponse: ProtoOASymbolsListRes = {
                ctidTraderAccountId: 12345,
                symbol: [],
                archivedSymbol: [
                    {
                        symbolId: 99,
                        symbolName: 'ARCHIVED',
                        enabled: false,
                        baseAssetId: 1,
                        quoteAssetId: 2,
                    },
                ],
            };

            mockConnection.sendCommand.mockResolvedValue(mockResponse);

            await symbolsManager.getSymbolsList({
                includeArchivedSymbols: true,
            });

            expect(mockConnection.sendCommand).toHaveBeenCalledWith(
                ProtoOASymbolsListReq.name,
                {
                    includeArchivedSymbols: true,
                    ctidTraderAccountId: 12345,
                },
            );
        });

        it('should throw GetSymbolsListError on failure', async () => {
            mockConnection.sendCommand.mockRejectedValue(
                new Error('Connection failed'),
            );

            await expect(symbolsManager.getSymbolsList()).rejects.toThrow(
                GetSymbolsListError,
            );

            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
