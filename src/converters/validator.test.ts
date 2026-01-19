import { describe, it, expect } from 'vitest';
import { validateTemplate } from './validator';
import type { EmailTemplate } from '../types';

describe('validateTemplate', () => {
  const createValidTemplate = (): EmailTemplate => ({
    version: '1.0',
    metadata: {
      subject: 'Test Subject',
      preheader: 'Test Preheader',
    },
    settings: {
      backgroundColor: '#ffffff',
      contentWidth: 600,
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    content: [],
  });

  describe('version validation', () => {
    it('accepts version 1.0', () => {
      const template = createValidTemplate();
      const result = validateTemplate(template);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects unsupported version', () => {
      const template = { ...createValidTemplate(), version: '2.0' };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('version'))).toBe(true);
    });

    it('rejects missing version', () => {
      const { version, ...template } = createValidTemplate();
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
    });
  });

  describe('metadata validation', () => {
    it('accepts valid metadata', () => {
      const template = createValidTemplate();
      const result = validateTemplate(template);

      expect(result.valid).toBe(true);
    });

    it('rejects invalid metadata type', () => {
      const template = { ...createValidTemplate(), metadata: 'invalid' };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
    });
  });

  describe('settings validation', () => {
    it('accepts valid settings', () => {
      const template = createValidTemplate();
      const result = validateTemplate(template);

      expect(result.valid).toBe(true);
    });

    it('rejects contentWidth out of range (too small)', () => {
      const template = {
        ...createValidTemplate(),
        settings: {
          ...createValidTemplate().settings,
          contentWidth: 300,
        },
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('contentWidth'))).toBe(true);
    });

    it('rejects contentWidth out of range (too large)', () => {
      const template = {
        ...createValidTemplate(),
        settings: {
          ...createValidTemplate().settings,
          contentWidth: 800,
        },
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
    });

    it('accepts contentWidth within range', () => {
      const template = {
        ...createValidTemplate(),
        settings: {
          ...createValidTemplate().settings,
          contentWidth: 550,
        },
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(true);
    });
  });

  describe('content validation', () => {
    it('accepts empty content array', () => {
      const template = createValidTemplate();
      const result = validateTemplate(template);

      expect(result.valid).toBe(true);
    });

    it('rejects non-array content', () => {
      const template = { ...createValidTemplate(), content: 'invalid' };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
    });

    it('rejects invalid block type', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'InvalidBlock',
            props: {},
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('InvalidBlock'))).toBe(true);
    });

    it('accepts valid EmailText block', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailText',
            props: {
              content: 'Hello',
              fontSize: 16,
              fontFamily: 'Arial',
              color: '#333',
              align: 'left',
              lineHeight: '1.5',
              padding: 'md',
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(true);
    });

    it('rejects invalid fontSize in EmailText', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailText',
            props: {
              content: 'Hello',
              fontSize: 99, // Invalid
              fontFamily: 'Arial',
              color: '#333',
              align: 'left',
              lineHeight: '1.5',
              padding: 'md',
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('fontSize'))).toBe(true);
    });
  });

  describe('EmailButton validation', () => {
    it('requires text property', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailButton',
            props: {
              // text missing
              href: 'https://example.com',
              backgroundColor: '#007bff',
              textColor: '#fff',
              fontSize: 16,
              borderRadius: 4,
              align: 'center',
              fullWidth: false,
              padding: 'md',
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('text'))).toBe(true);
    });

    it('requires href property', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailButton',
            props: {
              text: 'Click',
              // href missing
              backgroundColor: '#007bff',
              textColor: '#fff',
              fontSize: 16,
              borderRadius: 4,
              align: 'center',
              fullWidth: false,
              padding: 'md',
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('href'))).toBe(true);
    });

    it('rejects invalid borderRadius', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailButton',
            props: {
              text: 'Click',
              href: 'https://example.com',
              backgroundColor: '#007bff',
              textColor: '#fff',
              fontSize: 16,
              borderRadius: 16, // Invalid
              align: 'center',
              fullWidth: false,
              padding: 'md',
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('borderRadius'))).toBe(true);
    });
  });

  describe('EmailImage validation', () => {
    it('requires alt text for accessibility', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailImage',
            props: {
              src: 'https://example.com/image.jpg',
              // alt missing
              width: 300,
              align: 'center',
              padding: 'md',
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('alt'))).toBe(true);
    });

    it('accepts image with alt text', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailImage',
            props: {
              src: 'https://example.com/image.jpg',
              alt: 'Description',
              width: 300,
              align: 'center',
              padding: 'md',
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(true);
    });
  });

  describe('EmailSpacer validation', () => {
    it('accepts valid height', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailSpacer',
            props: {
              height: 20,
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(true);
    });

    it('rejects invalid height', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailSpacer',
            props: {
              height: 15, // Not in valid list
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
    });
  });

  describe('EmailColumns validation', () => {
    it('accepts valid column count', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailColumns',
            props: {
              columns: 2,
              gap: 'md',
              verticalAlign: 'top',
              stackOnMobile: true,
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(true);
    });

    it('rejects invalid column count', () => {
      const template = {
        ...createValidTemplate(),
        content: [
          {
            type: 'EmailColumns',
            props: {
              columns: 5, // Invalid
              gap: 'md',
              verticalAlign: 'top',
              stackOnMobile: true,
            },
          },
        ],
      };
      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('rejects null template', () => {
      const result = validateTemplate(null as any);

      expect(result.valid).toBe(false);
    });

    it('rejects undefined template', () => {
      const result = validateTemplate(undefined as any);

      expect(result.valid).toBe(false);
    });

    it('rejects non-object template', () => {
      const result = validateTemplate('string' as any);

      expect(result.valid).toBe(false);
    });
  });
});
