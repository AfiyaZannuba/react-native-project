/**
 * Email validation
 * RFC 5322 compliant regex pattern for email validation
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Password validation
 * Minimum 8 characters, at least one uppercase, one lowercase, and one number
 */
export const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
};

/**
 * Verification code validation
 * Should be a 6-digit code
 */
export const validateVerificationCode = (code: string): boolean => {
    return /^\d{6}$/.test(code);
};

/**
 * Extract user-friendly error message from Clerk errors
 */
export const getClerkErrorMessage = (error: any): string => {
    if (!error) return 'An unexpected error occurred';

    // Handle Clerk ClerkAPIError with errors array
    if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        return error.errors[0].message || 'An error occurred';
    }

    // Handle Clerk errors object
    if (error.fields && typeof error.fields === 'object') {
        const fieldErrors = Object.values(error.fields) as any[];
        if (fieldErrors.length > 0 && fieldErrors[0].message) {
            return fieldErrors[0].message;
        }
    }

    // Handle standard error message
    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred';
};

/**
 * Format field-specific errors from Clerk
 */
export const getFieldError = (
    errors: any,
    fieldName: string
): string | undefined => {
    if (!errors || !errors.fields) return undefined;
    return errors.fields[fieldName]?.message;
};
