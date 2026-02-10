import { cTraderXError } from './ctrader-x.error';

export class ConnectionError extends cTraderXError {
    constructor(message: string){
        super(`Connection error: ${message}`);
    }
}