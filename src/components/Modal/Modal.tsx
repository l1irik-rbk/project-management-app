import { useEffect, useState } from 'react';

import s from './Modal.module.scss';
import g from './../../App.module.scss';

type Props = {
  open: boolean;
  title: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
};

export const Modal = (props: Props) => {
  const [isOpen, setIsOpen] = useState(props.open);
  // console.log('Modal');
  useEffect(() => setIsOpen(props.open), [props.open]);

  const handleClose = () => {
    setIsOpen(false);
    props.onClose();
  };

  const handleAction = async () => {
    const result = await props.onConfirm();
    if (result !== undefined) {
      setIsOpen(false);
      props.onClose();
    }
  };

  return (
    <div className={isOpen ? `${s.overlay}` : `${s.overlay__hidden}`} onClick={handleClose}>
      <div className={`${s.modal__window}`} onClick={(e) => e.stopPropagation()}>
        <div className={`${s.modal__window_content}`}>
          <div className={s.content}>
            <h6 className={`${g.font_title}`}>{props.title}</h6>
            {props.content}
          </div>

          <div className={s.buttons__container}>
            <button className={`${g.button} ${g.drop_shadow}`} onClick={handleAction}>
              OK
            </button>

            <button className={`${g.button} ${g.drop_shadow}`} onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
