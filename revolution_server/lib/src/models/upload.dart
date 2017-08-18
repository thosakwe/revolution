library revolution_server.src.models.upload;

import 'package:angel_model/angel_model.dart';
import 'package:angel_serialize/angel_serialize.dart';
// ignore: uri_has_not_been_generated
part 'upload.g.dart';

@serializable
class _Upload extends Model {
  String userId, mimeType, path;
}
