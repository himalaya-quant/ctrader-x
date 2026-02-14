import { ProtoOAErrorRes } from '../../models/proto/models/ProtoOAErrorRes';

export class cTraderXError extends Error {
    static getMessageError(error: unknown): string {
        if (this.isProtoOAErrorRes(error))
            return `${error.errorCode} --> ${error.description} (RetryAfter: ${error.retryAfter} MaintenanceEnd: ${error.maintenanceEndTimestamp})`;
        if (error instanceof Error) return error.message || error.name;
        if (typeof error === 'string') return error;
        return JSON.stringify(error);
    }

    static isProtoOAErrorRes(error: any): error is ProtoOAErrorRes {
        if (error.payloadType && error.errorCode) return true;
        return false;
    }
}
