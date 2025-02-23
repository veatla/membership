import { Type, type Static } from "@sinclair/typebox";

export const BaseUserSchema = {
    id: Type.String({
        title: "User id",
        maxLength: 34,
    }),

    first_name: Type.String({
        title: "First Name",
        maxLength: 32,
    }),

    last_name: Type.String({
        title: "Last Name",
        maxLength: 32,
    }),

    password: Type.String({
        title: "Password",
        minLength: 6,
        maxLength: 32,
    }),

    birthday: Type.Number({
        title: "Birthday",
        minLength: 10,
        maxLength: 30,
    }),

    username: Type.String({
        title: "Password",
        minLength: 3,
        maxLength: 32,
    }),

    email: Type.RegExp(
        /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/,
        {
            title: "Email",
            minLength: 6,
            maxLength: 32,
        }
    ),

    stripe_customer_id: Type.String({
        title: "Stripe Customer ID",
        minLength: 6,
        maxLength: 32,
    }),

    phone: Type.RegExp(
        /^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/,
        {
            title: "Phone",
            minLength: 6,
            maxLength: 32,
        }
    ),
};

export const CreateUserSchema = Type.Object({
    email: BaseUserSchema.email,
    password: BaseUserSchema.password,
    birthday: Type.Optional(BaseUserSchema.birthday),
    username: Type.Optional(BaseUserSchema.username),
});
export type CreateUser = Static<typeof CreateUserSchema>;

export const LoginSchema = Type.Object({
    email: BaseUserSchema.email,
    password: BaseUserSchema.password,
});

export const GetUserByIdSchema = Type.Object({
    id: BaseUserSchema.id,
});

export type Login = Static<typeof LoginSchema>;
