export class cTraderXError extends Error {
    static getMessageError(error: unknown): string {
        if (error instanceof Error) return error.message || error.name;
        if (typeof error === 'string') return error;
        return JSON.stringify(error);
    }
}