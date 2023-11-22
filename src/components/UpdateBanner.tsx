import React, { useEffect, useState } from 'react';
import semverGt from 'semver/functions/gt';
import { version } from '../../package.json';
import { DIST_URL, RELEASES_URL } from '../constants';

export function UpdateBanner() {
   const [showUpdateBanner, setShowUpdateBanner] = useState(false);

   useEffect(() => {
      const getCurrentVersion = async () => {
         const installedVersion = version;
         const currentVersion = await fetch(RELEASES_URL)
            .then(res => res.json())
            .then(res => res[0].tag_name.replace('v', ''))
            .catch(console.error);

         if (currentVersion && semverGt(currentVersion, installedVersion)) {
            setShowUpdateBanner(true);
         }
      };

      void getCurrentVersion();
   }, []);

   if (showUpdateBanner) {
      return (
         <section id="new-update-banner">
            <h3>New update available.</h3>
            <a href={ DIST_URL }>Download</a>
         </section>
      );
   } else return null;
}
