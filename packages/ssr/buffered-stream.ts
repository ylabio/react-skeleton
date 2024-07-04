import { Writable } from 'stream';

/**
 * Поток, буферизующий все данные
 */
export default class BufferedStream extends Writable {
  chunks: any[] = [];
  buffer = '';

  override _write (chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void,
  ): void {
    this.chunks.push(chunk);
    callback();
  }

  override _final (callback: (error?: Error | null) => void): void {
    this.buffer = Buffer.concat(this.chunks).toString();
    callback();
  }
}
