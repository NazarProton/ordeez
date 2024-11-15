import NewHighlightedText from '../NewHighlightedText';

const FirsthHeader = () => {
  return (
    <div className="flex w-full justify-start flex-col">
      <p className="text-maize mb-2 font-vt323 text-[24px] pc820:text-[32px]  leading-[36px] pc820:leading-[44.8px] tracking-[.05em]">
        [ordirivatives]
      </p>
      <NewHighlightedText>
        <div className="flex flex-col pb-2 pc820:pb-4 w-full">
          <p className="z-[2] font-pressStart text-[32px] pc820:text-[40px] text-left leading-[44px] pc820:leading-[64px]">
            ORDINAL
          </p>
          <p className="z-[2] ms-10 pc600:ms-20 flex justify-end text-[32px] pc510:justify-start flex-wrap pc510:flex-nowrap font-pressStart pc820:text-[40px] text-left leading-[44px] pc820:leading-[64px]">
            DERIVATI
            <span className="pc510:inline-block flex pc510:ml-0 ml-[160px]">
              <span className="pc510:hidden inline-block ">-</span>VES
            </span>
          </p>
        </div>
      </NewHighlightedText>
      <p className="font-vt323v4 pc510:ms-10 pc600:ms-20 text-grayNew w-full pc510:w-[391px]">
        Create an authentic derivative of your NFT by inscribing it as an
        ordinal and featuring it on our marketplace.
      </p>
    </div>
  );
};

export default FirsthHeader;
