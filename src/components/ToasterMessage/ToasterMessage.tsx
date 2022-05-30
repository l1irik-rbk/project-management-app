import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../Redux/hooks';
import { logoutExpiredUserThunk } from '../../Redux/slices/userSlice';
import { getToken } from '../../services/utils';

type MessageType = {
  translationPath: string;
};

const ToasterTranslate = ({ translationPath }: MessageType) => {
  const { t } = useTranslation();

  return <div>{t(translationPath)}</div>;
};

export const showSuccess = (translationPath: string) => {
  toast.success(<ToasterTranslate translationPath={translationPath} />, {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const Toaster = (props: { message: string }) => {
  const dispatch = useAppDispatch();
  if (props.message === 'Unauthorized') dispatch(logoutExpiredUserThunk());

  return <div>{props.message}</div>;
};

export const showError = (message: string) => {
  toast.error(<Toaster message={message} />, {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
