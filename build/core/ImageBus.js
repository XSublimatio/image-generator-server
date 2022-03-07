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
var ImageBus_exports = {};
__export(ImageBus_exports, {
  default: () => ImageBus_default
});
var import_prisma = __toESM(require("../lib/prisma"));
var import_queue_ts = __toESM(require("queue-ts"));
var import_ethers = require("ethers");
var import_child_process = require("child_process");
var import_xsublimatio_smart_contracts = require("@faction-nfts/xsublimatio-smart-contracts");
var import_tiny_typed_emitter = require("tiny-typed-emitter");
class ImageBus extends import_tiny_typed_emitter.TypedEmitter {
  constructor() {
    super();
    this.queue = new import_queue_ts.default.Queue(1);
    this.addToQueue = this.addToQueue.bind(this);
  }
  start() {
    return __async(this, null, function* () {
      const queueItems = (yield import_prisma.default.queue.findMany()) || [];
      queueItems.forEach(this.addToQueue);
    });
  }
  feedNewQueueItem(queueItem) {
    this.addToQueue(queueItem);
  }
  addToQueue(queueItem) {
    this.queue.add(() => this.createImg(queueItem));
  }
  createImg(queueItem) {
    return __async(this, null, function* () {
      const bnTokenId = import_ethers.BigNumber.from(queueItem.tokenId);
      const token = (0, import_xsublimatio_smart_contracts.getTokenFromId)(bnTokenId);
      const processedMoleculeName = processName(token.name);
      try {
        yield (0, import_child_process.exec)(`
        ${process.env.PWD}/img-generator/main --seed=${token.seed} --molecule=${processedMoleculeName} --filename=${queueItem.tokenId} --sync
      `);
        this.emit("newImage", queueItem.tokenId, `${process.env.PWD}/build/output/${queueItem.tokenId}.png`);
      } catch (e) {
        import_prisma.default.queue.update({
          where: { id: queueItem.id },
          data: { failed: true }
        });
      }
    });
  }
}
var ImageBus_default = ImageBus;
const processName = (name) => name.toLowerCase().replace("-", "").split(" ")[0];
module.exports = __toCommonJS(ImageBus_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=ImageBus.js.map
