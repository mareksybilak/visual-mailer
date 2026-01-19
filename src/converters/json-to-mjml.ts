import type { EmailTemplate, EmailBlock, PaddingSize } from '../types';
import { EMAIL_CONSTRAINTS } from '../config/constraints';

/**
 * Converts EmailTemplate JSON to MJML markup
 */
export function jsonToMjml(template: EmailTemplate): string {
  const { metadata, settings, content } = template;

  return `<mjml>
  <mj-head>
    <mj-title>${escapeHtml(metadata.subject)}</mj-title>
    <mj-preview>${escapeHtml(metadata.preheader)}</mj-preview>
    <mj-attributes>
      <mj-all font-family="${settings.fontFamily}" />
      <mj-body background-color="${settings.backgroundColor}" />
      <mj-section padding="0" />
    </mj-attributes>
  </mj-head>
  <mj-body width="${settings.contentWidth}px">
${content.map((block) => blockToMjml(block)).join('\n')}
  </mj-body>
</mjml>`;
}

/**
 * Convert a single block to MJML
 */
function blockToMjml(block: EmailBlock): string {
  switch (block.type) {
    case 'EmailHeader':
      return renderHeader(block.props);
    case 'EmailText':
      return renderText(block.props);
    case 'EmailImage':
      return renderImage(block.props);
    case 'EmailButton':
      return renderButton(block.props);
    case 'EmailColumns':
      return renderColumns(block.props, block.children || []);
    case 'EmailSpacer':
      return renderSpacer(block.props);
    case 'EmailDivider':
      return renderDivider(block.props);
    case 'EmailSocial':
      return renderSocial(block.props);
    case 'EmailFooter':
      return renderFooter(block.props);
    default:
      return '';
  }
}

function getPadding(padding: PaddingSize): string {
  return EMAIL_CONSTRAINTS.padding[padding] || EMAIL_CONSTRAINTS.padding.md;
}

function renderHeader(props: any): string {
  const padding = getPadding(props.padding);
  return `    <mj-section background-color="${props.backgroundColor}" padding="${padding}">
      <mj-column>
        <mj-image
          src="${escapeHtml(props.logoUrl)}"
          alt="${escapeHtml(props.logoAlt || 'Logo')}"
          width="${props.logoWidth}px"
          align="${props.align}"
        />
      </mj-column>
    </mj-section>`;
}

function renderText(props: any): string {
  const padding = getPadding(props.padding);
  return `    <mj-section padding="${padding}">
      <mj-column>
        <mj-text
          font-size="${props.fontSize}px"
          font-family="${props.fontFamily}"
          color="${props.color}"
          align="${props.align}"
          line-height="${props.lineHeight}"
        >${props.content}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderImage(props: any): string {
  const padding = getPadding(props.padding);
  const width = props.width === 'full' || props.width === 0 ? '100%' : `${props.width}px`;
  const hrefAttr = props.href ? `href="${escapeHtml(props.href)}"` : '';

  return `    <mj-section padding="${padding}">
      <mj-column>
        <mj-image
          src="${escapeHtml(props.src)}"
          alt="${escapeHtml(props.alt || '')}"
          width="${width}"
          align="${props.align}"
          ${hrefAttr}
        />
      </mj-column>
    </mj-section>`;
}

function renderButton(props: any): string {
  const paddingMap: Record<string, string> = {
    sm: '10px 20px',
    md: '15px 30px',
    lg: '20px 40px',
  };
  const buttonPadding = paddingMap[props.padding] || paddingMap.md;

  return `    <mj-section>
      <mj-column>
        <mj-button
          href="${escapeHtml(props.href)}"
          background-color="${props.backgroundColor}"
          color="${props.textColor}"
          font-size="${props.fontSize}px"
          border-radius="${props.borderRadius}px"
          align="${props.align}"
          padding="${buttonPadding}"
          ${props.fullWidth ? 'width="100%"' : ''}
        >${escapeHtml(props.text)}</mj-button>
      </mj-column>
    </mj-section>`;
}

function renderColumns(props: any, children: EmailBlock[]): string {
  const columns = [];
  const columnCount = props.columns || 2;

  // Split children into columns
  const itemsPerColumn = Math.ceil(children.length / columnCount);

  for (let i = 0; i < columnCount; i++) {
    const start = i * itemsPerColumn;
    const end = start + itemsPerColumn;
    const columnChildren = children.slice(start, end);

    const columnContent = columnChildren
      .map((child) => blockToMjml(child))
      .join('\n');

    columns.push(`      <mj-column vertical-align="${props.verticalAlign}">
${columnContent || '        <!-- Empty column -->'}
      </mj-column>`);
  }

  return `    <mj-section ${props.stackOnMobile ? '' : 'mj-class="no-stack"'}>
${columns.join('\n')}
    </mj-section>`;
}

function renderSpacer(props: any): string {
  return `    <mj-section>
      <mj-column>
        <mj-spacer height="${props.height}px" />
      </mj-column>
    </mj-section>`;
}

function renderDivider(props: any): string {
  const padding = getPadding(props.padding);
  return `    <mj-section padding="${padding}">
      <mj-column>
        <mj-divider
          border-color="${props.color}"
          border-width="${props.width}px"
          border-style="${props.style}"
        />
      </mj-column>
    </mj-section>`;
}

function renderSocial(props: any): string {
  const networks = [];

  if (props.facebookUrl) {
    networks.push(`        <mj-social-element name="facebook" href="${escapeHtml(props.facebookUrl)}" icon-size="${props.iconSize}px" />`);
  }
  if (props.twitterUrl) {
    networks.push(`        <mj-social-element name="twitter" href="${escapeHtml(props.twitterUrl)}" icon-size="${props.iconSize}px" />`);
  }
  if (props.linkedinUrl) {
    networks.push(`        <mj-social-element name="linkedin" href="${escapeHtml(props.linkedinUrl)}" icon-size="${props.iconSize}px" />`);
  }
  if (props.instagramUrl) {
    networks.push(`        <mj-social-element name="instagram" href="${escapeHtml(props.instagramUrl)}" icon-size="${props.iconSize}px" />`);
  }
  if (props.youtubeUrl) {
    networks.push(`        <mj-social-element name="youtube" href="${escapeHtml(props.youtubeUrl)}" icon-size="${props.iconSize}px" />`);
  }

  if (networks.length === 0) {
    return '';
  }

  const mode = props.iconStyle === 'color' ? 'vertical' : props.iconStyle;

  return `    <mj-section>
      <mj-column>
        <mj-social align="${props.align}" mode="${mode}">
${networks.join('\n')}
        </mj-social>
      </mj-column>
    </mj-section>`;
}

function renderFooter(props: any): string {
  const unsubscribeLink = props.showUnsubscribe
    ? `<br/><a href="{{unsubscribe_url}}" style="color: ${props.textColor}; text-decoration: underline;">${escapeHtml(props.unsubscribeText || 'Unsubscribe')}</a>`
    : '';

  return `    <mj-section background-color="${props.backgroundColor}">
      <mj-column>
        <mj-text
          font-size="12px"
          color="${props.textColor}"
          align="center"
          line-height="1.6"
        >
          <strong>${escapeHtml(props.companyName)}</strong><br/>
          ${escapeHtml(props.address).replace(/\n/g, '<br/>')}
          ${unsubscribeLink}
        </mj-text>
      </mj-column>
    </mj-section>`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default jsonToMjml;
