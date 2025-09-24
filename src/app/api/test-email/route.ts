import { ResendEmailService } from '@/services/resendEmailService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || 'test@example.com';
  
  const success = await ResendEmailService.testEmailConfiguration(email);
  
  return Response.json({ 
    success, 
    message: success ? 'Test email sent!' : 'Email failed to send' 
  });
}