import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backBaseUrl } from '@/configs';

const Statistics = () => {
  const stats = [
    { title: '$1kk+', description: 'earned by traders' },
    { title: '2500+', description: 'ordinals sold' },
    { title: '3920+', description: 'derivatives created' },
    { title: '250k+', description: 'unique users' },
  ];
  const [Statistic, setStatistic] = useState<
    { title: string; description: string }[] | null
  >(null);

  function getStatistic() {
    axios.get(`${backBaseUrl}/api/activity`).then(({ data }) => {
      const statisticsArray = Object.entries(data.data).map(([key, value]) => ({
        title: value as string,
        description: key,
      }));
      setStatistic(statisticsArray.length ? statisticsArray : stats);
    });
  }

  useEffect(() => {
    getStatistic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-wrap my-16 w-full">
      {Statistic &&
        Statistic.map((stat, index) => (
          <div key={index} className="py-4 w-full md:w-1/2 lg:w-1/4">
            <div className="flex flex-col justify-between gap-2 pc820:gap-4 rounded-lg h-full">
              <p className="font-pressStart text-[32px] pc820:text-[40px]  leading-[44px] pc820:leading-[64px] text-center text-grayNew">
                {true ? 'TBP' : stat.title}
              </p>
              <p className="font-normal font-vt323 text-center text-grayNew text-xl tracking-[.05em]">
                {index === 0
                  ? 'derivatives created'
                  : index === 1
                  ? 'unique users'
                  : index === 2
                  ? 'earned by traders'
                  : 'ordinals sold'}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Statistics;
