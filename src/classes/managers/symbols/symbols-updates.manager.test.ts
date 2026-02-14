import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SymbolsUpdatesManager } from './symbols-updates.manager';
import { ProtoOASubscribeSpotsReq } from '../../../models/proto/messages/common/ProtoOASubscribeSpotsReq';
import { ProtoOASubscribeSpotsRes } from '../../../models/proto/messages/common/ProtoOASubscribeSpotsRes';
import { ProtoOASubscribeLiveTrendbarReq } from '../../../models/proto/messages/symbols/ProtoOASubscribeLiveTrendbarReq';
import { ProtoOASubscribeLiveTrendbarRes } from '../../../models/proto/messages/symbols/ProtoOASubscribeLiveTrendbarRes';
import { ProtoOAUnsubscribeLiveTrendbarReq } from '../../../models/proto/messages/symbols/ProtoOAUnsubscribeLiveTrendbarReq';
import { SubscribeSpotEventsError } from './errors/subscribe-spot-events.error';
import { SubscribeLiveTrendBarsInternalError } from './errors/subscribe-live-trend-bars.error';
import { UnsubscribeLiveTrendBarsError } from './errors/unsubscribe-live-trend-bars.error';
import { ProtoOASpotEvent } from '../../../models/proto/models/ProtoOASpotEvent';
import { firstValueFrom, take } from 'rxjs';
import { OHLCVPositions } from '../../../models/common/ohlcv';
import { ProtoOATrendbarPeriod } from '../../../models/proto/models/ProtoOATrendbarPeriod';

describe('SymbolsUpdatesManager - Unit Tests', () => {
    let symbolsUpdatesManager: SymbolsUpdatesManager;
    let mockConnection: any;
    let mockLogger: any;
    let mockCredentials: any;
    let eventHandlers: Map<string, Function>;

    beforeEach(() => {
        eventHandlers = new Map();

        mockConnection = {
            sendCommand: vi.fn(),
            on: vi.fn((eventName: string, handler: Function) => {
                eventHandlers.set(eventName, handler);
            }),
        };

        mockLogger = {
            debug: vi.fn(),
            error: vi.fn(),
            warn: vi.fn(),
        };

        mockCredentials = {
            clientId: 'test-client-id',
            clientSecret: 'test-client-secret',
            accessToken: 'test-access-token',
            ctidTraderAccountId: 12345,
        };

        symbolsUpdatesManager = new SymbolsUpdatesManager(
            mockCredentials,
            mockConnection,
            mockLogger,
        );
    });

    afterEach(() => {
        eventHandlers.clear();
    });

    describe('subscribeLiveTrendBars', () => {
        it('should subscribe to live trend bars and receive spot events', async () => {
            const mockSubscribeSpotsResponse: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarResponse: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsResponse)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarResponse);

            const opts = {
                symbolId: 10026,
                period: ProtoOATrendbarPeriod.M1,
            };

            const subscription =
                symbolsUpdatesManager.subscribeLiveTrendBars(opts);

            // Start subscribing to the observable
            const resultPromise = firstValueFrom(subscription.pipe(take(1)));

            // Wait for API calls to complete
            await vi.waitFor(() => {
                expect(mockConnection.sendCommand).toHaveBeenCalledTimes(2);
            });

            // Get the spot event handler
            const spotEventHandler = eventHandlers.get(ProtoOASpotEvent.name);
            expect(spotEventHandler).toBeDefined();

            // Simulate spot event
            const mockSpotEvent = {
                descriptor: {
                    symbolId: 10026,
                    bid: 95000,
                    ask: 95020,
                    timestamp: 1640000000000,
                    trendbar: [{ volume: 1000000 }],
                },
            };

            spotEventHandler!(mockSpotEvent);

            const result = await resultPromise;

            expect(result).toHaveProperty('ohlcv');
            expect(result).toHaveProperty('period');
            expect(result).toHaveProperty('symbolId');
            expect(result.symbolId).toBe(10026);
            expect(result.period).toBe(ProtoOATrendbarPeriod.M1);
            expect(result.ohlcv[OHLCVPositions.VOLUME]).toBe(1000000);

            expect(mockConnection.sendCommand).toHaveBeenNthCalledWith(
                1,
                ProtoOASubscribeSpotsReq.name,
                {
                    symbolId: 10026,
                    ctidTraderAccountId: 12345,
                    subscribeToSpotTimestamp: true,
                },
            );

            expect(mockConnection.sendCommand).toHaveBeenNthCalledWith(
                2,
                ProtoOASubscribeLiveTrendbarReq.name,
                {
                    symbolId: 10026,
                    period: ProtoOATrendbarPeriod.M1,
                    ctidTraderAccountId: 12345,
                },
            );
        });

        it('should update OHLC values correctly on multiple spot events', async () => {
            const mockSubscribeSpotsResponse: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarResponse: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsResponse)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarResponse);

            const opts = {
                symbolId: 10026,
                period: ProtoOATrendbarPeriod.M1,
            };

            const subscription =
                symbolsUpdatesManager.subscribeLiveTrendBars(opts);

            const events: any[] = [];
            subscription.pipe(take(2)).subscribe((event) => events.push(event));

            await vi.waitFor(() => {
                expect(mockConnection.sendCommand).toHaveBeenCalledTimes(2);
            });

            const spotEventHandler = eventHandlers.get(ProtoOASpotEvent.name);

            // First tick
            spotEventHandler!({
                descriptor: {
                    symbolId: 10026,
                    bid: 95000,
                    ask: 95020,
                    timestamp: 1640000000000,
                    trendbar: [{ volume: 1000000 }],
                },
            });

            await vi.waitFor(() => {
                expect(events.length).toBeGreaterThanOrEqual(1);
            });

            const initialOpen = events[0].ohlcv[OHLCVPositions.OPEN];

            // Second tick with higher price (same bar)
            spotEventHandler!({
                descriptor: {
                    symbolId: 10026,
                    bid: 95100,
                    ask: 95120,
                    timestamp: 1640000030000,
                    trendbar: [{ volume: 1500000 }],
                },
            });

            await vi.waitFor(() => {
                expect(events.length).toBe(2);
            });

            expect(events[1].ohlcv[OHLCVPositions.HIGH]).toBeGreaterThan(
                initialOpen,
            );
            expect(events[1].ohlcv[OHLCVPositions.CLOSE]).toBeGreaterThan(
                initialOpen,
            );
        });

        it('should throw SubscribeSpotEventsError on spot subscription failure', async () => {
            mockConnection.sendCommand.mockRejectedValue(
                new Error('Connection failed'),
            );

            const opts = {
                symbolId: 10026,
                period: ProtoOATrendbarPeriod.M1,
            };

            const subscription =
                symbolsUpdatesManager.subscribeLiveTrendBars(opts);

            await expect(firstValueFrom(subscription)).rejects.toThrow(
                SubscribeSpotEventsError,
            );

            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should throw SubscribeLiveTrendBarsInternalError on live bars subscription failure', async () => {
            const mockSubscribeSpotsResponse: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsResponse)
                .mockRejectedValueOnce(new Error('Connection failed'));

            const opts = {
                symbolId: 10026,
                period: ProtoOATrendbarPeriod.M1,
            };

            const subscription =
                symbolsUpdatesManager.subscribeLiveTrendBars(opts);

            await expect(firstValueFrom(subscription)).rejects.toThrow(
                SubscribeLiveTrendBarsInternalError,
            );

            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should complete previous subscriber when subscribing to same symbol and period', async () => {
            const mockSubscribeSpotsResponse: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarResponse: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand.mockResolvedValue(
                mockSubscribeSpotsResponse,
            );
            mockConnection.sendCommand.mockResolvedValue(
                mockSubscribeLiveTrendbarResponse,
            );

            const opts = {
                symbolId: 10026,
                period: ProtoOATrendbarPeriod.M1,
            };

            symbolsUpdatesManager.subscribeLiveTrendBars(opts);

            await vi.waitFor(() => {
                expect(mockConnection.sendCommand).toHaveBeenCalled();
            });

            // Subscribe again with same symbol and period
            symbolsUpdatesManager.subscribeLiveTrendBars(opts);

            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Completing previous subscriber'),
            );
        });
    });

    describe('unsubscribeLiveTrendBars', () => {
        it('should unsubscribe from live trend bars when no other subscribers exist', async () => {
            const mockSubscribeSpotsResponse: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarResponse: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsResponse)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarResponse)
                .mockResolvedValueOnce({});

            const opts = {
                symbolId: 10026,
                period: ProtoOATrendbarPeriod.M1,
            };

            const subscription =
                symbolsUpdatesManager.subscribeLiveTrendBars(opts);

            // Subscribe to the observable but don't wait for events
            subscription.subscribe();

            await vi.waitFor(() => {
                expect(mockConnection.sendCommand).toHaveBeenCalledTimes(2);
            });

            await symbolsUpdatesManager.unsubscribeLiveTrendBars(opts);

            expect(mockConnection.sendCommand).toHaveBeenCalledWith(
                ProtoOAUnsubscribeLiveTrendbarReq.name,
                {
                    symbolId: 10026,
                    period: ProtoOATrendbarPeriod.M1,
                    ctidTraderAccountId: 12345,
                },
            );
        });

        it('should throw UnsubscribeLiveTrendBarsError on failure', async () => {
            const mockSubscribeSpotsResponse: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarResponse: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsResponse)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarResponse)
                .mockRejectedValueOnce(new Error('Connection failed'));

            const opts = {
                symbolId: 10026,
                period: ProtoOATrendbarPeriod.M1,
            };

            const subscription =
                symbolsUpdatesManager.subscribeLiveTrendBars(opts);
            subscription.subscribe();

            await vi.waitFor(() => {
                expect(mockConnection.sendCommand).toHaveBeenCalledTimes(2);
            });

            await expect(
                symbolsUpdatesManager.unsubscribeLiveTrendBars(opts),
            ).rejects.toThrow(UnsubscribeLiveTrendBarsError);

            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('spot event handling', () => {
        it('should ignore spot events for untracked symbols', async () => {
            const mockSubscribeSpotsResponse: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarResponse: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsResponse)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarResponse);

            const opts = {
                symbolId: 10026,
                period: ProtoOATrendbarPeriod.M1,
            };

            const subscription =
                symbolsUpdatesManager.subscribeLiveTrendBars(opts);
            subscription.subscribe();

            await vi.waitFor(() => {
                expect(mockConnection.sendCommand).toHaveBeenCalledTimes(2);
            });

            const spotEventHandler = eventHandlers.get(ProtoOASpotEvent.name);

            // Send event for different symbol
            spotEventHandler!({
                descriptor: {
                    symbolId: 99999,
                    bid: 95000,
                    ask: 95020,
                    timestamp: 1640000000000,
                    trendbar: [{ volume: 1000000 }],
                },
            });

            // Should not log a warning for receiving update without subscriber
            // because the symbol is simply not tracked
            expect(mockLogger.warn).not.toHaveBeenCalled();
        });

        it('should create new bar when timestamp changes to new timeframe', async () => {
            const mockSubscribeSpotsResponse: ProtoOASubscribeSpotsRes = {
                ctidTraderAccountId: 12345,
            };

            const mockSubscribeLiveTrendbarResponse: ProtoOASubscribeLiveTrendbarRes =
                {
                    ctidTraderAccountId: 12345,
                };

            mockConnection.sendCommand
                .mockResolvedValueOnce(mockSubscribeSpotsResponse)
                .mockResolvedValueOnce(mockSubscribeLiveTrendbarResponse);

            const opts = {
                symbolId: 10026,
                period: ProtoOATrendbarPeriod.M1,
            };

            const subscription =
                symbolsUpdatesManager.subscribeLiveTrendBars(opts);

            const events: any[] = [];
            subscription.pipe(take(2)).subscribe((event) => events.push(event));

            await vi.waitFor(() => {
                expect(mockConnection.sendCommand).toHaveBeenCalledTimes(2);
            });

            const spotEventHandler = eventHandlers.get(ProtoOASpotEvent.name);

            // First bar
            spotEventHandler!({
                descriptor: {
                    symbolId: 10026,
                    bid: 95000,
                    ask: 95020,
                    timestamp: 1640000000000,
                    trendbar: [{ volume: 1000000 }],
                },
            });

            await vi.waitFor(() => {
                expect(events.length).toBeGreaterThanOrEqual(1);
            });

            const firstBarTime = events[0].ohlcv[OHLCVPositions.TIME];

            // New bar (60 seconds later for M1)
            spotEventHandler!({
                descriptor: {
                    symbolId: 10026,
                    bid: 95100,
                    ask: 95120,
                    timestamp: 1640000060000,
                    trendbar: [{ volume: 2000000 }],
                },
            });

            await vi.waitFor(() => {
                expect(events.length).toBe(2);
            });

            const secondBarTime = events[1].ohlcv[OHLCVPositions.TIME];

            expect(secondBarTime).toBeGreaterThan(firstBarTime);
            expect(events[1].ohlcv[OHLCVPositions.OPEN]).toBe(
                events[1].ohlcv[OHLCVPositions.CLOSE],
            );
        });
    });
});
