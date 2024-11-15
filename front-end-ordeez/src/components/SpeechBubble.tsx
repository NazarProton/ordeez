import Image from 'next/image';
import Fac from '../../public/fac.png';
import Sit from '../../public/sit.png';
import { usePathname } from 'next/navigation';

const SpeechBubble = () => {
  const pathName = usePathname();
  let image;
  let text;

  if (pathName === '/profile/inscriptions') {
    image = Sit;
    text = 'No inscriptions found.';
  } else if (pathName === '/profile/orders') {
    image = Sit;
    text = 'No orders found.';
  } else if (pathName === '/marketplace/listings') {
    image = Sit;
    text = 'No listings found.';
  } else if (pathName === '/creation') {
    image = Fac;
    text = 'Sorry, the page is currently unavailable on mobile devices.';
  } else if (
    /^\/marketplace\/collections\/bitcoin/.test(pathName ? pathName : '')
  ) {
    image = Sit;
    text = 'No listed items found.';
  } else {
    image = Fac;
    text = 'Sorry, the page is currently unavailable on mobile devices.';
  }

  return (
    <div
      style={{
        animation: 'levitate 3s infinite ease-in-out',
      }}
      className="flex flex-col items-center h-fit"
    >
      <div className="relative bg-maize mx-auto my-4 mb-8 p-4 w-full max-w-[328px] font-vt323v2 text-[14px] text-center pc450:text-auto">
        {text}
        <div className="-bottom-2 left-1/2 absolute border-maize border-x-8 border-x-transparent border-t-8 w-0 h-0 transform -translate-x-1/2"></div>
      </div>
      <Image
        src={image}
        height={128}
        width={128}
        className="mt-[0.5px] pb-4"
        alt="Chpik cat"
      />
    </div>
  );
};

export default SpeechBubble;
