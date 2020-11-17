const internalPDF = require('./pdf');
module.exports = {
    create: function createPdf(html, options, callback) {
        if (arguments.length === 1) {
            return new internalPDF(html);
        }
        if (arguments.length === 2 && typeof options !== 'function') {
            return new internalPDF(html, options);
        }
        if (arguments.length === 2) {
            callback = options;
            options = {};
        }
        try {
            var pdf = new internalPDF(html, options);
        }
        catch (err) {
            return callback(err);
        }
        pdf.exec(callback);
    },
};
//# sourceMappingURL=index.js.map