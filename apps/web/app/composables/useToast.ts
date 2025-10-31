export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  icon?: string;
  closable?: boolean;
  createdAt: number;
}

export interface ToastOptions {
  title?: string;
  duration?: number;
  position?: ToastPosition;
  icon?: string;
  closable?: boolean;
}

export const defaultIcons = {
  success: 'ri:checkbox-circle-line',
  error: 'ri:close-circle-line',
  warning: 'ri:error-warning-line',
  info: 'ri:information-line',
  default: '',
};

// Global state untuk toast

let toastId = 0;

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => []);

  const defaultDuration = 3000;

  const generateId = (): string => {
    return `toast-${++toastId}-${Date.now()}`;
  };

  // Add toast ke array
  const addToast = (
    message: string,
    type: ToastType = 'default',
    options?: ToastOptions
  ): string => {
    const id = generateId();
    const duration = options?.duration ?? defaultDuration;

    const toast: Toast = {
      id,
      type,
      title: options?.title,
      message,
      duration,

      icon: options?.icon,
      closable: options?.closable ?? true,
      createdAt: Date.now(),
    };

    toasts.value.push(toast);

    // Auto remove setelah duration
    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  };

  // Success toast
  const success = (message: string, options?: ToastOptions): string => {
    return addToast(message, 'success', {
      icon: defaultIcons.success,
      ...options,
    });
  };

  // Error toast
  const error = (message: string, options?: ToastOptions): string => {
    return addToast(message, 'error', {
      icon: defaultIcons.error,
      duration: 5000, // Error toast lebih lama
      ...options,
    });
  };

  // Warning toast
  const warning = (message: string, options?: ToastOptions): string => {
    return addToast(message, 'warning', {
      icon: defaultIcons.warning,
      ...options,
    });
  };

  // Info toast
  const info = (message: string, options?: ToastOptions): string => {
    return addToast(message, 'info', {
      icon: defaultIcons.info,
      ...options,
    });
  };

  const defaultToast = (message: string, options?: ToastOptions): string => {
    return addToast(message, 'default', {
      ...options,
    });
  };

  // Remove toast by ID
  const remove = (id: string): void => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  // Remove all toasts
  const clear = (): void => {
    toasts.value = [];
  };

  // Promise wrapper untuk async operations
  const promise = async <T>(
    promise: Promise<T>,
    options: {
      loading?: string;
      onSuccess?: string | ((data: T) => string);
      onError?: string | ((error: Error) => string);
    }
  ): Promise<T> => {
    let loadingToastId: string | undefined;

    // Show loading toast
    if (options.loading) {
      loadingToastId = defaultToast(options.loading, {
        duration: 0, // Tidak auto close
        closable: false,
        icon: 'line-md:loading-twotone-loop',
      });
    }

    try {
      // Menunggu promise selesai
      const data = await promise;

      // Remove loading toast
      if (loadingToastId) {
        remove(loadingToastId);
      }

      // Show success toast
      if (options.onSuccess) {
        const message =
          typeof options.onSuccess === 'function'
            ? options.onSuccess(data)
            : options.onSuccess;
        // tampilkan toast success
        success(message);
      }

      return data;
    } catch (err) {
      // Remove loading toast
      if (loadingToastId) {
        remove(loadingToastId);
      }

      // Show error toast
      if (options.onError) {
        const message =
          typeof options.onError === 'function'
            ? options.onError(err as Error)
            : options.onError;
        // tampilkan toast error
        error(message);
      }

      throw err;
    }
  };

  return {
    // State
    toasts,

    // Methods
    success,
    error,
    warning,
    info,
    add: defaultToast,
    remove,
    clear,
    promise,
  };
}
