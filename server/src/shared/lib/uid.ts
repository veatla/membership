import { customAlphabet } from "nanoid";

const prefix = {
    USER: "U",
    POST: "P",
    SUBSCRIPTION: "S",
    PAYMENT: "PM",
    FOLLOW: "F",
} as const;

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// Speed: 1000 IDs per hour/second
// More than 1 quadrillion years or 1,462,346,530,580,454T IDs needed,
// in order to have a 1% probability of at least one collision.
const nanoid = customAlphabet(alphabet, 36);

const uid = (type: keyof typeof prefix) => `${prefix[type]}_${nanoid()}`;

export default uid;
