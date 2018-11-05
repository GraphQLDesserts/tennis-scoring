import Toml from 'toml';
import FS from 'fs';
import Path from 'path';
import { promisify } from 'util';

const readFile = promisify(FS.readFile);

async function readToml(...pathComponents: string[]) {
  return Toml.parse((await readFile(Path.join(__dirname, 'resolvers', ...(pathComponents.map(a => `${a}`))) + '.toml')).toString())
}

function makeTypeResolver(fields: string[]) {
  return fields.reduce(
    (resolver, field) => {
      resolver[field] = async function(parent, args, context, info) {
        if (info.parentType.name === 'Query') {
          parent = await readToml('Query')
        }

        if (parent[field] == null) {
          return null
        }

        if (typeof parent[field] === 'string' || typeof parent[field] === 'number') {
          return await readToml(info.returnType.name, parent[field])
        }
        else if (Array.isArray(parent[field])) {
          return await Promise.all(parent[field].map(id => readToml(info.returnType.ofType.name, id)))
        }
        else {
          return parent[field]
        }
      }
      return resolver
    }, {}
  );
}

export default {
  Query: makeTypeResolver(['currentMatch']),
  Match: makeTypeResolver(['currentGame', 'stats']),
  SideStats: makeTypeResolver(['players']),
};
