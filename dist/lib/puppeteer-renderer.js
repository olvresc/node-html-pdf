"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerRenderer = void 0;
const puppeteer_1 = require("puppeteer");
class PuppeteerRenderer {
    constructor(options = {}) {
        this.options = options;
        this.defaultOptions = {
            pdf: {
                format: 'A4',
            },
        };
    }
    async renderFromHtml(html) {
        var _a, _b, _c, _d;
        const { browser, page } = await this.getBrowserAndPage();
        await page.setContent(html, (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.navigation) !== null && _b !== void 0 ? _b : {});
        /*
        await page.goto(`data:text/html;base64,${Buffer.from(html).toString('base64')}`, {
          waitUntil: 'networkidle0',
        });
        */
        const pdfOptions = (_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.pdf) !== null && _d !== void 0 ? _d : {};
        const buffer = await page.pdf(Object.assign(Object.assign({}, this.defaultOptions), pdfOptions));
        await browser.close();
        return buffer;
    }
    /**
     *
     * @param path The file path to save the PDF to. If path is a relative path, then it is resolved relative to current
     * working directory. If no path is provided, the PDF won't be saved to the disk.
     */
    async renderFromHtmlToFile(html, path) {
        var _a, _b, _c, _d;
        const { browser, page } = await this.getBrowserAndPage();
        await page.setContent(html, (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.navigation) !== null && _b !== void 0 ? _b : {});
        /*
        await page.goto(`data:text/html;base64,${Buffer.from(html).toString('base64')}`, {
          waitUntil: 'networkidle0',
        });
        */
        const pdfOptions = (_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.pdf) !== null && _d !== void 0 ? _d : {};
        await page.pdf(Object.assign(Object.assign(Object.assign({}, this.defaultOptions), pdfOptions), { path }));
        await browser.close();
    }
    async getBrowserAndPage() {
        var _a, _b, _c;
        const browser = await puppeteer_1.launch((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.launch) !== null && _b !== void 0 ? _b : {});
        const page = await browser.newPage();
        if ((_c = this.options) === null || _c === void 0 ? void 0 : _c.emulateMedia) {
            await page.emulateMediaType(this.options.emulateMedia);
        }
        return { browser, page };
    }
}
exports.PuppeteerRenderer = PuppeteerRenderer;
//# sourceMappingURL=puppeteer-renderer.js.map