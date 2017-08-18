library revolution_server.src.services.upload;

import 'package:angel_framework/angel_framework.dart';
import 'package:angel_framework/hooks.dart' as hooks;
import 'package:angel_mongo/angel_mongo.dart';
import 'package:mongo_dart/mongo_dart.dart';

AngelConfigurer configureServer(Db db) {
  return (Angel app) async {
    app.use('/api/uploads', new MongoService(db.collection('uploads')));

    var service = app.service('api/uploads') as HookedService;
    app.inject('uploadService', service);

    service.beforeAll(hooks.disable());

    service.beforeCreated.listen(hooks.chainListeners([
      hooks.addCreatedAt(key: 'created_at'),
      hooks.addUpdatedAt(key: 'updated_at'),
      (HookedServiceEvent e) async {
        // Set the path right after creation
        var created = await e.service.create(e.data, e.params);
        var modified =
            await e.service.modify(created['id'], {'path': created['id']});
        e.cancel(modified);
      },
    ]));
  };
}
