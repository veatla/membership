import { Type, type Static } from "@sinclair/typebox";

export const BasePostSchema = {
    id: Type.String({
        title: "Post id",
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

    Postname: Type.String({
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

export const CreatePostSchema = Type.Object({
    email: BasePostSchema.email,
    password: BasePostSchema.password,
    birthday: Type.Optional(BasePostSchema.birthday),
    Postname: Type.Optional(BasePostSchema.Postname),
});
export type CreatePost = Static<typeof CreatePostSchema>;

export const LoginSchema = Type.Object({
    email: BasePostSchema.email,
    password: BasePostSchema.password,
});

export type Login = Static<typeof LoginSchema>;
