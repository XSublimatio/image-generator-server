var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var prisma_exports = {};
__export(prisma_exports, {
  default: () => prisma_default,
  destroyPrismaTest: () => destroyPrismaTest,
  startPrismaTest: () => startPrismaTest
});
var import_client = require("@prisma/client");
var import_child_process = require("child_process");
var import_path = require("path");
var import_uuid = require("uuid");
const prisma = new import_client.PrismaClient();
var prisma_default = prisma;
const cwd = (0, import_path.join)(__dirname, "..", "..");
const startPrismaTest = () => __async(void 0, null, function* () {
  const uuid = (0, import_uuid.v4)();
  yield prisma.$disconnect();
  process.env.DATABASE_URL = process.env.DATABASE_URL + `-test-${uuid}`;
  const cwd2 = (0, import_path.join)(__dirname, "..", "..");
  (0, import_child_process.execSync)("npx prisma db push --force-reset", {
    cwd: cwd2,
    env: process.env
  });
  yield prisma.$connect();
});
const destroyPrismaTest = () => __async(void 0, null, function* () {
  prisma.$disconnect();
});
module.exports = __toCommonJS(prisma_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  destroyPrismaTest,
  startPrismaTest
});
//# sourceMappingURL=prisma.js.map
