import { HtmlToPdfOptions } from './html-to-pdf-options.interface';
import { PDF } from './pdf';
import { PuppeteerOptions } from './puppeteer-options.interface';
import { PuppeteerRenderer } from './puppeteer-renderer';

/*
 * Create a PDF file out of an html string.
 *
 * Regions for the PDF page are:
 *
 * - Page Header  -> document.getElementById('pageHeader')
 * - Page Content -> document.getElementById('pageContent')
 * - Page Footer  -> document.getElementById('pageFooter')
 *
 * When no #pageContent is available, phantomjs will use document.body as pdf content
 */
export function create(
  html: string,
  options?: HtmlToPdfOptions | ((err: any, result?: any) => void),
  callback?: (err: any, result?: any) => void
) {
  return createPhantomJsRenderer(html, options, callback);
}

/*
 * Create a PDF file out of an html string.
 *
 * Regions for the PDF page are:
 *
 * - Page Header  -> document.getElementById('pageHeader')
 * - Page Content -> document.getElementById('pageContent')
 * - Page Footer  -> document.getElementById('pageFooter')
 *
 * When no #pageContent is available, phantomjs will use document.body as pdf content
 */
export function createPhantomJsRenderer(
  html: string,
  options?: HtmlToPdfOptions | ((err: any, result?: any) => void),
  callback?: (err: any, result?: any) => void
) {
  if (!options && !callback) {
    return new PDF(html);
  }

  if (options && typeof options !== 'function') {
    return new PDF(html, options);
  }

  if (options && typeof options === 'function') {
    try {
      const pdf = new PDF(html, {});
      pdf.exec(options);
    } catch (err) {
      return options(err);
    }
  }

  try {
    const pdf = new PDF(html, options as HtmlToPdfOptions);
    pdf.exec(callback);
  } catch (err) {
    return callback(err);
  }
}

export function createPuppeteerRenderer(options?: PuppeteerOptions) {
  const renderer = new PuppeteerRenderer(options);

  return renderer;
}
