import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/auth';
import { loginSchema, type LoginData } from '@shared/schema';

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuthStore();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const handleLogin = (data: LoginData) => {
    const success = login(data.email, data.password);
    if (success) {
      toast({ 
        title: '로그인 성공', 
        description: '구글 시트 연결 정보가 자동으로 설정되었습니다.' 
      });
      setLocation('/dashboard');
    } else {
      toast({ 
        title: '로그인 실패', 
        description: '아이디 또는 비밀번호가 올바르지 않습니다.',
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
            <h2 className="text-xl font-semibold text-gray-900">로그인</h2>
            <p className="text-sm text-gray-600">개인 전용 케이크 관리 시스템</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <Label htmlFor="email">아이디</Label>
                <Input
                  id="email"
                  type="text"
                  {...loginForm.register('email')}
                  className="mt-1"
                  placeholder="아이디를 입력하세요"
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
                  {...loginForm.register('password')}
                  className="mt-1"
                  placeholder="비밀번호를 입력하세요"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}