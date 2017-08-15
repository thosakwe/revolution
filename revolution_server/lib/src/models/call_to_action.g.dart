// GENERATED CODE - DO NOT MODIFY BY HAND

part of revolution_server.src.models.call_to_action;

// **************************************************************************
// Generator: JsonModelGenerator
// Target: class _CallToAction
// **************************************************************************

class CallToAction extends _CallToAction {
  @override
  String id;

  @override
  DateTime createdAt;

  @override
  DateTime updatedAt;

  CallToAction({this.id, this.createdAt, this.updatedAt});

  factory CallToAction.fromJson(Map data) {
    return new CallToAction(
        id: data['id'],
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
        'created_at': createdAt == null ? null : createdAt.toIso8601String(),
        'updated_at': updatedAt == null ? null : updatedAt.toIso8601String()
      };

  static CallToAction parse(Map map) => new CallToAction.fromJson(map);

  CallToAction clone() {
    return new CallToAction.fromJson(toJson());
  }
}
