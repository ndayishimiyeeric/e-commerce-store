import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_15_2)">
            <rect width="32" height="32" rx="16" fill="white" />
            <path
              d="M-19 4C-19 -9.25484 -8.25483 -20 5 -20H27C40.2548 -20 51 -9.25483 51 4V26C51 39.2548 40.2548 50 27 50H5C-8.25484 50 -19 39.2548 -19 26V4Z"
              fill="black"
            />
            <path
              d="M22 14C22 15.5913 21.3679 17.1174 20.2426 18.2426C19.1174 19.3679 17.5913 20 16 20C14.4087 20 12.8826 19.3679 11.7574 18.2426C10.6321 17.1174 10 15.5913 10 14"
              stroke="#FDFDFE"
              stroke-opacity="0.937255"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_15_2">
              <rect width="32" height="32" rx="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
    size
  );
}
