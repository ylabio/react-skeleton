import Figure from "@src/features/example-canvas/components/draw/core/elements/figure";
import {createNoise2D} from 'simplex-noise';
import randomItem from "@src/utils/random-item";
import leafsImages from './img/export';
import roundRange from "@src/utils/round-range";

const maxX = 1500; // По сути ширина канвы, чтобы случайное число растянуть плавно на размер канвы
const maxY = 800;
const maxH = 100; // Максимальный размер фигуры, чтобы от размера плавно зависела случайность

class Leaf extends Figure {
  loaded: boolean = false;
  image: HTMLImageElement = new Image();
  static noiseX = createNoise2D();
  static noiseY = createNoise2D();
  static noiseS = createNoise2D();
  static noiseA = createNoise2D();
  noise = createNoise2D();
  // Масштаб (имитация приближения)
  scale: number = 1;
  // Вращение по оси Z
  angleZ: number = 0;
  // Ускорения (будет меняться случайным образом. Начальное значение не влияет.
  aX: number = 2;
  aY: number = 9.8;
  aS: number = 0;
  aA: number = 0;
  // Скорость
  vX: number = 0;
  vY: number = 0;
  vS: number = 0;
  vA: number = 0;

  constructor() {
    super();
    this.image.onload = () => {
      this.loaded = true;
      this.reset();
    };
    this.renew();
  }

  renew() {
    const src = randomItem(leafsImages);
    if (src !== this.image.src) {
      this.loaded = false;
      this.image.src = src;
    } else {
      this.reset();
    }
  }

  reset() {
    // Новый собственный шум
    this.noise = createNoise2D();
    // Новая начальная координата
    this.x = Math.random() * maxX;
    this.y = -(Math.random() * maxY * 100 + maxH * 2);
    this.scale = Math.random() * 0.01;
    this.width = this.image.width * this.scale;
    this.height = this.image.height * this.scale;
    this.angle = 0;
    this.angleZ = 0;
    // Скорость (начальная)
    this.vX = 0;
    this.vY = Math.random() * 100 + 10;
    this.vS = Math.random() * 5;
    this.vA = Math.random() * 5;
  }

  override get zIndex() {
    return this.width || 0;
  }

  override animate(time: number) {
    if (this.loaded) {
      // Время с прошлого расчёта
      const dt = (time - this.time) / 2000;

      const random = this.noise(this.x / maxX, this.y / maxY);
      const randomX = Leaf.noiseX(this.x / maxX, this.y / maxY) * random;
      const randomY = Leaf.noiseY(this.x / maxX, this.y / maxY) * random;
      const randomS = Leaf.noiseS(this.x / maxX, this.y / maxY) * random;
      const randomA = Leaf.noiseA(this.x / maxX, this.y / maxY) * random;

      if (this.y < maxY && this.y > -maxY && this.x > -500 && this.x < maxX + 500) {
        this.aX = randomX * 500;
        this.aY = randomY + 50; /// Сдвиг к положительному, чтобы вверх реже летали
        this.aS = randomS / 600;
        this.aA = randomA * 5;

        // Равноускоренное перемещение за dt
        if (!this.pause) {
          this.x += (this.vX * dt) + (this.aX * dt ** 2 / 2);
          this.y += (this.vY * dt) + (this.aY * dt ** 2 / 2);
        }
        this.scale += this.aS; //(this.vS * dt) + (this.aS * dt ** 2 / 2);
        this.angle += this.aA; //(this.vA * dt) + (this.aA * dt ** 2 / 2);
        this.angleZ = (this.aA + 1) / 2;

        // Текущая скорость, чтобы рассчитывать новую позицию в следующий раз
        if (!this.pause) {
          this.vX = this.vX + this.aX * dt;
          this.vY = this.vY + this.aY * dt;
        }
        this.vS = this.vS + this.aS * dt;
        this.vA = this.vA + this.aA * dt;

        // Корректировка scale, чтобы оставался в нужном диапазоне и расчёт размеров с учётом scale
        this.scale = roundRange(this.scale, 0.5, 50);
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;
      } else {
        // Обновить лист
        this.renew();
      }
    }
    this.time = time;
  }

  override draw(ctx: CanvasRenderingContext2D) {
    if (this.loaded) {
      ctx.save();
      // rotate по центру картинки
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.angle * Math.PI / 180);
      //ctx.scale(this.angleZ, 1);
      ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      // rect
      // ctx.fillStyle = 'rgba(137,255,91,0.7)';
      // ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.restore();
    }
  }
}

export default Leaf;
