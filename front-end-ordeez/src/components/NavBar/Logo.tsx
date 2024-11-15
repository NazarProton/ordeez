import { CurrentUserContext, ICurrentUser } from '@/context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Dispatch,
  memo,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

const Logo = memo(
  ({
    isBurger,
    setIsBurgerMenuVisible,
  }: {
    isBurger?: boolean;
    setIsBurgerMenuVisible?: Dispatch<SetStateAction<boolean>>;
  }) => {
    // const [changeColor, setChangeColor] = useState(true);
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [currentUserPrevState, setCurrentUserPrevState] =
      useState<ICurrentUser | null>(null);

    const [isRunning, setIsRunning] = useState(0);
    const [isAnimation, setIsAnimation] = useState(false);

    const toggleAnimation = (param: number) => {
      setIsRunning(param);
    };
    useEffect(() => {
      if (isAnimation || !isBurger) {
        if (currentUser.ordinalsWallet) {
          toggleAnimation(1);
        } else if (
          !currentUser.ordinalsWallet &&
          currentUserPrevState?.ordinalsWallet
        ) {
          toggleAnimation(2);
        }
      }
      setCurrentUserPrevState(currentUser);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser.ordinalsWallet]);

    useEffect(() => {
      setIsAnimation(true);
    }, []);

    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     setChangeColor((prev) => !prev);
    //   }, 500);
    //   return () => clearInterval(interval);
    // }, []);

    return (
      <>
        <Link
          href="/"
          onClick={() => {
            if (isBurger && setIsBurgerMenuVisible) {
              setIsBurgerMenuVisible(false);
            }
          }}
          className={`relative min-h-full flex justify-center items-center cursor-pointer`}
        >
          <div
            id="bulb"
            className={`absolute top-[3px] left-0 pc820:top-[11px] pc820:left-0 z-[4] bg-transparent cursor-pointer `}
          >
            <div
              id="bulb"
              className={`border-4 bg-transparent ${
                currentUser.ordinalsWallet ? 'border-maize' : 'border-rose'
              } ${
                isRunning === 1
                  ? 'running'
                  : isRunning === 2
                  ? 'runningBack'
                  : ''
              } border-r-0 border-b-0 w-4 h-5 backdrop-blur`}
            ></div>
            <div
              id="bulb"
              className={`absolute -top-0 border-4 bg-transparent  ${
                currentUser.ordinalsWallet ? 'border-maize' : 'border-rose'
              } ${
                isRunning === 1
                  ? 'running'
                  : isRunning === 2
                  ? 'runningBack'
                  : ''
              } border-r-0 border-b-0 w-4 h-5 blur-sm`}
            ></div>
          </div>
          <div className="z-[5]">
            <svg
              width="130"
              height="26"
              viewBox="0 0 130 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M78 6H90V10H82V14H90V18H82V22H90V26H78V6Z"
                fill="#E2DADB"
              />
              <path
                d="M98 6V26H110V22H102V18H110V14H102V10H110V6H98Z"
                fill="#E2DADB"
              />
              <path
                d="M30 26V6H42V10H46V14H42V22H46V26H42V22H38V18H34V26H30ZM34 14H41.84V10H34V14Z"
                fill="#E2DADB"
              />
              <path
                d="M54 26V6H66V10H70V22H66V26H54ZM58 22H65.84V10H58V22Z"
                fill="#E2DADB"
              />
              <path
                d="M126 14V10H118V6H130V14H126ZM122 18V14H126V18H122ZM118 26V18H122V22H130V26H118Z"
                fill="#E2DADB"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 6V26H22V6H6ZM10 22V10H18V22H10Z"
                fill="#E2DADB"
              />
            </svg>
          </div>
        </Link>
      </>
    );
  }
);
Logo.displayName = 'Logo';

export default Logo;
