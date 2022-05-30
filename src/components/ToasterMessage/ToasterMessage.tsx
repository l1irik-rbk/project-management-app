import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

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
