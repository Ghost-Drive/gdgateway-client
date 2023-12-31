var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import * as forge from 'node-forge';
import { sendChunk } from '../sendChunk';
import { encryptChunk } from '../encryptChunk';
import { chunkFile } from '../utils/chunkFile';
import { getCrypto } from '../utils/getCrypto';
var fileControllers = {};
var cancelledFiles = new Set();
var crypto = getCrypto();
export var uploadFile = function (_a) {
    var file = _a.file, oneTimeToken = _a.oneTimeToken, gateway = _a.gateway, callback = _a.callback, handlers = _a.handlers, key = _a.key, progress = _a.progress, totalSize = _a.totalSize, startedAt = _a.startedAt;
    return __awaiter(void 0, void 0, void 0, function () {
        var startTime, controller, clientsideKeySha3Hash, iv, totalProgress, currentIndex, result, fileKey, md, _b, _c, _d, chunk, finalChunk, e_1_1;
        var _e, e_1, _f, _g;
        var _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    startTime = startedAt || Date.now();
                    controller = new AbortController();
                    totalProgress = { number: progress || 0 };
                    currentIndex = 1;
                    fileControllers[file.uploadId] = controller;
                    if (cancelledFiles.has(file.uploadId)) {
                        fileControllers[file.uploadId].abort();
                        cancelledFiles.delete(file.uploadId);
                    }
                    if (key) {
                        fileKey = forge.random.getBytesSync(32);
                        md = forge.md.sha512.create();
                        md.update(fileKey);
                        clientsideKeySha3Hash = md.digest().toHex();
                        iv = crypto.getRandomValues(new Uint8Array(12));
                    }
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 9, 10, 15]);
                    _b = true, _c = __asyncValues(chunkFile({
                        file: file,
                        uploadChunkSize: gateway.upload_chunk_size,
                    }));
                    _k.label = 2;
                case 2: return [4 /*yield*/, _c.next()];
                case 3:
                    if (!(_d = _k.sent(), _e = _d.done, !_e)) return [3 /*break*/, 8];
                    _g = _d.value;
                    _b = false;
                    chunk = _g;
                    finalChunk = chunk;
                    if (!key) return [3 /*break*/, 5];
                    return [4 /*yield*/, encryptChunk({
                            chunk: chunk,
                            iv: iv,
                            key: key,
                        })];
                case 4:
                    finalChunk = _k.sent();
                    _k.label = 5;
                case 5: return [4 /*yield*/, sendChunk({
                        chunk: finalChunk,
                        index: currentIndex,
                        file: file,
                        startTime: startTime,
                        oneTimeToken: oneTimeToken,
                        gateway: gateway,
                        iv: iv,
                        clientsideKeySha3Hash: clientsideKeySha3Hash,
                        totalProgress: totalProgress,
                        callback: callback,
                        handlers: handlers,
                        controller: controller,
                        totalSize: totalSize,
                    })];
                case 6:
                    result = _k.sent();
                    if (result === null || result === void 0 ? void 0 : result.failed) {
                        delete fileControllers[file.uploadId];
                        totalProgress.number = 0;
                        return [2 /*return*/, result];
                    }
                    if ((_j = (_h = result === null || result === void 0 ? void 0 : result.data) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.slug) {
                        delete fileControllers[file.uploadId];
                        totalProgress.number = 0;
                        return [2 /*return*/, result];
                    }
                    currentIndex++;
                    _k.label = 7;
                case 7:
                    _b = true;
                    return [3 /*break*/, 2];
                case 8: return [3 /*break*/, 15];
                case 9:
                    e_1_1 = _k.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 15];
                case 10:
                    _k.trys.push([10, , 13, 14]);
                    if (!(!_b && !_e && (_f = _c.return))) return [3 /*break*/, 12];
                    return [4 /*yield*/, _f.call(_c)];
                case 11:
                    _k.sent();
                    _k.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 14: return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
};
export var cancelingUpload = function (uploadId) {
    if (fileControllers[uploadId]) {
        fileControllers[uploadId].abort();
    }
    else
        cancelledFiles.add(uploadId);
};
