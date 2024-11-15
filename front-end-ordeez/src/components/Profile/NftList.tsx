import { ReactNode, useContext, useEffect, useState } from 'react';
import FiltersBlock from './FiltersBlock';

const NftList = ({
  isMarketplace,
  children,
}: {
  isMarketplace?: boolean;
  children: ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState(isMarketplace ? 2 : 1);
  const [checked, setChecked] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(false);

  return (
    <div className="flex flex-col w-full gap-8 min-h-fit">
      <FiltersBlock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setFiltersVisible={setFiltersVisible}
        filtersVisible={filtersVisible}
        setChecked={setChecked}
        checked={checked}
        isMarketplace={isMarketplace}
      />
      {children}
    </div>
  );
};

export default NftList;
