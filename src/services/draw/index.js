import Leaf from "@src/services/draw/leaf";

class DrawService {
  constructor() {
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);

    this.leafs = [
      new Leaf()
    ];

  }

  init(config, services){
    this.config = config;
    this.services = services;
  }

  mount(root){
    this.root = root;

    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = '0';

    this.ctx = this.canvas.getContext('2d', {alpha: true});

    this.root.appendChild(this.canvas);
    window.addEventListener('resize', this.resize, false);
    this.resize();
    this.isMount = true;

    this.render();
  }

  demount(){
    this.isMount = false;
    window.removeEventListener('resize', this.resize, false);
  }

  resize(){
    const rect = this.root.getBoundingClientRect();
    const dpr = 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  render(){
    if (this.isMount) {


      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const time = performance.now();
      for (const item of this.leafs) {
        item.process(time);
        item.draw(this.ctx);
      }

      requestAnimationFrame(this.render);
    }
  }
}

export default DrawService;
