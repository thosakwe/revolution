library revolution_server.src.models.call_to_action;

import 'package:angel_model/angel_model.dart';
import 'package:angel_serialize/angel_serialize.dart';
// ignore: uri_has_not_been_generated
part 'call_to_action.g.dart';

@serializable
class _CallToAction extends Model {
  String userId, companyName, avatar, email, phoneNumber, twitter, facebook, message;
}
