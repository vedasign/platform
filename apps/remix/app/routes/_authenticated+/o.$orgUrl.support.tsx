import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { BookIcon, HelpCircleIcon, MailIcon } from 'lucide-react';
import { Link } from 'react-router';

import { appMetaTags } from '~/utils/meta';
import { SUPPORT_EMAIL } from '@documenso/lib/constants/app';

export function meta() {
  return appMetaTags(msg`Support`);
}

export default function SupportPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 md:px-8">
      <div className="mb-8">
        <h1 className="flex flex-row items-center gap-2 font-bold text-3xl">
          <HelpCircleIcon className="h-8 w-8 text-muted-foreground" />
          <Trans>Support</Trans>
        </h1>

        <p className="mt-2 text-muted-foreground">
          <Trans>We're here to help. Choose a support channel below:</Trans>
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <div className="rounded-lg border p-4">
            <h2 className="flex items-center gap-2 font-bold text-lg">
              <BookIcon className="h-5 w-5 text-muted-foreground" />
              <Link
                to="https://vedasign.uk/help"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                <Trans>Help Centre</Trans>
              </Link>
            </h2>
            <p className="mt-1 text-muted-foreground">
              <Trans>Visit our help centre for guides and tutorials on using VedaSign.</Trans>
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="flex items-center gap-2 font-bold text-lg">
              <MailIcon className="h-5 w-5 text-muted-foreground" />
              <Link
                to={`mailto:${SUPPORT_EMAIL}`}
                className="hover:underline"
              >
                <Trans>Email Support</Trans>
              </Link>
            </h2>
            <p className="mt-1 text-muted-foreground">
              <Trans>Email us at {SUPPORT_EMAIL} and we'll get back to you as soon as possible.</Trans>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
