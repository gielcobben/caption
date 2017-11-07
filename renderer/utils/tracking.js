import ReactGA from "react-ga";

export const initGA = () => {
  ReactGA.initialize("UA-89238300-2");
};

export const logPageView = () => {
  ReactGA.set({ page: '/v2/start' });
  ReactGA.set({ version: '2' });
  ReactGA.pageview('/v2/start');
};
