/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get email validation error message
 */
export const getEmailError = (email: string): string | undefined => {
  if (!email) {
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

/**
 * Validate name (non-empty and reasonable length)
 */
export const validateName = (name: string): boolean => {
  if (!name) return false;
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && trimmedName.length <= 100;
};

/**
 * Get name validation error message
 */
export const getNameError = (name: string): string | undefined => {
  if (!name || !name.trim()) {
    return 'Name is required';
  }
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (trimmedName.length > 100) {
    return 'Name must be less than 100 characters';
  }
  return undefined;
};

/**
 * Validate form fields
 */
export interface FormValidationErrors {
  name?: string;
  email?: string;
}

export const validateCheckoutForm = (
  name: string,
  email: string
): FormValidationErrors => {
  const errors: FormValidationErrors = {};

  const nameError = getNameError(name);
  if (nameError) {
    errors.name = nameError;
  }

  const emailError = getEmailError(email);
  if (emailError) {
    errors.email = emailError;
  }

  return errors;
};

/**
 * Check if form is valid (no errors)
 */
export const isFormValid = (errors: FormValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};
