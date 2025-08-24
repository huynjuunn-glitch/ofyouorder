import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { settingsSchema, type Settings } from '@shared/schema';

export default function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<Settings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      apiKey: '',
      sheetId: '',
      sheetName: '주문내역',
    }
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const apiKey = localStorage.getItem('cake_manager_api_key') || '';
    const sheetId = localStorage.getItem('cake_manager_sheet_id') || '';
    const sheetName = localStorage.getItem('cake_manager_sheet_name') || '주문내역';
    
    form.reset({ apiKey, sheetId, sheetName });
  }, [form]);

  // Listen for open modal events
  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('openSettingsModal', handleOpenModal);
    return () => window.removeEventListener('openSettingsModal', handleOpenModal);
  }, []);

  const handleSave = (data: Settings) => {
    localStorage.setItem('cake_manager_api_key', data.apiKey);
    localStorage.setItem('cake_manager_sheet_id', data.sheetId);
    localStorage.setItem('cake_manager_sheet_name', data.sheetName);
    
    setIsOpen(false);
    toast({
      title: '설정 저장 완료',
      description: 'Google Sheets 설정이 저장되었습니다.'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md" data-testid="modal-settings">
        <DialogHeader>
          <DialogTitle>
            Google Sheets 설정
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              placeholder="Google Sheets API Key를 입력하세요"
              data-testid="input-api-key"
              className="bg-gray-100 border-gray-300 placeholder:opacity-50"
              {...form.register('apiKey')}
            />
            {form.formState.errors.apiKey && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.apiKey.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="sheetId">Sheet ID</Label>
            <Input
              id="sheetId"
              placeholder="Google Sheets ID를 입력하세요"
              data-testid="input-sheet-id"
              className="bg-gray-100 border-gray-300 placeholder:opacity-50"
              {...form.register('sheetId')}
            />
            {form.formState.errors.sheetId && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.sheetId.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="sheetName">Sheet Name</Label>
            <Input
              id="sheetName"
              placeholder="시트 이름을 입력하세요"
              data-testid="input-sheet-name"
              className="bg-gray-100 border-gray-300 placeholder:opacity-50"
              {...form.register('sheetName')}
            />
            {form.formState.errors.sheetName && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.sheetName.message}
              </p>
            )}
          </div>
          
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <div className="text-sm">
                <p className="font-medium mb-1">설정 전 확인사항:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Google Sheets를 '링크가 있는 모든 사용자'로 공유</li>
                  <li>Google Cloud Console에서 Sheets API 활성화</li>
                  <li>컬럼 순서: 이름|디자인|주문일자|픽업일자|맛선택|시트|사이즈|크림|요청사항|특이사항|주문경로</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              data-testid="button-cancel-settings"
            >
              취소
            </Button>
            <Button
              type="submit"
              data-testid="button-save-settings"
              disabled={form.formState.isSubmitting}
            >
              저장
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
