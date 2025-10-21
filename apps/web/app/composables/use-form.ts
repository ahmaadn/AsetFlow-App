// composables/useForm.ts
import { ref, reactive, computed } from 'vue';
import { z } from 'zod';

export interface UseFormOptions<T extends object> {
  initialValues: T;
  validationSchema: z.ZodSchema<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

export interface FormField<T> {
  value: T;
  touched: boolean;
}

export function useForm<T extends object>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  // State untuk menyimpan values, errors, dan touched
  const values = reactive<T>({ ...initialValues });
  const errors = reactive<Record<string, string | null>>({});
  const isSubmitting = ref(false);

  // Initialize errors dan touched untuk setiap field
  Object.keys(initialValues).forEach((key) => {
    errors[key] = null;
  });

  // Computed untuk mengecek apakah form valid
  const isValid = computed(() => {
    return Object.values(errors).every((error) => error === null);
  });

  // Fungsi untuk validasi single field
  const validateField = (fieldName: keyof T) => {
    try {
      // Validasi menggunakan zod
      validationSchema.parse(values);
      errors[fieldName as string] = null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find(
          (err) => err.path[0] === fieldName
        );
        if (fieldError) {
          errors[fieldName as string] = fieldError.message;
        } else {
          errors[fieldName as string] = null;
        }
      }
    }
  };

  // Fungsi untuk validasi semua fields
  const validateForm = () => {
    try {
      validationSchema.parse(values);
      // Clear all errors jika validasi berhasil
      Object.keys(errors).forEach((key) => {
        errors[key] = null;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Reset errors dulu
        Object.keys(errors).forEach((key) => {
          errors[key] = null;
        });
        // Set errors dari zod
        error.issues.forEach((err) => {
          const fieldName = err.path[0] as string;
          if (fieldName) {
            errors[fieldName] = err.message;
          }
        });
      }
      return false;
    }
  };

  // Fungsi untuk set field value
  const setFieldValue = <K extends keyof T>(fieldName: K, value: T[K]) => {
    (values as T)[fieldName] = value;
    validateField(fieldName);
  };

  const setFieldError = <K extends keyof T>(
    fieldName: K,
    errorMessage: string | null
  ) => {
    errors[fieldName as string] = errorMessage;
  };

  // Fungsi untuk handle change event
  const handleChange = <K extends keyof T>(fieldName: K, value: T[K]) => {
    setFieldValue(fieldName, value);
  };

  // Fungsi untuk reset form
  const resetForm = () => {
    Object.keys(initialValues).forEach((key) => {
      (values as T)[key as keyof T] = initialValues[key as keyof T];
      errors[key] = null;
    });
    isSubmitting.value = false;
  };

  // Fungsi untuk handle submit
  const handleSubmit = async (e?: Event) => {
    if (e) {
      e.preventDefault();
    }

    // Validasi form
    const isFormValid = validateForm();

    if (!isFormValid) {
      return;
    }

    isSubmitting.value = true;

    try {
      await onSubmit(values as T);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      isSubmitting.value = false;
    }
  };

  // Helper function untuk mendapatkan field props
  const getFieldProps = <K extends keyof T>(fieldName: K) => {
    return {
      value: (values as T)[fieldName],
      error: errors[fieldName as string] ? errors[fieldName as string] : null,
      onChange: (value: T[K]) => handleChange(fieldName, value),
      setError: (errorMessage: string | null) => {
        errors[fieldName as string] = errorMessage;
      },
      setValue: (value: T[K]) => setFieldValue(fieldName, value),
    };
  };

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    setFieldValue,
    setFieldError,
    handleChange,
    handleSubmit,
    resetForm,
    validateField,
    validateForm,
    getFieldProps,
  };
}
