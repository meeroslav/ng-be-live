import {
  formatFiles,
  Tree,
} from '@nrwl/devkit';
import { UtilLibGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/js';

export default async function (tree: Tree, options: UtilLibGeneratorSchema) {
  libraryGenerator(tree, {
    name: `util-${options.name}`,
    directory: options.directory,
    tags: `type:util, scope:${options.directory}`
  });
  await formatFiles(tree);
}
