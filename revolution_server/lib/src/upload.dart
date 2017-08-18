import 'dart:io';
import 'package:angel_file_security/angel_file_security.dart';
import 'package:angel_framework/angel_framework.dart';
import 'package:image/image.dart';
import 'models/models.dart';

AngelConfigurer configureServer(Directory uploadDir) {
  return (Angel app) async {
    app.get('/upload/:id', (String id, ResponseContext res) async {
      var upload = await app.service('api/uploads').read(id).then(Upload.parse);
      var file = new File.fromUri(uploadDir.uri.resolve(upload.path));
      res.headers[HttpHeaders.CONTENT_TYPE] = upload.mimeType;
      await file.openRead().pipe(res);
    });

    // Force authenticated file uploads, and apply restrictions to incoming files.
    app.chain([
      'auth',
      restrictFileUploads(
        maxFiles: 1,
        maxFileSize: 5000000,
        allowedContentTypes: const [
          'image/jpeg',
          'image/png',
        ],
        allowedExtensions: const [
          '.jpg',
          '.jpeg',
          '.png',
        ],
      ),
    ]).post(
      '/api/cta/:ctaId/avatar',
          (User user, Service ctaService, Service uploadService,
          RequestContext req) async {
        var ctaId = req.params['ctaId'];
        var cta = await ctaService.read(ctaId).then(CallToAction.parse);

        if (cta.userId != user.id) throw new AngelHttpException.forbidden();

        var uploadedFile =
        req.files.firstWhere((f) => f.name == 'file', orElse: () => null);

        if (uploadedFile == null) throw new AngelHttpException.badRequest();

        var img = decodeImage(uploadedFile.data);

        if (img == null)
          throw new AngelHttpException.badRequest(message: 'Invalid image.');

        if (img.width > 500 || img.height > 500)
          throw new AngelHttpException.badRequest(
              message: 'Image exceeds the max dimensions of 500x500.');

        var upload = await uploadService.create({
          'user_id': user.id,
          'mime_type': uploadedFile.mimeType
        }).then(Upload.parse);

        var file = new File.fromUri(uploadDir.uri.resolve(upload.id));
        await file.writeAsBytes(uploadedFile.data);

        await ctaService.modify(cta.id, {'avatar': upload.id});

        // Return ID of upload...
        return upload.id;
      },
    );
  };
}
