"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPuppeteerRenderer = exports.create = void 0;
const pdf_1 = require("./pdf");
const puppeteer_renderer_1 = require("./puppeteer-renderer");
function create(html, options, callback) {
    if (!options && !callback) {
        return new pdf_1.PDF(html);
    }
    if (options && typeof options !== 'function') {
        return new pdf_1.PDF(html, options);
    }
    if (options && typeof options === 'function') {
        try {
            const pdf = new pdf_1.PDF(html, {});
            pdf.exec(options);
        }
        catch (err) {
            return options(err);
        }
    }
    try {
        const pdf = new pdf_1.PDF(html, options);
        pdf.exec(callback);
    }
    catch (err) {
        return callback(err);
    }
}
exports.create = create;
function createPuppeteerRenderer(options) {
    const renderer = new puppeteer_renderer_1.PuppeteerRenderer(options);
    return renderer;
}
exports.createPuppeteerRenderer = createPuppeteerRenderer;
//# sourceMappingURL=index.js.map