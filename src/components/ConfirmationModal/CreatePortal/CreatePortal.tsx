import { useEffect } from 'react';
import ReactDOM from 'react-dom';

export const CreatePortal = ({ children }: { children: React.ReactNode }) => {
  const el = document.createElement('div');

  useEffect(() => {
    document.body.appendChild(el);

    return () => {
      document.body.removeChild(el);
    };
  });

  return ReactDOM.createPortal(children, el);
};
