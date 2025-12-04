export class ApiError extends Error {
    constructor(readonly status_code: number, readonly status_text: string, readonly content: any) {
        super(`${status_code}: ${status_text}`);
    }
}
