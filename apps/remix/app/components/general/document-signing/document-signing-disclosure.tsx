import { cn } from '@documenso/ui/lib/utils';

import { Trans } from '@lingui/react/macro';
import type { HTMLAttributes } from 'react';
import { Link } from 'react-router';
import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';

export type DocumentSigningDisclosureProps = HTMLAttributes<HTMLParagraphElement>;

export const DocumentSigningDisclosure = ({ className, ...props }: DocumentSigningDisclosureProps) => {
  const isLatAm = NEXT_PUBLIC_WEBAPP_URL().includes('vedasign.lat');
  return (
    <p className={cn('text-muted-foreground text-xs', className)} {...props}>
      {isLatAm ? (
        <Trans>
          By proceeding with your electronic signature, you acknowledge and consent that it will be used to sign the given
          document and holds the same legal validity as a handwritten signature, in accordance with the UNCITRAL Model Law
          on Electronic Commerce. By completing the electronic signing process, you affirm your understanding and
          acceptance of these conditions.
        </Trans>
      ) : (
        <Trans>
          By proceeding with your electronic signature, you acknowledge and consent that it will be used to sign the given
          document and holds the same legal validity as a handwritten signature. By completing the electronic signing
          process, you affirm your understanding and acceptance of these conditions.
        </Trans>
      )}
      <span className="mt-2 block">
        <Trans>
          Read the full{' '}
          <Link className="text-[#C94F00] underline" to="/articles/signature-disclosure" target="_blank">
            signature disclosure
          </Link>
          .
        </Trans>
      </span>
    </p>
  );
};
