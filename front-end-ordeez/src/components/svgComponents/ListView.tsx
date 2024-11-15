const ListView = ({ active }: { active: boolean }) => {
  let activeColor = '#FFF05A';
  let defColor = '#E2DADB';
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1076_20730)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8 0H0V2H8V0ZM18 0H10V2H18V0ZM0 4H8V6H0V4ZM18 4H10V6H18V4ZM0 8H8V10H0V8ZM18 8H10V10H18V8ZM0 12H8V14H0V12ZM18 12H10V14H18V12Z"
          fill={active ? activeColor : defColor}
        />
      </g>
      <defs>
        <clipPath id="clip0_1076_20730">
          <rect width="18" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ListView;
