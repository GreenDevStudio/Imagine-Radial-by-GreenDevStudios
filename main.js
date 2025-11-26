const onReady = false; //Debug On Ready

let block_inputs = false;
let save_as_transparent = false;

let currentMenu = 0;

let colorRadialGradient = 'rgba(255,255,255,1)';


let width = 252;
let height = 252;
//Pickr



console.log("Iniciado");
document.addEventListener("DOMContentLoaded", () => {
//Ready:

const centerColor = Pickr.create({
  el: '.centerColor',
  theme: 'monolith',
  default: '#FFFFFF',
  components: {
    preview: true,
    opacity: true,
    hue: true,
    
    interaction: {
      rgba: true,
      hex: true,
      save: false
    }
  }
  
});

anime({
  targets: document.getElementById("panelParametersDisplay"),
  opacity: 1,
  duration: 1000,
  easing: 'easeInOutQuad'
});
  
//Menus

const mainMenu = document.getElementById("mainMenu");
const gradientMenu = document.getElementById("GradientMenu");

//INPUTS
const inputWidth = document.getElementById("inputWidth");
const inputHeight = document.getElementById("inputHeight");

const inputRadius = document.getElementById("radiusInput");
const inputSmoothFactor = document.getElementById("smoothInput");

//Buttons

const continueButton = document.getElementById("inputButtonContinue");
const transparentCheckButton = document.getElementById("inputIsTransparentBg");

const saverButton = document.getElementById("saveInputButton");

//Labels:

const radiusValueLabel = document.getElementById("radiusValueLabel");

const smoothValueLabel = document.getElementById("smoothValueLabel");


//Preview:

const preview = document.getElementById("previewCanvas");
const draw = preview.getContext('2d');

preview.width = 232; preview.height = 232;




continueButton.onclick = () => {
  if (block_inputs === false) {
    draw.clearRect(0,0, preview.width, preview.height);
    
    const widthValue = parseInt(inputWidth.value);
    const heightValue = parseInt(inputHeight.value);
    block_inputs = true;
    if (widthValue > 0 && heightValue > 0) {
      if (currentMenu === 0) {anime(menuHide);}
      if (transparentCheckButton.checked === true) {
        save_as_transparent = true;
        
        preview.style.backgroundColor='#505050FF';
        preview.style.backgroundImage='linear-gradient(45deg, #2E2E2EFF 25%, transparent 25%, transparent 75%, #2E2E2EFF 75%, #2E2E2EFF), linear-gradient(45deg, #2E2E2EFF 25%, transparent 25%, transparent 75%, #2E2E2EFF 75%, #2E2E2EFF)';
        preview.style.backgroundPosition='0 0, 10px 10px';
        preview.style.backgroundSize='20px 20px';
        
      } else {
        preview.style.backgroundColor='black';
      }
      
      
      width = widthValue;
      height = heightValue;
      update();
      
      
    } else {
      block_inputs = false;
      console.log("Usuário não configurou o Tamanho");
      console.log("Width: ", widthValue, "Height:", heightValue);
      
      anime({
        targets: [inputWidth, inputHeight],
        borderColor: '#FF6262FF',
        duration: 0,
        complete: () => {
          anime({
            targets: [inputWidth, inputHeight],
            borderColor: '#FF616100',
            delay: 300,
            duration: 1000,
            easing: 'easeInOutQuad'
          })
          }
          
      });
      
    }
    
    
    
  }
  
}

//Events

saverButton.onclick = () => {
  saveGradientToPNG(width, height);
}

inputRadius.addEventListener('input', () => {
  update();
  //radiusValueLabel.textContent=inputRadius.value;
  
  
  
  
});

inputSmoothFactor.addEventListener('input', () => {
  update();
});

centerColor.on('change', (color) => {
  update();
  colorRadialGradient = color.toRGBA().toString(0);
});


centerColor.on('hide', () => {
  centerColor.setColor(colorRadialGradient);
});

//borderColor.on('hide', () => {
  //borderColor.setColor(colorBorderString);
//});


function saveGradientToPNG(width, height, path = '') {
  const cache = document.createElement('canvas');
  const ctxCache = cache.getContext('2d');
  cache.width = width; cache.height = height;
  
  drawRadialGradient(ctxCache, width, height);
  const url = cache.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `radial-imagine_${Date.now()}.png`
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


function drawRadialGradient(ctx, w, h) {
  // 1. Limpa a tela
  ctx.clearRect(0, 0, w, h);
  
  const cX = w / 2;
  const cY = h / 2;
  
  const c1 = colorRadialGradient;
  const c2 = 'rgba(0,0,0,0)';
  
  let radius = parseFloat(inputRadius.value);
  let smoothFactor = parseFloat(inputSmoothFactor.value) * 0.4;
  
  radiusValueLabel.textContent=String(radius);
  smoothValueLabel.textContent=String(inputSmoothFactor.value);
  
  const startStop = smoothFactor;
  
  const gradient = ctx.createRadialGradient(cX, cY, 0, cX, cY, (radius * 0.5) * w);
  
  gradient.addColorStop(0, c1);
  if (startStop > 0) gradient.addColorStop(startStop, c1);
  gradient.addColorStop(1, c2);
  
  if (!save_as_transparent) {ctx.fillStyle='black'; ctx.fillRect(0,0, w, h);}
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0, w, h);
  
}

function update() {
  drawRadialGradient(draw, preview.width, preview.height);
}



//Menus Animation Transition


//Main Menu:
//Esconder Menu Principal:
const menuHide = {
  targets: mainMenu,
  opacity: 0,
  duration: 1000,
  easing: 'easeInOutQuad',
  complete: () => finished('menuHide')
}

//Mostrar Menu Principal:

const menuShow = {
  targets: mainMenu,
  opacity: 1,
  duration: 1000,
  easing: 'easeInOutQuad',
  complete: () => finished('menuShow')
}
/////////////////////////

//Gradient Menu:
//Esconder Menu de Gradiente:
const hideGradient = {
  targets: gradientMenu,
  opacity: 0,
  duration: 1000,
  easing: 'easeInOutQuad',
  complete: () => finished('hideGradient')
}

//Mostrar Menu Gradiente:
const showGradient = {
  targets: gradientMenu,
  opacity: 1,
  duration: 1000,
  easing: 'easeInOutQuad',
  complete: () => finished('showGradient')
}


//Transições:
function finished(animation) {
  if (animation === 'menuHide') {
    anime(showGradient);
    mainMenu.style.pointerEvents = 'none';
    gradientMenu.style.pointerEvents = 'auto';
    
  }
}



//Paremeters DEBUG /////////

const currentTab = 0; //0 = Main Menu
const hideMainMenu = false;
const hideGradientMenu = false;

//gradientMenu.style.opacity=1;
//gradientMenu.style.pointerEvents='auto'

mainMenu.hidden = hideMainMenu;
gradientMenu.hidden = hideGradientMenu;

if (onReady === true) {
  if (currentTab === 0) {
    anime(menuShow);
  }
  
  else if (currentTab === 1) {anime(menuHide);}
}

});

function parseRGBA(rgbaString ) {
  const match = rgbaString.match(/[\d.]+/g);
  if (!match) return [0,0,0,1];
  return match.map(Number);
}

function lerpColor(color1, color2, t) {
  const r = Math.round(color1[0] + (color2[0] - color1[0]) * t);
  const g = Math.round(color1[1] + (color2[1] - color1[1]) * t);
  const b = Math.round(color1[2] + (color2[2] - color1[2]) * t);
  const a = color1[3] + (color2[3] - color1[3]) * t;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}


