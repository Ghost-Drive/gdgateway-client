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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { recursive as exporter } from 'ipfs-unixfs-exporter';
import { decryptChunk } from '../decryptChunk';
import { convertBase64ToArrayBuffer } from '../utils/convertBase64ToArrayBuffer';
import { joinChunks } from '../utils/joinChunks';
import { chunkFile } from '../utils/chunkFile';
export function downloadFileFromSP(_a) {
    var carReader = _a.carReader, url = _a.url, isEncrypted = _a.isEncrypted, uploadChunkSize = _a.uploadChunkSize, key = _a.key, iv = _a.iv, file = _a.file, level = _a.level;
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_b) {
            return [2 /*return*/, fetch(url)
                    .then(function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, data.arrayBuffer()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); })
                    .then(function (blob) {
                    var uint8 = new Uint8Array(blob);
                    var reader = carReader.fromBytes(uint8);
                    return reader;
                })
                    .then(function (reader) { return __awaiter(_this, void 0, void 0, function () {
                    var roots, entries, typesEntries, fileBlob, _a, entries_1, entries_1_1, entry, cont, e_1_1;
                    var _b, e_1, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, reader.getRoots()];
                            case 1:
                                roots = _e.sent();
                                entries = exporter(roots[0], {
                                    get: function (cid) {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var block;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, reader.get(cid)];
                                                    case 1:
                                                        block = _a.sent();
                                                        return [2 /*return*/, block.bytes];
                                                }
                                            });
                                        });
                                    },
                                });
                                typesEntries = { count: {}, length: {} };
                                _e.label = 2;
                            case 2:
                                _e.trys.push([2, 9, 10, 15]);
                                _a = true, entries_1 = __asyncValues(entries);
                                _e.label = 3;
                            case 3: return [4 /*yield*/, entries_1.next()];
                            case 4:
                                if (!(entries_1_1 = _e.sent(), _b = entries_1_1.done, !_b)) return [3 /*break*/, 8];
                                _d = entries_1_1.value;
                                _a = false;
                                entry = _d;
                                if (!(entry.type === 'file' || entry.type === 'raw')) return [3 /*break*/, 6];
                                cont = entry.content();
                                return [4 /*yield*/, saveFileFromGenerator({
                                        generator: cont,
                                        type: file.mime,
                                        isEncrypted: isEncrypted,
                                        uploadChunkSize: uploadChunkSize,
                                        key: key,
                                        iv: iv,
                                        level: level,
                                    })];
                            case 5:
                                fileBlob = _e.sent();
                                typesEntries['count'][entry.type] =
                                    (typesEntries['count'][entry.type] || 0) + 1;
                                typesEntries['length'][entry.type] =
                                    // @ts-ignore
                                    (typesEntries['length'][entry.type] || 0) + entry.length;
                                return [3 /*break*/, 7];
                            case 6:
                                if (entry.type === 'directory') {
                                    typesEntries['count'][entry.type] =
                                        (typesEntries['count'][entry.type] || 0) + 1;
                                }
                                _e.label = 7;
                            case 7:
                                _a = true;
                                return [3 /*break*/, 3];
                            case 8: return [3 /*break*/, 15];
                            case 9:
                                e_1_1 = _e.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 15];
                            case 10:
                                _e.trys.push([10, , 13, 14]);
                                if (!(!_a && !_b && (_c = entries_1.return))) return [3 /*break*/, 12];
                                return [4 /*yield*/, _c.call(entries_1)];
                            case 11:
                                _e.sent();
                                _e.label = 12;
                            case 12: return [3 /*break*/, 14];
                            case 13:
                                if (e_1) throw e_1.error;
                                return [7 /*endfinally*/];
                            case 14: return [7 /*endfinally*/];
                            case 15: return [2 /*return*/, fileBlob];
                        }
                    });
                }); })
                    .catch(console.log)];
        });
    });
}
function saveFileFromGenerator(_a) {
    var _b, generator_1, generator_1_1;
    var _c, e_2, _d, _e, _f, e_3, _g, _h;
    var generator = _a.generator, type = _a.type, isEncrypted = _a.isEncrypted, uploadChunkSize = _a.uploadChunkSize, key = _a.key, iv = _a.iv, level = _a.level;
    return __awaiter(this, void 0, void 0, function () {
        var prev, chunk, e_2_1, blob, bufferKey, chunks, _j, _k, _l, _m, chunk, decryptedChunk, e_3_1, bufferKey, decryptedChunk, _o;
        var _p, _q, _r;
        var _this = this;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    prev = [];
                    _s.label = 1;
                case 1:
                    _s.trys.push([1, 6, 7, 12]);
                    _b = true, generator_1 = __asyncValues(generator);
                    _s.label = 2;
                case 2: return [4 /*yield*/, generator_1.next()];
                case 3:
                    if (!(generator_1_1 = _s.sent(), _c = generator_1_1.done, !_c)) return [3 /*break*/, 5];
                    _e = generator_1_1.value;
                    _b = false;
                    chunk = _e;
                    prev = __spreadArray(__spreadArray([], prev, true), [chunk], false);
                    _s.label = 4;
                case 4:
                    _b = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_2_1 = _s.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _s.trys.push([7, , 10, 11]);
                    if (!(!_b && !_c && (_d = generator_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _d.call(generator_1)];
                case 8:
                    _s.sent();
                    _s.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    blob = new Blob(prev, { type: type });
                    if (!isEncrypted) {
                        return [2 /*return*/, blob];
                    }
                    if (!(isEncrypted && (level === 'root' || level === 'interim'))) return [3 /*break*/, 27];
                    bufferKey = convertBase64ToArrayBuffer(key);
                    chunks = [];
                    _s.label = 13;
                case 13:
                    _s.trys.push([13, 20, 21, 26]);
                    _j = true;
                    _m = chunkFile;
                    _p = {};
                    _q = {};
                    return [4 /*yield*/, blob.arrayBuffer()];
                case 14:
                    _k = __asyncValues.apply(void 0, [_m.apply(void 0, [(_p.file = (_q.size = (_s.sent()).byteLength,
                                _q.arrayBuffer = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, blob.arrayBuffer()];
                                }); }); },
                                _q),
                                _p.uploadChunkSize = uploadChunkSize + 16,
                                _p)])]);
                    _s.label = 15;
                case 15: return [4 /*yield*/, _k.next()];
                case 16:
                    if (!(_l = _s.sent(), _f = _l.done, !_f)) return [3 /*break*/, 19];
                    _h = _l.value;
                    _j = false;
                    chunk = _h;
                    return [4 /*yield*/, decryptChunk({
                            chunk: chunk,
                            iv: iv,
                            key: bufferKey,
                        })];
                case 17:
                    decryptedChunk = _s.sent();
                    chunks.push(decryptedChunk);
                    _s.label = 18;
                case 18:
                    _j = true;
                    return [3 /*break*/, 15];
                case 19: return [3 /*break*/, 26];
                case 20:
                    e_3_1 = _s.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 26];
                case 21:
                    _s.trys.push([21, , 24, 25]);
                    if (!(!_j && !_f && (_g = _k.return))) return [3 /*break*/, 23];
                    return [4 /*yield*/, _g.call(_k)];
                case 22:
                    _s.sent();
                    _s.label = 23;
                case 23: return [3 /*break*/, 25];
                case 24:
                    if (e_3) throw e_3.error;
                    return [7 /*endfinally*/];
                case 25: return [7 /*endfinally*/];
                case 26: return [2 /*return*/, joinChunks(chunks)];
                case 27:
                    if (!(isEncrypted && level === 'upload')) return [3 /*break*/, 30];
                    bufferKey = convertBase64ToArrayBuffer(key);
                    _o = decryptChunk;
                    _r = {};
                    return [4 /*yield*/, blob.arrayBuffer()];
                case 28: return [4 /*yield*/, _o.apply(void 0, [(_r.chunk = _s.sent(),
                            _r.iv = iv,
                            _r.key = bufferKey,
                            _r)])];
                case 29:
                    decryptedChunk = _s.sent();
                    return [2 /*return*/, joinChunks([decryptedChunk])];
                case 30: return [2 /*return*/];
            }
        });
    });
}
