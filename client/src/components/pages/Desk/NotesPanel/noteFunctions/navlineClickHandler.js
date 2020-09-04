import embedClose from './embedClose';
// ok

const navlineClickHandler = (e, g) => {
  const resInfo = e.target.dataset.resInfo;
  embedClose(resInfo, g);
};

export default navlineClickHandler;
