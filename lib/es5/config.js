"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ONE_MB = exports.ALL_FILE_DOWNLOAD_MAX_SIZE = exports.ERRORS = exports.FILE_ACTION_TYPES = exports.MAX_DECRYPTION_TRIES = exports.MAX_TRIES_502 = exports.MAX_TRIES = void 0;
exports.MAX_TRIES = 16;
exports.MAX_TRIES_502 = 8;
exports.MAX_DECRYPTION_TRIES = 6;
exports.FILE_ACTION_TYPES = {
    VIEW: 6,
    DOWNLOAD: 5,
};
exports.ERRORS = [502, 504, 400];
exports.ALL_FILE_DOWNLOAD_MAX_SIZE = 20;
exports.ONE_MB = 1024 * 1024;
