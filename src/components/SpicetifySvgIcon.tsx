import React from 'react';

export interface SvgIconProps {
   iconName: string;
   size?: number;
   classes?: string;
}

export function SpicetifySvgIcon({ iconName, size = 24, classes = '' }: SvgIconProps) {
   return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <svg className={classes + ' spicetify-svg-icon'} dangerouslySetInnerHTML={{__html: Spicetify.SVGIcons[iconName]}} height={size} width={size} viewBox="0 0 16 16" fill="currentColor"></svg>
   );
}
