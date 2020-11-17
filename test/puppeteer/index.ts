import { existsSync } from 'fs';
import { readFile, unlink } from 'fs/promises';
import { resolve } from 'path';
import * as test from 'tape';
import { createPuppeteerRenderer } from '../../lib';

const tapSpec = require('tap-spec');
const asyncTest = require('mixed-tape')(test);
const testFolder = resolve(__dirname, '../../../test/puppeteer');

test.createStream().pipe(tapSpec()).pipe(process.stdout);
asyncTest.createStream().pipe(tapSpec()).pipe(process.stdout);

asyncTest(`can render ${testFolder}/example.html to buffer`, async t => {
  t.plan(2);

  const exampleHtml = await readFile(`${testFolder}/example.html`, { encoding: 'utf-8' });
  const renderer = createPuppeteerRenderer({});
  const buffer = await renderer.renderFromHtml(exampleHtml);

  t.assert(Buffer.isBuffer(buffer), 'result was buffer');
  t.assert(buffer.length > 0, 'buffer had content');

  t.end();
});

asyncTest(`can render ${testFolder}/example.html to file`, async t => {
  t.plan(2);
  const pdfPath = resolve(testFolder, 'example.pdf');

  if (existsSync(pdfPath)) {
    await unlink(pdfPath);
  }

  const exampleHtml = await readFile(`${testFolder}/example.html`, { encoding: 'utf-8' });
  const renderer = createPuppeteerRenderer({});

  await renderer.renderFromHtmlToFile(exampleHtml, resolve(testFolder, 'example.pdf'));

  t.assert(existsSync(pdfPath), 'file exists');

  const fileContentBuffer = await readFile(pdfPath);

  t.assert(fileContentBuffer.length, 'file has content');

  t.end();
});

asyncTest(`can render ${testFolder}/multiple-pages.html to buffer`, async t => {
  t.plan(2);

  const exampleHtml = await readFile(`${testFolder}/multiple-pages.html`, { encoding: 'utf-8' });
  const renderer = createPuppeteerRenderer({});
  const buffer = await renderer.renderFromHtml(exampleHtml);

  t.assert(Buffer.isBuffer(buffer), 'result was buffer');
  t.assert(buffer.length > 0, 'buffer had content');

  t.end();
});

asyncTest(`can render ${testFolder}/multiple-pages.html to file`, async t => {
  t.plan(2);
  const pdfPath = resolve(testFolder, 'multiple-pages.pdf');

  if (existsSync(pdfPath)) {
    await unlink(pdfPath);
  }

  const exampleHtml = await readFile(`${testFolder}/multiple-pages.html`, { encoding: 'utf-8' });
  const renderer = createPuppeteerRenderer({
    pdf: {},
  });

  await renderer.renderFromHtmlToFile(exampleHtml, resolve(testFolder, 'multiple-pages.pdf'));

  t.assert(existsSync(pdfPath), 'file exists');

  const fileContentBuffer = await readFile(pdfPath);

  t.assert(fileContentBuffer.length, 'file has content');

  t.end();
});
