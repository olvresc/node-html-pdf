import { LaunchOptions, NavigationOptions, PDFOptions, MediaType } from 'puppeteer';

export interface PuppeteerOptions {
  emulateMedia?: MediaType;
  launch?: LaunchOptions;
  navigation?: NavigationOptions;
  pdf?: PDFOptions;
}
