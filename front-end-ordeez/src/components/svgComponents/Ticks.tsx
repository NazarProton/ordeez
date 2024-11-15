const Ticks = ({ color }: { color: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 6.5H17V8.5H15V6.5ZM13 10.5V8.5H15V10.5H13ZM11 12.5V10.5H13V12.5H11ZM9 14.5V12.5H11V14.5H9ZM7 16.5V14.5H9V16.5H7ZM5 16.5H7V18.5H5V16.5ZM3 14.5H5V16.5H3V14.5ZM3 14.5H1V12.5H3V14.5ZM11 16.5H13V18.5H11V16.5ZM15 14.5V16.5H13V14.5H15ZM17 12.5V14.5H15V12.5H17ZM19 10.5V12.5H17V10.5H19ZM21 8.5H19V10.5H21V8.5ZM21 8.5H23V6.5H21V8.5Z"
        fill={`${color ? color : '#7E7C80'}`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 6.5H17V8.5H15V6.5ZM13 10.5V8.5H15V10.5H13ZM11 12.5V10.5H13V12.5H11ZM9 14.5V12.5H11V14.5H9ZM7 16.5V14.5H9V16.5H7ZM5 16.5H7V18.5H5V16.5ZM3 14.5H5V16.5H3V14.5ZM3 14.5H1V12.5H3V14.5ZM11 16.5H13V18.5H11V16.5ZM15 14.5V16.5H13V14.5H15ZM17 12.5V14.5H15V12.5H17ZM19 10.5V12.5H17V10.5H19ZM21 8.5H19V10.5H21V8.5ZM21 8.5H23V6.5H21V8.5Z"
        fill={`${color ? color : '#7E7C80'}`}
        fillOpacity="0.2"
      />
    </svg>
  );
};

export default Ticks;
