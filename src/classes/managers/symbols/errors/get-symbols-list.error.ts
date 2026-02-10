import { cTraderXError } from '../../../models/ctrader-x-error.model';

export class GetSymbolsListError extends cTraderXError {
    constructor(error: unknown) {
        super(
            `Get symbols list error: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
