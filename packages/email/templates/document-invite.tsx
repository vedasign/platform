import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import type { RecipientRole } from '@prisma/client';
import { OrganisationType } from '@prisma/client';

import { Body, Container, Head, Hr, Html, Img, Preview, Section } from '../components';
import { useBranding } from '../providers/branding';
import { TemplateCustomMessageBody } from '../template-components/template-custom-message-body';
import type { TemplateDocumentInviteProps } from '../template-components/template-document-invite';
import { TemplateDocumentInvite } from '../template-components/template-document-invite';
import { TemplateFooter } from '../template-components/template-footer';
import { Text } from '../components';

export type DocumentInviteEmailTemplateProps = Partial<TemplateDocumentInviteProps> & {
  customBody?: string;
  role: RecipientRole;
  selfSigner?: boolean;
  teamName?: string;
  teamEmail?: string;
  includeSenderDetails?: boolean;
  organisationType?: OrganisationType;
};

export const DocumentInviteEmailTemplate = ({
  inviterName = 'Lucas Smith',
  inviterEmail = 'lucas@vedasign.uk',
  documentName = 'Open Source Pledge.pdf',
  signDocumentLink = 'https://vedasign.uk',
  assetBaseUrl = 'https://app.vedasign.uk',
  customBody,
  role,
  selfSigner = false,
  teamName = '',
  includeSenderDetails,
  organisationType,
}: DocumentInviteEmailTemplateProps) => {
  const { _ } = useLingui();
  const branding = useBranding();

  const action = _(RECIPIENT_ROLES_DESCRIPTION[role].actionVerb).toLowerCase();

  const displayName = teamName || inviterName;

  let previewText = msg`${displayName} has invited you to ${action} ${documentName}`;

  if (selfSigner) {
    previewText = msg`Please ${action} your document ${documentName}`;
  }

  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Html>
      <Head />
      <Preview>{_(previewText)}</Preview>

      <Body className="mx-auto my-auto bg-white font-sans">
        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-xl rounded-lg border border-slate-200 border-solid p-4 backdrop-blur-sm">
            <Section>
              {branding.brandingEnabled && branding.brandingLogo ? (
                <Img src={branding.brandingLogo} alt="Branding Logo" className="mb-4 h-6" />
              ) : (
                <Img src={getAssetUrl('/static/logo.png')} alt="VedaSign Logo" className="mb-4 h-6" />
              )}

              <TemplateDocumentInvite
                inviterName={displayName}
                inviterEmail={inviterEmail}
                documentName={documentName}
                signDocumentLink={signDocumentLink}
                assetBaseUrl={assetBaseUrl}
                role={role}
                selfSigner={selfSigner}
                organisationType={organisationType}
                teamName={teamName}
                includeSenderDetails={includeSenderDetails}
              />
            </Section>
          </Container>

          {customBody && (
            <Container className="mx-auto mt-12 max-w-xl">
              <Section>
                <Text className="mt-2 text-base text-slate-400">
                  <TemplateCustomMessageBody text={customBody} />
                </Text>
              </Section>
            </Container>
          )}

          <Hr className="mx-auto mt-12 max-w-xl" />

          <Container className="mx-auto max-w-xl">
            <TemplateFooter />
          </Container>
        </Section>
      </Body>
    </Html>
  );
};

export default DocumentInviteEmailTemplate;
