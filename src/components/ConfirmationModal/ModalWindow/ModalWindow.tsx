import s from './ModalWindow.module.scss';
import g from './../../../App.module.scss';
import { useAppSelector, useAppDispatch } from '../../../Redux/reduxHooks';
import { Props } from '../ConfirmationModal';
import { confirmationModalSlice } from '../../../Redux/slices/confirmationModalSlice';

const ModalWindow = ({ text, onConfirm }: Props) => {
  const { isPortalVisible } = useAppSelector((state) => state.confirmationModal);

  const dispatch = useAppDispatch();
  const { setPortalVisible, setConfirmationModalType } = confirmationModalSlice.actions;

  const portalVisibility = isPortalVisible ? `${s.overlay}` : `${s.overlay__hidden}`;

  const handleClosePortal = () => {
    dispatch(setPortalVisible(false));
    dispatch(setConfirmationModalType(null));
  };

  const handlePortalAction = () => {
    onConfirm();
    dispatch(setPortalVisible(false));
    dispatch(setConfirmationModalType(null));
  };

  return (
    <div className={portalVisibility} onClick={handleClosePortal}>
      <div className={`${s.modal__window}`} onClick={(e) => e.stopPropagation()}>
        <div className={`${s.modal__window_content}`}>
          <h6 className={`${g.font_title}`}>Are you sure?</h6>
          <p>{text}</p>
          <div className={s.buttons__container}>
            <button className={`${g.button} ${g.drop_shadow}`} onClick={handlePortalAction}>
              OK
            </button>
            <button className={`${g.button} ${g.drop_shadow}`} onClick={handleClosePortal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
