import React from 'react';
import { useSelector } from 'react-redux';

const Alert = () => {
  const alert = useSelector((state) => state.ui.alert);
  return alert !== null && <div className={alert.type}>{alert.message}</div>;
};

export default Alert;
