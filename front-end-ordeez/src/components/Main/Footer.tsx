// import Image from 'next/image';
import Link from 'next/link';
// import telegram from '../../../public/Telegram.svg';
// import x from '../../../public/X.svg';
// import discord from '../../../public/Discord.svg';
import Logo from '../NavBar/Logo';

const Footer = () => {
  return (
    <div className="flex justify-center items-center flex-col   py-8 w-full">
      <div className="h-8 pc820:h-12">
        <Logo />
      </div>
      <div className="flex gap-4 mt-8 text-grayNew">
        <Link
          target="_blank"
          className="flex flex-nowrap justify-center items-center gap-2 w-[100px] text-grayNew hover:text-whiteNew"
          href="https://t.me/ordeez"
        >
          {/* <Image src={telegram} alt="socials" className="w-8 h-8" /> */}
          <p className="font-vt323v4 whitespace-nowrap">
            {'>'}
            {'>'} Telegram
          </p>
        </Link>
        <Link
          target="_blank"
          className="flex flex-nowrap justify-center items-center gap-2 w-[100px] text-grayNew hover:text-whiteNew"
          href="https://discord.gg/Vw4AKKyy4n"
        >
          {/* <Image src={discord} alt="socials" className="w-8 h-8" /> */}
          <p className="font-vt323v4 whitespace-nowrap">
            {'>'}
            {'>'} Discord
          </p>
        </Link>
        <Link
          target="_blank"
          className="flex flex-nowrap justify-center items-center gap-2 w-[100px] text-grayNew hover:text-whiteNew"
          href="https://twitter.com/ordeez_io"
        >
          {/* <Image src={x} alt="socials" className="w-8 h-8" /> */}
          <p className="font-vt323v4 whitespace-nowrap">
            {'>'}
            {'>'} Twitter
          </p>
        </Link>
      </div>
      <div className="font-vt323v4 mt-4 text-whiteNew">© 2024</div>
    </div>
  );
};

export default Footer;
