// GENERATED CODE - DO NOT MODIFY BY HAND

part of revolution_server.src.models.upload;

// **************************************************************************
// Generator: JsonModelGenerator
// Target: class _Upload
// **************************************************************************

class Upload extends _Upload {
  @override
  String id;

  @override
  String userId;

  @override
  String mimeType;

  @override
  String path;

  @override
  DateTime createdAt;

  @override
  DateTime updatedAt;

  Upload(
      {this.id,
      this.userId,
      this.mimeType,
      this.path,
      this.createdAt,
      this.updatedAt});

  factory Upload.fromJson(Map data) {
    return new Upload(
        id: data['id'],
        userId: data['user_id'],
        mimeType: data['mime_type'],
        path: data['path'],
        createdAt: data['created_at'] is DateTime
            ? data['created_at']
            : (data['created_at'] is String
                ? DateTime.parse(data['created_at'])
                : null),
        updatedAt: data['updated_at'] is DateTime
            ? data['updated_at']
            : (data['updated_at'] is String
                ? DateTime.parse(data['updated_at'])
                : null));
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'user_id': userId,
        'mime_type': mimeType,
        'path': path,
        'created_at': createdAt == null ? null : createdAt.toIso8601String(),
        'updated_at': updatedAt == null ? null : updatedAt.toIso8601String()
      };

  static Upload parse(Map map) => new Upload.fromJson(map);

  Upload clone() {
    return new Upload.fromJson(toJson());
  }
}
