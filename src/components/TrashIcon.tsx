import React from 'react';

export function TrashIcon() {
   return (
      // @ts-expect-error inline style type is supposedly incorrect.
      <svg data-encore-id="icon" role="img" aria-hidden="true" class="e-91000-icon e-91000-baseline" viewBox="0 0 16 16" style={{ '--encore-icon-fill': 'var(--text-subdued, #656565)', '--encore-icon-height': 'var(--encore-graphic-size-decorative-smaller)', '--encore-icon-width': 'var(--encore-graphic-size-decorative-smaller)'}}><path d="M5.25 3v-.917C5.25.933 6.183 0 7.333 0h1.334c1.15 0 2.083.933 2.083 2.083V3h4.75v1.5h-.972l-1.257 9.544A2.25 2.25 0 0 1 11.041 16H4.96a2.25 2.25 0 0 1-2.23-1.956L1.472 4.5H.5V3zm1.5-.917V3h2.5v-.917a.583.583 0 0 0-.583-.583H7.333a.583.583 0 0 0-.583.583M2.986 4.5l1.23 9.348a.75.75 0 0 0 .744.652h6.08a.75.75 0 0 0 .744-.652L13.015 4.5H2.985z"></path></svg>
   );
}
