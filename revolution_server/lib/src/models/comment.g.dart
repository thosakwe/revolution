// GENERATED CODE - DO NOT MODIFY BY HAND

part of revolution_server.src.models.comment;

// **************************************************************************
// Generator: JsonModelGenerator
// Target: class _Comment
// **************************************************************************

class Comment extends _Comment {
  @override
  String id;

  @override
  String userId;

  @override
  String ctaId;

  @override
  String text;

  @override
  DateTime createdAt;

  @override
  DateTime updatedAt;

  Comment(
      {this.id,
      this.userId,
      this.ctaId,
      this.text,
      this.createdAt,
      this.updatedAt});

  factory Comment.fromJson(Map data) {
    return new Comment(
        id: data['id'],
        userId: data['user_id'],
        ctaId: data['cta_id'],
        text: data['text'],
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
        'cta_id': ctaId,
        'text': text,
        'created_at': createdAt == null ? null : createdAt.toIso8601String(),
        'updated_at': updatedAt == null ? null : updatedAt.toIso8601String()
      };

  static Comment parse(Map map) => new Comment.fromJson(map);

  Comment clone() {
    return new Comment.fromJson(toJson());
  }
}
