import type { EmailTemplate, EmailBlock, ValidationResult } from '../types';
import { EMAIL_CONSTRAINTS } from '../config/constraints';

const VALID_BLOCK_TYPES = [
  'EmailHeader',
  'EmailText',
  'EmailImage',
  'EmailButton',
  'EmailColumns',
  'EmailSpacer',
  'EmailDivider',
  'EmailSocial',
  'EmailFooter',
] as const;

/**
 * Validates an email template JSON structure
 */
export function validateTemplate(template: unknown): ValidationResult {
  const errors: string[] = [];

  if (!template || typeof template !== 'object') {
    return { valid: false, errors: ['Template must be an object'] };
  }

  const t = template as Partial<EmailTemplate>;

  // Validate version
  if (t.version !== '1.0') {
    errors.push(`Unsupported version: ${t.version}. Expected "1.0"`);
  }

  // Validate metadata
  if (!t.metadata || typeof t.metadata !== 'object') {
    errors.push('Missing or invalid metadata');
  } else {
    if (typeof t.metadata.subject !== 'string') {
      errors.push('metadata.subject must be a string');
    }
    if (typeof t.metadata.preheader !== 'string') {
      errors.push('metadata.preheader must be a string');
    }
  }

  // Validate settings
  if (!t.settings || typeof t.settings !== 'object') {
    errors.push('Missing or invalid settings');
  } else {
    if (typeof t.settings.backgroundColor !== 'string') {
      errors.push('settings.backgroundColor must be a string');
    }
    if (typeof t.settings.contentWidth !== 'number') {
      errors.push('settings.contentWidth must be a number');
    } else if (
      t.settings.contentWidth < 400 ||
      t.settings.contentWidth > 700
    ) {
      errors.push('settings.contentWidth must be between 400 and 700');
    }
    if (typeof t.settings.fontFamily !== 'string') {
      errors.push('settings.fontFamily must be a string');
    }
  }

  // Validate content
  if (!Array.isArray(t.content)) {
    errors.push('content must be an array');
  } else {
    t.content.forEach((block, index) => {
      const blockErrors = validateBlock(block, index);
      errors.push(...blockErrors);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a single block
 */
function validateBlock(block: unknown, index: number): string[] {
  const errors: string[] = [];
  const prefix = `content[${index}]`;

  if (!block || typeof block !== 'object') {
    errors.push(`${prefix}: Block must be an object`);
    return errors;
  }

  const b = block as Partial<EmailBlock>;

  // Validate type
  if (!b.type || !VALID_BLOCK_TYPES.includes(b.type as any)) {
    errors.push(`${prefix}: Invalid block type "${b.type}"`);
    return errors;
  }

  // Validate props exist
  if (!b.props || typeof b.props !== 'object') {
    errors.push(`${prefix}: Block must have props object`);
    return errors;
  }

  // Type-specific validation
  switch (b.type) {
    case 'EmailHeader':
      errors.push(...validateHeaderProps(b.props, prefix));
      break;
    case 'EmailText':
      errors.push(...validateTextProps(b.props, prefix));
      break;
    case 'EmailImage':
      errors.push(...validateImageProps(b.props, prefix));
      break;
    case 'EmailButton':
      errors.push(...validateButtonProps(b.props, prefix));
      break;
    case 'EmailColumns':
      errors.push(...validateColumnsProps(b.props, prefix));
      if ((b as any).children) {
        (b as any).children.forEach((child: unknown, childIndex: number) => {
          errors.push(...validateBlock(child, childIndex));
        });
      }
      break;
    case 'EmailSpacer':
      errors.push(...validateSpacerProps(b.props, prefix));
      break;
    case 'EmailDivider':
      errors.push(...validateDividerProps(b.props, prefix));
      break;
  }

  return errors;
}

function validateHeaderProps(props: any, prefix: string): string[] {
  const errors: string[] = [];

  if (props.logoWidth && (props.logoWidth < 50 || props.logoWidth > 300)) {
    errors.push(`${prefix}.props.logoWidth must be between 50 and 300`);
  }

  if (props.align && !['left', 'center', 'right'].includes(props.align)) {
    errors.push(`${prefix}.props.align must be left, center, or right`);
  }

  return errors;
}

function validateTextProps(props: any, prefix: string): string[] {
  const errors: string[] = [];

  if (
    props.fontSize &&
    !EMAIL_CONSTRAINTS.fontSizes.includes(props.fontSize)
  ) {
    errors.push(
      `${prefix}.props.fontSize must be one of: ${EMAIL_CONSTRAINTS.fontSizes.join(', ')}`
    );
  }

  if (
    props.lineHeight &&
    !EMAIL_CONSTRAINTS.lineHeights.includes(props.lineHeight)
  ) {
    errors.push(
      `${prefix}.props.lineHeight must be one of: ${EMAIL_CONSTRAINTS.lineHeights.join(', ')}`
    );
  }

  return errors;
}

function validateImageProps(props: any, prefix: string): string[] {
  const errors: string[] = [];

  if (EMAIL_CONSTRAINTS.requireImageAlt && !props.alt) {
    errors.push(`${prefix}.props.alt is required for accessibility`);
  }

  if (
    props.width &&
    props.width !== 'full' &&
    (props.width < 0 || props.width > EMAIL_CONSTRAINTS.maxWidth)
  ) {
    errors.push(
      `${prefix}.props.width must be between 0 and ${EMAIL_CONSTRAINTS.maxWidth}`
    );
  }

  return errors;
}

function validateButtonProps(props: any, prefix: string): string[] {
  const errors: string[] = [];

  if (!props.text) {
    errors.push(`${prefix}.props.text is required`);
  }

  if (!props.href) {
    errors.push(`${prefix}.props.href is required`);
  }

  if (
    props.borderRadius !== undefined &&
    !EMAIL_CONSTRAINTS.borderRadius.includes(props.borderRadius)
  ) {
    errors.push(
      `${prefix}.props.borderRadius must be one of: ${EMAIL_CONSTRAINTS.borderRadius.join(', ')}`
    );
  }

  return errors;
}

function validateColumnsProps(props: any, prefix: string): string[] {
  const errors: string[] = [];

  if (props.columns && !EMAIL_CONSTRAINTS.columnCounts.includes(props.columns)) {
    errors.push(
      `${prefix}.props.columns must be one of: ${EMAIL_CONSTRAINTS.columnCounts.join(', ')}`
    );
  }

  return errors;
}

function validateSpacerProps(props: any, prefix: string): string[] {
  const errors: string[] = [];

  if (
    props.height &&
    !EMAIL_CONSTRAINTS.spacerHeights.includes(props.height)
  ) {
    errors.push(
      `${prefix}.props.height must be one of: ${EMAIL_CONSTRAINTS.spacerHeights.join(', ')}`
    );
  }

  return errors;
}

function validateDividerProps(props: any, prefix: string): string[] {
  const errors: string[] = [];

  if (props.width && !EMAIL_CONSTRAINTS.dividerWidths.includes(props.width)) {
    errors.push(
      `${prefix}.props.width must be one of: ${EMAIL_CONSTRAINTS.dividerWidths.join(', ')}`
    );
  }

  if (props.style && !['solid', 'dashed', 'dotted'].includes(props.style)) {
    errors.push(`${prefix}.props.style must be solid, dashed, or dotted`);
  }

  return errors;
}

export default validateTemplate;
