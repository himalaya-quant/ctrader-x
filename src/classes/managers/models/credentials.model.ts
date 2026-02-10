import { IConfiguration } from '../../models/client-configuration.model';

export interface ICredentials extends Pick<
    IConfiguration,
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
