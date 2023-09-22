import axios from "axios";
import * as Base64 from "base64-js";
import * as setCookieParser from "set-cookie-parser";

import { getFibonacciNumber } from "../utils/getFibonacciNumber";
import { convertTextToBase64 } from "../utils/convertTextToBase64";
import { postWithCookies } from "../utils/makeRequestWithCookies";
import { isBrowser } from "../utils/isBrowser";

import { CHUNK_SIZE, MAX_TRIES } from "../config";

import { ISendChunk } from "../types";

export const sendChunk = async ({
  chunk,
  index,
  file,
  startTime,
  oneTimeToken,
  endpoint,
  iv,
  clientsideKeySha3Hash,
  totalProgress,
  callback,
  handlers,
  controller,
}: ISendChunk) => {
  const base64iv = iv ? Base64.fromByteArray(iv) : null;
  const fileName = convertTextToBase64(file.name);
  const chunksLength = Math.ceil(file.size / CHUNK_SIZE);
  let currentTry = 1;
  let cookieJar = [];

  const headers = {
    "content-type": "application/octet-stream",
    "one-time-token": oneTimeToken,
    "x-file-name": fileName,
    "x-last": `${index}/${chunksLength}`,
    "x-chunk-index": `${index}`,
    "X-folder": file.folderId || "",
    "x-mime": file?.type,
    "X-Ai-Generated": false,
    "x-clientsideKeySha3Hash": iv ? clientsideKeySha3Hash : "null",
    "x-iv": iv ? base64iv : "null",
  };

  const uploadChunk: (chunk: ArrayBuffer) => Promise<any> = async (
    chunk: ArrayBuffer
  ) => {
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000
      );
    });

    try {
      let response;
      if (!isBrowser()) {
        response = axios
          .get(`${endpoint}`, {
            headers: {
              "content-type": "application/octet-stream",
              "one-time-token": oneTimeToken,
            },
          })
          .then((response) => {
            if (response.headers["set-cookie"]) {
              const parsed = setCookieParser.parse(
                response.headers["set-cookie"]
              );
              for (const cookieObject of parsed) {
                const cookieString = `${cookieObject.name}=${cookieObject.value}`;
                cookieJar.push(cookieString);
              }
            }
          })
          .then(() => {
            return postWithCookies(
              `${endpoint}/chunked/uploadChunk`,
              headers,
              cookieJar,
              controller.signal,
              chunk
            );
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      } else {
        response = await axios.post(`${endpoint}/chunked/uploadChunk`, chunk, {
          headers,
        });
      }
      if (currentTry > 1) {
        currentTry = 1;
      }
      const prevProgress = totalProgress.number || 0;
      const progress = +prevProgress + chunk.byteLength;
      totalProgress.number = progress;
      const elapsedTime = Date.now() - startTime;
      const remainingBytes = file.size - progress;
      const bytesPerMillisecond = progress / elapsedTime;
      const remainingTime = remainingBytes / bytesPerMillisecond;
      const timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
      handlers.includes("onProgress") &&
        callback({
          type: "onProgress",
          params: { id: file.uploadId, progress, timeLeft },
        });

      return response;
    } catch (error: any) {
      console.error("ERROR", error);
      if (
        currentTry >= MAX_TRIES ||
        !error?.message?.includes("Network Error")
      ) {
        currentTry = 1;
        return { failed: true };
      } else {
        currentTry++;
        return uploadChunk(chunk);
      }
    }
  };

  return await uploadChunk(chunk);
};
