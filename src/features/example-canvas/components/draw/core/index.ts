import {Action, ScrollParams, ZoomParams} from "@src/features/example-canvas/components/draw/core/types";
import Figure from "@src/features/example-canvas/components/draw/core/elements/figure";

class Core {
  // DOM элемент, в котором будет создана канва
  root: HTMLElement | null = null;
  // DOM элемент канвы
  canvas: HTMLCanvasElement | null = null;
  // Контекст для 2D рисования
  ctx: CanvasRenderingContext2D | null = null;
  // Элементы для рендера
  elements: Figure[] = [];
  // Метрики канвы
  metrics = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    dpr: 1,
    scrollX: 0,
    scrollY: 0,
    zoom: 1
  };
  // Активное действие (обычно при зажатой клавиши мышки)
  action: Action | null = null;

  constructor() {
    this.elements.push(new Figure(100,100, 200, 300));
  }

  /**
   * Монтирование канвы в DOM элемент (dom)
   * @param root
   */
  mount(root: HTMLElement) {
    this.root = root;
    this.canvas = document.createElement('canvas');
    this.root.appendChild(this.canvas);

    // Отслеживаем изменение размеров окна (хотя лучше повесить ResizeObserver на root)
    window.addEventListener('resize', this.resize);
    // Нажатие мышки отслеживается только в рамках канвы
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    // Перемещение и отпускание кнопки мышки отслеживаем в рамках всего окна
    // чтобы не ломалась логика, если после нажатия мышь случайна вышла за рамки канвы
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    this.canvas.addEventListener('wheel', this.onMouseWheel);

    this.ctx = this.canvas.getContext('2d', {alpha: false});
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
      // Актуализация размеров канвы
      this.resize();
      // Запуск цикла рендера
      this.draw();
    } else {
      throw new Error('Не удалось создать CanvasRenderingContext2D');
    }
  }

  /**
   * Демонтирование канвы
   */
  unmount() {
    // Отписка от всех событий
    if (this.canvas) {
      window.removeEventListener('resize', this.resize);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      this.canvas.removeEventListener('mousedown', this.onMouseDown);
      this.canvas.removeEventListener('wheel', this.onMouseWheel);
      // Удаление канвы
      if (this.root) this.root.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }
  }

  /**
   * Обработка изменения размеров/масштаба под канву
   */
  resize = () => {
    if (this.root && this.canvas && this.ctx) {
      const rect = this.root.getBoundingClientRect();
      this.metrics.left = rect.left;
      this.metrics.top = rect.top;
      this.metrics.width = this.root.offsetWidth;
      this.metrics.height = this.root.offsetHeight;
      this.metrics.dpr = window.devicePixelRatio;
      // Физический размер канвы с учётом плотности пикселей (т.е. канва может быть в разы больше)
      this.canvas.width = this.metrics.width * this.metrics.dpr;
      this.canvas.height = this.metrics.height * this.metrics.dpr;
      // Фактический размер канвы
      this.canvas.style.width = `${this.metrics.width}px`;
      this.canvas.style.height = `${this.metrics.height}px`;
      // Общая трансформация - все координаты будут увеличиваться на dpr, чтобы фигуры рисовались в увеличенном (в физическом) размере
      this.ctx.scale(this.metrics.dpr, this.metrics.dpr);
    }
  };

  /**
   * Смещение области обзора (прокрутка по горизонтали и/или вертикали)
   * @param x Точная позиция по горизонтали
   * @param y Точная позиция по вертикали
   * @param dx Добавить смещение по горизонтали
   * @param dy Добавить смещение по вертикали
   */
  scroll({x, y, dx, dy}: ScrollParams) {
    if (typeof x != 'undefined') this.metrics.scrollX = x;
    if (typeof y != 'undefined') this.metrics.scrollY = y;
    if (typeof dx != 'undefined') this.metrics.scrollX += dx;
    if (typeof dy != 'undefined') this.metrics.scrollY += dy;
  }

  /**
   * Установка масштаба
   * @param zoom Точная установка (1 = 100%)
   * @param delta Изменение текущего масштаба на коэффициент, например -0.1
   * @param center Центр масштабирования (точка, которая визуально не сместится)
   */
  zoom({zoom, delta, center}: ZoomParams) {
    // Центр масштабирования с учётом текущего смещения и масштабирования
    const centerReal = {
      x: (center.x + this.metrics.scrollX) / this.metrics.zoom,
      y: (center.y + this.metrics.scrollY) / this.metrics.zoom
    };
    // Точная установка масштаба
    if (typeof zoom != 'undefined') this.metrics.zoom = zoom;
    // Изменение масштабирования на коэффициент
    if (typeof delta != 'undefined') this.metrics.zoom += delta * this.metrics.zoom;
    // Корректировка минимального масштаба
    this.metrics.zoom = Math.max(0.1, this.metrics.zoom);
    // Центр масштабирования с учётом нового масштаба
    const centerNew = {
      x: centerReal.x * this.metrics.zoom,
      y: centerReal.y * this.metrics.zoom
    };
    // Корректировка смещения
    this.scroll({
      x: centerNew.x - center.x,
      y: centerNew.y - center.y,
    });
  }

  onMouseDown = (e: MouseEvent) => {
    // Активация действия scroll
    // @todo Если проверяем попадание курсора в фигуру, то при успехе активация действия перемещения конкретной фигуры
    this.action = {
      name: 'scroll',
      // Координата, с которой начинаем расчёт смещения
      x: e.clientX - this.metrics.left,
      y: e.clientY - this.metrics.top,
      // Запоминаем исходное смещение, чтобы к нему добавлять расчётное
      scrollX: this.metrics.scrollX,
      scrollY: this.metrics.scrollY
    };
  };

  onMouseMove = (e: MouseEvent) => {
    // Обработка действия scroll
    if (this.action && this.action.name === 'scroll') {
      // можно e.offsetY вместо e.clientY - this.metrics.top, но если курсор окажется вне канвы, то будет глюк
      const dx = e.clientX - this.metrics.left - this.action.x;
      const dy = e.clientY - this.metrics.top - this.action.y;
      this.scroll({
        x: this.action.scrollX - dx,
        y: this.action.scrollY - dy,
      });
    }
  };

  onMouseUp = (e: MouseEvent) => {
    // Сброс активного действия
    this.action = null;
  };

  onMouseWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    if (e.ctrlKey) {
      // Масштабирование
      this.zoom({delta, center: {x: e.offsetX, y: e.offsetY}});
    } else {
      // Прокрутка по вертикали
      this.scroll({dy: delta * 300});
    }
  };

  /**
   * Рисование всего
   */
  draw = () => {
    if (this.ctx) {
      // Область рендера
      const viewRect = {
        x1: this.metrics.scrollX / this.metrics.zoom,
        y1: this.metrics.scrollY / this.metrics.zoom,
        x2: (this.metrics.width + this.metrics.scrollX) / this.metrics.zoom,
        y2: (this.metrics.height + this.metrics.scrollY) / this.metrics.zoom
      };

      this.ctx.save();
      // Очистка
      this.ctx.fillStyle = '#ebf4ff';
      this.ctx.fillRect(0, 0, this.metrics.width, this.metrics.height);
      // scroll
      this.ctx.translate(-this.metrics.scrollX, -this.metrics.scrollY);
      // scale
      this.ctx.scale(this.metrics.zoom, this.metrics.zoom);

      // Метка времени, чтобы все элементы рассчитали анимацию относительно неё
      const time = performance.now();

      for (const element of this.elements) {
        // Анимация элемента
        element.animate(time);
        // Рисование элемента, если попадает в видимую область
        if (element.isIntersectRect(viewRect)) {
          this.ctx.save();
          element.draw(this.ctx);
          this.ctx.restore();
        }
      }
      this.ctx.restore();
      // Цикл рендера
      requestAnimationFrame(this.draw);
    }
  };
}

export default Core;
