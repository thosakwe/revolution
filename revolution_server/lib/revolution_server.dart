library revolution_server;

import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:angel_common/angel_common.dart';
import 'package:angel_websocket/server.dart';
import 'package:mock_request/mock_request.dart';
import 'package:mongo_dart/mongo_dart.dart';
import 'src/services/services.dart' as services;
import 'src/auth.dart' as auth;
import 'src/upload.dart' as upload;

/// Generates and configures an Angel server.
Future<Angel> createServer() async {
  var app = new Angel()
    ..injectSerializer(JSON.encode)
    ..lazyParseBodies = true;

  // Loads app configuration from 'config/'.
  // It supports loading from YAML files, and also supports loading a `.env` file.
  //
  // https://github.com/angel-dart/configuration
  await app.configure(loadConfigurationFile());

  var db = new Db(app.properties['mongo_db']);
  await db.open();

  if (!app.isProduction)
    app.before.add(cors());

  await app.configure(services.configureServer(db));
  await app.configure(auth.configureServer());

  var uploadsDir = new Directory('uploads');
  if (!await uploadsDir.exists()) await uploadsDir.create(recursive: true);
  await upload.configureServer(uploadsDir);

  // Sets up a static server (with caching support).
  // Defaults to serving out of 'web/'.
  // In production mode, it'll try to serve out of `build/web/`.
  //
  // https://github.com/angel-dart/static
  if (app.isProduction) {
    await app.configure(
      new CachingVirtualDirectory(
        source: new Directory('../revolution_web'),
        // Disable cache expiry... Might be dangerous!
        maxAge: null,
      ),
    );
  }

  // Routes in `app.after` will only run if the request was not terminated by a prior handler.
  // Usually, this is a situation in which you'll want to throw a 404 error.
  // On 404's, let's redirect the user to a pretty error page.
  if (app.isProduction) {
    app.after.add((RequestContext req, ResponseContext res) async {
      // Push state...
      if (!req.accepts(ContentType.HTML) ||
          req.uri.path.endsWith('.js') ||
          req.uri.path.endsWith('.index.html')) return true;

      print('Forward ${req.uri} => index.html (push-state)');
      var rq = new MockHttpRequest('GET', Uri.parse('index.html'));
      rq.close();
      var rs = rq.response;
      copyHeaders(req.io.headers, rq.headers);
      await app.handleRequest(rq);

      res
        ..statusCode = rs.statusCode
        ..contentType = rs.headers.contentType;

      rs.headers.forEach((k, v) {
        res.headers[k] = v.join(', ');
      });

      await rs.pipe(res);
      return false;
    });
  }

  app.after.add((RequestContext req, ResponseContext res) async {
    // Any other request should receive a 404
    var msg = '404 Not Found: ${req.io.requestedUri}';
    print(msg);
    res
      ..statusCode = HttpStatus.NOT_FOUND
      ..write(msg);
  });

  // Enable GZIP and DEFLATE compression (conserves bandwidth)
  // https://github.com/angel-dart/compress
  app.injectEncoders({
    'gzip': GZIP.encoder,
    'deflate': ZLIB.encoder,
  });

  // Instant WebSockets
  // TODO: Attach doNotBroadcast hooks...
  await app.configure(new AngelWebSocket(debug: !app.isProduction));

  // Logs requests and errors to both console, and a file named `log.txt`.
  // https://github.com/angel-dart/diagnostics
  await app.configure(logRequests(new File('log.txt')));

  return app;
}
