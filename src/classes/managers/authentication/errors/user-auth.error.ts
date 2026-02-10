import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class UserAuthenticationError extends cTraderXError {
    constructor(message: string) {
        super(`User authentication error: ${message}`);
    }
}
