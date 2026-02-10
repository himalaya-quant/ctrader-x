import { CTraderConnection } from '@reiryoku/ctrader-layer';
import { Configuration } from '../client';
import { ILogger } from '../logger';
import { ApplicationAuthenticationError } from '../../errors/application-auth.error';
import { cTraderXError } from '../../errors/ctrader-x.error';
import { UserAuthenticationError } from '../../errors/user-auth.error';
import { ProtoOAAccountAuthReq } from '../../models/proto/authentication/ProtoOAAccountAuthReq';
import { ProtoOAApplicationAuthReq } from '../../models/proto/authentication/ProtoOAApplicationAuthReq';

interface ICredentials extends Pick<
    Configuration,
    | 'clientId'
    | 'clientSecret'
    | 'ctidTraderAccountId'
    | 'accessToken'
    | 'accessToken'
> {
    clientId: string;
    accessToken: string;
    clientSecret: string;
    ctidTraderAccountId: number;
}

export class AuthenticationManager {
    constructor(
        readonly credentials: ICredentials,
        private readonly connection: CTraderConnection,
        private readonly logger: ILogger,
    ) {}

    async authenticateApp() {
        try {
            this.logger.debug('Attempting application authentication');

            const payload: ProtoOAApplicationAuthReq = {
                clientId: this.credentials.clientId,
                clientSecret: this.credentials.clientSecret,
            };
            await this.connection.sendCommand(
                ProtoOAApplicationAuthReq.name,
                payload,
            );

            this.logger.debug('Application authenticated');
        } catch (e) {
            const message = cTraderXError.getMessageError(e);
            this.logger.error(`Error authenticating application: ${message}`);
            throw new ApplicationAuthenticationError(message);
        }
    }

    async authenticateUser() {
        try {
            this.logger.debug('Attempting user authentication');

            const payload: ProtoOAAccountAuthReq = {
                accessToken: this.credentials.accessToken,
                ctidTraderAccountId: this.credentials.ctidTraderAccountId,
            };
            await this.connection.sendCommand(
                ProtoOAAccountAuthReq.name,
                payload,
            );

            this.logger.debug('User authenticated');
        } catch (e) {
            const message = cTraderXError.getMessageError(e);
            this.logger.error(`Error authenticating user: ${message}`);
            throw new UserAuthenticationError(message);
        }
    }
}
