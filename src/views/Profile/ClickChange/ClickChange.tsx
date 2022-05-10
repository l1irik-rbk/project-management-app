import { SyntheticEvent, useState } from 'react';

type Props = {
  one: React.ReactNode;
  two: React.ReactNode;
};

export const ClickChange = (props: Props) => {
  const { one, two } = props;
  const [state, setState] = useState('one');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setState(state === 'one' ? 'two' : 'one');
  };

  return <form onSubmit={handleSubmit}>{state === 'one' ? one : two}</form>;
};
