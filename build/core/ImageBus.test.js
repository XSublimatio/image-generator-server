var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
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
var import_tap = __toESM(require("tap"));
var import_QueueItemBus = __toESM(require("../core/QueueItemBus"));
var import_prisma = __toESM(require("../lib/prisma"));
var import_ImageBus = __toESM(require("./ImageBus"));
let queueItemBus;
let imageBus;
let feedNewQueueItem;
import_tap.default.test("Test onNewQueueItem", (t) => {
  t.before(() => __async(exports, null, function* () {
    yield (0, import_prisma.startPrismaTest)();
    queueItemBus = new import_QueueItemBus.default();
    imageBus = new import_ImageBus.default();
    feedNewQueueItem = (queueItem) => imageBus.feedNewQueueItem(queueItem);
    queueItemBus.on("newQueueItem", feedNewQueueItem);
  }));
  t.teardown(() => __async(exports, null, function* () {
    queueItemBus.off("newQueueItem", feedNewQueueItem);
    yield (0, import_prisma.destroyPrismaTest)();
  }));
  t.plan(1);
  t.test("Should return hello world", (t2) => __async(exports, null, function* () {
    const tokenId = "1223321123";
    yield import_prisma.default.queue.create({ data: { tokenId } });
    imageBus.on("newImage", (receivedTokenId, imagePath) => {
      t2.equal(tokenId, receivedTokenId);
      t2.equal(`${process.env.PWD}/main/application.linux64/${tokenId}.png`, imagePath);
    });
  }));
});
//# sourceMappingURL=ImageBus.test.js.map
