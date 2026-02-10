import { cTraderXError } from './ctrader-x.error';

export class ApplicationAuthenticationError extends cTraderXError {
    constructor(message: string){
        super(`Application authentication error: ${message}`);
    }
}