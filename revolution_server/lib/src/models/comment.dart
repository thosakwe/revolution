library revolution_server.src.models.comment;

import 'package:angel_model/angel_model.dart';
import 'package:angel_serialize/angel_serialize.dart';
// ignore: uri_has_not_been_generated
part 'comment.g.dart';

@serializable
class _Comment extends Model {
  String userId, ctaId, text;
}
