import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

export const Portal = ({ children }: { children: React.ReactNode }) => {
  const el = document.createElement('div');

  useEffect(() => {
    document.body.appendChild(el);

    return () => {
      document.body.removeChild(el);
    };
  });

  return ReactDOM.createPortal(children, el);
};
