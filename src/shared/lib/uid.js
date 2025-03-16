import { customAlphabet } from "nanoid";

const prefix = {
    USER: "U",
    POST: "P",
    POST_ACCESSES: "PA",
    SUBSCRIPTION: "S",
    PAYMENT: "PM",
    ATTACHMENT: "F",
    ATTACHMENT_ITEM: "FI",
    ATTACHMENT_REFERENCE: "FR",
    MEMBERSHIP_TIER: "MT",
};

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// Speed: 1000 IDs per hour/second
// More than 1 quadrillion years or 1,462,346,530,580,454T IDs needed,
// in order to have a 1% probability of at least one collision.
const nanoid = customAlphabet(alphabet, 36);

/**
 * 
 * @param {keyof typeof prefix} type 
 * @returns 
 */
const uid = (type) => `${prefix[type]}:${nanoid()}`;

export default uid;
