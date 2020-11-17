import { HtmlToPdfOptions } from './html-to-pdf-options.interface';
import { PDF } from './pdf';
import { PuppeteerOptions } from './puppeteer-options.interface';
import { PuppeteerRenderer } from './puppeteer-renderer';

export function create(
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
