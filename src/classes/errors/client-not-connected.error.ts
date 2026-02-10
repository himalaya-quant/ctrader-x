import { cTraderXError } from '../models/ctrader-x-error.model';

export class ClientNotConnectedError extends cTraderXError {
    constructor() {
        super(`Client not connected error`);
    }
}
