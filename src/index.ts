// Main exports
export { EmailBuilder } from './EmailBuilder';
export type { EmailBuilderProps } from './EmailBuilder';

// Components
export * from './components/blocks';

// Configuration
export { EMAIL_CONSTRAINTS } from './config/constraints';
export type { EmailConstraints } from './config/constraints';
export { defaultTheme } from './config/default-theme';
export type { EmailTheme } from './config/default-theme';

// Converters
export { jsonToMjml } from './converters/json-to-mjml';
export { mjmlToHtml } from './converters/mjml-to-html';
export { validateTemplate } from './converters/validator';

// Types
export type {
  EmailTemplate,
  EmailBlock,
  EmailBuilderConfig,
  EmailVariable,
  EmailMetadata,
  EmailSettings,
} from './types';
