import type { HTMLAttributes } from 'react';

export type LogoProps = HTMLAttributes<HTMLImageElement>;

export const BrandingLogo = ({ style, className, ...props }: LogoProps) => {
  return (
    <img
      src="/static/logo.png"
      alt="VedaSign"
      style={{ height: '32px', width: 'auto', ...style }}
      className={className}
      {...props}
    />
  );
};
