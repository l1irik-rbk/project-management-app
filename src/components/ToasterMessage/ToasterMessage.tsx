import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type MessageType = {
  translationPath: string;
};

export const ToasterMessage = ({ translationPath }: MessageType) => {
  const { t } = useTranslation();

  return <div>{t(translationPath)}</div>;
};

export const showSuccessToaster = (translationPath: string) => {
  toast.success(<ToasterMessage translationPath={translationPath} />, {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const showErrorToaster = (translationPath: string) => {
  toast.error(<ToasterMessage translationPath={translationPath} />, {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
