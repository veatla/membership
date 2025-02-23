// this file is JS because worker threads doesn't friendly with .ts files


export default class APIError extends Error {
    message = '';
    status = 500;

    constructor(message, status = 500) {
        super(message);
        this.message = message;
        this.status = status;
    }
}

/**
 * 
 * @param {string} message 
 * @param {number} status 
 * @returns {never}
 */
export function throw_err(message, status = 500) {
    throw new APIError(message, status);
}
