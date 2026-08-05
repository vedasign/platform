import { getOptionalSession } from '@documenso/auth/server/lib/utils/get-session';
import { acceptOrganisationInvitation } from '@documenso/lib/server-only/organisation/accept-organisation-invitation';
import { prisma } from '@documenso/prisma';
import { Button } from '@documenso/ui/primitives/button';
import { Input } from '@documenso/ui/primitives/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { useState } from 'react';
import { Link } from 'react-router';

import type { Route } from './+types/organisation.invite.$token';

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await getOptionalSession(request);
  const { token } = params;

  if (!token) {
    return { state: 'InvalidLink' } as const;
  }

  const organisationMemberInvite = await prisma.organisationMemberInvite.findUnique({
    where: { token },
    include: { organisation: { select: { name: true } } },
  });

  if (!organisationMemberInvite) {
    return { state: 'InvalidLink' } as const;
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: organisationMemberInvite.email, mode: 'insensitive' } },
    select: { id: true },
  });

  if (user) {
    await acceptOrganisationInvitation({ token: organisationMemberInvite.token });
    return {
      state: 'Success',
      email: organisationMemberInvite.email,
      organisationName: organisationMemberInvite.organisation.name,
      isSessionUserTheInvitedUser: user.id === session.user?.id,
    } as const;
  }

  return {
    state: 'LoginRequired' as const,
    email: organisationMemberInvite.email,
    organisationName: organisationMemberInvite.organisation.name,
    inviteToken: token,
  };
}

export default function AcceptInvitationPage({ loaderData }: Route.ComponentProps) {
  const data = loaderData;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  if (data.state === 'InvalidLink') {
    return (
      <div className="w-screen max-w-lg px-4">
        <h1 className="font-semibold text-4xl"><Trans>Invalid token</Trans></h1>
        <p className="mt-2 mb-4 text-muted-foreground text-sm">
          <Trans>This token is invalid or has expired. Please contact your team for a new invitation.</Trans>
        </p>
        <Button asChild><Link to="/"><Trans>Return</Trans></Link></Button>
      </div>
    );
  }

  if (data.state === 'Success') {
    return (
      <div>
        <h1 className="font-semibold text-4xl"><Trans>Invitation accepted!</Trans></h1>
        <p className="mt-2 mb-4 text-muted-foreground text-sm">
          <Trans>You have accepted an invitation from <strong>{data.organisationName}</strong> to join their organisation.</Trans>
        </p>
        <Button asChild>
          <Link to={`/signin#email=${encodeURIComponent(data.email)}`}>
            <Trans>Continue to login</Trans>
          </Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/\d/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const isLatAm = window.location.hostname.includes('vedasign.lat');
      const internalApiBase = isLatAm ? 'https://app.vedasign.lat' : 'https://app.vedasign.uk';
      const market = isLatAm ? 'lat' : 'uk';

      const createRes = await fetch(`${internalApiBase}/internal/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password,
          name: data.email.split('@')[0],
          secret: 'vedasign-internal-api-secret-2026',
          isInvite: true,
          market
        })
      });

      const createResult = await createRes.json();

      if (!createRes.ok && !createResult.message?.includes('already exists')) {
        setError(createResult.error || 'Failed to create account.');
        setLoading(false);
        return;
      }

      const acceptRes = await fetch(`${internalApiBase}/internal/accept-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invite_token: data.inviteToken,
          email: data.email,
          secret: 'vedasign-internal-api-secret-2026',
          market
        })
      });

      const acceptResult = await acceptRes.json();

      if (!acceptRes.ok) {
        setError(acceptResult.error || 'Failed to accept invitation.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);

    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div>
        <h1 className="font-semibold text-4xl"><Trans>Account created!</Trans></h1>
        <p className="mt-2 mb-4 text-muted-foreground text-sm">
          <Trans>Redirecting you to login...</Trans>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-semibold text-4xl"><Trans>Join {data.organisationName}</Trans></h1>
      <p className="mt-2 mb-6 text-muted-foreground text-sm">
        <Trans>You have been invited to join <strong>{data.organisationName}</strong>. Set your password to get started.</Trans>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="text-sm font-medium"><Trans>Password</Trans></label>
          <div className="relative mt-1">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters, 1 number"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1 text-muted-foreground text-xs">
            <Trans>At least 8 characters, including 1 number.</Trans>
          </p>
        </div>
        <div>
          <label className="text-sm font-medium"><Trans>Confirm Password</Trans></label>
          <div className="relative mt-1">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Trans>Creating account...</Trans> : <Trans>Create account & join organisation</Trans>}
        </Button>
      </form>
    </div>
  );
}
