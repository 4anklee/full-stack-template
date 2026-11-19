# Component Props

Prefer a separate, named `type` declaration for React and React Native component props. Name it `<ComponentName>Props` and declare it near the component. Avoid inline object type annotations in component parameters.

```tsx
type AuthFormProps = {
    mode: "sign-in" | "sign-up";
    onSwitchMode: () => void;
};

export default function AuthForm({ mode, onSwitchMode }: AuthFormProps) {
    // ...
}
```
