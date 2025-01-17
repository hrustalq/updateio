# Auth Store

## Обзор
Auth Store предоставляет централизованное хранилище состояния аутентификации для фронтенд-приложений системы UpdateIO.

## Возможности

### Управление Состоянием
- Хранение данных пользователя
- Управление токенами
- Синхронизация состояния
- Персистентность данных

### Интеграция с Фреймворками
- React хуки и компоненты
- Интеграция с React Router
- Защищенные маршруты
- Контекст авторизации

### События и Подписки
- Подписка на изменения состояния
- События аутентификации
- Обработчики изменений
- Middleware

## Использование

### React Хуки
```typescript
import { useAuth, useUser, usePermissions } from '@updateio/auth-store';

function Profile() {
  const { user } = useUser();
  const { logout } = useAuth();
  const { can } = usePermissions();

  if (can('profile:edit')) {
    // Показать форму редактирования
  }

  return (
    <div>
      <h1>Профиль {user.name}</h1>
      <button onClick={logout}>Выйти</button>
    </div>
  );
}
```

### Защищенные Маршруты
```typescript
import { ProtectedRoute } from '@updateio/auth-store';

function App() {
  return (
    <Routes>
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

### Провайдер Состояния
```typescript
import { AuthProvider } from '@updateio/auth-store';

function App() {
  return (
    <AuthProvider
      storage="localStorage"
      initialState={{ isAuthenticated: false }}
    >
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
```

## Конфигурация

### Настройки Хранилища
```typescript
interface AuthStoreConfig {
  storage: 'localStorage' | 'sessionStorage' | 'memory';
  key?: string;
  serialize?: (state: AuthState) => string;
  deserialize?: (raw: string) => AuthState;
}
```

### Начальное Состояние
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens: Tokens | null;
  loading: boolean;
  error: Error | null;
}
```

## Интеграции

### React Router
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@updateio/auth-store';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    await login(credentials);
    navigate('/dashboard');
  };
}
```

### API Client
```typescript
import { useAuth } from '@updateio/auth-store';
import { createApiClient } from '@updateio/api-client';

const api = createApiClient({
  onUnauthorized: () => {
    const { logout } = useAuth();
    logout();
  },
});
```

## Типизация

### Хуки
```typescript
interface UseAuth {
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

interface UseUser {
  user: User | null;
  loading: boolean;
  error: Error | null;
}
```

### События
```typescript
type AuthEvent = 
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESH'; payload: Tokens }
  | { type: 'ERROR'; payload: Error };
``` 