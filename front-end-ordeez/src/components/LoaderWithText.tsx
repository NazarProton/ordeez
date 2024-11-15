import Loader from './Loader';

const LoaderWithText = ({
  isLoading,
  isBig,
}: {
  isLoading: boolean;
  isBig?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center  ${
        isBig
          ? 'w-full h-[calc(100dvh-96px)] pc820:h-[calc(100dvh-112px)]'
          : 'w-full h-fit mt-16'
      }`}
    >
      <div className="flex flex-col justify-center items-center w-full font-vt323 text-whiteNew text-xl tracking-[0.05em]">
        Loading...
      </div>
      <div className="flex flex-col justify-center items-center w-full h-[128px] font-vt323 text-whiteNew text-xl tracking-[0.05em]">
        <Loader isSmall={true} dataLoaded={!isLoading} />
      </div>
    </div>
  );
};

export default LoaderWithText;
