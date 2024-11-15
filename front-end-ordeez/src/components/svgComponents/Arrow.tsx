const Arrow = ({ active }: { active?: boolean }) => {
  let whiteNew = '#E2DADB';
  let maize = '#FFF05A';
  return (
    <svg
      width="11"
      height="6"
      viewBox="0 0 11 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="4"
        width="2"
        height="2"
        fill={active ? maize : whiteNew}
      />
      <rect
        x="2.5"
        y="2"
        width="2"
        height="2"
        fill={active ? maize : whiteNew}
      />
      <rect x="4.5" width="2" height="2" fill={active ? maize : whiteNew} />
      <rect
        x="6.5"
        y="2"
        width="2"
        height="2"
        fill={active ? maize : whiteNew}
      />
      <rect
        x="8.5"
        y="4"
        width="2"
        height="2"
        fill={active ? maize : whiteNew}
      />
    </svg>
  );
};

export default Arrow;
