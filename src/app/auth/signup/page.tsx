// ============================================================
// SIGNUP PAGE — /auth/signup
// ============================================================
import { AuthCard, SignupForm } from '@/components/Auth';

export default function SignupPage() {
  return (
    <AuthCard activeTab="signup">
      <SignupForm />
    </AuthCard>
  );
}
