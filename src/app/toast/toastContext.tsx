import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, MESSAGE_TYPES } from '@theme';
import cn from '@common/utils/classnames';
import styles from './toastContext.css';

const DEFAULT_TIMEOUT = 5000;

interface ToastI {
  message: string;
  timeout?: number;
  type?: MESSAGE_TYPES;
}

interface ToastEnrichedI extends ToastI {
  id: string;
  className?: string;
}

const Context = React.createContext<{
  addToast: (toast: ToastI) => void;
}>({ addToast: () => {} });

export const ToastProvider = ({ children }: { children: any }) => {
  const [toasts, setToasts] = React.useState<Array<ToastEnrichedI>>([]);

  const updateClassName = (id: string, className: string) =>
    setToasts((toasts) =>
      toasts.map((toast) => (toast.id === id ? { ...toast, className } : toast))
    );

  const removeToast = (id: string) => {
    updateClassName(id, styles.toastFadeOut);

    window.setTimeout(
      () => setToasts((toasts) => toasts.filter((toast) => toast.id !== id)),
      300
    );
  };

  const addToast = (toast: ToastI) => {
    const id = uuidv4();
    console.log('addToast', toast);
    setToasts((toasts) => [
      {
        id,
        ...toast,
      },
      ...toasts,
    ]);
    window.setTimeout(() => updateClassName(id, styles.toastFadeIn), 100);
    window.setTimeout(() => removeToast(id), toast.timeout || DEFAULT_TIMEOUT);
  };

  return (
    <Context.Provider value={{ addToast }}>
      {children}
      <div className={styles.root}>
        {Boolean(toasts) &&
          toasts.map((toast) => (
            <Message
              className={cn(styles.toast, {
                [toast.className]: Boolean(toast.className),
              })}
              classNameContent={styles.toastInner}
              type={toast.type}
              key={toast.id}
            >
              <p dangerouslySetInnerHTML={{ __html: toast.message }} />
              <button
                className={styles.remove}
                onClick={() => removeToast(toast.id)}
              >
                <span className={styles.removeInner}>remove</span>
              </button>
            </Message>
          ))}
      </div>
    </Context.Provider>
  );
};

export const useToast = () => React.useContext(Context);
