import {Rect} from "@src/features/example-canvas/components/draw/core/types";

class Figure {
  x: number = 0;
  y: number = 0;
  width: number = 10;
  height: number = 10;
  angle: number = 10;
  time: number = performance.now();
  pause: boolean = false;

  constructor(x: number = 0, y: number = 0, width: number = 10, height: number = 10) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  animate(time: number) {
    // Время "жизни" фигуры
    const t = (time - this.time);

    // Изменение угла без укореняем
    this.angle += 5;
    if (this.angle > 360 || this.angle < -360) this.angle = 0;
  }

  setPause(pause = true){
    this.pause = pause;
    this.time = performance.now();
  };

  setPosition({x, y}: {x: number, y: number}){
    this.x = x;
    this.y = y;
  }

  /**
   * Прямоугольная область элемента
   */
  getBoundRect(): Rect {
    return {
      x1: this.x,
      y1: this.y,
      x2: this.x + this.width,
      y2: this.y + this.height
    };
  }

  /**
   * Проверка попадания элемента в прямоугольную область
   * @param rect
   */
  isIntersectRect(rect: Rect) {
    const bound = this.getBoundRect();
    return (
      bound.x1 <= rect.x2 && bound.x2 >= rect.x1 &&
      bound.y1 <= rect.y2 && bound.y2 >= rect.y1
    );
  }

  get zIndex(){
    return 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Добавление трансформации поворота
    // Смещение origin в центр фигуры
    ctx.translate((this.x + this.width / 2), (this.y + this.height / 2));
    // Поворот относительно origin
    ctx.rotate(this.angle * Math.PI / 180);
    // Возвращаем origin обратно
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    // Rect
    ctx.fillStyle = '#777';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Figure;
