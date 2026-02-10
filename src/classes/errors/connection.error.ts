import { cTraderXError } from '../models/ctrader-x-error.model';

export class ConnectionError extends cTraderXError {
    constructor(message: string) {
        super(`Connection error: ${message}`);
    }
}
