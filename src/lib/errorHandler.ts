
import { useToast } from '@/hooks/use-toast';

export interface SecureError {
  userMessage: string;
  logMessage: string;
  code?: string;
}

export class SecurityError extends Error {
  public userMessage: string;
  public logMessage: string;
  public code?: string;

  constructor(userMessage: string, logMessage: string, code?: string) {
    super(logMessage);
    this.userMessage = userMessage;
    this.logMessage = logMessage;
    this.code = code;
    this.name = 'SecurityError';
  }
}

export const createSecureError = (userMessage: string, logMessage: string, code?: string): SecurityError => {
  return new SecurityError(userMessage, logMessage, code);
};

export const handleSecureError = (error: unknown, toast: ReturnType<typeof useToast>['toast']) => {
  console.error('Security error:', error);
  
  if (error instanceof SecurityError) {
    // Log the detailed error for developers
    console.error(`[${error.code}] ${error.logMessage}`);
    
    // Show user-friendly message
    toast({
      title: "Error",
      description: error.userMessage,
      variant: "destructive",
    });
  } else if (error instanceof Error) {
    // Generic error handling - don't expose internal details
    console.error('Unexpected error:', error.message);
    toast({
      title: "Something went wrong",
      description: "Please try again later",
      variant: "destructive",
    });
  } else {
    // Unknown error type
    console.error('Unknown error:', error);
    toast({
      title: "Unexpected error",
      description: "Please try again later",
      variant: "destructive",
    });
  }
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Validate and sanitize numeric input
export const sanitizeNumericInput = (input: number, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number => {
  if (isNaN(input) || input < min || input > max) {
    throw createSecureError(
      `Please enter a valid number between ${min} and ${max}`,
      `Invalid numeric input: ${input}, expected range: ${min}-${max}`,
      'INVALID_NUMERIC_INPUT'
    );
  }
  return input;
};
