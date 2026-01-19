import { describe, it, expect } from 'vitest';
import { EMAIL_CONSTRAINTS } from './constraints';

describe('EMAIL_CONSTRAINTS', () => {
  describe('fonts', () => {
    it('contains only web-safe fonts', () => {
      expect(EMAIL_CONSTRAINTS.fonts.length).toBeGreaterThan(0);

      EMAIL_CONSTRAINTS.fonts.forEach((font) => {
        expect(font.value).toBeTruthy();
        expect(font.label).toBeTruthy();
        // All should have fallback
        expect(font.value).toContain(',');
      });
    });

    it('includes Arial as default', () => {
      const arial = EMAIL_CONSTRAINTS.fonts.find((f) =>
        f.value.toLowerCase().startsWith('arial')
      );
      expect(arial).toBeDefined();
    });
  });

  describe('fontSizes', () => {
    it('contains reasonable font sizes', () => {
      expect(EMAIL_CONSTRAINTS.fontSizes).toContain(12);
      expect(EMAIL_CONSTRAINTS.fontSizes).toContain(16);
      expect(EMAIL_CONSTRAINTS.fontSizes).toContain(24);

      // All sizes should be reasonable (12-48)
      EMAIL_CONSTRAINTS.fontSizes.forEach((size) => {
        expect(size).toBeGreaterThanOrEqual(12);
        expect(size).toBeLessThanOrEqual(48);
      });
    });
  });

  describe('lineHeights', () => {
    it('contains valid line height values', () => {
      EMAIL_CONSTRAINTS.lineHeights.forEach((lh) => {
        const value = parseFloat(lh);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(2);
      });
    });
  });

  describe('borderRadius', () => {
    it('limits border radius for Outlook compatibility', () => {
      // Outlook has issues with border-radius > 8px
      EMAIL_CONSTRAINTS.borderRadius.forEach((radius) => {
        expect(radius).toBeLessThanOrEqual(8);
      });
    });

    it('includes 0 for square corners', () => {
      expect(EMAIL_CONSTRAINTS.borderRadius).toContain(0);
    });
  });

  describe('padding', () => {
    it('provides standard padding options', () => {
      expect(EMAIL_CONSTRAINTS.padding.none).toBe('0px');
      expect(EMAIL_CONSTRAINTS.padding.md).toBeDefined();
    });

    it('all values end with px', () => {
      Object.values(EMAIL_CONSTRAINTS.padding).forEach((value) => {
        expect(value).toMatch(/^\d+px$/);
      });
    });
  });

  describe('maxWidth', () => {
    it('is standard email width', () => {
      expect(EMAIL_CONSTRAINTS.maxWidth).toBe(600);
    });
  });

  describe('imageFormats', () => {
    it('includes common email-safe formats', () => {
      expect(EMAIL_CONSTRAINTS.imageFormats).toContain('jpg');
      expect(EMAIL_CONSTRAINTS.imageFormats).toContain('jpeg');
      expect(EMAIL_CONSTRAINTS.imageFormats).toContain('png');
      expect(EMAIL_CONSTRAINTS.imageFormats).toContain('gif');
    });

    it('does not include webp (poor email client support)', () => {
      expect(EMAIL_CONSTRAINTS.imageFormats).not.toContain('webp');
    });
  });

  describe('spacerHeights', () => {
    it('provides reasonable spacing options', () => {
      expect(EMAIL_CONSTRAINTS.spacerHeights.length).toBeGreaterThan(0);

      EMAIL_CONSTRAINTS.spacerHeights.forEach((height) => {
        expect(height).toBeGreaterThanOrEqual(10);
        expect(height).toBeLessThanOrEqual(60);
      });
    });
  });

  describe('columnCounts', () => {
    it('limits to 4 columns max', () => {
      const maxColumns = Math.max(...EMAIL_CONSTRAINTS.columnCounts);
      expect(maxColumns).toBe(4);
    });

    it('includes single column', () => {
      expect(EMAIL_CONSTRAINTS.columnCounts).toContain(1);
    });
  });

  describe('socialNetworks', () => {
    it('includes major social networks', () => {
      expect(EMAIL_CONSTRAINTS.socialNetworks).toContain('facebook');
      expect(EMAIL_CONSTRAINTS.socialNetworks).toContain('twitter');
      expect(EMAIL_CONSTRAINTS.socialNetworks).toContain('linkedin');
      expect(EMAIL_CONSTRAINTS.socialNetworks).toContain('instagram');
    });
  });
});
