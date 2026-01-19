/**
 * Phoenix LiveView hook for email builder integration.
 *
 * Usage in app.js:
 *
 * ```javascript
 * import { EmailBuilderHook } from 'visual-mailer/hooks';
 *
 * let liveSocket = new LiveSocket('/live', Socket, {
 *   hooks: {
 *     EmailBuilder: EmailBuilderHook,
 *   },
 * });
 * ```
 */

import type { EmailTemplate, EmailBuilderConfig, EmailVariable } from '../types';

interface PhoenixHookContext {
  el: HTMLElement;
  pushEvent: (event: string, payload: object) => void;
  handleEvent: (event: string, callback: (payload: any) => void) => void;
}

interface EmailBuilderHookInstance extends PhoenixHookContext {
  _root?: any;
  _cleanup?: () => void;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export const EmailBuilderHook = {
  async mounted(this: EmailBuilderHookInstance) {
    const container = this.el;

    // Parse data attributes
    const initialData: EmailTemplate | null = container.dataset.template
      ? JSON.parse(container.dataset.template)
      : null;

    const config: EmailBuilderConfig = container.dataset.config
      ? JSON.parse(container.dataset.config)
      : {};

    const variables: EmailVariable[] = container.dataset.variables
      ? JSON.parse(container.dataset.variables)
      : [];

    // Dynamically import React and the EmailBuilder
    const [React, ReactDOM, { EmailBuilder }] = await Promise.all([
      import('react'),
      import('react-dom/client'),
      import('../EmailBuilder'),
    ]);

    const root = ReactDOM.createRoot(container);

    // Create React element with callbacks
    const element = React.createElement(EmailBuilder, {
      initialData,
      config,
      variables,

      onSave: (data: any) => {
        this.pushEvent('email_builder:save', {
          json: data.json,
          mjml: data.mjml,
        });
      },

      onAutoSave: (data: any) => {
        this.pushEvent('email_builder:autosave', {
          json: data.json,
        });
      },

      onRequestPreview: (mjml: string) => {
        this.pushEvent('email_builder:preview', { mjml });
      },

      onImageUpload: async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          fileToBase64(file)
            .then((base64) => {
              this.pushEvent('email_builder:upload', {
                name: file.name,
                type: file.type,
                data: base64,
              });

              // Listen for upload complete
              this.handleEvent(
                'email_builder:upload_complete',
                ({ url }: { url: string }) => {
                  resolve(url);
                }
              );

              this.handleEvent(
                'email_builder:upload_error',
                ({ error }: { error: string }) => {
                  reject(new Error(error));
                }
              );
            })
            .catch(reject);
        });
      },
    });

    root.render(element);

    // Listen for preview HTML from server
    this.handleEvent('email_builder:preview_html', ({ html }: { html: string }) => {
      window.dispatchEvent(
        new CustomEvent('visual-mailer:preview-update', {
          detail: { html },
        })
      );
    });

    this._root = root;
  },

  destroyed(this: EmailBuilderHookInstance) {
    if (this._root) {
      this._root.unmount();
    }
    if (this._cleanup) {
      this._cleanup();
    }
  },
};

export default EmailBuilderHook;
