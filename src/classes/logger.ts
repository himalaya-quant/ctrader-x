import { Config } from '../config/config';

export interface ILogger {
    debug(message: string): void;
    log(message: string): void;
    error(message: string): void;
    warn(message: string): void;
}

export class Logger implements ILogger{
    debug(message: string) {
        if (Config.DEBUG_LOGS) console.log(`🐛 ${message}`);
    }

    log(message: string) {
        console.log(`ℹ️ ${message}`);
    }

    error(message: string) {
        console.log(`❌ ${message}`);
    }

    warn(message: string) {
        console.log(`⚠️ ${message}`);
    }
}
