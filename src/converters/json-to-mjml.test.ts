import { describe, it, expect } from 'vitest';
import { jsonToMjml } from './json-to-mjml';
import type { EmailTemplate } from '../types';

describe('jsonToMjml', () => {
  const createTemplate = (content: any[] = []): EmailTemplate => ({
    version: '1.0',
    metadata: {
      subject: 'Test Subject',
      preheader: 'Test Preheader',
    },
    settings: {
      backgroundColor: '#f4f4f4',
      contentWidth: 600,
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    content,
  });

  describe('basic structure', () => {
    it('generates valid MJML structure', () => {
      const template = createTemplate();
      const mjml = jsonToMjml(template);

      expect(mjml).toContain('<mjml>');
      expect(mjml).toContain('</mjml>');
      expect(mjml).toContain('<mj-head>');
      expect(mjml).toContain('<mj-body');
    });

    it('includes metadata in head', () => {
      const template = createTemplate();
      const mjml = jsonToMjml(template);

      expect(mjml).toContain('<mj-title>Test Subject</mj-title>');
      expect(mjml).toContain('<mj-preview>Test Preheader</mj-preview>');
    });

    it('applies settings to body', () => {
      const template = createTemplate();
      const mjml = jsonToMjml(template);

      expect(mjml).toContain('width="600px"');
      expect(mjml).toContain('font-family="Arial, Helvetica, sans-serif"');
    });
  });

  describe('EmailText block', () => {
    it('converts text block to mj-text', () => {
      const template = createTemplate([
        {
          type: 'EmailText',
          props: {
            content: 'Hello World',
            fontSize: 16,
            fontFamily: 'Arial, sans-serif',
            color: '#333333',
            align: 'left',
            lineHeight: '1.5',
            padding: 'md',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('<mj-text');
      expect(mjml).toContain('Hello World');
      expect(mjml).toContain('font-size="16px"');
      expect(mjml).toContain('color="#333333"');
      expect(mjml).toContain('align="left"');
    });
  });

  describe('EmailButton block', () => {
    it('converts button block to mj-button', () => {
      const template = createTemplate([
        {
          type: 'EmailButton',
          props: {
            text: 'Click Me',
            href: 'https://example.com',
            backgroundColor: '#007bff',
            textColor: '#ffffff',
            fontSize: 16,
            borderRadius: 4,
            align: 'center',
            fullWidth: false,
            padding: 'md',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('<mj-button');
      expect(mjml).toContain('Click Me');
      expect(mjml).toContain('href="https://example.com"');
      expect(mjml).toContain('background-color="#007bff"');
      expect(mjml).toContain('border-radius="4px"');
    });

    it('handles full width button', () => {
      const template = createTemplate([
        {
          type: 'EmailButton',
          props: {
            text: 'Full Width',
            href: '#',
            backgroundColor: '#007bff',
            textColor: '#ffffff',
            fontSize: 16,
            borderRadius: 4,
            align: 'center',
            fullWidth: true,
            padding: 'md',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('width="100%"');
    });
  });

  describe('EmailImage block', () => {
    it('converts image block to mj-image', () => {
      const template = createTemplate([
        {
          type: 'EmailImage',
          props: {
            src: 'https://example.com/image.jpg',
            alt: 'Test Image',
            width: 300,
            align: 'center',
            padding: 'md',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('<mj-image');
      expect(mjml).toContain('src="https://example.com/image.jpg"');
      expect(mjml).toContain('alt="Test Image"');
      expect(mjml).toContain('width="300px"');
    });

    it('handles full width image', () => {
      const template = createTemplate([
        {
          type: 'EmailImage',
          props: {
            src: 'https://example.com/image.jpg',
            alt: 'Full Width',
            width: 0,
            align: 'center',
            padding: 'md',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('width="100%"');
    });

    it('includes href when provided', () => {
      const template = createTemplate([
        {
          type: 'EmailImage',
          props: {
            src: 'https://example.com/image.jpg',
            alt: 'Clickable',
            width: 300,
            align: 'center',
            href: 'https://example.com',
            padding: 'md',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('href="https://example.com"');
    });
  });

  describe('EmailHeader block', () => {
    it('converts header block to mj-section with mj-image', () => {
      const template = createTemplate([
        {
          type: 'EmailHeader',
          props: {
            logoUrl: 'https://example.com/logo.png',
            logoAlt: 'Company Logo',
            logoWidth: 150,
            backgroundColor: '#ffffff',
            align: 'center',
            padding: 'md',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('<mj-section');
      expect(mjml).toContain('background-color="#ffffff"');
      expect(mjml).toContain('src="https://example.com/logo.png"');
      expect(mjml).toContain('alt="Company Logo"');
      expect(mjml).toContain('width="150px"');
    });
  });

  describe('EmailSpacer block', () => {
    it('converts spacer block to mj-spacer', () => {
      const template = createTemplate([
        {
          type: 'EmailSpacer',
          props: {
            height: 30,
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('<mj-spacer');
      expect(mjml).toContain('height="30px"');
    });
  });

  describe('EmailDivider block', () => {
    it('converts divider block to mj-divider', () => {
      const template = createTemplate([
        {
          type: 'EmailDivider',
          props: {
            color: '#e0e0e0',
            width: 1,
            style: 'solid',
            padding: 'md',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('<mj-divider');
      expect(mjml).toContain('border-color="#e0e0e0"');
      expect(mjml).toContain('border-width="1px"');
      expect(mjml).toContain('border-style="solid"');
    });
  });

  describe('EmailFooter block', () => {
    it('converts footer block with unsubscribe link', () => {
      const template = createTemplate([
        {
          type: 'EmailFooter',
          props: {
            companyName: 'ACME Corp',
            address: '123 Main St',
            showUnsubscribe: true,
            unsubscribeText: 'Unsubscribe',
            backgroundColor: '#f4f4f4',
            textColor: '#666666',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('ACME Corp');
      expect(mjml).toContain('123 Main St');
      expect(mjml).toContain('{{unsubscribe_url}}');
      expect(mjml).toContain('Unsubscribe');
    });

    it('hides unsubscribe when disabled', () => {
      const template = createTemplate([
        {
          type: 'EmailFooter',
          props: {
            companyName: 'ACME Corp',
            address: '123 Main St',
            showUnsubscribe: false,
            unsubscribeText: 'Unsubscribe',
            backgroundColor: '#f4f4f4',
            textColor: '#666666',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).not.toContain('{{unsubscribe_url}}');
    });
  });

  describe('HTML escaping', () => {
    it('escapes HTML special characters in subject', () => {
      const template: EmailTemplate = {
        ...createTemplate(),
        metadata: {
          subject: '<script>alert("xss")</script>',
          preheader: 'Test',
        },
      };

      const mjml = jsonToMjml(template);

      expect(mjml).not.toContain('<script>');
      expect(mjml).toContain('&lt;script&gt;');
    });

    it('escapes HTML in text content', () => {
      const template = createTemplate([
        {
          type: 'EmailButton',
          props: {
            text: '<b>Bold</b>',
            href: 'https://example.com?foo=1&bar=2',
            backgroundColor: '#007bff',
            textColor: '#ffffff',
            fontSize: 16,
            borderRadius: 4,
            align: 'center',
            fullWidth: false,
            padding: 'md',
          },
        },
      ]);

      const mjml = jsonToMjml(template);

      expect(mjml).toContain('&lt;b&gt;Bold&lt;/b&gt;');
      expect(mjml).toContain('foo=1&amp;bar=2');
    });
  });
});
