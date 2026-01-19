/**
 * Email-safe constraints to ensure compatibility with all email clients.
 * These constraints prevent users from creating emails that break in Outlook, Gmail, etc.
 */
export const EMAIL_CONSTRAINTS = {
  /**
   * System-safe fonts that work in all email clients
   */
  fonts: [
    { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
    { value: 'Lucida Sans Unicode, sans-serif', label: 'Lucida Sans' },
  ],

  /**
   * Safe font sizes (avoid very small or very large)
   */
  fontSizes: [12, 14, 16, 18, 20, 24, 28, 32, 36, 48] as const,

  /**
   * Safe line heights for readability
   */
  lineHeights: ['1.2', '1.4', '1.5', '1.6', '1.8'] as const,

  /**
   * Border radius values (Outlook has issues with > 8px)
   */
  borderRadius: [0, 4, 8] as const,

  /**
   * Predefined padding values for consistency
   */
  padding: {
    none: '0px',
    xs: '5px',
    sm: '10px',
    md: '20px',
    lg: '30px',
    xl: '40px',
  } as const,

  /**
   * Standard email max width
   */
  maxWidth: 600,

  /**
   * Minimum column width for readability
   */
  minColumnWidth: 100,

  /**
   * Safe image formats for email
   */
  imageFormats: ['jpg', 'jpeg', 'png', 'gif'] as const,

  /**
   * Maximum recommended image size (KB)
   */
  maxImageSize: 500,

  /**
   * Always require alt text for accessibility
   */
  requireImageAlt: true,

  /**
   * Spacer height options
   */
  spacerHeights: [10, 20, 30, 40, 50, 60] as const,

  /**
   * Divider width options
   */
  dividerWidths: [1, 2, 3] as const,

  /**
   * Column count options
   */
  columnCounts: [1, 2, 3, 4] as const,

  /**
   * Social icon sizes
   */
  socialIconSizes: [24, 32, 40] as const,

  /**
   * Supported social networks
   */
  socialNetworks: [
    'facebook',
    'twitter',
    'linkedin',
    'instagram',
    'youtube',
  ] as const,
} as const;

export type EmailConstraints = typeof EMAIL_CONSTRAINTS;

// Derived types
export type FontSize = (typeof EMAIL_CONSTRAINTS.fontSizes)[number];
export type LineHeight = (typeof EMAIL_CONSTRAINTS.lineHeights)[number];
export type BorderRadius = (typeof EMAIL_CONSTRAINTS.borderRadius)[number];
export type PaddingKey = keyof typeof EMAIL_CONSTRAINTS.padding;
export type SpacerHeight = (typeof EMAIL_CONSTRAINTS.spacerHeights)[number];
export type DividerWidth = (typeof EMAIL_CONSTRAINTS.dividerWidths)[number];
export type ColumnCount = (typeof EMAIL_CONSTRAINTS.columnCounts)[number];
export type SocialIconSize = (typeof EMAIL_CONSTRAINTS.socialIconSizes)[number];
export type SocialNetworkType =
  (typeof EMAIL_CONSTRAINTS.socialNetworks)[number];
