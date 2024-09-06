import React, {createContext, useContext, useState, ReactNode} from 'react';
import CustomDialog from '../components/customDialog';

interface DialogContextProps {
  showDialog: (props: DialogProps) => void;
  hideDialog: () => void;
}

interface DialogProps {
  title: string;
  description?: string;
  confirm?: {
    confirmLabel: string;
    onConfirm: () => void;
  };
  cancel?: {
    cancelLabel: string;
    onCancel: () => void;
  };
  onBackdropPress?: () => void;
}

const DialogContext = createContext<DialogContextProps>({
  showDialog: () => {},
  hideDialog: () => {},
});

export const DialogProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogProps, setDialogProps] = useState<DialogProps | null>(null);

  const showDialog = (props: DialogProps) => {
    setDialogProps(props);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  return (
    <DialogContext.Provider value={{showDialog, hideDialog}}>
      {children}
      {dialogProps && (
        <CustomDialog
          isVisible={dialogVisible}
          onBackdropPress={hideDialog}
          {...dialogProps}
        />
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);
