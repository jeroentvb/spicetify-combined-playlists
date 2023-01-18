import React from 'react';
import type { SpotifyPlaylist } from '../types';
import { SpicetifySvgIcon } from './SpicetifySvgIcon';

export interface CardProps {
    playlist: SpotifyPlaylist;
    onClickAction?: () => void;
    onClick?: () => void;
}

export function Card({ playlist, onClick, onClickAction }: CardProps) {
   const handleCardClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation();
      onClick?.();
   };

   const handleActionClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation();
      onClickAction?.();
   };

   return (
      <div className="main-card-card" onClick={handleCardClick}>
         <div className="main-card-draggable" draggable="true">
            <div className="main-card-imageContainer">
               <div className="main-cardImage-imageWrapper">
                  <div className=""><img aria-hidden="false" draggable="false" loading="lazy" src={playlist.images[0]?.url} alt="" className="main-image-image main-cardImage-image" /></div>
               </div>

               <div onClick={handleActionClick}  className="main-card-PlayButtonContainer">
                  <button aria-label="Synchronize combined playlist" className="action-button__button Button-qlcn5g-0 flgROw">
                     <div className="action-button__wrapper ButtonInner-sc-14ud5tc-0 cSeieV encore-bright-accent-set">
                        <span aria-hidden="true" className="action-button-icon__wrapper IconWrapper__Wrapper-sc-1hf1hjl-0 jWeDTW">
                           <SpicetifySvgIcon iconName="repeat" />
                        </span>
                     </div>
                  </button>
               </div>
            </div>

            <div className="main-card-cardMetadata">
               <a draggable="false" title={playlist.name} className="main-cardHeader-link" dir="auto">
                  <div className="Type__TypeElement-goli3j-0 cgtbKc main-cardHeader-text">{playlist.name}</div>
               </a>
               <div className="Type__TypeElement-goli3j-0 fcehhQ main-cardSubHeader-root">{playlist.description}</div>
            </div>
            <div className="main-card-cardLink"></div>
         </div>
      </div>
   );
}
