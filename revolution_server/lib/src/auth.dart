import 'package:angel_auth/angel_auth.dart';
import 'package:angel_auth_twitter/angel_auth_twitter.dart';
import 'package:angel_framework/angel_framework.dart';
import 'package:twit/twit.dart';
import 'models/user.dart';

AngelConfigurer configureServer() {
  return (Angel app) async {
    verifier(TwitBase twit) async {
      var userService = app.service('api/users');

      var userInfo = await twit.get('/account/verify_credentials.json');
      String twitterId = userInfo['id_str'],
          screenName = userInfo['screen_name'],
          avatar = userInfo['profile_image_url_https'];
      var accountData = {
        'twitter_id': twitterId,
        'name': screenName,
        'avatar': avatar,
      };

      Iterable<User> users = await userService.index({
        'query': {
          'twitter_id': twitterId,
        }
      }).then(
        (u) => u.map(User.parse),
      );

      var existing =
          users.firstWhere((u) => u.twitterId == twitterId, orElse: () => null);

      if (existing != null) {
        return await userService
            .modify(existing.id, accountData)
            .then(User.parse);
      } else {
        return await userService.create(accountData).then(User.parse);
      }
    }

    var auth = new AngelAuth<User>(
        jwtKey: app.properties['jwt_secret'], allowCookie: false);
    auth.strategies
        .add(new TwitterStrategy(verifier, config: app.properties['twitter']));
    auth.serializer = (User u) => u.id;
    auth.deserializer =
        (String id) => app.service('api/users').read(id).then(User.parse);
    await app.configure(auth);

    app.get('/auth/twitter', auth.authenticate('twitter'));
    app.get(
      '/auth/twitter/callback',
      auth.authenticate(
        'twitter',
        new AngelAuthOptions(
          callback: confirmPopupAuthentication(),
        ),
      ),
    );
  };
}
