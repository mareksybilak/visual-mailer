import mjml2html from 'mjml-browser';

export interface MjmlToHtmlResult {
  html: string;
  errors: MjmlError[];
}

export interface MjmlError {
  line: number;
  message: string;
  tagName: string;
  formattedMessage: string;
}

/**
 * Converts MJML markup to HTML using mjml-browser.
 * This is used for client-side preview. For production rendering,
 * use the server-side Rust NIF compiler (visual_mailer Hex package).
 */
export function mjmlToHtml(mjml: string): MjmlToHtmlResult {
  try {
    const result = mjml2html(mjml, {
      validationLevel: 'soft',
      minify: false,
    });

    return {
      html: result.html,
      errors: result.errors || [],
    };
  } catch (error) {
    return {
      html: '',
      errors: [
        {
          line: 0,
          message: error instanceof Error ? error.message : 'Unknown error',
          tagName: 'mjml',
          formattedMessage: `MJML compilation error: ${error}`,
        },
      ],
    };
  }
}

export default mjmlToHtml;
