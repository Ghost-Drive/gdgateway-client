import { downloadChunk, countChunks, decryptChunk } from '../index.js';

import { isMobile } from '../utils/isMobile.js';
import { isBrowser } from '../utils/isBrowser.js';
import { joinChunks } from '../utils/joinChunks.js';
import { convertBase64ToArrayBuffer } from '../utils/convertBase64ToArrayBuffer.js';

import { IDownloadFile } from '../types/index.js';
import { ALL_FILE_DOWNLOAD_MAX_SIZE, ONE_MB } from '../config.js';

import { downloadFileFromSP } from './downloadFileFromSP.js';
import {Readable} from "stream";

export const downloadFile = async ({
  file,
  oneTimeToken,
  endpoint,
  isEncrypted,
  key,
  callback,
  handlers,
  signal,
  carReader,
  uploadChunkSize,
  cidData,
  writeStreamMobile,
}: IDownloadFile) => {
  const startTime = Date.now();
  const chunks = [];
  const { entry_clientside_key, slug } = file;

  const sha3 = !isEncrypted
    ? null
    : entry_clientside_key?.clientsideKeySha3Hash ||
      entry_clientside_key?.sha3_hash;

  let totalProgress = { number: 0 };
  let fileStream = null;

  if (file.is_on_storage_provider) {
    const size = Number((file.size / ONE_MB).toFixed(1));

    if (size < ALL_FILE_DOWNLOAD_MAX_SIZE) {
      const fileBlob = await downloadFileFromSP({
        carReader,
        url: `${file.storage_provider.url}/${file.root_cid}`,
        isEncrypted,
        uploadChunkSize,
        key,
        iv: entry_clientside_key?.iv,
        file,
        level: 'root',
      });
      return fileBlob;
    }

    if (size >= ALL_FILE_DOWNLOAD_MAX_SIZE) {
      const cids = cidData.cids;
      const chunks = [];

      for (let i = 0; i < cids.length; i++) {
        const fileBlob = await downloadFileFromSP({
          carReader,
          url: `${file.storage_provider.url}/${cids[i]}`,
          isEncrypted,
          uploadChunkSize,
          key,
          iv: entry_clientside_key?.iv,
          file,
          level: cidData.level,
        });

        // @ts-ignore
        const chunk = await fileBlob.arrayBuffer();
        chunks.push(chunk);
      }
      return joinChunks(chunks);
    }
  } else {
    const chunkCountResponse = await countChunks({
      endpoint,
      oneTimeToken,
      slug,
      signal,
    });

    if (chunkCountResponse.status !== 200) {
      throw new Error(`HTTP error! status:${chunkCountResponse.status}`);
    }

    const {
      data: { count },
    } = chunkCountResponse;

    if (!isBrowser() && !isMobile()) {
      // const { Readable } = require('stream');
      fileStream = new Readable({
        read() {},
      });
    }

    for (let index = 0; index < count; index++) {
      let chunk;
      const downloadedChunk = await downloadChunk({
        index,
        sha3_hash: sha3,
        oneTimeToken,
        signal,
        endpoint,
        file,
        startTime,
        totalProgress,
        callback,
        handlers,
      });

      if (!isEncrypted) {
        chunk = downloadedChunk;
      } else {
        const bufferKey = convertBase64ToArrayBuffer(key);

        chunk = await decryptChunk({
          chunk: downloadedChunk,
          iv: entry_clientside_key?.iv,
          key: bufferKey,
        });
        if (chunk?.failed) {
          return { failed: true };
        }
        if (index === 0 && chunk) {
          handlers?.includes('onSuccess') &&
            callback({
              type: 'onSuccess',
              params: {},
            });
        }
      }
      if (fileStream) {
        fileStream.push(new Uint8Array(chunk));
      } else if (isMobile()) {
        await writeStreamMobile(chunk);
      } else {
        chunks.push(chunk);
      }
    }

    if (fileStream) {
      fileStream.push(null);
      return fileStream;
    } else if (isMobile()) {
      return { failed: false };
    } else {
      const file = joinChunks(chunks);
      return file;
    }
  }
};
