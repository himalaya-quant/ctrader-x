import { ProtoOATrendbarPeriod } from './ProtoOATrendbarPeriod';

export class ProtoOATrendbar {
    volume: number;
    period?: ProtoOATrendbarPeriod;
    low?: number;
    deltaOpen?: number;
    deltaClose?: number;
    deltaHigh?: number;
    utcTimestampInMinutes?: number;
}
