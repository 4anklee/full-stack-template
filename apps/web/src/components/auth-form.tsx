import { Button, FieldError, Input, Label, TextField, toast } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function AuthForm({
    mode,
    onSwitchMode,
}: {
    mode: "sign-in" | "sign-up";
    onSwitchMode: () => void;
}) {
    const navigate = useNavigate();
    const { isPending } = authClient.useSession();
    const isSignUp = mode === "sign-up";

    const form = useForm({
        defaultValues: { name: "", email: "", password: "" },
        validators: {
            onSubmit: z.object({
                name: isSignUp
                    ? z.string().min(2, "Name must be at least 2 characters")
                    : z.string(),
                email: z.email("Invalid email address"),
                password: z.string().min(8, "Password must be at least 8 characters"),
            }),
        },
        onSubmit: async ({ value }) => {
            const result = isSignUp
                ? await authClient.signUp.email(value)
                : await authClient.signIn.email({ email: value.email, password: value.password });

            if (result.error) {
                toast.danger(result.error.message || result.error.statusText);
                return;
            }

            toast.success(isSignUp ? "Sign up successful" : "Sign in successful");
            await navigate({ to: "/dashboard" });
        },
    });

    if (isPending) {
        return <Loader />;
    }

    return (
        <div className="mx-auto mt-10 w-full max-w-md p-6">
            <h1 className="mb-6 text-center text-3xl font-bold">
                {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <form
                noValidate
                className="flex flex-col gap-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    void form.handleSubmit();
                }}
            >
                {isSignUp ? (
                    <form.Field name="name">
                        {(field) => (
                            <TextField
                                name={field.name}
                                value={field.state.value}
                                onChange={field.handleChange}
                                onBlur={field.handleBlur}
                                isRequired
                                isInvalid={field.state.meta.errors.length > 0}
                                validationBehavior="aria"
                            >
                                <Label>Name</Label>
                                <Input autoComplete="name" />
                                <FieldError>
                                    {field.state.meta.errors
                                        .map((error) => error?.message)
                                        .join(" ")}
                                </FieldError>
                            </TextField>
                        )}
                    </form.Field>
                ) : null}
                <form.Field name="email">
                    {(field) => (
                        <TextField
                            name={field.name}
                            type="email"
                            value={field.state.value}
                            onChange={field.handleChange}
                            onBlur={field.handleBlur}
                            isRequired
                            isInvalid={field.state.meta.errors.length > 0}
                            validationBehavior="aria"
                        >
                            <Label>Email</Label>
                            <Input autoComplete="email" />
                            <FieldError>
                                {field.state.meta.errors.map((error) => error?.message).join(" ")}
                            </FieldError>
                        </TextField>
                    )}
                </form.Field>
                <form.Field name="password">
                    {(field) => (
                        <TextField
                            name={field.name}
                            type="password"
                            value={field.state.value}
                            onChange={field.handleChange}
                            onBlur={field.handleBlur}
                            isRequired
                            isInvalid={field.state.meta.errors.length > 0}
                            validationBehavior="aria"
                        >
                            <Label>Password</Label>
                            <Input autoComplete={isSignUp ? "new-password" : "current-password"} />
                            <FieldError>
                                {field.state.meta.errors.map((error) => error?.message).join(" ")}
                            </FieldError>
                        </TextField>
                    )}
                </form.Field>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting] as const}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            fullWidth
                            isDisabled={!canSubmit}
                            isPending={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : isSignUp ? "Sign Up" : "Sign In"}
                        </Button>
                    )}
                </form.Subscribe>
            </form>
            <div className="mt-4 text-center">
                <Button variant="ghost" onPress={onSwitchMode}>
                    {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
                </Button>
            </div>
        </div>
    );
}
