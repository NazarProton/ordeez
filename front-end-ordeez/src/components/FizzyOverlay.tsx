// import { motion } from 'framer-motion';

// export const FuzzyOverlay = ({
//   zindex,
//   minus = false,
// }: {
//   zindex: number;
//   minus?: boolean;
// }) => {
//   return (
//     <motion.div
//       initial={{ transform: 'translateX(-10%) translateY(-10%)' }}
//       animate={{
//         transform: 'translateX(10%) translateY(10%)',
//       }}
//       transition={{
//         repeat: Infinity,
//         duration: 0.2,
//         ease: 'linear',
//         repeatType: 'mirror',
//       }}
//       // You can download these PNGs here:
//       // https://www.hover.dev/black-noise.png
//       // https://www.hover.dev/noise.png
//       style={{
//         // backgroundImage: 'url("/black-noise.png")',
//         backgroundImage: 'url("/noise.png")',
//       }}
//       className={`${
//         minus ? '-' : ''
//       }z-[${zindex}] absolute -inset-[100%] opacity-[10%] pointer-events-none`}
//     />
//   );
// };
