import React from 'react';
import { ADD_PLAYLIST_IMG } from '../constants/add-playlist-img';
import { SpicetifySvgIcon } from './SpicetifySvgIcon';

export interface AddPlaylistCardProps {
   onClick: () => void;
}

export function AddPlaylistCard({ onClick }: AddPlaylistCardProps) {
   return (
      <div onClick={onClick} className="main-card-card">
         <div className="main-card-draggable" draggable="true">
            <div className="main-card-imageContainer">
               <div className="main-cardImage-imageWrapper">
                  <div className=""><img aria-hidden="false" draggable="false" loading="lazy" src={ADD_PLAYLIST_IMG} alt="" className="main-image-image main-cardImage-image" /></div>
               </div>

               <div className="main-card-PlayButtonContainer">
                  <button aria-label="Release Radar afspelen" className="Button-qlcn5g-0 flgROw">
                     <div className="action-button__wrapper ButtonInner-sc-14ud5tc-0 cSeieV encore-bright-accent-set">
                        <span aria-hidden="true" className="action-button-icon__wrapper IconWrapper__Wrapper-sc-1hf1hjl-0 jWeDTW">
                           <SpicetifySvgIcon iconName="plus2px" />
                        </span>
                     </div>
                  </button>
               </div>
            </div>

            <div className="main-card-cardMetadata">
               <a draggable="false" title="Release Radar" className="main-cardHeader-link" dir="auto" href="/playlist/37i9dQZEVXbjqbHDY2jqVd">
                  <div className="Type__TypeElement-goli3j-0 cgtbKc main-cardHeader-text">Create playlist</div>
               </a>
               <div className="Type__TypeElement-goli3j-0 fcehhQ main-cardSubHeader-root">Create a new combined playlist</div>
            </div>
            <div className="main-card-cardLink"></div>
         </div>
      </div>
   );
}
