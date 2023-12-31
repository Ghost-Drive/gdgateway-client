import { LocalFileBuffer, LocalFileStream } from '../types/File';
import { chunkBuffer } from './chunkBuffer';

export async function* chunkFile({
  file,
  uploadChunkSize,
}: {
  file:
    | LocalFileBuffer
    | LocalFileStream
    | { size: number; arrayBuffer: () => Promise<ArrayBuffer> };
  uploadChunkSize: number;
}): AsyncGenerator<Buffer | ArrayBuffer> {
  if (file instanceof LocalFileStream) {
    const stream = file.stream();
    const lastChunkSize =
      file.size > uploadChunkSize
        ? file.size - Math.floor(file.size / uploadChunkSize) * uploadChunkSize
        : file.size;

    let buffer: Buffer = Buffer.alloc(uploadChunkSize);
    let offset: number = 0;

    for await (const chunk of stream) {
      let position = 0;
      if (lastChunkSize === chunk.length && lastChunkSize) {
        buffer = Buffer.alloc(lastChunkSize);
      }
      while (position < chunk.length) {
        const spaceLeft = uploadChunkSize - offset;
        const chunkToCopy = Math.min(spaceLeft, chunk.length - position);

        chunk.copy(buffer, offset, position, position + chunkToCopy);

        position += chunkToCopy;
        offset += chunkToCopy;

        if (offset === uploadChunkSize) {
          yield buffer;
          buffer = Buffer.alloc(uploadChunkSize);
          offset = 0;
        }
      }
    }

    if (offset > 0) {
      yield buffer.slice(0, offset);
    }
  } else {
    const arrayBuffer = await file.arrayBuffer();
    yield* chunkBuffer({ arrayBuffer, uploadChunkSize });
  }
}
