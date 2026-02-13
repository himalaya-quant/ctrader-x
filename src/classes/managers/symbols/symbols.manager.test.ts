import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProtoOASymbolsListReq } from '../../../models/proto/messages/symbols/ProtoOASymbolsListReq';
import { ProtoOASymbolsListRes } from '../../../models/proto/messages/symbols/ProtoOASymbolsListRes';
import { ProtoOASymbolByIdReq } from '../../../models/proto/messages/symbols/ProtoOASymbolByIdReq';
import { ProtoOASymbolByIdRes } from '../../../models/proto/messages/symbols/ProtoOASymbolByIdRes';
import { ProtoOAGetTrendbarsReq } from '../../../models/proto/messages/symbols/ProtoOAGetTrendbarsReq';
import { ProtoOAGetTrendbarsRes } from '../../../models/proto/messages/symbols/ProtoOAGetTrendbarsRes';
import { ProtoOASubscribeSpotsReq } from '../../../models/proto/messages/common/ProtoOASubscribeSpotsReq';
import { ProtoOASubscribeSpotsRes } from '../../../models/proto/messages/common/ProtoOASubscribeSpotsRes';
import { ProtoOASubscribeLiveTrendbarReq } from '../../../models/proto/messages/symbols/ProtoOASubscribeLiveTrendbarReq';
import { ProtoOASubscribeLiveTrendbarRes } from '../../../models/proto/messages/symbols/ProtoOASubscribeLiveTrendbarRes';
import { GetSymbolsListError } from './errors/get-symbols-list.error';
import { GetSymbolsDetailsError } from './errors/get-symbols-details.error';
import { GetTrendBarsError } from './errors/get-trend-bars.error';
import { SubscribeSpotEventsError } from './errors/subscribe-spot-events.error';
import { SubscribeLiveTrendBarsInternalError } from './errors/subscribe-live-trend-bars.error';
import { SymbolsManager } from './symbols.manager';
import { ProtoOAPayloadType } from '../../../models/proto/payload-types/payload-types.enum';
import { firstValueFrom, take } from 'rxjs';

describe('SymbolsManager - Unit Tests', () => {
    let symbolsManager: SymbolsManager;
    let mockConnection: any;
    let mockLogger: any;
    let mockCredentials: any;

    beforeEach(() => {
        mockConnection = {
            sendCommand: vi.fn(),
            on: vi.fn(),
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
                    ctidTraderAccountId: 12345,
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
                    ctidTraderAccountId: 12345,
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
                    ctidTraderAccountId: 12345,
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
        it('should return trend bars with converted timestamps', async () => {
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

            // Verify timestamps are converted (multiplied by 60000)
            expect(result.trendbar[0].utcTimestampInMinutes).toBe(
                29350000 * 60000,
            );
            expect(mockConnection.sendCommand).toHaveBeenCalledWith(
                ProtoOAGetTrendbarsReq.name,
                {
                    ...opts,
                    ctidTraderAccountId: 12345,
                },
            );
        });

        it('should convert all timestamps in multiple trend bars', async () => {
            const mockResponse: ProtoOAGetTrendbarsRes = {
                ctidTraderAccountId: 12345,
                period: null!,
                trendbar: [
                    {
                        utcTimestampInMinutes: 1000,
                        deltaOpen: 108500,
                        deltaHigh: 108600,
                        low: 108400,
                        deltaClose: 108550,
                        volume: 1000000,
                    },
                    {
                        utcTimestampInMinutes: 2000,
                        deltaOpen: 108600,
                        deltaHigh: 108700,
                        low: 108500,
                        deltaClose: 108650,
                        volume: 1500000,
                    },
                    {
                        utcTimestampInMinutes: 3000,
                        deltaOpen: 108650,
                        deltaHigh: 108750,
                        low: 108600,
                        deltaClose: 108700,
                        volume: 2000000,
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

            expect(result.trendbar[0].utcTimestampInMinutes).toBe(1000 * 60000);
            expect(result.trendbar[1].utcTimestampInMinutes).toBe(2000 * 60000);
            expect(result.trendbar[2].utcTimestampInMinutes).toBe(3000 * 60000);
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

    describe('subscribeLiveTrendBars', () => {
        it('should successfully subscribe to live trend bars and emit events', async () => {
            const mockSubscribeSpotsRes: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarRes: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsRes)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarRes);

            const opts = {
                symbolId: 1,
                period: 'M1' as any,
            };

            const observable = symbolsManager.subscribeLiveTrendBars(opts);

            // Simulate event emission
            const mockEvent = {
                type: ProtoOAPayloadType.PROTO_OA_SPOT_EVENT,
                descriptor: {
                    ctidTraderAccountId: 12345,
                    symbolId: 1,
                    timestamp: 1640000000000,
                    sessionClose: 1640086400000,
                    ask: 1.1234,
                    bid: 1.123,
                    trendbar: [
                        {
                            period: 'M1',
                            volume: 1000000,
                            low: 1.12,
                            utcTimestampInMinutes: 27333,
                            deltaOpen: 50,
                            deltaHigh: 100,
                            deltaClose: 75,
                        },
                    ],
                },
            };

            const eventPromise = firstValueFrom(observable.pipe(take(1)));

            // Wait a bit for the subscription to be set up
            await new Promise((resolve) => setTimeout(resolve, 10));

            // Get the event handler that was registered
            const onHandler = mockConnection.on.mock.calls[0][1];
            onHandler(mockEvent);

            const result = await eventPromise;

            expect(result).toEqual({
                symbolId: 1,
                timestamp: 1640000000000,
                sessionClose: 1640086400000,
                ask: 1.1234,
                bid: 1.123,
                trendbar: [
                    {
                        period: 'M1',
                        volume: 1000000,
                        low: 1.12,
                        utcTimestampInMinutes: 27333,
                        deltaOpen: 50,
                        deltaHigh: 100,
                        deltaClose: 75,
                    },
                ],
            });

            expect(mockConnection.sendCommand).toHaveBeenCalledTimes(2);
            expect(mockConnection.sendCommand).toHaveBeenNthCalledWith(
                1,
                ProtoOASubscribeSpotsReq.name,
                {
                    symbolId: 1,
                    ctidTraderAccountId: 12345,
                    subscribeToSpotTimestamp: true,
                },
            );
            expect(mockConnection.sendCommand).toHaveBeenNthCalledWith(
                2,
                ProtoOASubscribeLiveTrendbarReq.name,
                {
                    symbolId: 1,
                    period: 'M1',
                    ctidTraderAccountId: 12345,
                },
            );
        });

        it('should filter events by symbolId and accountId', async () => {
            const mockSubscribeSpotsRes: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarRes: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsRes)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarRes);

            const opts = {
                symbolId: 1,
                period: 'M1' as any,
            };

            const observable = symbolsManager.subscribeLiveTrendBars(opts);
            const events: any[] = [];

            const subscription = observable.subscribe((event) => {
                events.push(event);
            });

            await new Promise((resolve) => setTimeout(resolve, 10));

            const onHandler = mockConnection.on.mock.calls[0][1];

            // Event with different symbolId - should be filtered out
            const wrongSymbolEvent = {
                type: ProtoOAPayloadType.PROTO_OA_SPOT_EVENT,
                descriptor: {
                    ctidTraderAccountId: 12345,
                    symbolId: 2,
                    timestamp: 1640000000000,
                    trendbar: [],
                },
            };

            // Event with different accountId - should be filtered out
            const wrongAccountEvent = {
                type: ProtoOAPayloadType.PROTO_OA_SPOT_EVENT,
                descriptor: {
                    ctidTraderAccountId: 99999,
                    symbolId: 1,
                    timestamp: 1640000000000,
                    trendbar: [],
                },
            };

            // Correct event - should be accepted
            const correctEvent = {
                type: ProtoOAPayloadType.PROTO_OA_SPOT_EVENT,
                descriptor: {
                    ctidTraderAccountId: 12345,
                    symbolId: 1,
                    timestamp: 1640000000000,
                    trendbar: [
                        {
                            period: 'M1',
                            volume: 1000000,
                            utcTimestampInMinutes: 27333,
                        },
                    ],
                },
            };

            onHandler(wrongSymbolEvent);
            onHandler(wrongAccountEvent);
            onHandler(correctEvent);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(events).toHaveLength(1);
            expect(events[0].symbolId).toBe(1);

            subscription.unsubscribe();
        });

        it('should handle optional fields in spot events', async () => {
            const mockSubscribeSpotsRes: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarRes: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsRes)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarRes);

            const opts = {
                symbolId: 1,
                period: 'M1' as any,
            };

            const observable = symbolsManager.subscribeLiveTrendBars(opts);

            const mockEvent = {
                type: ProtoOAPayloadType.PROTO_OA_SPOT_EVENT,
                descriptor: {
                    ctidTraderAccountId: 12345,
                    symbolId: 1,
                    // timestamp, sessionClose, ask, bid are optional and not present
                    trendbar: [
                        {
                            period: 'M1',
                            volume: 1000000,
                            utcTimestampInMinutes: 27333,
                            // deltaOpen, deltaHigh, deltaClose, low are optional and not present
                        },
                    ],
                },
            };

            const eventPromise = firstValueFrom(observable.pipe(take(1)));

            await new Promise((resolve) => setTimeout(resolve, 10));

            const onHandler = mockConnection.on.mock.calls[0][1];
            onHandler(mockEvent);

            const result = await eventPromise;

            expect(result).toEqual({
                symbolId: 1,
                timestamp: undefined,
                sessionClose: undefined,
                ask: undefined,
                bid: undefined,
                trendbar: [
                    {
                        period: 'M1',
                        volume: 1000000,
                        utcTimestampInMinutes: 27333,
                        deltaOpen: undefined,
                        deltaHigh: undefined,
                        deltaClose: undefined,
                        low: undefined,
                    },
                ],
            });
        });

        it('should throw SubscribeSpotEventsError on spot subscription failure', async () => {
            mockConnection.sendCommand.mockRejectedValue(
                new Error('Spot subscription failed'),
            );

            const opts = {
                symbolId: 1,
                period: 'M1' as any,
            };

            const observable = symbolsManager.subscribeLiveTrendBars(opts);

            await expect(firstValueFrom(observable)).rejects.toThrow(
                SubscribeSpotEventsError,
            );

            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should throw SubscribeLiveTrendBarsInternalError on trend bar subscription failure', async () => {
            const mockSubscribeSpotsRes: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsRes)
                .mockRejectedValueOnce(
                    new Error('Trend bar subscription failed'),
                );

            const opts = {
                symbolId: 1,
                period: 'M1' as any,
            };

            const observable = symbolsManager.subscribeLiveTrendBars(opts);

            await expect(firstValueFrom(observable)).rejects.toThrow(
                SubscribeLiveTrendBarsInternalError,
            );

            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle multiple trendbars in a single event', async () => {
            const mockSubscribeSpotsRes: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarRes: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsRes)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarRes);

            const opts = {
                symbolId: 1,
                period: 'M1' as any,
            };

            const observable = symbolsManager.subscribeLiveTrendBars(opts);

            const mockEvent = {
                type: ProtoOAPayloadType.PROTO_OA_SPOT_EVENT,
                descriptor: {
                    ctidTraderAccountId: 12345,
                    symbolId: 1,
                    timestamp: 1640000000000,
                    trendbar: [
                        {
                            period: 'M1',
                            volume: 1000000,
                            low: 1.12,
                            utcTimestampInMinutes: 27333,
                            deltaOpen: 50,
                            deltaHigh: 100,
                            deltaClose: 75,
                        },
                        {
                            period: 'M5',
                            volume: 5000000,
                            low: 1.115,
                            utcTimestampInMinutes: 27335,
                            deltaOpen: 100,
                            deltaHigh: 200,
                            deltaClose: 150,
                        },
                    ],
                },
            };

            const eventPromise = firstValueFrom(observable.pipe(take(1)));

            await new Promise((resolve) => setTimeout(resolve, 10));

            const onHandler = mockConnection.on.mock.calls[0][1];
            onHandler(mockEvent);

            const result = await eventPromise;

            expect(result.trendbar).toHaveLength(2);
            expect(result.trendbar[0].period).toBe('M1');
            expect(result.trendbar[1].period).toBe('M5');
        });

        it('should set subscribeToSpotTimestamp to true when subscribing to spots', async () => {
            const mockSubscribeSpotsRes: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarRes: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsRes)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarRes);

            const opts = {
                symbolId: 1,
                period: 'M1' as any,
            };

            symbolsManager.subscribeLiveTrendBars(opts);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(mockConnection.sendCommand).toHaveBeenNthCalledWith(
                1,
                ProtoOASubscribeSpotsReq.name,
                expect.objectContaining({
                    subscribeToSpotTimestamp: true,
                }),
            );
        });
    });
});
