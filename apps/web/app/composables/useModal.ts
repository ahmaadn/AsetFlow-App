export type ModalVariant =
  | 'basic'
  | 'primary'
  | 'error'
  | 'warning'
  | 'success';
export type ModalType = 'basic' | 'confirm' | 'input' | 'timer' | 'promise';
type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export interface ModalButton {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'ghost';
  action?: () => void | Promise<void>;
  closeOnClick?: boolean;
}

export interface ModalConfig {
  id?: string;
  type?: ModalType;
  variant?: ModalVariant;
  title?: string;
  message?: string;
  icon?: string;
  confirmText?: string;
  cancelText?: string;
  confirmDelay?: number; // dalam detik
  inputPlaceholder?: string;
  inputValue?: string;
  inputRequiredValue?: string;
  buttons?: ModalButton[];
  closable?: boolean;
  onConfirm?: (value?: string) => void | Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
}

export interface Modal
  extends Required<
    Omit<ModalConfig, 'buttons' | 'html' | 'onConfirm' | 'onCancel' | 'onClose'>
  > {
  buttons: ModalButton[];

  onConfirm?: (value?: string) => void | Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
  createdAt: number;
}

let modalId = 0;

export function useModal() {
  const modals = useState<Modal[]>('modals', () => []);

  const generateId = (): string => {
    return `modal-${++modalId}-${Date.now()}`;
  };

  const getVariantConfig = (variant: ModalVariant) => {
    const configs = {
      basic: {
        icon: 'ri:information-line',
        iconColor: 'text-base-content',
        buttonClass: 'btn-primary',
      },
      primary: {
        icon: 'ri:information-line',
        iconColor: 'text-primary',
        buttonClass: 'btn-primary',
      },
      error: {
        icon: 'ri:error-warning-line',
        iconColor: 'text-error',
        buttonClass: 'btn-error',
      },
      warning: {
        icon: 'ri:error-warning-line',
        iconColor: 'text-warning',
        buttonClass: 'btn-warning',
      },
      success: {
        icon: 'ri:checkbox-circle-line',
        iconColor: 'text-success',
        buttonClass: 'btn-success',
      },
    };
    return configs[variant];
  };

  const getClassConfirmButton = (modal: Modal) => {
    return getVariantConfig(modal.variant).buttonClass;
  };

  const open = (config: ModalConfig): string => {
    const id = config.id || generateId();
    const variantConfig = getVariantConfig(config.variant || 'basic');

    const modal: Modal = {
      id,
      type: config.type || 'basic',
      variant: config.variant || 'basic',
      title: config.title || 'Modal',
      message: config.message || '',
      icon: config.icon || variantConfig.icon,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      confirmDelay: config.confirmDelay || 0,
      inputPlaceholder: config.inputPlaceholder || 'Type here...',
      inputRequiredValue: config.inputRequiredValue || '',
      inputValue: config.inputValue || '',
      buttons: config.buttons || [],
      closable: config.closable ?? true,
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
      onClose: config.onClose,
      createdAt: new Date().getTime(),
    };

    modals.value.push(modal);
    return id;
  };

  const close = (id: string): void => {
    const modal = modals.value.find((m) => m.id === id);
    if (modal) {
      modal.onClose?.();
      modals.value.splice(modals.value.indexOf(modal), 1);
    }
  };

  const closeAll = (): void => {
    modals.value.forEach((modal) => modal.onClose?.());
    modals.value = [];
  };

  // Modal basic
  const basic = (config: Omit<ModalConfig, 'type'>): string => {
    return open({ ...config, type: 'basic' });
  };

  // Modal dengan konfirmasi
  const confirm = (
    config: Omit<ModalConfig, 'type' | 'onConfirm' | 'onCancel'>
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      open({
        ...config,
        type: 'confirm',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  // Modal dengan input
  const input = (
    config: WithRequired<
      Omit<ModalConfig, 'type' | 'onConfirm' | 'onCancel'>,
      'inputRequiredValue'
    >
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      open({
        ...config,
        type: 'input',
        onConfirm: (value) => resolve(value || null),
        onCancel: () => resolve(null),
      });
    });
  };

  // Modal dengan timer
  const timer = (
    config: Omit<ModalConfig, 'type' | 'onConfirm' | 'onCancel'>
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      open({
        ...config,
        type: 'timer',
        confirmDelay: config.confirmDelay || 3,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  // Modal dengan promise wrapper
  const promise = async <T>(
    promise: Promise<T>,
    config: {
      loading?: Omit<ModalConfig, 'type' | 'confirmText' | 'closable'>;
      success?:
        | Omit<ModalConfig, 'type'>
        | ((data: T) => Omit<ModalConfig, 'type'>);
      error?:
        | Omit<ModalConfig, 'type'>
        | ((error: Error) => Omit<ModalConfig, 'type'>);
    }
  ): Promise<T> => {
    let loadingModalId: string | undefined;

    // Show loading modal
    if (config.loading) {
      loadingModalId = open({
        ...config.loading,
        type: 'promise',
        closable: false,
        confirmText: '',
        icon: config.loading.icon || 'line-md:loading-twotone-loop',
      });
    }

    try {
      const data = await promise;

      // Close loading modal
      if (loadingModalId) {
        close(loadingModalId);
      }

      // Show success modal
      if (config.success) {
        const successConfig =
          typeof config.success === 'function'
            ? config.success(data)
            : config.success;

        open({
          ...successConfig,
          variant: successConfig.variant || 'success',
          type: 'basic',
        });
      }

      return data;
    } catch (err) {
      // Close loading modal
      if (loadingModalId) {
        close(loadingModalId);
      }

      // Show error modal
      if (config.error) {
        const errorConfig =
          typeof config.error === 'function'
            ? config.error(err as Error)
            : config.error;

        open({
          ...errorConfig,
          variant: errorConfig.variant || 'error',
          type: 'basic',
        });
      }

      throw err;
    }
  };

  return {
    // State
    modals,

    // Methods
    open,
    close,
    closeAll,
    basic,
    confirm,
    input,
    timer,
    promise,

    // Utils
    getClassConfirmButton,
    getVariantConfig,
  };
}
