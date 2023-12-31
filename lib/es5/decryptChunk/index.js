"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptChunk = void 0;
var convertBase64ToArrayBuffer_1 = require("../utils/convertBase64ToArrayBuffer");
var getFibonacciNumber_1 = require("../utils/getFibonacciNumber");
var getCrypto_1 = require("../utils/getCrypto");
var config_1 = require("../config");
var crypto = (0, getCrypto_1.getCrypto)();
var decryptChunk = function (_a) {
    var chunk = _a.chunk, iv = _a.iv, key = _a.key;
    return __awaiter(void 0, void 0, void 0, function () {
        var activationKey, ivBufferSource, normalizedIv, currentTry, decrypt;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, crypto.subtle.importKey("raw", key, {
                        name: "AES-GCM",
                        length: 256,
                    }, true, ["encrypt", "decrypt"])];
                case 1:
                    activationKey = _b.sent();
                    ivBufferSource = (0, convertBase64ToArrayBuffer_1.convertBase64ToArrayBuffer)(iv);
                    normalizedIv = new Uint8Array(ivBufferSource);
                    currentTry = 1;
                    decrypt = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var response, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                        setTimeout(function () {
                                            resolve();
                                        }, currentTry === 1 ? 0 : (0, getFibonacciNumber_1.getFibonacciNumber)(currentTry) * 1000);
                                    })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, crypto.subtle.decrypt({
                                            name: "AES-GCM",
                                            iv: normalizedIv,
                                        }, activationKey, chunk)];
                                case 3:
                                    response = _a.sent();
                                    if (currentTry > 1) {
                                        currentTry = 1;
                                    }
                                    return [2 /*return*/, response];
                                case 4:
                                    error_1 = _a.sent();
                                    if (currentTry >= config_1.MAX_DECRYPTION_TRIES) {
                                        currentTry = 1;
                                        return [2 /*return*/, { failed: true }];
                                    }
                                    currentTry++;
                                    return [2 /*return*/, decrypt()];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, decrypt()];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
exports.decryptChunk = decryptChunk;
