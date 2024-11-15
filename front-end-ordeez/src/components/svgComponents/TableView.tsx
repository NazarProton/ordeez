const TableView = ({ active }: { active: boolean }) => {
  let activeColor = '#FFF05A';
  let defColor = '#E2DADB';
  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1076_20732)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 0H20V18H0V0ZM2 4V9H9V4H2ZM11 4V9H18V4H11ZM18 11H11V16H18V11ZM9 16V11H2V16H9Z"
          fill={active ? activeColor : defColor}
        />
      </g>
      <defs>
        <clipPath id="clip0_1076_20732">
          <rect width="20" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default TableView;
