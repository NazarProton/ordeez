import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { CurrentUserContext } from '@/context';
import axios from 'axios';
import SpeechBubble from '../SpeechBubble';
import { formatDate } from '@/services/datePrettier';
import LoaderWithText from '../LoaderWithText';
import { backBaseUrl } from '@/configs';
import Arrow from '../svgComponents/Arrow';
import Link from 'next/link';
import Loader from '../Loader';

interface IOrders {
  orderId: string;
  status: string;
  quantity: string;
  date: string;
  txId: string;
}

const OrdersInfo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(CurrentUserContext);
  const [filtersState, setFiltersState] = useState<'TimeAsc' | 'TimeDesc'>(
    'TimeDesc'
  );

  const [userOrders, setUserOrders] = useState<IOrders[] | null>(null);
  const [pageKey, setPageKey] = useState<number>(0);
  const [hasNext, setHasNext] = useState(true);
  const [getNextDataLoader, setGetNextDataLoader] = useState(false);
  const listInnerRef = useRef<HTMLTableSectionElement>(null);

  const getUserOrdersRequest = useCallback(() => {
    setGetNextDataLoader(true);
    axios
      .get(`${backBaseUrl}/api/orders/${currentUser.ordinalsWallet}/${pageKey}`)
      .then(({ data }) => {
        const sortedOrders = [...data.data.orders].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        requestAnimationFrame(() => {
          setUserOrders((currentOrders) => {
            const updatedOrders = currentOrders
              ? [...currentOrders, ...sortedOrders]
              : [...sortedOrders];
            return updatedOrders;
          });
          setHasNext(data.data.hasNext);
          setPageKey(pageKey + 1);
        });
      })
      .finally(() => {
        setGetNextDataLoader(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [currentUser.ordinalsWallet, pageKey]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastOrderElementRef = useCallback(
    (node: HTMLTableRowElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          getUserOrdersRequest();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNext, getUserOrdersRequest]
  );

  useEffect(() => {
    // if (!currentUser.btcWallet) {
    //   router.push('/');
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.btcWallet]);

  useEffect(() => {
    if (currentUser.ordinalsWallet) {
      getUserOrdersRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedOrders = !userOrders
    ? []
    : [...userOrders].sort((a, b) => {
        if (filtersState === 'TimeAsc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (filtersState === 'TimeDesc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      });

  return (
    <>
      {!userOrders || isLoading ? (
        <div className="h-[calc(100vh-96px-173px-64px)] pc820:h-[calc(100vh-112px-173px-64px)]">
          <LoaderWithText isLoading={isLoading} />
        </div>
      ) : !userOrders.length ? (
        <div className="h-[calc(100vh-96px-173px-64px)] pc820:h-[calc(100vh-112px-173px-64px)]">
          <SpeechBubble />
        </div>
      ) : (
        <div className="w-full h-fit overflow-scroll default-scrollbar-main">
          <div
            ref={listInnerRef}
            className="relative select-none pb-8 min-w-[1024px] max-w-[1510px] overscroll-x-none"
          >
            <div className="flex gap-4 mb-8 border-b border-onyxNew text-grayNew font-vt323v4 pb-8 mx-4 pc820:mx-8">
              <span className="w-5/12">ID</span>
              <div className="flex justify-end gap-2 w-2/12 flex-nowrap">
                STATUS
              </div>
              <span className="w-2/12 text-end">QUANTITY</span>
              <div
                onClick={() =>
                  setFiltersState((prev) =>
                    prev === 'TimeAsc' ? 'TimeDesc' : 'TimeAsc'
                  )
                }
                className="flex justify-end gap-2 w-3/12 flex-nowrap cursor-pointer hover:text-whiteNew"
              >
                DATE
                <div className="flex flex-col h-fit py-1.5 gap-1 justify-center items-center">
                  <Arrow active={filtersState === 'TimeAsc'} />
                  <div className="rotate-180">
                    <Arrow active={filtersState === 'TimeDesc'} />
                  </div>
                </div>
              </div>
            </div>
            <div>
              {sortedOrders.map((order, index) => {
                return (
                  <Link
                    href={`https://mempool.space/tx/${order.txId}`}
                    target="_blank"
                    key={index}
                    className=""
                  >
                    <div
                      ref={
                        index === userOrders.length - 1
                          ? lastOrderElementRef
                          : null
                      }
                      className="flex w-full gap-4 py-4 text-whiteNew font-vt323v4 px-4 pc820:px-8 hover:bg-whiteNew hover:bg-opacity-10"
                    >
                      <div className="flex w-5/12 h-[56px] items-center gap-2 ">
                        <span>{order.orderId}</span>
                      </div>
                      <div
                        className={`flex justify-end items-center h-[56px] truncate w-2/12 ${
                          order.status === 'Confirmed'
                            ? 'text-whiteNew'
                            : order.status === 'Pending'
                            ? 'text-greenNew'
                            : order.status === 'Inscribing'
                            ? 'text-maize'
                            : order.status === 'Closed'
                            ? 'text-onyxNew'
                            : 'text-rose'
                        }`}
                      >
                        <div>
                          {order.status === 'Pending' ||
                          order.status === 'Inscribing' ? (
                            <div className="flex">
                              {`${order.status}`}
                              <div
                                className={`dot-typing ${
                                  order.status === 'Pending'
                                    ? 'text-greenNew'
                                    : 'text-maize'
                                } font-vt323v4`}
                              ></div>
                            </div>
                          ) : (
                            order.status
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end items-center h-[56px] truncate w-2/12">
                        <span>{order.quantity}</span>
                      </div>
                      <div className="flex items-center h-[56px] justify-end truncate w-3/12 ">
                        {formatDate(order.date)}
                      </div>
                    </div>
                  </Link>
                );
              })}
              {getNextDataLoader && (
                <div className="flex flex-col justify-center items-center w-full h-fit">
                  <Loader isSmall={true} dataLoaded={!getNextDataLoader} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersInfo;
