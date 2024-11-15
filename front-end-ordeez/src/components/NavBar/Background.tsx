'use client'; // This is a client component

import { FC, useCallback, useEffect, useState, memo } from 'react';
import dynamic from 'next/dynamic';
import { Container, Engine, ISourceOptions } from '@tsparticles/engine';
import options from '../../configs/OptionsForBg.json';
import { loadMyParticles } from '../../utils/loadMyParticles';
import { initParticlesEngine } from '@tsparticles/react';

interface BackgroundProps {
  setDataLoaded?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Particles = dynamic(() => import('@tsparticles/react'), {
  ssr: false,
});

const Background: FC<BackgroundProps> = memo(({ setDataLoaded }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    const initParticles = async () => {
      await initParticlesEngine(async (engine: Engine) => {
        await loadMyParticles(engine);
      });
      setInit(true);
    };

    initParticles();
  }, []);

  const particlesLoaded = useCallback(
    (container: Container) => {
      if (setDataLoaded) setDataLoaded(true);
    },
    [setDataLoaded]
  );

  return (
    <>
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={
            particlesLoaded as (container?: Container) => Promise<void>
          }
          options={options as ISourceOptions}
        />
      )}
    </>
  );
});

Background.displayName = 'Background';

export default Background;
