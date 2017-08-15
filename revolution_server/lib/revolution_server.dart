library revolution_server;

import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:angel_common/angel_common.dart';
import 'package:mock_request/mock_request.dart';
import 'package:mongo_dart/mongo_dart.dart';
import 'src/services/services.dart' as services;
import 'src/auth.dart' as auth;

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

  await app.configure(services.configureServer(db));
  await app.configure(auth.configureServer());

  // Sets up a static server (with caching support).
  // Defaults to serving out of 'web/'.
  // In production mode, it'll try to serve out of `build/web/`.
  //
  // https://github.com/angel-dart/static
  await app.configure(new CachingVirtualDirectory());

  // Routes in `app.after` will only run if the request was not terminated by a prior handler.
  // Usually, this is a situation in which you'll want to throw a 404 error.
  // On 404's, let's redirect the user to a pretty error page.
  app.after.add((RequestContext req, ResponseContext res) async {
    // Push state...
    if (!req.accepts(ContentType.HTML) ||
        req.uri.path.endsWith('.js') ||
        req.uri.path.endsWith('.index.html')) return true;

    var rq = new MockHttpRequest('GET', Uri.parse('index.html'));
    rq.close();
    var rs = rq.response;
    copyHeaders(req.io.headers, rq.headers);
    await app.handleRequest(rq);

    res.io
      ..statusCode = rs.statusCode
      ..headers.contentType = rs.headers.contentType;
    copyHeaders(rs.headers, res.io.headers);
    res
      ..willCloseItself = true
      ..end();
    await rs.pipe(res.io);
    return false;
  });

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
  if (app.isProduction)
    app.responseFinalizers.add(gzip());

  // Logs requests and errors to both console, and a file named `log.txt`.
  // https://github.com/angel-dart/diagnostics
  await app.configure(logRequests(new File('log.txt')));

  return app;
}
