'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const messages: Record<string, string> = {
    CredentialsSignin: 'The admin key you entered is incorrect.',
    OAuthSignin: 'There was a problem signing in with the provider. Please try again.',
    OAuthCallback: 'The authentication provider returned an error.',
    OAuthCreateAccount: 'Could not create your account.',
    EmailCreateAccount: 'Could not create your account.',
    Callback: 'An error occurred during the authentication callback.',
    default: 'An unexpected authentication error occurred.',
  };

  const message = messages[error || ''] || messages['default'];

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card p-8 w-full max-w-md text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
        <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
        <p className="text-sm text-[var(--muted)] mb-6">{message}</p>
        <Link href="/auth/signin" className="btn-primary inline-flex text-sm">
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ErrorContent />
    </Suspense>
  );
}
