# @repo/credentials

A React authentication package for credentials-based (email/password) authentication in the UpdateIO platform.

## Features

- 🔑 Email/Password authentication
- 🌍 Global auth state management with Zustand
- ⚛️ React Context integration
- 💾 Persistent authentication state
- 🎨 Pre-built UI components with Tailwind CSS
- 📦 Type-safe components and hooks
- 🔄 Automatic token refresh
- ⚡ Loading and error states
- 🎯 Success/error callbacks

## Installation

Since this is a workspace package, it's already available in your monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@repo/credentials": "workspace:*"
  }
}
```

## Quick Start

1. Wrap your app with `AuthProvider`:

```tsx
import { AuthProvider } from '@repo/credentials';

function App() {
  return (
    <AuthProvider 
      onAuthStateChange={(isAuthenticated) => {
        console.log('Auth state changed:', isAuthenticated);
      }}
    >
      <YourApp />
    </AuthProvider>
  );
}
```

2. Use the auth hook in your components:

```tsx
import { useAuth } from '@repo/credentials';

function UserProfile() {
  const { 
    isAuthenticated, 
    isLoading, 
    error,
    logout 
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome!</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
```

3. Use the pre-built login form:

```tsx
import { LoginForm } from '@repo/credentials';

function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm 
        onSuccess={() => {
          console.log('Login successful');
        }}
        onError={(error) => {
          console.error('Login failed:', error);
        }}
      />
    </div>
  );
}
```

## API Reference

### AuthProvider

The main provider component that manages authentication state.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onAuthStateChange | (isAuthenticated: boolean) => void | No | Callback when auth state changes |
| children | React.ReactNode | Yes | Child components |

### useAuth Hook

A React hook that provides access to the auth state and methods.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| credentials | Credentials \| null | The current credentials |
| accessToken | string \| null | The current access token |
| expiresIn | number \| null | Token expiration time in seconds |
| issuedAt | number \| null | Token issue timestamp |
| isAuthenticated | boolean | Whether the user is authenticated |
| isLoading | boolean | Loading state |
| error | Error \| null | Any authentication errors |
| login | (email: string, password: string) => Promise<void> | Login function |
| logout | () => Promise<void> | Logout function |
| refreshToken | () => Promise<void> | Token refresh function |

### LoginForm

A pre-built form component for email/password authentication.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onSuccess | () => void | No | Callback on successful login |
| onError | (error: Error) => void | No | Callback on login error |
| className | string | No | Additional CSS classes |

## Types

### Credentials

```typescript
interface Credentials {
  email: string;
  password: string;
}
```

### AuthResponse

```typescript
interface AuthResponse {
  access_token: string;
  expires_in: number;
  issued_at: number;
}
```

## State Management

The package uses Zustand for state management with the following features:

- Automatic token management
- Type-safe state updates
- React integration
- Error handling

## Security

The package implements several security measures:

- Secure token storage
- Automatic token refresh
- Token expiration handling
- HTTP-only cookies for refresh tokens
- CSRF protection

## API Integration

The package integrates with the UpdateIO API:

- Automatic handling of auth endpoints
- Token refresh mechanism
- Error handling and retries
- Axios instance configuration

## Best Practices

1. Always wrap your app with `AuthProvider` at the root level
2. Use the `useAuth` hook to access auth state
3. Handle loading and error states appropriately
4. Implement proper error boundaries
5. Use TypeScript for type safety
6. Never store sensitive data in local storage
7. Always use HTTPS in production

## Error Handling

The package provides comprehensive error handling:

- Network errors
- Authentication errors
- Token refresh errors
- Validation errors
- API errors

## Contributing

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Make your changes
4. Run tests (if available)
5. Submit a pull request

## License

Internal package - all rights reserved. 