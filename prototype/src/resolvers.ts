import Toml from 'toml';
import FS from 'fs';
import Path from 'path';
import { promisify } from 'util';

const readFile = promisify(FS.readFile);

async function readToml(...pathComponents: string[]) {
  return Toml.parse((await readFile(Path.join(__dirname, 'resolvers', ...(pathComponents.map(a => `${a}`))) + '.toml')).toString())
}

function readTomlSync(...pathComponents: string[]) {
  return Toml.parse(FS.readFileSync(Path.join(__dirname, ...(pathComponents.map(a => `${a}`))) + '.toml').toString())
}

const baseToml = Toml.parse(FS.readFileSync(Path.join(__dirname, 'resolvers.toml')).toString())

export default {
  Query: makeTypeResolver(['currentMatch']),
  Match: makeTypeResolver(['currentGame', 'stats']),
  SideStats: makeTypeResolver(['players'])
};

function makeTypeResolver(fields: string[]) {
  const resolver = {}
  fields.forEach(field => {
    resolver[field] = makeFieldResolver(field)
  });
  return resolver
}

function makeFieldResolver(field: string) {
  return async function (parent: any, args: {}, context: {}, info: { parentType: { name: string }, returnType: { name: string, ofType: { name: string } } }) {
    if (info.parentType.name === 'Query') {
      parent = await baseToml['Query']
    }

    if (parent[field] == null) {
      return null
    }

    if (typeof parent[field] === 'string') {
      return baseToml[info.returnType.name][parent[field]]
    }
    else if (typeof parent[field] === 'number') {
      return baseToml[info.returnType.name][parent[field]]
    }
    else if (Array.isArray(parent[field])) {
      return parent[field].map(id => baseToml[info.returnType.ofType.name][id])
    }
    else {
      return parent[field]
    }
  }
}
