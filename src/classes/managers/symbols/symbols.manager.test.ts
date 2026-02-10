import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProtoOASymbolsListReq } from '../../../models/proto/messages/symbols/ProtoOASymbolsListReq';
import { ProtoOASymbolsListRes } from '../../../models/proto/messages/symbols/ProtoOASymbolsListRes';
import { ProtoOASymbolByIdReq } from '../../../models/proto/messages/symbols/ProtoOASymbolByIdReq';
import { ProtoOASymbolByIdRes } from '../../../models/proto/messages/symbols/ProtoOASymbolByIdRes';
import { ProtoOAGetTrendbarsReq } from '../../../models/proto/messages/symbols/ProtoOAGetTrendbarsReq';
import { ProtoOAGetTrendbarsRes } from '../../../models/proto/messages/symbols/ProtoOAGetTrendbarsRes';
import { GetSymbolsListError } from './errors/get-symbols-list.error';
import { GetSymbolsDetailsError } from './errors/get-symbols-details.error';
import { GetTrendBarsError } from './errors/get-trend-bars.error';
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
        it('should return full symbols list successfully', async () => {
            const mockSymbolsListResponse: ProtoOASymbolsListRes = {
                ctidTraderAccountId: 12345,
                symbol: [
                    {
                        symbolId: 1,
                        symbolName: 'EURUSD',
                        enabled: true,
                        baseAssetId: 10,
                        quoteAssetId: 11,
                    },
                    {
                        symbolId: 2,
                        symbolName: 'GBPUSD',
                        enabled: true,
                        baseAssetId: 12,
                        quoteAssetId: 11,
                    },
                ],
                archivedSymbol: [],
            };

            const mockSymbolDetailsResponse: ProtoOASymbolByIdRes = {
                ctidTraderAccountId: 12345,
                archivedSymbol: null!,
                symbol: [
                    {
                        symbolId: 1,
                        digits: 5,
                        pipPosition: 4,
                        enableShortSelling: true,
                        guaranteedStopLoss: false,
                        swapLong: -1.5,
                        swapShort: 0.5,
                        maxVolume: 10000000,
                        minVolume: 1000,
                        stepVolume: 1000,
                        description: 'Euro vs US Dollar',
                    },
                    {
                        symbolId: 2,
                        digits: 5,
                        pipPosition: 4,
                        enableShortSelling: true,
                        guaranteedStopLoss: false,
                        swapLong: -2.0,
                        swapShort: 1.0,
                        maxVolume: 10000000,
                        minVolume: 1000,
                        stepVolume: 1000,
                        description: 'British Pound vs US Dollar',
                    },
                ],
            };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSymbolsListResponse)
                .mockResolvedValueOnce(mockSymbolDetailsResponse);

            const result = await symbolsManager.getSymbolsList();

            // Il risultato deve essere il merge tra ProtoOASymbol e ProtoOALightSymbol
            const expected = [
                {
                    symbolId: 1,
                    digits: 5,
                    pipPosition: 4,
                    enableShortSelling: true,
                    guaranteedStopLoss: false,
                    swapLong: -1.5,
                    swapShort: 0.5,
                    maxVolume: 10000000,
                    minVolume: 1000,
                    stepVolume: 1000,
                    description: 'Euro vs US Dollar',
                    symbolName: 'EURUSD',
                    enabled: true,
                    baseAssetId: 10,
                    quoteAssetId: 11,
                },
                {
                    symbolId: 2,
                    digits: 5,
                    pipPosition: 4,
                    enableShortSelling: true,
                    guaranteedStopLoss: false,
                    swapLong: -2.0,
                    swapShort: 1.0,
                    maxVolume: 10000000,
                    minVolume: 1000,
                    stepVolume: 1000,
                    description: 'British Pound vs US Dollar',
                    symbolName: 'GBPUSD',
                    enabled: true,
                    baseAssetId: 12,
                    quoteAssetId: 11,
                },
            ];

            expect(result).toEqual(expected);
            expect(mockConnection.sendCommand).toHaveBeenCalledTimes(2);
            expect(mockConnection.sendCommand).toHaveBeenNthCalledWith(
                1,
                ProtoOASymbolsListReq.name,
                {
                    includeArchivedSymbols: undefined,
                    ctidTraderAccountId: 12345,
                },
            );
            expect(mockConnection.sendCommand).toHaveBeenNthCalledWith(
                2,
                ProtoOASymbolByIdReq.name,
                {
                    symbolId: [1, 2],
                },
            );
        });

        it('should pass includeArchivedSymbols option correctly', async () => {
            const mockSymbolsListResponse: ProtoOASymbolsListRes = {
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

            const mockSymbolDetailsResponse: ProtoOASymbolByIdRes = {
                ctidTraderAccountId: 12345,
                archivedSymbol: null!,
                symbol: [],
            };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSymbolsListResponse)
                .mockResolvedValueOnce(mockSymbolDetailsResponse);

            await symbolsManager.getSymbolsList({
                includeArchivedSymbols: true,
            });

            expect(mockConnection.sendCommand).toHaveBeenNthCalledWith(
                1,
                ProtoOASymbolsListReq.name,
                {
                    includeArchivedSymbols: true,
                    ctidTraderAccountId: 12345,
                },
            );
        });

        it('should throw GetSymbolsListError on symbols list failure', async () => {
            mockConnection.sendCommand.mockRejectedValue(
                new Error('Connection failed'),
            );

            await expect(symbolsManager.getSymbolsList()).rejects.toThrow(
                GetSymbolsListError,
            );

            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should throw GetSymbolsDetailsError on symbols details failure', async () => {
            const mockSymbolsListResponse: ProtoOASymbolsListRes = {
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

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSymbolsListResponse)
                .mockRejectedValueOnce(new Error('Details fetch failed'));

            await expect(symbolsManager.getSymbolsList()).rejects.toThrow(
                GetSymbolsDetailsError,
            );

            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getSymbolsDetails', () => {
        it('should return symbols details successfully', async () => {
            const mockResponse: ProtoOASymbolByIdRes = {
                ctidTraderAccountId: 12345,
                archivedSymbol: null!,
                symbol: [
                    {
                        symbolId: 1,
                        digits: 5,
                        pipPosition: 4,
                        enableShortSelling: true,
                        guaranteedStopLoss: false,
                        swapLong: -1.5,
                        swapShort: 0.5,
                        maxVolume: 10000000,
                        minVolume: 1000,
                        stepVolume: 1000,
                        description: 'Euro vs US Dollar',
                    },
                ],
            };

            mockConnection.sendCommand.mockResolvedValue(mockResponse);

            const result = await symbolsManager.getSymbolsDetails([1]);

            expect(result).toEqual(mockResponse);
            expect(mockConnection.sendCommand).toHaveBeenCalledWith(
                ProtoOASymbolByIdReq.name,
                {
                    symbolId: [1],
                },
            );
        });

        it('should handle multiple symbol IDs', async () => {
            const mockResponse: ProtoOASymbolByIdRes = {
                ctidTraderAccountId: 12345,
                archivedSymbol: null!,
                symbol: [
                    {
                        symbolId: 1,
                        digits: 5,
                        pipPosition: 4,
                    },
                    {
                        symbolId: 2,
                        digits: 5,
                        pipPosition: 4,
                    },
                    {
                        symbolId: 3,
                        digits: 3,
                        pipPosition: 2,
                    },
                ],
            };

            mockConnection.sendCommand.mockResolvedValue(mockResponse);

            const result = await symbolsManager.getSymbolsDetails([1, 2, 3]);

            expect(result).toEqual(mockResponse);
            expect(mockConnection.sendCommand).toHaveBeenCalledWith(
                ProtoOASymbolByIdReq.name,
                {
                    symbolId: [1, 2, 3],
                },
            );
        });

        it('should throw GetSymbolsDetailsError on failure', async () => {
            mockConnection.sendCommand.mockRejectedValue(
                new Error('Connection failed'),
            );

            await expect(
                symbolsManager.getSymbolsDetails([1, 2]),
            ).rejects.toThrow(GetSymbolsDetailsError);

            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getTrendBars', () => {
        it('should return trend bars successfully', async () => {
            const mockResponse: ProtoOAGetTrendbarsRes = {
                ctidTraderAccountId: 12345,
                period: null!,
                trendbar: [
                    {
                        utcTimestampInMinutes: 29350000,
                        deltaOpen: 108500,
                        deltaHigh: 108600,
                        low: 108400,
                        deltaClose: 108550,
                        volume: 1000000,
                    },
                ],
            };

            mockConnection.sendCommand.mockResolvedValue(mockResponse);

            const opts = {
                symbolId: 1,
                period: 'M1' as any,
                fromTimestamp: 1640000000000,
                toTimestamp: 1640086400000,
            };

            const result = await symbolsManager.getTrendBars(opts);

            expect(result).toEqual(mockResponse);
            expect(mockConnection.sendCommand).toHaveBeenCalledWith(
                ProtoOAGetTrendbarsReq.name,
                {
                    ...opts,
                    ctidTraderAccountId: 12345,
                },
            );
        });

        it('should throw GetTrendBarsError on failure', async () => {
            mockConnection.sendCommand.mockRejectedValue(
                new Error('Connection failed'),
            );

            const opts = {
                symbolId: 1,
                period: 'M1' as any,
                fromTimestamp: 1640000000000,
                toTimestamp: 1640086400000,
            };

            await expect(symbolsManager.getTrendBars(opts)).rejects.toThrow(
                GetTrendBarsError,
            );

            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
