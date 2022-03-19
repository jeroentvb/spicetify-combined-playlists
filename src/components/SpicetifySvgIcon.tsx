import React from 'react';

export interface SvgIconProps {
   iconName: string;
   size?: number;
}

export function SpicetifySvgIcon({ iconName, size = 24 }: SvgIconProps) {
   return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <svg className="spicetify-svg-icon" dangerouslySetInnerHTML={{__html: Spicetify.SVGIcons[iconName]}} height={size} width={size} viewBox="0 0 16 16" fill="currentColor"></svg>
   );
}
