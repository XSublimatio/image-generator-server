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
var new_image_exports = {};
__export(new_image_exports, {
  POST: () => POST
});
var import_typebox = require("@sinclair/typebox");
var import_prisma = __toESM(require("../../lib/prisma"));
const POST = function(req, res) {
  return __async(this, null, function* () {
    const { tokenId } = req.body;
    yield import_prisma.default.queue.create({ data: { tokenId } });
    res.code(202);
    return { success: true };
  });
};
POST.opts = {
  schema: {
    body: {
      tokenId: import_typebox.Type.String()
    },
    response: {
      202: import_typebox.Type.Object({
        success: import_typebox.Type.Boolean({ default: true })
      }),
      400: import_typebox.Type.Object({
        success: import_typebox.Type.Boolean({ default: false })
      }),
      500: import_typebox.Type.Object({
        success: import_typebox.Type.Boolean({ default: false })
      })
    }
  }
};
module.exports = __toCommonJS(new_image_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  POST
});
//# sourceMappingURL=new-image.js.map
