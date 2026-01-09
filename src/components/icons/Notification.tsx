import * as React from 'react';
import type { SVGProps } from 'react';
const SvgNotification = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={19} height={19} {...props}>
    <path
      fill='#bcbccb'
      d='M7.125 16.625h4.75a2.375 2.375 0 0 1-4.75 0m-5.938-1.187a1.187 1.187 0 1 1 0-2.375h.594A5.17 5.17 0 0 0 3.562 9.5V5.938A5.88 5.88 0 0 1 9.5 0a5.88 5.88 0 0 1 5.937 5.938V9.5a5.17 5.17 0 0 0 1.782 3.563h.594a1.187 1.187 0 1 1 0 2.375Z'
      data-name='Notification Icon'
    />
  </svg>
);
export default SvgNotification;
