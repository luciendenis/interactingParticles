const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// constants for the behavior of the model
const pNumber = 1000;             // number of particles
const pColor = [  '#716282',
                  '#736484',
                  '#756686',
                  '#776887',
                  '#786989',
                  '#7a6b8b',
                  '#7c6d8d',
                  '#7e6f8e',
                  '#807190',
                  '#817292',
                  '#837494',
                  '#857695',
                  '#877897',
                  '#897a99',
                  '#8b7c9b',
                  '#8d7e9d',
                  '#8e7f9f',
                  '#9081a1',
                  '#9283a2',
                  '#9485a4',
                  '#9687a6',
                  '#9788a7',
                  '#998aa9',
                  '#9b8cab',
                  '#9d8ead'
                  ];      // particles color when excited
const pSize = 10;                  // minimum size of particle
const pSizeR = 5;                 // randomness of the size of particles
const maxS = 2;                  // maximum speed of a particle
const minS = 0.1;                 // minimum speed of a particle
const range = 100;                // mouse range of action towards particles
const acceleration = 0.3;         // attractive/repulsive force towards the mouse
const deceleration = 0.99;       // deceleration when particle not in mouse range
const attract = -1;               // attractive (1) or repulsive (-1) force of the mouse
const pAttract = -1;              // attractive (1) or repulsive (-1) force of each particle
const pAcceleration = 0.2;          // acceleration force between particles


// boolean for mouse down
let isMouseDown;
// array containing all particles
let particlesArray;

// to take into account mouse position for particles excitement
let mouse = {
  x: null,
  y : null,
  radius: range
}

window.addEventListener('mousedown',
  function(event){
    isMouseDown = true;
  }
);

window.addEventListener('mouseup',
  function(event){
    isMouseDown = false;
  }
);

window.addEventListener('mousemove',
  function(event){
    if(isMouseDown){
      mouse.x = event.x;
      mouse.y = event.y;
      for(let p = 0; p < particlesArray.length ; p++){
        let dx = mouse.x - particlesArray[p].x;
        let dy = mouse.y - particlesArray[p].y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < range){
          excited = true;
          particlesArray[p].dirX += attract*(acceleration/dist)*dx;
          particlesArray[p].dirY += attract*(acceleration/dist)*dy;
        }
      }
    }
  }
);

// Particle creation
class Particle{
  constructor(x,y,dirX,dirY,size,color){
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.size = size;
    this.color = color;
    this.excited = 0;
  }
  // excite the particle
  excite(){
    if(this.excited < pColor.length){
      this.excited++;
    }
  }
  // method to draw each particle
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
    this.color = pColor[this.excited];
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  // method to check position of particle
  update(){
    let collision = false;
    // checking if particle is getting outside canvas to make it bounce against the walls
    if(this.x + this.size > canvas.width || this.x - this.size <0){
      this.dirX = -this.dirX;
    }
    if(this.y + this.size > canvas.height || this.y - this.size <0){
      this.dirY = -this.dirY;
    }

    // applying particle interaction
    for(let p = 0; p < particlesArray.length ; p++){
      if(particlesArray[p] != this){
        let dpx = particlesArray[p].x - this.x;
        let dpy = particlesArray[p].y - this.y;
        let pdist = Math.sqrt(dpx*dpx + dpy*dpy);
        if(pdist <= this.size + particlesArray[p].size){
          collision = true;
          this.dirX += pAttract*(pAcceleration/pdist)*dpx*(particlesArray[p].size/this.size);
          this.dirY += pAttract*(pAcceleration/pdist)*dpy*(particlesArray[p].size/this.size);
          this.excite();
          particlesArray[p].excite();
        }
      }
    }

    // deceleration
    if(!collision){
      if(Math.abs(this.dirX) > minS){
        this.dirX *= deceleration;
      }
      if(Math.abs(this.dirY) > minS){
        this.dirY *= deceleration;
      }
      if(this.excited > 0){
        this.excited --;
      }
    }

    if (this.dirX > maxS){ this.dirX = maxS }
    else if (this.dirX < - maxS) { this.dirX = -maxS }
    if (this.dirY > maxS){ this.dirY = maxS }
    else if (this.dirY < - maxS) { this.dirY = -maxS }

    // move particles
    this.x += this.dirX;
    this.y += this.dirY;
    // draw particle
    this.draw();
  }
}

// create particle array, positions are randomized
function init(){
  particlesArray = [];
  for(let i = 0; i < pNumber ; i++){
    let size = (Math.random() * pSizeR) + pSize;
    let x = Math.random() * ((innerWidth - size *2 ) - (size * 2)) + size * 2;
    let y = Math.random() * ((innerHeight - size *2 ) - (size * 2)) + size * 2;
    let dirX = Math.random() * maxS - (maxS/2);
    let dirY = Math.random() * maxS - (maxS/2);
    let color = pColor;

    particlesArray.push(new Particle(x, y, dirX, dirY, size, color));
  }
}

// animation
function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,innerWidth, innerHeight);

  for(let i = 0; i < particlesArray.length; i++){
    particlesArray[i].update();
  }
}

// now we play
init();
animate();
