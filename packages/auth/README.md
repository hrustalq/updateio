# @repo/auth

A React authentication package for Telegram-based authentication in the UpdateIO platform.

## Features

- 🔐 Telegram Web App authentication
- 🌍 Global auth state management with Zustand
- ⚛️ React Context integration
- 💾 Persistent authentication state
- 🎨 Pre-built UI components with Tailwind CSS
- 📦 Type-safe components and hooks
- 🔄 Automatic token management
- ⚡ Loading and error states
- 🎯 Success/error callbacks

## Installation

Since this is a workspace package, it's already available in your monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@repo/auth": "workspace:*"
  }
}
```

## Quick Start

1. Wrap your app with `AuthProvider`:

```tsx
import { AuthProvider } from '@repo/auth';

function App() {
  return (
    <AuthProvider 
      botToken="YOUR_TELEGRAM_BOT_TOKEN"
      onAuthStateChange={(isAuthenticated) => {
        console.log('Auth state changed:', isAuthenticated);
      }}
      onTelegramAuthSuccess={(user) => {
        console.log('Telegram auth success:', user);
      }}
      onTelegramAuthError={(error) => {
        console.error('Telegram auth error:', error);
      }}
    >
      <YourApp />
    </AuthProvider>
  );
}
```

2. Use the auth hook in your components:

```tsx
import { useAuth } from '@repo/auth';

function UserProfile() {
  const { 
    user, 
    telegramUser, 
    isAuthenticated, 
    isLoading, 
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
      <h1>Welcome, {telegramUser?.first_name}!</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
```

3. Use the Telegram Login Button:

```tsx
import { TelegramLoginButton } from '@repo/auth';

function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <TelegramLoginButton 
        onSuccess={(user) => {
          console.log('Logged in:', user);
        }}
        onError={(error) => {
          console.error('Login failed:', error);
        }}
        className="my-custom-class"
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
| botToken | string | Yes | Your Telegram bot token |
| maxAge | number | No | Max age of auth data in seconds (default: 86400) |
| onAuthStateChange | (isAuthenticated: boolean) => void | No | Callback when auth state changes |
| onTelegramAuthSuccess | (user: TelegramUser) => void | No | Callback on successful Telegram auth |
| onTelegramAuthError | (error: Error) => void | No | Callback on auth error |
| children | React.ReactNode | Yes | Child components |

### useAuth Hook

A React hook that provides access to the auth state and methods.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| user | AuthUser \| null | The current authenticated user |
| telegramUser | TelegramUser \| null | The Telegram user data |
| accessToken | string \| null | The current access token |
| isAuthenticated | boolean | Whether the user is authenticated |
| isLoading | boolean | Loading state |
| error | Error \| null | Any authentication errors |
| setUser | (user: AuthUser \| null) => void | Set the current user |
| setTelegramUser | (user: TelegramUser \| null) => void | Set the Telegram user |
| setAccessToken | (token: string \| null) => void | Set the access token |
| logout | () => void | Log out the current user |

### TelegramLoginButton

A pre-built button component for Telegram authentication.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onSuccess | (user: TelegramUser) => void | No | Callback on successful login |
| onError | (error: Error) => void | No | Callback on login error |
| className | string | No | Additional CSS classes |
| children | React.ReactNode | No | Custom button content |

## Types

### AuthUser

```typescript
interface AuthUser {
  id: string;
  telegramId: string;
  role: 'ADMIN' | 'USER';
}
```

### TelegramUser

```typescript
interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}
```

## State Management

The package uses Zustand for state management with the following features:

- Persistent storage of auth state
- Automatic token management
- Type-safe state updates
- React integration

## Security

The package implements several security measures:

- Telegram authentication data validation
- Token expiration handling
- Secure storage of sensitive data
- CSRF protection

## Best Practices

1. Always wrap your app with `AuthProvider` at the root level
2. Use the `useAuth` hook to access auth state
3. Handle loading and error states appropriately
4. Implement proper error boundaries
5. Use TypeScript for type safety

## Contributing

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Make your changes
4. Run tests (if available)
5. Submit a pull request

## License

Internal package - all rights reserved. 