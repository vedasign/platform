import type { HTMLAttributes } from 'react';

export type LogoProps = HTMLAttributes<HTMLImageElement>;

export const BrandingLogoIcon = ({ style, className, ...props }: LogoProps) => {
  return (
    <img
      src="/static/logo.png"
      alt="VedaSign"
      style={{ height: '32px', width: '32px', objectFit: 'contain', ...style }}
      className={className}
      {...props}
    />
  );
};
