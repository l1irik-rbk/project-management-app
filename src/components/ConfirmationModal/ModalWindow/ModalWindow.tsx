import s from './ModalWindow.module.scss';
import g from './../../../App.module.scss';
import { useAppSelector, useAppDispatch } from '../../../Redux/reduxHooks';
import { appSlice } from '../../../Redux/toolkitSlice';
import { Props } from '../ConfirmationModal';

const ModalWindow = ({ text, onConfirm }: Props) => {
  const { confirmationModal } = useAppSelector((state) => state.appReducer);
  const { isPortalVisible } = confirmationModal;
  const dispatch = useAppDispatch();
  const { setPortalVisible, setConfirmationModalType, setIsConfirmed } = appSlice.actions;
  const portalVisibility = isPortalVisible ? `${s.overlay}` : `${s.overlay__hidden}`;

  const handleClosePortal = () => {
    dispatch(setPortalVisible(false));
    dispatch(setConfirmationModalType(null));
  };

  const handlePortalAction = () => {
    onConfirm();
    // dispatch(setIsConfirmed(true));
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
