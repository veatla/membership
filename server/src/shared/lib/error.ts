export default class APIError extends Error {
    constructor(public message: string, public status = 500) {
        super(message);
    }
}

export function throw_err(message: string, status?: number): never {
    throw new APIError(message, status);
}
