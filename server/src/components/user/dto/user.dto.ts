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

    email: Type.String({
        title: "Email",
        format: "email",
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

export type Login = Static<typeof LoginSchema>;
