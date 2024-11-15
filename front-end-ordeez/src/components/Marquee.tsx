import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

interface MarqueeProps {
  children: ReactNode;
}

const DragableMarquee: React.FC<MarqueeProps> = ({ children }) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [{ x }, set] = useSpring(() => ({ x: 0 }));
  const [isDragging, setIsDragging] = useState(false);

  const bind = useDrag(({ down, movement: [mx], memo = x.get() }) => {
    setIsDragging(down);
    set({ x: memo + mx });
    return memo;
  });

  const handleScroll = () => {
    if (marqueeRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = marqueeRef.current;
      if (scrollLeft <= 0) {
        marqueeRef.current.scrollLeft = scrollWidth / 2;
      }
      if (scrollLeft + clientWidth >= scrollWidth) {
        marqueeRef.current.scrollLeft = 0;
      }
    }
  };

  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        set({ x: x.get() - 1 });
        handleScroll();
      }, 20);
      return () => clearInterval(interval);
    }
  }, [isDragging, x, set]);

  return (
    <div className="marquee-container">
      <div {...bind()} className="marquee-overlay"></div>
      <animated.div ref={marqueeRef} className="marquee-content" style={{ x }}>
        {React.Children.map(children, (child) => (
          <div className="marquee-item">{child}</div>
        ))}
      </animated.div>
    </div>
  );
};

export default DragableMarquee;
