library revolution_server.src.models.user;

import 'package:angel_model/angel_model.dart';
import 'package:angel_serialize/angel_serialize.dart';
// ignore: uri_has_not_been_generated
part 'user.g.dart';

@serializable
class _User extends Model {
  String twitterId, name, avatar;
}
