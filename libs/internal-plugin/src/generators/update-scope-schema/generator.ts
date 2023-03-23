import {
  formatFiles,
  getProjects,
  NxJsonConfiguration,
  ProjectConfiguration,
  Tree,
  updateJson,
  names
} from '@nrwl/devkit';

function getScopes(projectMap: Map<string, ProjectConfiguration>) {
  const projects: any[] = Array.from(projectMap.values());
  const allScopes: string[] = projects
    .map((project) =>
      project.tags
        // take only those that point to scope
        .filter((tag: string) => tag.startsWith('scope:'))
    )
    // flatten the array
    .reduce((acc, tags) => [...acc, ...tags], [])
    // remove prefix `scope:`
    .map((scope: string) => scope.slice(6));
  // remove duplicates
  return Array.from(new Set(allScopes));
}

function updateSchemaInterface(tree: Tree, scopes: string[]) {
  const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
  const interfaceDefinitionFilePath =
    'libs/internal-plugin/src/generators/util-lib/schema.d.ts';
  const newContent = `export interface UtilLibGeneratorSchema {
    name: string;
    directory: ${joinScopes};
  }`;
  tree.write(interfaceDefinitionFilePath, newContent);
}

export default async function (tree: Tree) {
  const projects = getProjects(tree);
  ensureTagExists(tree, projects);
  const scopes = getScopes(projects);
  updateSchemaInterface(tree, scopes);
  updateJson(tree, 'libs/internal-plugin/src/generators/util-lib/schema.json', (json) => {
    json.properties.directory.enum = scopes;
    json.properties.directory['x-prompt'].items = scopes
      .map(s => ({
        'value': s, 'label':
          names(s).className
      }));
    return json;
  });
  await formatFiles(tree);
}
function ensureTagExists(tree: Tree, projects: Map<string, ProjectConfiguration>) {
  for (const project of projects.values()) {
    if (!project.tags || project.tags.length === 0) {
      const scope = project.name.split('-')[0];
      project.tags = [`scope:${scope}`];
      updateJson(tree, `${project.root}/project.json`, (json) => {
        json.tags = project.tags;
        return json;
      });
    }
  }
}

