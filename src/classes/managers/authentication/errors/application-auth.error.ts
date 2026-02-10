import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class ApplicationAuthenticationError extends cTraderXError {
    constructor(message: string) {
        super(`Application authentication error: ${message}`);
    }
}
