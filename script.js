let canvas = document.getElementById('cnv'),
      WIDTH = canvas.width = window.innerWidth,
      HEIGHT = canvas.height = window.innerHeight,
      ctxMenu = document.getElementById('ctx-menu'),
      ctx = canvas.getContext('2d'),
      mouse = {
        x: undefined,
        y: undefined
      },
      C_SIZE = 50,
      nodes = [],
      pointers = [];

let selectedItem;

//listener bullshittery
window.addEventListener('mousemove', e => {
  mouse.x = e.x;
  mouse.y = e.y;
  nodes.forEach(elem => elem.hover(mouse));
  pointers.forEach(elem => elem.hover(mouse));
});

window.addEventListener('dblclick', e => {
  nodes.forEach(elem => elem.dblClicked(mouse));
  pointers.forEach(elem => elem.dblClicked(mouse));
});

window.addEventListener('mousedown', e => {
  
  nodes.forEach(elem => elem.startDrag(mouse));
  pointers.forEach(elem => elem.startDrag(mouse));
});

window.addEventListener('mouseup', e => {
  nodes.forEach(elem => elem.stopDrag(mouse));
  pointers.forEach(elem => elem.stopDrag(mouse));
});

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  nodes.forEach(elem => elem.rightClick(mouse));
  pointers.forEach(elem => elem.rightClick(mouse));
});

window.addEventListener('click', e => {
  hideCtxMenu();
});

window.addEventListener('resize', () => {
  init();
});



// The Pointer class
class Pointer{
  constructor(x, y, address, name = ''){
    this.x = x;
    this.y = y;
    this.addr = address;
    this.name = name;
    
    this.hovering = false;
    this.dragging = null;
    this.selected = false;
  }
  
  draw(){
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.moveTo(0,0);
    ctx.rect(0,0,C_SIZE, C_SIZE);
    
    if(this.name != ''){
      ctx.font = (C_SIZE * 0.35) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(this.name, C_SIZE/2, -4);
    }
    
    if(this.hovering) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fill();
    }
    ctx.stroke();
    ctx.closePath();
    
    ctx.font = (C_SIZE * 0.4) + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(this.addr, (C_SIZE/2), (C_SIZE/2));
    
    ctx.restore();
  }
  
  hover(m){
    if(m.x > this.x && m.x < this.x + C_SIZE && m.y > this.y && m.y < this.y + C_SIZE){
      this.hovering = true;
    } else this.hovering = false;
  }
  
  dblClicked(m){
    if(m.x > this.x && m.x < this.x + C_SIZE && m.y > this.y && m.y < this.y + C_SIZE){
      let newAddr = prompt('New address:');
      while (newAddr != null && (newAddr.length > 4 || newAddr.length < 1)){
        newAddr = prompt('New address (0 - 9999):');
      }
     
      if(newAddr) this.addr = newAddr;
    }
  }
  
  startDrag(m){
    if(m.x > this.x && m.x < this.x + C_SIZE && m.y > this.y && m.y < this.y + C_SIZE){
      this.dragging = {
        dx: m.x - this.x,
        dy: m.y - this.y
      };
    }
  }
  
  stopDrag(m){
    if(m.x > this.x && m.x < this.x + C_SIZE && m.y > this.y && m.y < this.y + C_SIZE){
      this.dragging = null;
    }
  }
  
  // show context menu on right click
  rightClick(m){
    if(m.x > this.x && m.x < this.x + C_SIZE && m.y > this.y && m.y < this.y + C_SIZE){
      pointers.forEach(elem => elem.selected = false);
      nodes.forEach(elem => elem.selected = false);
      this.selected = true;
      showCtxMenu(mouse);
    }
  }
  
  update(){
    if(this.dragging != null){
      this.x = mouse.x - this.dragging.dx;
      this.y = mouse.y - this.dragging.dy;
    }
    
    this.draw();
  }
};

// the node class
class Node{
  constructor(x, y, address, value, next, dbly = false){
    this.x = x;
    this.y = y;
    this.dbly = dbly;
    
    this.addr = address;
    this.value = value;
    this.next = next;
    this.prev = '/';
    
    this.hovering = false;
    this.addrHover = false;
    this.valHover = false;
    this.nextHover = false;
    this.prevHover = false;
    
    this.dragging = null;
    this.selected = false;
  }
  
  draw(){
    ctx.font = '10px Arial';
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.moveTo(0,0);
    ctx.rect(0,0,-C_SIZE, -C_SIZE);
    if(this.addrHover) {
      ctx.fillStyle = '#000';
      ctx.fillText('address', -(C_SIZE - 2), -2)
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fill();
    }
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(0,0,-C_SIZE, C_SIZE);
    if(this.valHover) {
      ctx.fillStyle = '#000';
      ctx.fillText('value', -(C_SIZE - 2), C_SIZE - 2)
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fill();
    }
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(0,0,C_SIZE,C_SIZE);
    if(this.nextHover) {
      ctx.fillStyle = '#000';
      ctx.fillText('next', 2, C_SIZE - 2)
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fill();
    }
    ctx.stroke();
    ctx.closePath();
   
    if(this.dbly){
      ctx.beginPath();
      ctx.rect(-(C_SIZE*2),0,C_SIZE,C_SIZE);
      if(this.prevHover) {
        ctx.fillStyle = '#000';
        ctx.fillText('prev', -(C_SIZE*2) + 2, C_SIZE - 2)
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fill();
      }
      ctx.stroke();
      ctx.closePath();
    }
    
    ctx.font = (C_SIZE * 0.4) + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(this.addr, -(C_SIZE/2), -(C_SIZE/2));
    ctx.fillText(this.value, -(C_SIZE/2), (C_SIZE/2));
    ctx.fillText(this.next, (C_SIZE/2), (C_SIZE/2));
    if(this.dbly) ctx.fillText(this.prev, (C_SIZE/2) - (C_SIZE*2), (C_SIZE/2));
    
    
    ctx.restore();
  }
  
  // handle hover on different parts of the node
  hover(m){
    
    //addr box
    if(m.x > this.x - C_SIZE && m.x < this.x && m.y > this.y - C_SIZE && m.y < this.y){
      this.addrHover = true;
    } else this.addrHover = false;
    
    //value box
    if(m.x > this.x - C_SIZE && m.x < this.x && m.y > this.y && m.y < this.y + C_SIZE){
      this.valHover = true;
    } else this.valHover = false;
    
    //next box
    if(m.x > this.x && m.x < this.x + C_SIZE && m.y > this.y && m.y < this.y + C_SIZE){
      this.nextHover = true;
    } else this.nextHover = false;
    
    //prev box
    if(this.dbly && m.x > this.x - (C_SIZE*2) && m.x < this.x - C_SIZE && m.y > this.y && m.y < this.y + C_SIZE){
      this.prevHover = true;
    } else this.prevHover = false;
    
    if(this.dbly && m.x > this.x - (C_SIZE*2) && m.x < this.x + C_SIZE && m.y > this.y - C_SIZE && m.y < this.y + C_SIZE){
       this.hovering = true;
    } else if(m.x > this.x - C_SIZE && m.x < this.x + C_SIZE && m.y > this.y - C_SIZE && m.y < this.y + C_SIZE){
      this.hovering = true;
    } else this.hovering = false;
  }
  
  // change address, value, and next values on dbl click
  dblClicked(m){
    
    //addr box
    if(m.x > this.x - C_SIZE && m.x < this.x && m.y > this.y - C_SIZE && m.y < this.y){
      let newAddr = prompt('New address:');
      while (newAddr != null && (newAddr.length > 4 || newAddr.length < 1)){
        newAddr = prompt('New address (0 - 9999):');
      }
      
      if(newAddr) this.addr = newAddr;
    }
    
    //value box
    if(m.x > this.x - C_SIZE && m.x < this.x && m.y > this.y && m.y < this.y + C_SIZE){
      let newVal = prompt('New value:');
      while (newVal != null && (newVal.length > 4 || newVal.length < 1)){
        newVal = prompt('New value (0 - 9999):');
      }
      
      if(newVal) this.value = newVal;
    }
    
    //next box
    if(m.x > this.x && m.x < this.x + C_SIZE && m.y > this.y && m.y < this.y + C_SIZE){
      let newNext = prompt('New next:');
      while (newNext != null && (newNext.length > 4 || newNext.length < 1)){
        newNext = prompt('New next (0 - 9999):');
      }
      
      
      if(newNext) this.next = newNext;
    }
    
    //prev box
    if(this.dbly && m.x > this.x - (C_SIZE*2) && m.x < this.x - C_SIZE && m.y > this.y && m.y < this.y + C_SIZE){
      let newPrev = prompt('New prev:');
      while (newPrev != null && (newPrev.length > 4 || newPrev.length < 1)){
        newPrev = prompt('New prev (0 - 9999):');
      }
      
      
      if(newPrev) this.prev = newPrev;
    }
    
  }
  
  // start dragging on mosue down
  startDrag(m){
    if(this.dbly && m.x > this.x - (C_SIZE*2) && m.x < this.x + C_SIZE && m.y > this.y - C_SIZE && m.y < this.y + C_SIZE){
      this.dragging = {
        dx: m.x - this.x,
        dy: m.y - this.y
      };
    }else if(m.x > this.x - C_SIZE && m.x < this.x + C_SIZE && m.y > this.y - C_SIZE && m.y < this.y + C_SIZE){
      this.dragging = {
        dx: m.x - this.x,
        dy: m.y - this.y
      };
    }
  }
  
  // stop dragging on mouse up
  stopDrag(m){
    if(this.dbly && m.x > this.x - (C_SIZE*2) && m.x < this.x + C_SIZE && m.y > this.y - C_SIZE && m.y < this.y + C_SIZE){
      this.dragging = null;
    } else if(m.x > this.x - C_SIZE && m.x < this.x + C_SIZE && m.y > this.y - C_SIZE && m.y < this.y + C_SIZE){
      this.dragging = null;
    }
  }
  
  // show context menu on right click
  rightClick(m){
    if(this.dbly && m.x > this.x - (C_SIZE*2) && m.x < this.x + C_SIZE && m.y > this.y - C_SIZE && m.y < this.y + C_SIZE){
      nodes.forEach(elem => elem.selected = false);
      pointers.forEach(elem => elem.selected = false);
      this.selected = true;
      showCtxMenu(mouse);
    } else if(m.x > this.x - C_SIZE && m.x < this.x + C_SIZE && m.y > this.y - C_SIZE && m.y < this.y + C_SIZE){
      nodes.forEach(elem => elem.selected = false);
      pointers.forEach(elem => elem.selected = false);
      this.selected = true;
      showCtxMenu(mouse);
    }
  }
  
  update(){
    
    // dragging the entire node
    if(this.dragging != null){
      this.x = mouse.x - this.dragging.dx;
      this.y = mouse.y - this.dragging.dy;
    }
    
    this.draw();
  }
}


// Link nodes
function linkNodes(n, p){
  for(let i = 0; i < n.length; i++){
    for(let j = 0; j < n.length; j++){
      if(n[i].next != '/' && n[j].addr != '/' && n[i].next == n[j].addr){
        
        ctx.beginPath();
        ctx.strokeStyle = '#f00';
        ctx.moveTo(n[i].x + C_SIZE, n[i].y + (C_SIZE/2));
        ctx.bezierCurveTo(n[i].x + (C_SIZE*3), n[i].y + (C_SIZE/2), n[j].x + (C_SIZE*3), n[j].y - (C_SIZE/2), n[j].x, n[j].y - (C_SIZE/2));
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#f00';
        ctx.moveTo(n[j].x, n[j].y - (C_SIZE/2));
        ctx.lineTo(n[j].x + (C_SIZE*0.2), n[j].y - (C_SIZE*0.6));
        ctx.lineTo(n[j].x + (C_SIZE*0.2), n[j].y - (C_SIZE*0.4));
        ctx.lineTo(n[j].x, n[j].y - (C_SIZE/2));
        ctx.fill();
        ctx.closePath();
      }
      
      
      if(n[i].dbly && n[j].dbly && n[i].prev != '/' && n[j].addr != '/' && n[i].prev == n[j].addr) {
        ctx.beginPath();
        ctx.strokeStyle = '#00f';
        ctx.moveTo(n[i].x - (C_SIZE*2), n[i].y + (C_SIZE/2));
        ctx.bezierCurveTo(n[i].x - (C_SIZE*4), n[i].y + (C_SIZE/2), n[j].x - (C_SIZE*4), n[j].y - (C_SIZE/2), n[j].x - C_SIZE, n[j].y - (C_SIZE/2));
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#00f';
        ctx.moveTo(n[j].x - C_SIZE, n[j].y - (C_SIZE/2));
        ctx.lineTo(n[j].x - (C_SIZE*1.2), n[j].y - (C_SIZE*0.6));
        ctx.lineTo(n[j].x - (C_SIZE*1.2), n[j].y - (C_SIZE*0.4));
        ctx.lineTo(n[j].x - C_SIZE, n[j].y - (C_SIZE/2));
        ctx.fill();
        ctx.closePath();
       }
    }
  }
  
  
  for(let i = 0; i < p.length; i++){
    for(let j = 0; j < n.length; j++){
      if(p[i].addr == n[j].addr && p[i].addr != '/' && n[j].addr != '/'){
        ctx.beginPath();
        ctx.strokeStyle = '#0ff';
        ctx.moveTo(p[i].x + C_SIZE, p[i].y + (C_SIZE/2));
        ctx.bezierCurveTo(p[i].x + (C_SIZE*3), p[i].y + (C_SIZE/2), n[j].x - (C_SIZE*3), n[j].y - (C_SIZE/2), n[j].x - C_SIZE, n[j].y - (C_SIZE/2));
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#0ff';
        ctx.moveTo(n[j].x - C_SIZE, n[j].y - (C_SIZE/2));
        ctx.lineTo(n[j].x - (C_SIZE*1.2), n[j].y - (C_SIZE*0.6));
        ctx.lineTo(n[j].x - (C_SIZE*1.2), n[j].y - (C_SIZE*0.4));
        ctx.lineTo(n[j].x - C_SIZE, n[j].y - (C_SIZE/2));
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// context-menu stuff
function showCtxMenu(m){
  ctxMenu.style.left = m.x + 'px';
  ctxMenu.style.top = m.y + 'px';
  ctxMenu.style.display = 'block';
}

function hideCtxMenu(){
  ctxMenu.style.display = 'none';
}


// Add node on btn press
function addNode(n){
  nodes.push(new Node(WIDTH/2 , HEIGHT/2, '/', '0', '/', n == 1));
}

// Add pointer on btn press
function addPointer(){
  let pName = prompt('Pointer name:');
  pointers.push(new Pointer(WIDTH/2 , HEIGHT/2, '/', pName));
}

// delete item on btn press
function delItem(){
  nodes = nodes.filter(elem => !elem.selected);
  pointers = pointers.filter(elem => !elem.selected);
}

// initiate shit
function init(){
  WIDTH = canvas.width = window.innerWidth;
  HEIGHT = canvas.height = window.innerHeight;
  
}


function animate(){
  ctx.clearRect(0,0,WIDTH,HEIGHT);
  
  // update each node every frame
  nodes.forEach(elem => {elem.update()});
  
  
  // update each pointer every frame
  pointers.forEach(elem => {elem.update()});
  
  
  // change cursor based on it's location and action
  canvas.style.cursor = 'default';
  for(let i = 0; i < nodes.length; i++){
    if(nodes[i].dragging != null && nodes[i].hovering){
      canvas.style.cursor = 'grabbing';
      break;
    } else if(nodes[i].hovering){
      canvas.style.cursor = 'grab';
      break;
    }
  }
  
  for(let i = 0; i < pointers.length; i++){
    if(pointers[i].dragging != null && pointers[i].hovering){
      canvas.style.cursor = 'grabbing';
      break;
    } else if(pointers[i].hovering){
      canvas.style.cursor = 'grab';
      break;
    }
  }
  
  linkNodes(nodes, pointers);

  requestAnimationFrame(animate);
}

init();
animate();