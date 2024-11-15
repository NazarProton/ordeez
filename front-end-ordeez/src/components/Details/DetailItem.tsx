import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Open from '../svgComponents/Open';

interface DetailItemProps {
  rose?: boolean;
  label: string;
  value: string | number | null;
  dashed?: boolean;
  link?: boolean;
  copied: string | null;
  handleCopy: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    value: string | number | null
  ) => void;
  getRef: (label: string) => string;
}

const DetailItem: React.FC<DetailItemProps> = ({
  rose,
  label,
  value,
  dashed = false,
  link = false,
  copied,
  handleCopy,
  getRef,
}) => {
  const href = getRef(label);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="grid grid-cols-2 pc820:grid-cols-3 max-w-full whitespace-nowrap font-vt323v3 gap-4">
      <div className="truncate text-onyxNew col-span-1">{label}:</div>
      <div className="col-span-1 pc820:col-span-2">
        <div className={`flex items-center relative w-fit max-w-full`}>
          <div
            className={`truncate  ${
              dashed
                ? 'border-dashed border-b-2 hover:border-whiteNew hover:text-whiteNew cursor-pointer'
                : ''
            } ${
              rose
                ? 'text-rose border-rose'
                : dashed
                ? 'text-grayNew border-grayNew'
                : 'text-whiteNew'
            } `}
            onClick={(e) => {
              dashed ? handleCopy(e, value) : null;
            }}
          >
            {value}
          </div>
          {copied === value && (
            <span className="absolute -top-6 left-0 right-0 flex justify-center items-center z-10">
              <span className="bg-maize text-black font-vt323v3 px-4">
                COPIED
              </span>
            </span>
          )}
          {link && value && (
            <Link
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              target="_blank"
              href={href ? href : ''}
              passHref
              className="ml-2 flex items-center"
            >
              <Open rose={rose ? rose : false} isHovered={isHovered} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailItem;
