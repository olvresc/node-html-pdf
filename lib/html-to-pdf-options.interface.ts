/**
 * http://phantomjs.org/api/webpage/property/paper-size.html
 */
export interface HtmlToPdfOptions {
  /**
   * The directory the file gets written into if not using .toFile(filename, callback). default: '/tmp'
   */
  directory?: string;
  /**
   * Allowed units: mm, cm, in, px
   * Eg. '10.5in'
   * @see http://phantomjs.org/api/webpage/property/paper-size.html
   */
  height?: string;
  /**
   * Allowed units: mm, cm, in, px
   * Eg. '8in'
   * @see http://phantomjs.org/api/webpage/property/paper-size.html
   */
  width?: string;
  /**
   * Allowed units: A3, A4, A5, Legal, Letter, Tabloid
   * Eg. 'Letter'
   * @see http://phantomjs.org/api/webpage/property/paper-size.html
   */
  format?: string;
  /**
   * Allowed units: portrait or landscape
   * Eg. 'portrait'
   * @see http://phantomjs.org/api/webpage/property/paper-size.html
   */
  orientation?: string;
  /**
   * Default is 0, units: mm, cm, in, px
   */
  border?:
    | string
    | {
        /**
         * Default is 0, units: mm, cm, in, px
         */
        top?: string;
        /**
         * Default is 0, units: mm, cm, in, px
         */
        right?: string;
        /**
         * Default is 0, units: mm, cm, in, px
         */
        bottom?: string;
        /**
         * Default is 0, units: mm, cm, in, px
         */
        left?: string;
      };
  /**
   * Override the initial pagination number
   */
  paginationOffset?: number;
  header?: {
    height?: string;
    contents?: string;
  };
  footer?: {
    height?: string;
    contents?:
      | string
      | {
          /**
           * Fallback value
           */
          default: string;
          first: string;
          last: string;
          /**
           * Any page number is working. 1-based index
           */
          [idx: number]: string;
        };
  };
  /**
   * Base path that's used to load files (images, css, js) when they aren't referenced using a host
   * Eg. 'file:///home/www/your-asset-path'
   */
  base?: string;
  /**
   * Zooming option, can be used to scale images if `type` is not pdf
   * Default is 1
   */
  zoomFactor?: string;
  type?: 'png' | 'jpeg' | 'pdf';
  /**
   * Only used for types png & jpeg
   */
  quality?: number;
  /**
   * PhantomJS binary which should get downloaded automatically
   * Eg. './node_modules/phantomjs/bin/phantomjs'
   */
  phantomPath?: string;
  /**
   * Array of strings used as phantomjs args e.g. ["--ignore-ssl-errors=yes"]
   */
  phantomArgs?: string[];
  /**
   * Absolute path to a custom phantomjs script, use the file in lib/scripts as example
   * Eg. '/url'
   */
  script?: string;
  /**
   * Timeout that will cancel phantomjs, in milliseconds
   * Eg. 30000
   */
  timeout?: number;

  /**
   * Time we should wait after window load
   * Accepted values are 'manual', some delay in milliseconds or undefined to wait for a render event
   */
  renderDelay?: 'manual' | number | undefined;
  httpHeaders?: { [key: string]: string };
  /**
   * To run Node application as Windows service
   */
  childProcessOptions?: {
    detached: boolean;
  };
  /**
   * HTTP Cookies that are used for requests
   */
  httpCookies?: {
    name: string;
    value: string;
    path: string;
    domain?: string;
    httponly?: boolean;
    secure?: boolean;
    expires?: number;
  }[];
}
