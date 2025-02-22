export enum UserAccess {
    YOU_FOLLOWED = 0x0001,
    YOU_SUBSCRIBED = 0x0002,
    
    FOLLOWS_YOU = 0x0003,
    SUBSCRIBES_YOU = 0x0004,

    YOU_BANNED = 0x0006,
    BANNED_YOU = 0x0005,

    CAN_COMMENT = 0x0006,
    CAN_MESSAGE = 0x0007,
};


export enum UserState {
    PUBLIC = 0x0001,
    VERIFIED = 0x0002,
    DEACTIVATED = 0x0003,
    CONFIRMED = 0x0004,
}
