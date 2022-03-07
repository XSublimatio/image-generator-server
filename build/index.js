var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var src_exports = {};
__export(src_exports, {
  createServer: () => createServer,
  startServer: () => startServer
});
var import_path = __toESM(require("path"));
var import_fastify = __toESM(require("fastify"));
var import_fastify_now = __toESM(require("fastify-now"));
var import_config = __toESM(require("./lib/config"));
(0, import_config.default)();
function createServer() {
  return __async(this, null, function* () {
    const server = (0, import_fastify.default)({
      logger: {
        level: process.env.LOG_LEVEL
      }
    });
    server.register(import_fastify_now.default, {
      routesFolder: import_path.default.join(__dirname, "./routes")
    });
    yield server.ready();
    return server;
  });
}
function startServer() {
  return __async(this, null, function* () {
    process.on("unhandledRejection", (err) => {
      console.error(err);
      process.exit(1);
    });
    const server = yield createServer();
    yield server.listen(+process.env.API_PORT, process.env.API_HOST);
    for (const signal of ["SIGINT", "SIGTERM"]) {
      process.on(signal, () => server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      }));
    }
  });
}
if (process.env.NODE_ENV !== "test") {
  startServer();
}
module.exports = __toCommonJS(src_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createServer,
  startServer
});
//# sourceMappingURL=index.js.map
