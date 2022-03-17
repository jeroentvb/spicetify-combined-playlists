import React from 'react';

export interface SvgIconProps {
   iconName: string;
}

export function SpicetifySvgIcon({ iconName }: SvgIconProps) {
   return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <svg className="spicetify-svg-icon" dangerouslySetInnerHTML={{__html: Spicetify.SVGIcons[iconName]}} height="16" width="16" viewBox="0 0 16 16" fill="currentColor"></svg>
   );
}
