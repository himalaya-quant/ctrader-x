import { cTraderXError } from '../../models/ctrader-x-error.model';
import { ILogger } from '../../logger';

export abstract class BaseManager {
    protected readonly logger: ILogger;

    protected logCallAttempt(method: Function) {
        this.logger.debug(`Attempting ${method.name} call`);
    }

    protected logCallAttemptSuccess(method: Function) {
        this.logger.debug(`Call attempt to ${method.name} succeeded`);
    }

    protected logCallAttemptFailure(method: Function, error: unknown) {
        this.logger.error(
            `Call attempt to ${method.name} failed: ${cTraderXError.getMessageError(error)}`,
        );
    }
}
