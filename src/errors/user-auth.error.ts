import { cTraderXError } from './ctrader-x.error';

export class UserAuthenticationError extends cTraderXError {
    constructor(message: string) {
        super(`User authentication error: ${message}`);
    }
}
