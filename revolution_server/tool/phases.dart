import 'package:angel_serialize_generator/angel_serialize_generator.dart';
import 'package:build_runner/build_runner.dart';
import 'package:source_gen/source_gen.dart';

final InputSet inputSet = new InputSet('revolution_server', const [
  'lib/src/models/*.dart',
]);

final PhaseGroup phaseGroup = new PhaseGroup.singleAction(
  new GeneratorBuilder([
    new JsonModelGenerator(),
  ]),
  inputSet,
);
