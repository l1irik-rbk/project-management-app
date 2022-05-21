import s from './ModalWindow.module.scss';
import g from './../../../App.module.scss';
import { useAppSelector, useAppDispatch } from '../../../Redux/reduxHooks';
import { confirmationModalSlice } from '../../../Redux/slices/confirmationModalSlice';
import { useTranslation } from 'react-i18next';

export type Props = {
  text: string;
  onConfirm: () => void;
};

const ModalWindow = ({ text, onConfirm }: Props) => {
  const { t } = useTranslation();
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
          <h6 className={`${g.font_title}`}>{t('confirmationModal.title')}</h6>
          <p>{text}</p>
          <div className={s.buttons__container}>
            <button className={`${g.button} ${g.drop_shadow}`} onClick={handlePortalAction}>
              {t('confirmationModal.ok')}
            </button>
            <button className={`${g.button} ${g.drop_shadow}`} onClick={handleClosePortal}>
              {t('confirmationModal.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
