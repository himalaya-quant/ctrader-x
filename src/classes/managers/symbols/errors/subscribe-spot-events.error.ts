import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class SubscribeSpotEventsError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `Subscribe spot events error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
