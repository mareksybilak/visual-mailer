import type { Config, ComponentConfig } from '@measured/puck';
import { EMAIL_CONSTRAINTS } from './constraints';
import { defaultTheme } from './default-theme';
import type { EmailBuilderConfig, EmailVariable } from '../types';

// Import block components
import {
  EmailHeader,
  EmailText,
  EmailImage,
  EmailButton,
  EmailColumns,
  EmailSpacer,
  EmailDivider,
  EmailSocial,
  EmailFooter,
} from '../components/blocks';

interface PuckConfigOptions {
  config: EmailBuilderConfig;
  variables: EmailVariable[];
  onImageUpload?: (file: File) => Promise<string>;
}

/**
 * Creates Puck configuration with mail-safe components
 */
export function createPuckConfig(options: PuckConfigOptions): Config {
  const { config, variables } = options;
  const colors = { ...defaultTheme.colors, ...config.colors };

  // Create color options for pickers
  const colorOptions = Object.entries(colors).map(([name, value]) => ({
    label: name.charAt(0).toUpperCase() + name.slice(1),
    value: typeof value === 'string' ? value : value[500] || '#000000',
  }));

  // Create variable options for inserting
  const variableOptions = variables.map((v) => ({
    label: v.label,
    value: `{{${v.key}}}`,
  }));

  return {
    components: {
      EmailHeader: createHeaderConfig(colorOptions),
      EmailText: createTextConfig(colorOptions, variableOptions),
      EmailImage: createImageConfig(colorOptions),
      EmailButton: createButtonConfig(colorOptions),
      EmailColumns: createColumnsConfig(),
      EmailSpacer: createSpacerConfig(),
      EmailDivider: createDividerConfig(colorOptions),
      EmailSocial: createSocialConfig(colorOptions),
      EmailFooter: createFooterConfig(colorOptions, config.defaultFooter),
    },
    categories: {
      layout: {
        title: 'Layout',
        components: ['EmailColumns', 'EmailSpacer', 'EmailDivider'],
      },
      content: {
        title: 'Content',
        components: ['EmailText', 'EmailImage', 'EmailButton'],
      },
      branding: {
        title: 'Branding',
        components: ['EmailHeader', 'EmailFooter', 'EmailSocial'],
      },
    },
    root: {
      fields: {
        subject: {
          type: 'text',
          label: 'Email Subject',
        },
        preheader: {
          type: 'text',
          label: 'Preheader Text',
        },
        backgroundColor: {
          type: 'select',
          label: 'Background Color',
          options: colorOptions,
        },
        contentWidth: {
          type: 'number',
          label: 'Content Width',
          min: 400,
          max: 700,
        },
        fontFamily: {
          type: 'select',
          label: 'Default Font',
          options: EMAIL_CONSTRAINTS.fonts,
        },
      },
      defaultProps: {
        subject: '',
        preheader: '',
        backgroundColor: '#f4f4f4',
        contentWidth: 600,
        fontFamily: 'Arial, Helvetica, sans-serif',
      },
    },
  };
}

// Component configurations

function createHeaderConfig(
  colorOptions: Array<{ label: string; value: string }>
): ComponentConfig<any> {
  return {
    label: 'Header',
    fields: {
      logoUrl: { type: 'text', label: 'Logo URL' },
      logoAlt: { type: 'text', label: 'Logo Alt Text' },
      logoWidth: {
        type: 'number',
        label: 'Logo Width (px)',
        min: 50,
        max: 300,
      },
      backgroundColor: {
        type: 'select',
        label: 'Background Color',
        options: colorOptions,
      },
      align: {
        type: 'radio',
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
      padding: {
        type: 'select',
        label: 'Padding',
        options: Object.keys(EMAIL_CONSTRAINTS.padding).map((key) => ({
          label: key.toUpperCase(),
          value: key,
        })),
      },
    },
    defaultProps: {
      logoUrl: '',
      logoAlt: 'Company Logo',
      logoWidth: 150,
      backgroundColor: '#ffffff',
      align: 'center',
      padding: 'md',
    },
    render: EmailHeader,
  };
}

function createTextConfig(
  colorOptions: Array<{ label: string; value: string }>,
  variableOptions: Array<{ label: string; value: string }>
): ComponentConfig<any> {
  return {
    label: 'Text',
    fields: {
      content: {
        type: 'textarea',
        label: 'Content',
      },
      fontSize: {
        type: 'select',
        label: 'Font Size',
        options: EMAIL_CONSTRAINTS.fontSizes.map((s) => ({
          label: `${s}px`,
          value: s,
        })),
      },
      fontFamily: {
        type: 'select',
        label: 'Font Family',
        options: EMAIL_CONSTRAINTS.fonts,
      },
      color: {
        type: 'select',
        label: 'Text Color',
        options: colorOptions,
      },
      align: {
        type: 'radio',
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
      lineHeight: {
        type: 'select',
        label: 'Line Height',
        options: EMAIL_CONSTRAINTS.lineHeights.map((h) => ({
          label: h,
          value: h,
        })),
      },
      padding: {
        type: 'select',
        label: 'Padding',
        options: Object.keys(EMAIL_CONSTRAINTS.padding).map((key) => ({
          label: key.toUpperCase(),
          value: key,
        })),
      },
    },
    defaultProps: {
      content: 'Your text here...',
      fontSize: 16,
      fontFamily: 'Arial, Helvetica, sans-serif',
      color: '#333333',
      align: 'left',
      lineHeight: '1.5',
      padding: 'md',
    },
    render: EmailText,
  };
}

function createImageConfig(
  colorOptions: Array<{ label: string; value: string }>
): ComponentConfig<any> {
  return {
    label: 'Image',
    fields: {
      src: { type: 'text', label: 'Image URL' },
      alt: { type: 'text', label: 'Alt Text (Required)' },
      width: {
        type: 'number',
        label: 'Width (px, or 0 for full width)',
        min: 0,
        max: 600,
      },
      align: {
        type: 'radio',
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
      href: { type: 'text', label: 'Link URL (optional)' },
      padding: {
        type: 'select',
        label: 'Padding',
        options: Object.keys(EMAIL_CONSTRAINTS.padding).map((key) => ({
          label: key.toUpperCase(),
          value: key,
        })),
      },
    },
    defaultProps: {
      src: '',
      alt: '',
      width: 0,
      align: 'center',
      href: '',
      padding: 'md',
    },
    render: EmailImage,
  };
}

function createButtonConfig(
  colorOptions: Array<{ label: string; value: string }>
): ComponentConfig<any> {
  return {
    label: 'Button',
    fields: {
      text: { type: 'text', label: 'Button Text' },
      href: { type: 'text', label: 'Link URL' },
      backgroundColor: {
        type: 'select',
        label: 'Background Color',
        options: colorOptions,
      },
      textColor: {
        type: 'select',
        label: 'Text Color',
        options: colorOptions,
      },
      fontSize: {
        type: 'select',
        label: 'Font Size',
        options: EMAIL_CONSTRAINTS.fontSizes.map((s) => ({
          label: `${s}px`,
          value: s,
        })),
      },
      borderRadius: {
        type: 'radio',
        label: 'Border Radius',
        options: EMAIL_CONSTRAINTS.borderRadius.map((r) => ({
          label: `${r}px`,
          value: r,
        })),
      },
      align: {
        type: 'radio',
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
      fullWidth: {
        type: 'radio',
        label: 'Full Width',
        options: [
          { label: 'No', value: false },
          { label: 'Yes', value: true },
        ],
      },
      padding: {
        type: 'select',
        label: 'Button Padding',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
    },
    defaultProps: {
      text: 'Click Here',
      href: '#',
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      fontSize: 16,
      borderRadius: 4,
      align: 'center',
      fullWidth: false,
      padding: 'md',
    },
    render: EmailButton,
  };
}

function createColumnsConfig(): ComponentConfig<any> {
  return {
    label: 'Columns',
    fields: {
      columns: {
        type: 'radio',
        label: 'Number of Columns',
        options: EMAIL_CONSTRAINTS.columnCounts.map((c) => ({
          label: `${c}`,
          value: c,
        })),
      },
      gap: {
        type: 'select',
        label: 'Gap',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      verticalAlign: {
        type: 'radio',
        label: 'Vertical Align',
        options: [
          { label: 'Top', value: 'top' },
          { label: 'Middle', value: 'middle' },
          { label: 'Bottom', value: 'bottom' },
        ],
      },
      stackOnMobile: {
        type: 'radio',
        label: 'Stack on Mobile',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
      },
    },
    defaultProps: {
      columns: 2,
      gap: 'md',
      verticalAlign: 'top',
      stackOnMobile: true,
    },
    render: EmailColumns,
  };
}

function createSpacerConfig(): ComponentConfig<any> {
  return {
    label: 'Spacer',
    fields: {
      height: {
        type: 'select',
        label: 'Height',
        options: EMAIL_CONSTRAINTS.spacerHeights.map((h) => ({
          label: `${h}px`,
          value: h,
        })),
      },
    },
    defaultProps: {
      height: 20,
    },
    render: EmailSpacer,
  };
}

function createDividerConfig(
  colorOptions: Array<{ label: string; value: string }>
): ComponentConfig<any> {
  return {
    label: 'Divider',
    fields: {
      color: {
        type: 'select',
        label: 'Color',
        options: colorOptions,
      },
      width: {
        type: 'radio',
        label: 'Width',
        options: EMAIL_CONSTRAINTS.dividerWidths.map((w) => ({
          label: `${w}px`,
          value: w,
        })),
      },
      style: {
        type: 'radio',
        label: 'Style',
        options: [
          { label: 'Solid', value: 'solid' },
          { label: 'Dashed', value: 'dashed' },
          { label: 'Dotted', value: 'dotted' },
        ],
      },
      padding: {
        type: 'select',
        label: 'Padding',
        options: Object.keys(EMAIL_CONSTRAINTS.padding).map((key) => ({
          label: key.toUpperCase(),
          value: key,
        })),
      },
    },
    defaultProps: {
      color: '#e0e0e0',
      width: 1,
      style: 'solid',
      padding: 'md',
    },
    render: EmailDivider,
  };
}

function createSocialConfig(
  colorOptions: Array<{ label: string; value: string }>
): ComponentConfig<any> {
  return {
    label: 'Social Icons',
    fields: {
      iconSize: {
        type: 'radio',
        label: 'Icon Size',
        options: EMAIL_CONSTRAINTS.socialIconSizes.map((s) => ({
          label: `${s}px`,
          value: s,
        })),
      },
      align: {
        type: 'radio',
        label: 'Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
      iconStyle: {
        type: 'radio',
        label: 'Icon Style',
        options: [
          { label: 'Color', value: 'color' },
          { label: 'Black', value: 'black' },
          { label: 'White', value: 'white' },
        ],
      },
      facebookUrl: { type: 'text', label: 'Facebook URL' },
      twitterUrl: { type: 'text', label: 'Twitter URL' },
      linkedinUrl: { type: 'text', label: 'LinkedIn URL' },
      instagramUrl: { type: 'text', label: 'Instagram URL' },
      youtubeUrl: { type: 'text', label: 'YouTube URL' },
    },
    defaultProps: {
      iconSize: 32,
      align: 'center',
      iconStyle: 'color',
      facebookUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      instagramUrl: '',
      youtubeUrl: '',
    },
    render: EmailSocial,
  };
}

function createFooterConfig(
  colorOptions: Array<{ label: string; value: string }>,
  defaultFooter?: { companyName: string; address: string; unsubscribeUrl: string }
): ComponentConfig<any> {
  return {
    label: 'Footer',
    fields: {
      companyName: { type: 'text', label: 'Company Name' },
      address: { type: 'textarea', label: 'Address' },
      showUnsubscribe: {
        type: 'radio',
        label: 'Show Unsubscribe Link',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
      },
      unsubscribeText: { type: 'text', label: 'Unsubscribe Text' },
      backgroundColor: {
        type: 'select',
        label: 'Background Color',
        options: colorOptions,
      },
      textColor: {
        type: 'select',
        label: 'Text Color',
        options: colorOptions,
      },
    },
    defaultProps: {
      companyName: defaultFooter?.companyName || 'Company Name',
      address: defaultFooter?.address || '123 Street, City, Country',
      showUnsubscribe: true,
      unsubscribeText: 'Unsubscribe',
      backgroundColor: '#f4f4f4',
      textColor: '#666666',
    },
    render: EmailFooter,
  };
}
