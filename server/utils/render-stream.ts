import {Writable} from 'stream';

/**
 * Поток, чтобы в него записать рендер
 */
class RenderStream extends Writable {
  chunks: any[] = [];
  render = '';

  getRender() {
    return this.render;
  }

  override _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    this.chunks.push(chunk);
    callback();
  }

  override _final(callback: (error?: Error | null) => void): void {
    this.render = Buffer.concat(this.chunks).toString();
    callback();
  }
}

export default RenderStream;
