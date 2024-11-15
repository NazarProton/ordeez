import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import ArrpwTop from '../../public/ArrpwTop.svg';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bottom-8 left-8 z-20 fixed bg-transparent px-4 py-2 rounded-md text-whiteNew"
        >
          <Image
            src={ArrpwTop}
            className="opacity-40 hover:opacity-100"
            alt="arrowTopImage"
          />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
