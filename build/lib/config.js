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
var config_exports = {};
__export(config_exports, {
  NodeEnv: () => NodeEnv,
  default: () => loadConfig
});
var import_path = __toESM(require("path"));
var import_env_schema = __toESM(require("env-schema"));
var import_typebox = require("@sinclair/typebox");
var NodeEnv = /* @__PURE__ */ ((NodeEnv2) => {
  NodeEnv2["development"] = "development";
  NodeEnv2["test"] = "test";
  NodeEnv2["production"] = "production";
  return NodeEnv2;
})(NodeEnv || {});
const ConfigSchema = import_typebox.Type.Object({
  NODE_ENV: import_typebox.Type.Enum(NodeEnv),
  API_HOST: import_typebox.Type.String(),
  API_PORT: import_typebox.Type.String(),
  VRAM: import_typebox.Type.Optional(import_typebox.Type.Number())
});
function loadConfig() {
  var _a;
  const result = require("dotenv").config({
    path: import_path.default.join(__dirname, `../../.env.${(_a = process.env.NODE_ENV) != null ? _a : "development"}`)
  });
  if (result.error) {
    throw new Error(result.error);
  }
  (0, import_env_schema.default)({
    data: result.parsed,
    schema: import_typebox.Type.Strict(ConfigSchema)
  });
}
module.exports = __toCommonJS(config_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NodeEnv
});
//# sourceMappingURL=config.js.map
