import * as pdf from '../lib';
import * as test from 'tape';
import { HtmlToPdfOptions } from '../lib/html-to-pdf-options.interface';
import { createWriteStream, existsSync, readFileSync, ReadStream, unlink } from 'fs';
import { join, resolve } from 'path';
const tapSpec = require('tap-spec');
const testFolder = resolve(__dirname, '../../test');
const html = readFileSync(join(testFolder, 'example.html'), 'utf8');

function noop(err) {
  if (err) {
    throw err;
  }
}

test.createStream().pipe(tapSpec()).pipe(process.stdout);

//
// API
//
test('pdf.create(html[, options]) throws an error when executing without html', function (t) {
  t.plan(3);

  t.throws(function () {
    pdf.create(null);
  }, 'pdf.create(null)');
  t.throws(function () {
    pdf.create(undefined);
  }, 'pdf.create(undefined)');
  t.throws(function () {
    pdf.create('');
  }, 'pdf.create("")');
});

// tslint:disable-next-line:max-line-length
test('pdf.create(html[, options], callback) returns error as first cb argument when executing without html', function (t) {
  t.plan(3);

  pdf.create(null, function (error) {
    t.assert(error instanceof Error, 'pdf.create(null, cb)');
  });

  pdf.create(undefined, function (error) {
    t.assert(error instanceof Error, 'pdf.create(undefined, cb)');
  });

  pdf.create('', function (error) {
    t.assert(error instanceof Error, 'pdf.create("", cb)');
  });
});

test('pdf.create(html[, options]).toFile([filename, ]callback)', function (t) {
  t.plan(5);

  pdf.create(html).toFile(function (err, _pdf: any) {
    t.error(err);
    t.assert(
      typeof _pdf.filename === 'string',
      `toFile(callback) returns {filename: '${_pdf.filename}'} as second cb argument`
    );
    unlink(_pdf.filename, noop);
  });

  const file = join(testFolder, 'simple.pdf');
  pdf.create(html).toFile(file, function (err, _pdf: any) {
    t.error(err);
    t.assert(
      _pdf.filename === file,
      `toFile(filename, callback) returns {filename: '${_pdf.filename}'} as second cb argument`
    );
    t.assert(existsSync(file), 'writes the file to the given destination');
  });
});

test('pdf.create(html).toBuffer(callback)', function (t) {
  t.plan(3);

  pdf.create(html).toBuffer(function (err, _pdf: any) {
    t.error(err);
    t.assert(Buffer.isBuffer(_pdf), 'toBuffer(callback) returns a buffer instance as second cb argument');
    t.assert(/^\%PDF-1.4/.test(_pdf.slice(0, 100).toString()), 'the PDF buffer has a PDF Header');
  });
});

test('pdf.create(html, {directory: "/tmp"}).toBuffer(callback)', function (t) {
  t.plan(2);

  pdf.create(html, { directory: '/tmp' }).toBuffer(function (err, _pdf: any) {
    t.error(err);
    t.assert(Buffer.isBuffer(_pdf), 'uses the passed directory as tmp dir');
  });
});

test('pdf.create(html, {renderDelay: 1000}).toBuffer(callback)', function (t) {
  t.plan(2);

  pdf.create(html, { renderDelay: 1000 }).toBuffer(function (err, _pdf: any) {
    t.error(err);
    t.assert(Buffer.isBuffer(_pdf), 'still returns after renderDelay');
  });
});

test('window.callPhantom renders page', function (t) {
  t.plan(3);

  const callbackHtml = readFileSync(join(testFolder, 'callback.html'), 'utf8');
  const file = join(testFolder, 'callback.pdf');
  const startTime = new Date().getTime();

  pdf.create(callbackHtml, { renderDelay: 'manual' }).toFile(file, function (err, _pdf: any) {
    const endTime = new Date().getTime();
    t.error(err);

    const time = endTime - startTime;
    t.assert(time > 1000 && time < 2000, 'rendered in response to callPhantom');
    t.assert(existsSync(file), 'writes the file to the given destination');
  });
});

test('pdf.create(html[, options]).toStream(callback)', function (t) {
  t.plan(3);

  pdf.create(html).toStream(function (err, stream) {
    t.error(err);
    t.assert(stream instanceof ReadStream, 'toStream(callback) returns a fs.ReadStream as second cb argument');
    const destination = join(testFolder, 'streamed.pdf');
    stream.pipe(createWriteStream(destination));
    stream.on('end', function () {
      t.assert(existsSync(destination), 'toStream returns a working readable stream');
      unlink(destination, noop);
    });
  });
});

test('allows invalid phantomPath', function (t) {
  t.plan(3);

  const filename = join(testFolder, 'invalid-phantomPath.pdf');

  const options = {
    phantomPath: '/bad/path/to/phantom',
  };

  pdf.create(html, options).toFile(filename, function (error, _pdf) {
    t.assert(error instanceof Error, 'Returns an error');
    t.equal(error.code, 'ENOENT', 'Error code is ENOENT');
    t.error(_pdf, 'PDF does not exist');
  });
});

test('allows custom page and footer options', function (t) {
  t.plan(3);

  const filename = join(testFolder, 'custom.pdf');
  const options: HtmlToPdfOptions = {
    width: '3in',
    height: '7in',
    footer: {
      contents: '<b style="color: red">page {{page}} of {{pages}}</b>',
    },
  };

  pdf.create(html, options).toFile(filename, function (error, _pdf) {
    t.error(error);
    t.assert(_pdf.filename === filename, 'Returns the filename from the phantom script');
    t.assert(existsSync(_pdf.filename), 'Saves the pdf with a custom page size and footer');
  });
});

test('allows different header and footer for first page', function (t) {
  t.plan(3);

  const enrichedHtml = readFileSync(join(testFolder, 'multiple-pages.html'), 'utf8');
  const filename = join(testFolder, 'multiple-pages.pdf');
  pdf.create(enrichedHtml, { quality: 100 }).toFile(filename, function (error, _pdf) {
    t.error(error);
    t.assert(_pdf.filename === filename, 'Returns the filename from the phantom script');
    t.assert(existsSync(_pdf.filename), 'Saves the pdf with a custom page size and footer');
  });
});

test('load external css', function (t) {
  t.plan(3);

  const enrichedHtml = readFileSync(join(testFolder, 'external-css.html'), 'utf8');
  const filename = join(testFolder, 'external-css.pdf');
  pdf.create(enrichedHtml).toFile(filename, function (error, _pdf) {
    t.error(error);
    t.assert(_pdf.filename === filename, 'Returns the filename from the phantom script');
    t.assert(existsSync(_pdf.filename), 'Saves the pdf with a custom page size and footer');
  });
});

test('load external js', function (t) {
  t.plan(3);

  const enrichedHtml = readFileSync(join(testFolder, 'external-js.html'), 'utf8');
  const filename = join(testFolder, 'external-js.pdf');
  pdf.create(enrichedHtml, { phantomArgs: ['--ignore-ssl-errors=true'] }).toFile(filename, function (error, _pdf) {
    t.error(error);
    t.assert(_pdf.filename === filename, 'Returns the filename from the phantom script');
    t.assert(existsSync(_pdf.filename), 'Saves the pdf with a custom page size and footer');
  });
});

test('load with cookies js', function (t) {
  t.plan(3);

  const server = require('http').createServer(function (req, res) {
    res.write(req.headers.cookie);
    res.end();
  });

  server.listen(0, function (err) {
    t.error(err, 'http server for iframe started');

    const port = server.address().port;
    const filename = join(testFolder, 'cookies.pdf');
    pdf
      .create(
        `
      <body>here is an iframe which receives the cookies
        <iframe src="http://localhost:${port}" width="400" height="100"></iframe>
      </body>
    `,
        {
          httpCookies: [
            {
              name: 'Valid-Cookie-Name',
              value: 'Valid-Cookie-Value',
              domain: 'localhost',
              path: '/',
            },
          ],
        }
      )
      .toFile(filename, function (error, _pdf) {
        server.close();
        t.error(error, 'There must be no render error');
        t.assert(existsSync(_pdf.filename), 'Saves the pdf');
      });
  });
});
