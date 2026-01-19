import React, { useState, useCallback } from 'react';
import { Puck, type Config, type Data } from '@measured/puck';
import { createPuckConfig } from './config/puck-config';
import { jsonToMjml } from './converters/json-to-mjml';
import { mjmlToHtml } from './converters/mjml-to-html';
import type {
  EmailTemplate,
  EmailBuilderConfig,
  EmailVariable,
  EmailBuilderOutput,
} from './types';

export interface EmailBuilderProps {
  /**
   * Initial template data (for editing existing templates)
   */
  initialData?: EmailTemplate | null;

  /**
   * Configuration for the builder (colors, logo, footer, etc.)
   */
  config?: EmailBuilderConfig;

  /**
   * Available personalization variables
   */
  variables?: EmailVariable[];

  /**
   * Callback when user saves the template
   */
  onSave?: (output: EmailBuilderOutput) => void;

  /**
   * Callback for auto-save (draft)
   */
  onAutoSave?: (data: { json: EmailTemplate }) => void;

  /**
   * Callback to request server-side preview rendering
   */
  onRequestPreview?: (mjml: string) => void;

  /**
   * Callback for image upload
   */
  onImageUpload?: (file: File) => Promise<string>;

  /**
   * Custom class name for the container
   */
  className?: string;
}

export function EmailBuilder({
  initialData,
  config = {},
  variables = [],
  onSave,
  onAutoSave,
  onRequestPreview,
  onImageUpload,
  className,
}: EmailBuilderProps) {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  // Create Puck configuration with our mail-safe components
  const puckConfig = createPuckConfig({
    config,
    variables,
    onImageUpload,
  });

  // Convert initial data to Puck format
  const initialPuckData: Data | undefined = initialData
    ? convertToPuckData(initialData)
    : undefined;

  const handleSave = useCallback(
    (data: Data) => {
      if (!onSave) return;

      // Convert Puck data back to our format
      const template = convertFromPuckData(data);
      const mjml = jsonToMjml(template);
      const { html } = mjmlToHtml(mjml);

      onSave({
        json: template,
        mjml,
        html,
      });
    },
    [onSave]
  );

  const handleChange = useCallback(
    (data: Data) => {
      if (onAutoSave) {
        const template = convertFromPuckData(data);
        onAutoSave({ json: template });
      }
    },
    [onAutoSave]
  );

  // Listen for server-rendered preview
  React.useEffect(() => {
    const handlePreviewUpdate = (event: CustomEvent<{ html: string }>) => {
      setPreviewHtml(event.detail.html);
    };

    window.addEventListener(
      'visual-mailer:preview-update',
      handlePreviewUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        'visual-mailer:preview-update',
        handlePreviewUpdate as EventListener
      );
    };
  }, []);

  return (
    <div className={`visual-mailer-builder ${className || ''}`}>
      <Puck
        config={puckConfig as Config}
        data={initialPuckData || { content: [], root: {} }}
        onPublish={handleSave}
        onChange={handleChange}
      />
    </div>
  );
}

/**
 * Convert our EmailTemplate format to Puck Data format
 */
function convertToPuckData(template: EmailTemplate): Data {
  return {
    content: template.content.map((block, index) => ({
      type: block.type,
      props: {
        ...block.props,
        id: `block-${index}`,
      },
    })),
    root: {
      props: {
        ...template.settings,
        ...template.metadata,
      },
    },
  };
}

/**
 * Convert Puck Data format back to our EmailTemplate format
 */
function convertFromPuckData(data: Data): EmailTemplate {
  const rootProps = data.root?.props || {};

  return {
    version: '1.0',
    metadata: {
      subject: rootProps.subject || '',
      preheader: rootProps.preheader || '',
    },
    settings: {
      backgroundColor: rootProps.backgroundColor || '#ffffff',
      contentWidth: rootProps.contentWidth || 600,
      fontFamily: rootProps.fontFamily || 'Arial, Helvetica, sans-serif',
    },
    content: data.content.map((item) => {
      const { id, ...props } = item.props || {};
      return {
        type: item.type as any,
        props,
        ...(item.type === 'EmailColumns' && { children: [] }),
      };
    }),
  };
}

export default EmailBuilder;
