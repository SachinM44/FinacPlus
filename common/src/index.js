const z = require('zod');

const RegistrationInput = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
});

const LoginInput = z.object({
    email: z.string().email(),
    password: z.string()
});

const UpdateInput = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
});

module.exports = {
    RegistrationInput,
    LoginInput,
    UpdateInput
};