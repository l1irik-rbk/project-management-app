import { CreatePortal } from './CreatePortal/CreatePortal';
import ModalWindow from './ModalWindow/ModalWindow';

export type Props = {
  text: string;
  action: () => void;
};

export const ConfirmationModal = (props: Props) => {
  return (
    <CreatePortal>
      <ModalWindow text={props.text} action={props.action} />
    </CreatePortal>
  );
};
