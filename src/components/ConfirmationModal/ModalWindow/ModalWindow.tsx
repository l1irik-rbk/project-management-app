import s from './ModalWindow.module.scss';
import g from './../../../App.module.scss';
import { useAppSelector, useAppDispatch } from '../../../Redux/reduxHooks';
import { appSlice } from '../../../Redux/toolkitSlice';
import { Props } from '../ConfirmationModal';

const ModalWindow = (props: Props) => {
  const { isPortalVisible } = useAppSelector((state) => state.appReducer);
  const dispatch = useAppDispatch();
  const { setPortalVisible } = appSlice.actions;
  console.log('ModalWindow');
  const portalVisibility = isPortalVisible ? `${s.overlay}` : `${s.overlay__hidden}`;

  const handleClosePortal = () => {
    dispatch(setPortalVisible(false));
  };

  const handlePortalAction = () => {
    props.onConfirm();
    dispatch(setPortalVisible(false));
  };

  return (
    <div className={portalVisibility} onClick={handleClosePortal}>
      <div className={`${s.modal__window}`} onClick={(e) => e.stopPropagation()}>
        <div className={`${s.modal__window_content}`}>
          <h6 className={`${g.font_title}`}>Are you sure?</h6>
          <p>{props.text}</p>
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
