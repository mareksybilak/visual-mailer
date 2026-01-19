/**
 * Default theme configuration for the email builder.
 * Can be overridden via EmailBuilderConfig.
 */
export interface EmailTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
    light: string;
    dark: string;
    white: string;
    black: string;
    gray: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  typography: {
    defaultFontFamily: string;
    defaultFontSize: number;
    defaultLineHeight: string;
    defaultColor: string;
  };
  layout: {
    contentWidth: number;
    defaultBackgroundColor: string;
    defaultPadding: string;
  };
}

export const defaultTheme: EmailTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    black: '#000000',
    gray: {
      100: '#f8f9fa',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529',
    },
  },
  typography: {
    defaultFontFamily: 'Arial, Helvetica, sans-serif',
    defaultFontSize: 16,
    defaultLineHeight: '1.5',
    defaultColor: '#333333',
  },
  layout: {
    contentWidth: 600,
    defaultBackgroundColor: '#ffffff',
    defaultPadding: '20px',
  },
};
