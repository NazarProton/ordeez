import { Dispatch, SetStateAction, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Step5 = ({ setStep }: { setStep: Dispatch<SetStateAction<number>> }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-center items-center h-[170px] font-vt323 text-xl tracking-[0.05em]">
        <p className="px-8 w-full text-center text-grayNew">
          <span className="text-whiteNew">
            Transaction was successfully sent!
          </span>{' '}
          Verify your order status by clicking on the{' '}
          <Link href={`/profile/orders`} className="text-rose">
            link.
          </Link>{' '}
          Newly created digital artifacts will appear in the recipient&apos;s
          portfolio. Great inscriptions take time, so be patient.
        </p>
      </div>
      <div
        onClick={() => router.push('/')}
        className="py-[22.5px] w-full font-vt323 text-center text-grayNew text-xl hover:text-whiteNew tracking-[0.05em] cursor-pointer"
      >
        CONFIRM
      </div>
    </>
  );
};

export default Step5;
