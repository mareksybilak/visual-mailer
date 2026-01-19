# visual-mailer

> Visual drag-and-drop email builder based on Puck and MJML

[![npm version](https://badge.fury.io/js/visual-mailer.svg)](https://www.npmjs.com/package/visual-mailer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Create **mail-safe**, **responsive** email templates with a visual drag-and-drop editor. Built on top of [Puck](https://github.com/measuredco/puck) for the editing experience and [MJML](https://mjml.io/) for bulletproof email rendering.

## Features

- 🎨 **Visual drag-and-drop editor** - No coding required for end users
- 📧 **Mail-safe components** - Pre-built blocks that render correctly in all email clients
- 📱 **Responsive by default** - MJML handles responsive design automatically
- 🔒 **Constrained editing** - Users can't break email compatibility
- ⚡ **Phoenix LiveView integration** - Seamless integration with Elixir/Phoenix
- 🎯 **Variable support** - Personalization with `{{variable}}` syntax

## Installation

```bash
npm install visual-mailer
# or
yarn add visual-mailer
# or
pnpm add visual-mailer
```

## Quick Start

```tsx
import { EmailBuilder } from 'visual-mailer';
import 'visual-mailer/styles';

function App() {
  const handleSave = (data) => {
    console.log('Template JSON:', data.json);
    console.log('MJML:', data.mjml);
    console.log('HTML:', data.html);
  };

  return (
    <EmailBuilder
      onSave={handleSave}
      config={{
        brandColor: '#007bff',
        brandLogo: '/logo.png',
      }}
      variables={[
        { key: 'first_name', label: 'First Name' },
        { key: 'company', label: 'Company' },
      ]}
    />
  );
}
```

## Phoenix LiveView Integration

For Elixir/Phoenix projects, use together with the [visual_mailer](https://hex.pm/packages/visual_mailer) Hex package.

### 1. Add the hook to your app.js

```javascript
import { EmailBuilderHook } from 'visual-mailer/hooks';

let liveSocket = new LiveSocket('/live', Socket, {
  hooks: {
    EmailBuilder: EmailBuilderHook,
  },
});
```

### 2. Use in LiveView

```elixir
<.live_component
  module={VisualMailer.BuilderComponent}
  id="email-builder"
  template={@template}
  on_save={fn data -> send(self(), {:template_saved, data}) end}
/>
```

## Available Components

| Component | Description |
|-----------|-------------|
| `EmailHeader` | Logo and branding header |
| `EmailText` | Rich text block with safe formatting |
| `EmailImage` | Responsive images with required alt text |
| `EmailButton` | Call-to-action buttons |
| `EmailColumns` | 1-4 column layouts |
| `EmailSpacer` | Vertical spacing |
| `EmailDivider` | Horizontal divider lines |
| `EmailSocial` | Social media icons |
| `EmailFooter` | Footer with unsubscribe link |

## Configuration

```tsx
interface EmailBuilderConfig {
  // Brand colors (will be available in color picker)
  colors?: Record<string, string>;

  // Default logo URL
  brandLogo?: string;

  // Default footer content
  defaultFooter?: {
    companyName: string;
    address: string;
    unsubscribeUrl: string;
  };

  // Available personalization variables
  variables?: Array<{
    key: string;
    label: string;
    defaultValue?: string;
  }>;
}
```

## Output Format

The editor outputs three formats:

### JSON (for storage)
```json
{
  "version": "1.0",
  "metadata": {
    "subject": "Newsletter",
    "preheader": "Check out our latest news..."
  },
  "content": [
    {
      "type": "EmailText",
      "props": {
        "content": "Hello {{first_name}}!",
        "fontSize": 16
      }
    }
  ]
}
```

### MJML (intermediate)
```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello {{first_name}}!</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

### HTML (for sending)
Fully rendered, inline-CSS HTML ready for email delivery.

## Mail-Safe Constraints

The editor enforces email-safe constraints:

- **Fonts**: Only system-safe fonts (Arial, Georgia, Tahoma, etc.)
- **Colors**: Customizable palette to maintain brand consistency
- **Images**: Required alt text, max width 600px
- **Border radius**: Limited to 0, 4, or 8px (Outlook compatibility)
- **Layout**: Max 4 columns, automatic mobile stacking

## Related Packages

- [visual_mailer](https://hex.pm/packages/visual_mailer) - Elixir/Phoenix integration with MJML rendering

## License

MIT © [Marek Sybilak](https://github.com/mareksybilak)
