module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/graphpack/config/index.js":
/*!************************************************!*\
  !*** ./node_modules/graphpack/config/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const cosmiconfig = __webpack_require__(/*! cosmiconfig */ "cosmiconfig");

const webpack = __webpack_require__(/*! webpack */ "webpack");

const defaultConfig = __webpack_require__(/*! ./webpack.config */ "./node_modules/graphpack/config/webpack.config.js");

const explorer = cosmiconfig('graphpack').search();

const loadServerConfig = async () => {
  const result = await explorer;
  const userConfig = result ? typeof result.config === 'function' ? result.config(defaultConfig.mode) : result.config : {};
  return {
    port: Number(process.env.PORT),
    ...userConfig.server
  };
};

const loadWebpackConfig = async () => {
  const result = await explorer;
  const userConfig = result ? typeof result.config === 'function' ? result.config(defaultConfig.mode) : result.config : {};

  if (typeof userConfig.webpack === 'function') {
    return userConfig.webpack({
      config: defaultConfig,
      webpack
    });
  }

  return { ...defaultConfig,
    ...userConfig.webpack
  };
};

exports.loadServerConfig = loadServerConfig;
exports.loadWebpackConfig = loadWebpackConfig;

/***/ }),

/***/ "./node_modules/graphpack/config/webpack.config.js":
/*!*********************************************************!*\
  !*** ./node_modules/graphpack/config/webpack.config.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const FriendlyErrorsWebpackPlugin = __webpack_require__(/*! friendly-errors-webpack-plugin */ "friendly-errors-webpack-plugin");

const fs = __webpack_require__(/*! fs */ "fs");

const path = __webpack_require__(/*! path */ "path");

const webpack = __webpack_require__(/*! webpack */ "webpack");

const nodeExternals = __webpack_require__(/*! webpack-node-externals */ "webpack-node-externals");

const IS_DEV = "development" !== 'production';
const hasBabelRc = fs.existsSync(path.resolve('babel.config.js'));

if (hasBabelRc) {
  console.info('🐠 Using babel.config.js defined in your app root');
}

module.exports = {
  devtool: IS_DEV ? 'sourcemap' : 'none',
  entry: {
    // We take care of setting up entry file under lib/index.js
    index: ['graphpack']
  },
  // When bundling with Webpack for the backend you usually don't want to bundle
  // its node_modules dependencies. This creates an externals function that
  // ignores node_modules when bundling in Webpack.
  externals: [nodeExternals({
    whitelist: [/^graphpack$/]
  })],
  mode: IS_DEV ? 'development' : 'production',
  module: {
    rules: [{
      test: /\.(gql|graphql)/,
      use: 'graphql-tag/loader'
    }, {
      test: /\.(js|ts)$/,
      use: [{
        loader: /*require.resolve*/(/*! babel-loader */ "babel-loader"),
        options: {
          babelrc: true,
          cacheDirectory: true,
          presets: hasBabelRc ? undefined : [/*require.resolve*/(/*! babel-preset-graphpack */ "babel-preset-graphpack")]
        }
      }]
    }, {
      test: /\.mjs$/,
      type: 'javascript/auto'
    }]
  },
  node: {
    __filename: true,
    __dirname: true
  },
  optimization: {
    noEmitOnErrors: true
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(process.cwd(), './build'),
    sourceMapFilename: '[name].map'
  },
  performance: {
    hints: false
  },
  plugins: [new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1
  }), new webpack.EnvironmentPlugin({
    DEBUG: false,
    GRAPHPACK_SRC_DIR: path.resolve(process.cwd(), 'src'),
    NODE_ENV: 'development'
  }), new FriendlyErrorsWebpackPlugin({
    clearConsole: IS_DEV
  })],
  resolve: {
    extensions: ['.ts', '.js']
  },
  stats: 'minimal',
  target: 'node'
};

/***/ }),

/***/ "./node_modules/graphpack/lib/server.js":
/*!**********************************************!*\
  !*** ./node_modules/graphpack/lib/server.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-server */ "apollo-server");
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _srcFiles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./srcFiles */ "./node_modules/graphpack/lib/srcFiles.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config */ "./node_modules/graphpack/config/index.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_config__WEBPACK_IMPORTED_MODULE_2__);




if (!(_srcFiles__WEBPACK_IMPORTED_MODULE_1__["resolvers"] && Object.keys(_srcFiles__WEBPACK_IMPORTED_MODULE_1__["resolvers"]).length > 0)) {
  throw Error(`Couldn't find any resolvers. Please add resolvers to your src/resolvers.js`);
}

const createOptions = serverConfig => {
  if (serverConfig) {
    const {
      context: _context,
      resolvers: _resolvers,
      typeDefs: _typeDefs,
      applyMiddleware,
      ...options
    } = serverConfig;
    return options;
  }

  return {};
};

const startServer = async () => {
  // Load server config from graphpack.config.js
  const serverConfig = await Object(_config__WEBPACK_IMPORTED_MODULE_2__["loadServerConfig"])();
  const options = createOptions(serverConfig);
  const server = new apollo_server__WEBPACK_IMPORTED_MODULE_0__["ApolloServer"]({ ...options,
    context: _srcFiles__WEBPACK_IMPORTED_MODULE_1__["context"],
    typeDefs: _srcFiles__WEBPACK_IMPORTED_MODULE_1__["typeDefs"],
    resolvers: _srcFiles__WEBPACK_IMPORTED_MODULE_1__["resolvers"]
  }); // Apply user provided middlewares

  if (serverConfig && serverConfig.applyMiddleware && serverConfig.applyMiddleware.app) {
    server.applyMiddleware(applyMiddleware);
  }

  server.listen({
    port: Number(process.env.PORT) || serverConfig && serverConfig.port ? serverConfig.port : 4000
  }).then(({
    url
  }) => console.log(`🚀 Server ready at ${url}`));
};

startServer();

/***/ }),

/***/ "./node_modules/graphpack/lib/srcFiles.js":
/*!************************************************!*\
  !*** ./node_modules/graphpack/lib/srcFiles.js ***!
  \************************************************/
/*! exports provided: importFirst, context, resolvers, typeDefs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importFirst", function() { return importFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "context", function() { return context; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolvers", function() { return resolvers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeDefs", function() { return typeDefs; });
const importFirst = req => req.keys().map(mod => req(mod).default || req(mod))[0]; // Optionally import modules

const context = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$"));
const resolvers = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$"));
const typeDefs = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$"));

/***/ }),

/***/ "./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$":
/*!**********************************************************!*\
  !*** ./src sync ^\.\/(context|context\/index)\.(js|ts)$ ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$";

/***/ }),

/***/ "./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$":
/*!**************************************************************!*\
  !*** ./src sync ^\.\/(resolvers|resolvers\/index)\.(js|ts)$ ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./resolvers.ts": "./src/resolvers.ts"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$";

/***/ }),

/***/ "./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$":
/*!********************************************************************!*\
  !*** ./src sync ^\.\/(schema|schema\/index)\.(gql|graphql|js|ts)$ ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./schema.graphql": "./src/schema.graphql"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$";

/***/ }),

/***/ "./src/resolvers.ts":
/*!**************************!*\
  !*** ./src/resolvers.ts ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var toml__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! toml */ "toml");
/* harmony import */ var toml__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(toml__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! util */ "util");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_3__);




const readFile = Object(util__WEBPACK_IMPORTED_MODULE_3__["promisify"])(fs__WEBPACK_IMPORTED_MODULE_1___default.a.readFile);

async function readToml(...pathComponents) {
  return toml__WEBPACK_IMPORTED_MODULE_0___default.a.parse((await readFile(path__WEBPACK_IMPORTED_MODULE_2___default.a.join(__dirname, 'resolvers', ...pathComponents.map(a => `${a}`)) + '.toml')).toString());
}

function makeTypeResolver(fields) {
  return fields.reduce((resolver, field) => {
    resolver[field] = async function (parent, args, context, info) {
      if (info.parentType.name === 'Query') {
        parent = await readToml('Query');
      }

      if (parent[field] == null) {
        return null;
      }

      if (typeof parent[field] === 'string' || typeof parent[field] === 'number') {
        return await readToml(info.returnType.name, parent[field]);
      } else if (Array.isArray(parent[field])) {
        return await Promise.all(parent[field].map(id => readToml(info.returnType.ofType.name, id)));
      } else {
        return parent[field];
      }
    };

    return resolver;
  }, {});
}

/* harmony default export */ __webpack_exports__["default"] = ({
  Query: makeTypeResolver(['currentMatch']),
  Match: makeTypeResolver(['currentGame', 'stats']),
  SideStats: makeTypeResolver(['players'])
});
/* WEBPACK VAR INJECTION */}.call(this, "src"))

/***/ }),

/***/ "./src/schema.graphql":
/*!****************************!*\
  !*** ./src/schema.graphql ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"currentMatch"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Match"}},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"Side"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"SIDE_A"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"SIDE_B"},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Match"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"winner"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Side"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"currentGame"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stats"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SideStats"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Game"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"servingSide"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Side"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"pointsWon"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GamePointsWon"}}}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"GamePointsWon"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"count"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"side"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Side"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SideStats"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"side"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Side"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"players"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlayerStats"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"PlayerStats"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"breakpoints"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PlayerStatsBreakpoints"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"aces"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PlayerStatsAces"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"doubleFaults"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PlayerStatsDoubleFaults"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"PlayerStatsBreakpoints"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"totalCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"wonCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"PlayerStatsAces"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"count"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"PlayerStatsDoubleFaults"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"count"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"UnionTypeDefinition","name":{"kind":"Name","value":"MatchStats"},"directives":[],"types":[{"kind":"NamedType","name":{"kind":"Name","value":"PlayerStats"}}]}],"loc":{"start":0,"end":627}};
    doc.loc.source = {"body":"type Query {\n  currentMatch: Match\n}\n\nenum Side {\n  SIDE_A\n  SIDE_B\n}\n\ntype Match {\n  winner: Side\n  currentGame: Game\n  stats: [SideStats]\n}\n\ntype Game {\n  servingSide: Side!\n  pointsWon: [GamePointsWon!]!\n}\n\ntype GamePointsWon {\n  count: Int!\n  side: Side!\n}\n\ntype SideStats {\n  side: Side\n  players: [PlayerStats]\n}\n\ntype PlayerStats {\n  breakpoints: PlayerStatsBreakpoints\n  aces: PlayerStatsAces\n  doubleFaults: PlayerStatsDoubleFaults\n}\n\ntype PlayerStatsBreakpoints {\n  totalCount: Int\n  wonCount: Int\n}\n\ntype PlayerStatsAces {\n  count: Int\n}\n\ntype PlayerStatsDoubleFaults {\n  count: Int\n}\n\nunion MatchStats = PlayerStats","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

      module.exports = doc;
    


/***/ }),

/***/ 0:
/*!***********************!*\
  !*** multi graphpack ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! graphpack */"./node_modules/graphpack/lib/server.js");


/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server");

/***/ }),

/***/ "babel-loader":
/*!*******************************!*\
  !*** external "babel-loader" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-loader");

/***/ }),

/***/ "babel-preset-graphpack":
/*!*****************************************!*\
  !*** external "babel-preset-graphpack" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-preset-graphpack");

/***/ }),

/***/ "cosmiconfig":
/*!******************************!*\
  !*** external "cosmiconfig" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cosmiconfig");

/***/ }),

/***/ "friendly-errors-webpack-plugin":
/*!*************************************************!*\
  !*** external "friendly-errors-webpack-plugin" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("friendly-errors-webpack-plugin");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "toml":
/*!***********************!*\
  !*** external "toml" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("toml");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),

/***/ "webpack-node-externals":
/*!*****************************************!*\
  !*** external "webpack-node-externals" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-node-externals");

/***/ })

/******/ });
//# sourceMappingURL=index.map