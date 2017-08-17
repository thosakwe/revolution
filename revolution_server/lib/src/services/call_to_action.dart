library revolution_server.src.services.call_to_action;

import 'package:angel_framework/angel_framework.dart';
import 'package:angel_framework/hooks.dart' as hooks;
import 'package:angel_mongo/angel_mongo.dart';
import 'package:angel_security/hooks.dart' as auth;
import 'package:angel_validate/server.dart';
import 'package:mongo_dart/mongo_dart.dart';

final Validator ctaValidator = new Validator({
  'company_name*,message*': [isNonEmptyString]
});

AngelConfigurer configureServer(Db db) {
  return (Angel app) async {
    app.use('/api/cta', new MongoService(db.collection('cta')));

    var service = app.service('api/cta') as HookedService;

    service.before(
      [HookedServiceEvent.modified, HookedServiceEvent.removed],
      auth.restrictToOwner(ownerField: 'user_id'),
    );

    service.beforeCreated.listen(hooks.chainListeners([
      (HookedServiceEvent e) {
        if (e.data is! Map) throw new AngelHttpException.badRequest();
      },
      auth.restrictToAuthenticated(),
      validateEvent(ctaValidator),
      auth.associateCurrentUser(ownerField: 'user_id'),
      hooks.addCreatedAt(key: 'created_at'),
    ]));

    service.beforeModify(
      hooks.addUpdatedAt(key: 'updated_at'),
    );

    service.beforeUpdated.listen(
      hooks.disable(),
    );

    service.afterIndexed.listen((HookedServiceEvent e) {
      e.result.sort((Map a, Map b) {
        var aa = DateTime.parse(a['created_at']), bb = DateTime.parse(b['created_at']);
        return bb.compareTo(aa);
      });
    });
  };
}
