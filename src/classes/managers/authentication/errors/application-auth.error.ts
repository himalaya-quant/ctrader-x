import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class ApplicationAuthenticationError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `Application authentication error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
