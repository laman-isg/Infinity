const parameters = {
    particleRadius: 2,
    speed: 0.5,
    deceleration: 0.05,
    maxLife: 1200,
    particlesCount: 4,
    tIncrement: 0.15,
    stepPeriod: 30
  };
  
  const canvas = document.querySelector('canvas');
  const canvasCtx = canvas.getContext('2d');
  
  const setCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', setCanvasSize);
  setCanvasSize();
  
  let particles = [];
  let lastRafCall = 0;
  
  class Particle {
    constructor(x, y) {
      const {maxLife, radius, speed, colors, deceleration} = parameters;
      this.framesCount = Math.ceil(maxLife / (1000 / 60));
      this.framesRendered = 0;
      this.opacity = 1;
      this.opacitySpeed = 1 / this.framesCount;
      this.x = x;
      this.y = y;
      this.deceleration = deceleration; //percentage of speed lost each frame
      if (Math.random() > 0.8) {
        this.color = '#BB3BA7';
      }
      else {
        this.color = '#fff';
      }
      this.speedX = random(-speed, speed);
      this.speedY = random(-speed, speed);
      this.radius = parameters.particleRadius;
      this.radiusSpeed = this.radius / this.framesCount;
    }
    
    frame(canvasCtx) {
      canvasCtx.fillStyle = this.color;
      canvasCtx.globalAlpha = this.opacity;
      canvasCtx.beginPath();
      canvasCtx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      canvasCtx.fill();
      this.opacity-= this.opacitySpeed;
      if (this.opacity < 0) {
        this.opacity = 0;
      }
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedX *= (1 - this.deceleration);
      this.speedY *= (1 - this.deceleration);
      this.radius = this.radius - this.radiusSpeed;
      if (this.radius < 0) {
        this.radius = 0;
      }
      this.framesRendered++;
      return this.framesCount >= this.framesRendered;
    }
  }
  
  const particlesFrame = timestamp => {
    if (timestamp - lastRafCall > 1000 / 65) {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p =>  p.frame(canvasCtx));
      lastRafCall = timestamp;
    }  
    window.requestAnimationFrame(particlesFrame);
  };
  particlesFrame();
  
  const random = (min, max) => {
    return min + Math.random() * (max - min);
  };
  
  const addParticlesAtPoint = (x, y) => {
    const newParticles = (new Array(parameters.particlesCount)).fill(0).map(() => new Particle(x, y));
    particles.push(...newParticles);
  };
  
  const getPositionOnCanvas = (x, y) => ({
    x: x + window.innerWidth / 2,
    y: y + window.innerHeight / 2
  });
  
  const addParticlesOnAxis = (x, y) => {
    const {x: realX, y: realY} = getPositionOnCanvas(x, y);
    addParticlesAtPoint(realX, realY);
  };
  
  let t = 0;
  const getScreenScale = () => {
    return Math.min(window.innerWidth, window.innerHeight) / 5;
  };
  
  const addParticlesAtNextPoint = () => {
    if (!document.hidden) {
      const scale = 2 / (3 - Math.cos(2 * t)) * getScreenScale();
      const x = scale * Math.cos(t);
      const y = scale * Math.sin(2 * t) / 2;
      t += parameters.tIncrement;
      addParticlesOnAxis(x, y);
    } 
    setTimeout(addParticlesAtNextPoint, parameters.stepPeriod);
  };
  
  addParticlesAtNextPoint();
  
  const LINKS_APPEARANCE_DELAY = 5000;
  const addTwitterLinkParticles = () => {
    const count = 30;
    const y = window.innerHeight - 15;
    canvasCtx.font = '16px Roboto';
    const {width} = canvasCtx.measureText('Check out my other pens and follow me on twitter!');
    const firstX = (window.innerWidth - width) / 2;
    const lastX = window.innerWidth - firstX;
    const step = (lastX - firstX) / count;
    const particlePositions = new Array(count).fill(0).map((el, idx) => ({
      x: firstX + step * idx,
      y
    }));
    particlePositions.unshift({
      x: firstX - step,
      y
    });
    particlePositions.push({
      x: lastX + step,
      y
    });
    
    particlePositions.forEach((pos, i) => {
      setTimeout(() => addParticlesAtPoint(pos.x, pos.y), i * 20);
    });
    document.querySelector('.links').classList.add('links--visible');
  };
  