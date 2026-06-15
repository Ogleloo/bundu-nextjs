// ============================================================
// LOGIN PAGE — /auth/login
// ============================================================
import { AuthCard, LoginForm } from '@/components/Auth';

export default function LoginPage() {
  return (
    <AuthCard activeTab="login">
      <LoginForm />
    </AuthCard>
  );
}
