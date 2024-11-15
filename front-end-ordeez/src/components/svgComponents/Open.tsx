const Open = ({ rose, isHovered }: { rose: boolean; isHovered: boolean }) => {
  let whiteNew = '#E2DADB';
  let roseNew = '#F50076';
  let grayNew = '#AAA4A5';
  let currentColor = isHovered ? whiteNew : rose ? roseNew : grayNew;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.33333 2H7.33333V3.33333H3.33333V12.6666H12.6667V8.66669H14L14 12.6666V14L14 14H12.6667V14H3.33333V14H2V14V12.6666V3.33333V2H3.33333ZM8.66683 2H12.6667H14H14.0002V3.33333H14V7.33333H12.6667V4.66667H11.3333V3.33333L8.66683 3.33333V2ZM8.66667 7.33335H7.33333V8.66669L6 8.66669V10H7.33333V8.66669H8.66667V7.33335ZM11.3334 4.66669H10.0001V6.00002L8.66675 6.00002V7.33335H10.0001L10.0001 6.00002H11.3334V4.66669Z"
        fill={currentColor}
      />
    </svg>
  );
};

export default Open;
