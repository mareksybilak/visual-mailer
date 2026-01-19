/**
 * Email template structure
 */
export interface EmailTemplate {
  version: '1.0';
  metadata: EmailMetadata;
  settings: EmailSettings;
  content: EmailBlock[];
}

/**
 * Email metadata (subject, preheader)
 */
export interface EmailMetadata {
  subject: string;
  preheader: string;
}

/**
 * Global email settings
 */
export interface EmailSettings {
  backgroundColor: string;
  contentWidth: number;
  fontFamily: string;
}

/**
 * Union type of all available email blocks
 */
export type EmailBlock =
  | EmailHeaderBlock
  | EmailTextBlock
  | EmailImageBlock
  | EmailButtonBlock
  | EmailColumnsBlock
  | EmailSpacerBlock
  | EmailDividerBlock
  | EmailSocialBlock
  | EmailFooterBlock;

// Block types

export interface EmailHeaderBlock {
  type: 'EmailHeader';
  props: EmailHeaderProps;
}

export interface EmailTextBlock {
  type: 'EmailText';
  props: EmailTextProps;
}

export interface EmailImageBlock {
  type: 'EmailImage';
  props: EmailImageProps;
}

export interface EmailButtonBlock {
  type: 'EmailButton';
  props: EmailButtonProps;
}

export interface EmailColumnsBlock {
  type: 'EmailColumns';
  props: EmailColumnsProps;
  children: EmailBlock[];
}

export interface EmailSpacerBlock {
  type: 'EmailSpacer';
  props: EmailSpacerProps;
}

export interface EmailDividerBlock {
  type: 'EmailDivider';
  props: EmailDividerProps;
}

export interface EmailSocialBlock {
  type: 'EmailSocial';
  props: EmailSocialProps;
}

export interface EmailFooterBlock {
  type: 'EmailFooter';
  props: EmailFooterProps;
}

// Props types

export interface EmailHeaderProps {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  backgroundColor: string;
  align: 'left' | 'center' | 'right';
  padding: PaddingSize;
}

export interface EmailTextProps {
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: 'left' | 'center' | 'right' | 'justify';
  lineHeight: string;
  padding: PaddingSize;
}

export interface EmailImageProps {
  src: string;
  alt: string;
  width: number | 'full';
  align: 'left' | 'center' | 'right';
  href?: string;
  padding: PaddingSize;
}

export interface EmailButtonProps {
  text: string;
  href: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  borderRadius: 0 | 4 | 8;
  align: 'left' | 'center' | 'right';
  fullWidth: boolean;
  padding: 'sm' | 'md' | 'lg';
}

export interface EmailColumnsProps {
  columns: 1 | 2 | 3 | 4;
  gap: 'none' | 'sm' | 'md' | 'lg';
  verticalAlign: 'top' | 'middle' | 'bottom';
  stackOnMobile: boolean;
}

export interface EmailSpacerProps {
  height: 10 | 20 | 30 | 40 | 50 | 60;
}

export interface EmailDividerProps {
  color: string;
  width: 1 | 2 | 3;
  style: 'solid' | 'dashed' | 'dotted';
  padding: PaddingSize;
}

export interface EmailSocialProps {
  networks: SocialNetwork[];
  iconSize: 24 | 32 | 40;
  align: 'left' | 'center' | 'right';
  iconStyle: 'color' | 'black' | 'white';
}

export interface EmailFooterProps {
  companyName: string;
  address: string;
  showUnsubscribe: boolean;
  unsubscribeText: string;
  backgroundColor: string;
  textColor: string;
}

// Helper types

export type PaddingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SocialNetwork {
  type: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube';
  url: string;
}

// Configuration types

export interface EmailBuilderConfig {
  colors?: Record<string, string>;
  brandLogo?: string;
  defaultFooter?: {
    companyName: string;
    address: string;
    unsubscribeUrl: string;
  };
  variables?: EmailVariable[];
}

export interface EmailVariable {
  key: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}

// Output types

export interface EmailBuilderOutput {
  json: EmailTemplate;
  mjml: string;
  html: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
