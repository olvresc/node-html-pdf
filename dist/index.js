"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    create(html, options, callback) {
        const { PDF } = require('./pdf');
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
            }
            catch (err) {
                return options(err);
            }
        }
        try {
            const pdf = new PDF(html, options);
            pdf.exec(callback);
        }
        catch (err) {
            return callback(err);
        }
    },
    createWithPuppeteer() { },
};
//# sourceMappingURL=index.js.map