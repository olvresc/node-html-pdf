"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const test = require("tape");
const lib_1 = require("../../lib");
const tapSpec = require('tap-spec');
const asyncTest = require('mixed-tape')(test);
const testFolder = path_1.resolve(__dirname, '../../../test/puppeteer');
test.createStream().pipe(tapSpec()).pipe(process.stdout);
asyncTest.createStream().pipe(tapSpec()).pipe(process.stdout);
asyncTest(`can render ${testFolder}/example.html to buffer`, async (t) => {
    t.plan(2);
    const exampleHtml = await promises_1.readFile(`${testFolder}/example.html`, { encoding: 'utf-8' });
    const renderer = lib_1.createPuppeteerRenderer({});
    const buffer = await renderer.renderFromHtml(exampleHtml);
    t.assert(Buffer.isBuffer(buffer), 'result was buffer');
    t.assert(buffer.length > 0, 'buffer had content');
    t.end();
});
asyncTest(`can render ${testFolder}/example.html to file`, async (t) => {
    t.plan(2);
    const pdfPath = path_1.resolve(testFolder, 'example.pdf');
    if (fs_1.existsSync(pdfPath)) {
        await promises_1.unlink(pdfPath);
    }
    const exampleHtml = await promises_1.readFile(`${testFolder}/example.html`, { encoding: 'utf-8' });
    const renderer = lib_1.createPuppeteerRenderer({});
    await renderer.renderFromHtmlToFile(exampleHtml, path_1.resolve(testFolder, 'example.pdf'));
    t.assert(fs_1.existsSync(pdfPath), 'file exists');
    const fileContentBuffer = await promises_1.readFile(pdfPath);
    t.assert(fileContentBuffer.length, 'file has content');
    t.end();
});
asyncTest(`can render ${testFolder}/multiple-pages.html to buffer`, async (t) => {
    t.plan(2);
    const exampleHtml = await promises_1.readFile(`${testFolder}/multiple-pages.html`, { encoding: 'utf-8' });
    const renderer = lib_1.createPuppeteerRenderer({});
    const buffer = await renderer.renderFromHtml(exampleHtml);
    t.assert(Buffer.isBuffer(buffer), 'result was buffer');
    t.assert(buffer.length > 0, 'buffer had content');
    t.end();
});
asyncTest(`can render ${testFolder}/multiple-pages.html to file`, async (t) => {
    t.plan(2);
    const pdfPath = path_1.resolve(testFolder, 'multiple-pages.pdf');
    if (fs_1.existsSync(pdfPath)) {
        await promises_1.unlink(pdfPath);
    }
    const exampleHtml = await promises_1.readFile(`${testFolder}/multiple-pages.html`, { encoding: 'utf-8' });
    const renderer = lib_1.createPuppeteerRenderer({});
    await renderer.renderFromHtmlToFile(exampleHtml, path_1.resolve(testFolder, 'multiple-pages.pdf'));
    t.assert(fs_1.existsSync(pdfPath), 'file exists');
    const fileContentBuffer = await promises_1.readFile(pdfPath);
    t.assert(fileContentBuffer.length, 'file has content');
    t.end();
});
//# sourceMappingURL=index.js.map