import { useForm } from "@tanstack/react-form";
import {
    Button,
    Card,
    FieldError,
    Input,
    type InputRef,
    Label,
    Spinner,
    TextField,
    useThemeColor,
    useToast,
} from "heroui-native";
import { useRef } from "react";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/orpc";

type AuthFormProps = {
    mode: "sign-in" | "sign-up";
};

export function AuthForm({ mode }: AuthFormProps) {
    const isSignUp = mode === "sign-up";
    const emailInputRef = useRef<InputRef>(null);
    const passwordInputRef = useRef<InputRef>(null);
    const accentForeground = useThemeColor("accent-foreground");
    const { toast } = useToast();

    const form = useForm({
        defaultValues: { name: "", email: "", password: "" },
        validators: {
            onSubmit: z.object({
                name: isSignUp
                    ? z.string().trim().min(2, "Name must be at least 2 characters")
                    : z.string(),
                email: z.string().trim().pipe(z.email("Enter a valid email address")),
                password: z.string().min(8, "Use at least 8 characters"),
            }),
        },
        onSubmit: async ({ value, formApi }) => {
            const credentials = { email: value.email.trim(), password: value.password };
            const result = isSignUp
                ? await authClient.signUp.email({ ...credentials, name: value.name.trim() })
                : await authClient.signIn.email(credentials);

            if (result.error) {
                toast.show({
                    variant: "danger",
                    label:
                        result.error.message ||
                        (isSignUp ? "Failed to sign up" : "Failed to sign in"),
                });
                return;
            }

            formApi.reset();
            toast.show({
                variant: "success",
                label: isSignUp ? "Account created successfully" : "Signed in successfully",
            });
            await queryClient.refetchQueries();
        },
    });

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Card variant="secondary">
                    <Card.Body className="gap-4">
                        <Card.Title>{isSignUp ? "Create Account" : "Sign In"}</Card.Title>
                        {isSignUp ? (
                            <form.Field name="name">
                                {(field) => (
                                    <TextField
                                        isRequired
                                        isDisabled={isSubmitting}
                                        isInvalid={field.state.meta.errors.length > 0}
                                    >
                                        <Label>Name</Label>
                                        <Input
                                            variant="secondary"
                                            accessibilityLabel="Name"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChangeText={field.handleChange}
                                            autoComplete="name"
                                            textContentType="name"
                                            returnKeyType="next"
                                            submitBehavior="submit"
                                            onSubmitEditing={() => emailInputRef.current?.focus()}
                                        />
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
                                    isRequired
                                    isDisabled={isSubmitting}
                                    isInvalid={field.state.meta.errors.length > 0}
                                >
                                    <Label>Email</Label>
                                    <Input
                                        ref={emailInputRef}
                                        variant="secondary"
                                        accessibilityLabel="Email"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChangeText={field.handleChange}
                                        placeholder="email@example.com"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="email"
                                        textContentType="emailAddress"
                                        returnKeyType="next"
                                        submitBehavior="submit"
                                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                                    />
                                    <FieldError>
                                        {field.state.meta.errors
                                            .map((error) => error?.message)
                                            .join(" ")}
                                    </FieldError>
                                </TextField>
                            )}
                        </form.Field>
                        <form.Field name="password">
                            {(field) => (
                                <TextField
                                    isRequired
                                    isDisabled={isSubmitting}
                                    isInvalid={field.state.meta.errors.length > 0}
                                >
                                    <Label>Password</Label>
                                    <Input
                                        ref={passwordInputRef}
                                        variant="secondary"
                                        accessibilityLabel="Password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChangeText={field.handleChange}
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoComplete={isSignUp ? "new-password" : "password"}
                                        textContentType={isSignUp ? "newPassword" : "password"}
                                        returnKeyType="go"
                                        onSubmitEditing={() => {
                                            if (!isSubmitting) void form.handleSubmit();
                                        }}
                                    />
                                    <FieldError>
                                        {field.state.meta.errors
                                            .map((error) => error?.message)
                                            .join(" ")}
                                    </FieldError>
                                </TextField>
                            )}
                        </form.Field>
                    </Card.Body>
                    <Card.Footer>
                        <Button
                            className="flex-1"
                            onPress={() => void form.handleSubmit()}
                            isDisabled={isSubmitting}
                            accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
                        >
                            {isSubmitting ? <Spinner size="sm" color={accentForeground} /> : null}
                            <Button.Label>
                                {isSubmitting
                                    ? "Submitting..."
                                    : isSignUp
                                      ? "Create Account"
                                      : "Sign In"}
                            </Button.Label>
                        </Button>
                    </Card.Footer>
                </Card>
            )}
        </form.Subscribe>
    );
}
