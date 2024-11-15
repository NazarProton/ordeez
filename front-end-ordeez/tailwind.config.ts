import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: '#F50076',
        magnolia: '#FCF7FF',
        maize: '#FFF05A',
        grayBorder: '#201F20',
        grayNew: '#AAA4A5',
        whiteNew: '#E2DADB',
        onyxNew: '#716D6E',
        greenNew: '#09F07C',
      },
      screens: {
        pc360: '360px',
        pc390: '390px',
        pc410: '410px',
        pc450: '450px',
        pc470: '470px',
        pc500: '500px',
        pc510: '510px',
        pc550: '550px',
        pc600: '600px',
        pc700: '700px',
        pc740: '740px',
        pc750: '750px',
        pc770: '770px',
        pc768: '768px',
        pc820: '820px',
        pc850: '850px',
        pc860: '860px',
        pc870: '870px',
        pc900: '900px',
        pc950: '950px',
        pc1000: '1000px',
        pc1024: '1024px',
        pc1067: '1067px',
        pc1100: '1100px',
        pc1120: '1120px',
        pc1180: '1180px',
        pc1200: '1200px',
        pc1250: '1250px',
        pc1265: '1265px',
        pc1300: '1300px',
        pc1510: '1510px',
        pc1500: '1500px',
        pc830h: { raw: '(min-height: 830px)' },
      },
      fontFamily: {
        pressStart: ['"Press Start 2P"'],
        vt323: ['VT323', 'sans-serif'],
        vt323v2: ['VT323'],
        vt323v3: ['VT323'],
        vt323v4: ['VT323'],
      },
      letterSpacing: {
        tightest: '-.15em',
      },
      boxShadow: {
        CWButton: '0px 0px 5px 5px rgba(32, 31, 32, 1)',
      },
      // clipPath: {
      //   pacman: 'polygon(50% 0%, 100% 100%, 50% 100%, 0% 50%, 50% 0%)',
      // },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};
export default config;
