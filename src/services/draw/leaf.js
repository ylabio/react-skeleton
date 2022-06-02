
class Leaf {

  constructor() {
    this.g = 9;
    this.yo = 0;
    this.x = 0;
    this.y = 0;
    this.time0 = performance.now();
  }

  process(time) {
    this.y = this.yo + (this.g * Math.pow((time - this.time0)/200, 2)) / 2;

    if (this.y > 300) {
      this.time0 = performance.now();
    }


  }

  draw(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.fillStyle = '#0f0'
    ctx.rect(this.x, this.y, 50, 50);
    ctx.fill();

    ctx.restore();
  }
}

export default Leaf;
