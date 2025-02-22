import { Type, type Static } from "@sinclair/typebox";

export const BaseAttachmentSchema = {
    id: Type.String({
        title: "Attachment id",
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

export const CreateAttachmentSchema = Type.Object({
    email: BaseAttachmentSchema.email,
});
export type CreateAttachment = Static<typeof CreateAttachmentSchema>;

export const LoginSchema = Type.Object({
    email: BaseAttachmentSchema.email,
    password: BaseAttachmentSchema.password,
});

export type Login = Static<typeof LoginSchema>;
