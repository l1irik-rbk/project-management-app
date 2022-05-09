import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../Redux/reduxHooks';

export const PrivateRoute = ({ children }: { children: React.ReactElement }): JSX.Element => {
  const { isTokenLoaded } = useAppSelector((state) => state.appReducer);

  if (!isTokenLoaded) return <Navigate to="/" replace />;

  return children;
};
