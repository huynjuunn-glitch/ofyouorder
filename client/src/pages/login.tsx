import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/auth';
import { loginSchema, signupSchema, type LoginData, type SignupData } from '@shared/schema';

export default function Login() {
  const [, setLocation] = useLocation();
  const [isSignup, setIsSignup] = useState(false);
  const { toast } = useToast();
  const { login, signup } = useAuthStore();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const signupForm = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' }
  });

  const handleLogin = (data: LoginData) => {
    const success = login(data.email, data.password);
    if (success) {
      toast({ title: '로그인 성공', description: '대시보드로 이동합니다.' });
      setLocation('/dashboard');
    } else {
      toast({ 
        title: '로그인 실패', 
        description: '이메일 또는 비밀번호가 올바르지 않습니다.',
        variant: 'destructive'
      });
    }
  };

  const handleSignup = (data: SignupData) => {
    const success = signup(data.email, data.password);
    if (success) {
      toast({ title: '회원가입 성공', description: '대시보드로 이동합니다.' });
      setLocation('/dashboard');
    } else {
      toast({ 
        title: '회원가입 실패', 
        description: '이미 존재하는 이메일입니다.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎂</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">케이크 매니저</h1>
          <p className="text-gray-600">주문 관리를 더 쉽고 효율적으로</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              {isSignup ? '회원가입' : '로그인'}
            </h2>
          </CardHeader>
          <CardContent>
            {!isSignup ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    data-testid="input-email"
                    {...loginForm.register('email')}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    data-testid="input-password"
                    {...loginForm.register('password')}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  data-testid="button-login"
                  disabled={loginForm.formState.isSubmitting}
                >
                  로그인
                </Button>
              </form>
            ) : (
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email">이메일</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    data-testid="input-signup-email"
                    {...signupForm.register('email')}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    data-testid="input-signup-password"
                    {...signupForm.register('password')}
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirm-password">비밀번호 확인</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    data-testid="input-confirm-password"
                    {...signupForm.register('confirmPassword')}
                  />
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  data-testid="button-signup"
                  disabled={signupForm.formState.isSubmitting}
                >
                  회원가입
                </Button>
              </form>
            )}
            
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsSignup(!isSignup)}
                data-testid="button-toggle-auth"
              >
                {isSignup 
                  ? '이미 계정이 있으신가요? 로그인' 
                  : '계정이 없으신가요? 회원가입'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
