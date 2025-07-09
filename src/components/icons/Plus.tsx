import * as React from "react";
import type { SVGProps } from "react";
const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22.071}
    height={22.071}
    viewBox="0 0 22.071 22.071"
    fill="currentColor"
    {...props}
  >
    <g data-name="Groupe 1">
      <path
        d="m20.287 12.895-.036-3.604H9.29v10.96l3.604.036-.035-7.428Z"
        data-name="Line Arrow Left"
      />
      <path
        d="m1.784 9.175.036 3.604h10.959l.001-10.96-3.605-.035.036 7.427Z"
        data-name="Line Arrow Right"
      />
    </g>
  </svg>
);
export default SvgPlus;
