import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class UserAuthenticationError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `User authentication error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
