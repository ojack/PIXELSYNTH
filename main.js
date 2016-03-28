
//squares

import Synthesizer from './synthesizer.js';
import ScaleMaker  from 'scale-maker';
import Controls from './controls.js';
import ImageCanvas from './imageCanvas.js';
import DrawCanvas from './drawCanvas.js';


var synth, controls, imageCanvas, drawCanvas;

var prevTime, data;
var colPos = 0;
var isPlaying = true;



var settings = {
  brightness: 0.5,
  contrast : 0.5,
  invert: false,
  repetitions : {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0, 
    y: 0
  },
  spacing: {
    x: 0.16,
    y: 0.16
  },
  rotation: 0,
  play: true,
  speed: 0.7,
  drawMode: true,
  stroke_width: 0.1,
  stroke_repetitions: 0.3,
  stroke_opacity: 1.0,
  eraser: 0,
  stroke_offset: {
    x: 0.6,
    y: 0.6
  },
  scale: {
    numSteps: 100,
    note: "C",
    octave: 1,
    type: 'chromatic'
  }
};

var synthObj = {};
//var numSteps = 30;

//var isPlaying = false;


var scaleFrequencies;
//var settings.speed = 60;
var playheadCanvas, imageData, ctx, playheadCtx, compressor, ongoingTouches, mouse, touchObject, audioCtx, backgroundColor, oscillators;
// timing params
var requestId, startTime;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
    
//var scaleFrequencies = ScaleMaker.makeScale('chinesePentatonic', 'A#3', numSteps).inHertz;

//console.log(settings.scale);

window.onload = function(){
  var l = document.getElementById("landing");
  l.onclick = init;
 // init();
};

function handlePlay(){
 prevTime = audioCtx.currentTime;
 settings.play = true;
// console.log(audioCtx);
 if(audioCtx.resume){
    audioCtx.resume();
 } else {
  //browser doesnt support resume()
 }
 
  requestId = requestAnimationFrame(nextStep);
}

function regenerateSynth(){
  synth.endSynth();
  var note = settings.scale.note + "" + settings.scale.octave;
  //console.log(settings.scale.numSteps);
  scaleFrequencies = ScaleMaker.makeScale(settings.scale.type, note, parseInt(settings.scale.numSteps)).inHertz;
  synth = new Synthesizer(scaleFrequencies, compressor, audioCtx);
}

function handleStop(){
  settings.play = false;
  if(audioCtx.suspend){
   // audioCtx.resume();
    audioCtx.suspend();
 } else {
  //browser doesnt support suspend()
   // synth.zeroGains();
    var gainVals = [];
  for(var i = 0; i < settings.scale.numSteps; i++){
    gainVals[i] = 0;
 }
 synth.updateGains(gainVals);
  cancelAnimationFrame(requestId);
}
}

function init(){
  //log("init");
  document.body.removeChild(document.getElementById("landing"));
  ongoingTouches = new Array();
  
  touchObject = {};
  oscillators = {};
   
   imageCanvas = new ImageCanvas(settings, handlePlay);
   drawCanvas = new DrawCanvas(settings);
  playheadCanvas = document.createElement("canvas");
   playheadCanvas.width = window.innerWidth;
   playheadCanvas.height = window.innerHeight;
   playheadCanvas.style.position = "fixed";
   playheadCanvas.style.top = "0px";
   playheadCanvas.style.left = "0px";
   playheadCtx = playheadCanvas.getContext('2d');
    backgroundColor = "rgba(242, 35, 12, 0.1)";
 
       
  initAudioCtx();
   
   document.body.appendChild(playheadCanvas); 
   controls = new Controls(imageCanvas, drawCanvas, settings, handlePlay, handleStop, regenerateSynth);
   setEventHandlers();

   document.body.onkeydown = function(e){
    if(e.keyCode == 32){
        if(settings.play){
          settings.play = false;
          handleStop();
        } else {
          settings.play = true;
          handlePlay();
          
        }
    } 
    // else if(e.keyCode == 38){ // up key
    //   settings.speed +=5;
    // } else if(e.keyCode == 40){
    //   settings.speed -=5;
    // } else if(e.keyCode == 73){
    //   invert();
    // } else if(e.keyCode == 67){
    //   contrast();
    //  } else if(e.keyCode == 66){
    //   brighter();
    //  } else if(e.keyCode == 68){
    //   darker();
    // }
  }
 
}

function setEventHandlers(){
  console.log("setting event handlers");
  playheadCanvas.addEventListener("touchstart", handleTouchStart, false);
  playheadCanvas.addEventListener("touchend", handleTouchEnd, false);
  playheadCanvas.addEventListener("touchcancel", handleTouchCancel, false);
  playheadCanvas.addEventListener("touchmove", handleTouchMove, false);
   playheadCanvas.addEventListener("mousedown", handleMouseStart, false);
    playheadCanvas.addEventListener("mousemove", handleMouseMove, false);
    playheadCanvas.addEventListener("mouseup", handleMouseUp, false);
     playheadCanvas.addEventListener("mouseout", handleMouseUp, false);
      playheadCanvas.addEventListener("mouseleave", handleMouseUp, false);
      window.addEventListener("resize", onResize);
}




function initAudioCtx(){
  audioCtx = new window.AudioContext();
  compressor = audioCtx.createDynamicsCompressor();
  compressor.connect(audioCtx.destination);
  scaleFrequencies = ScaleMaker.makeScale(settings.scale.type, 'C3', settings.scale.numSteps).inHertz;
  synth = new Synthesizer(scaleFrequencies, compressor, audioCtx);
}

function nextStep(){
  //var col = Math.floor(audioCtx.currentTime*settings.speed);
  var step = Math.floor((audioCtx.currentTime - prevTime)*(settings.speed*400-200));
  var col = colPos + step;
 if(col>=imageCanvas.canvas.width){
  while(col>=imageCanvas.canvas.width){
    col-=imageCanvas.canvas.width;
  }
 }
 if(col < 0) col+=imageCanvas.canvas.width;
  playheadCtx.clearRect(0, 0, playheadCanvas.width, playheadCanvas.height);

    playheadCtx.fillStyle = "rgba(255, 0, 102, 1)";
    playheadCtx.fillRect(col-5, 0, 10, imageCanvas.canvas.height);
    playheadCtx.fillStyle = "rgba(153, 255, 204, 1)";
  
  var gainVals = [];
  for(var i = 0; i < settings.scale.numSteps; i++){
       var row = Math.floor((i+0.5)*imageCanvas.canvas.height/settings.scale.numSteps);
       var off = (row*imageCanvas.canvas.width+col)*4;
       var val;
      
        //val = imageCanvas.imageData[off]+imageCanvas.imageData[off+1]+imageCanvas.imageData[off+2])/(255*3);
       val = (imageCanvas.imageData[off]+drawCanvas.imageData[off]*(drawCanvas.imageData[off+3]/255))/255;
      // console.log(val);
      // console.log(row);
       // }
        playheadCtx.fillRect(col-5, row, 10, val*5);
        gainVals[i] = val;
       // if(val > 0) synth.playNote(i, val);
    }
 synth.updateGains(gainVals);
  requestId = requestAnimationFrame(nextStep);
  colPos = col;
  prevTime = audioCtx.currentTime;
}


function handleMouseStart(e){
  // isScrubbing = true;
  // console.log(e.pageX);
  // colPos = e.pageX;
  // console.log(colPos);
  drawCanvas.startStroke(e.pageX, e.pageY);
}

function handleMouseMove(e){
  // if(isScrubbing){
  //    colPos = e.pageX;
  //  } 
   drawCanvas.continueStroke(e.pageX, e.pageY);
}

function handleMouseUp(){
  //isScrubbing = false;
  drawCanvas.endStroke();
}

function handleTouchStart(e) {
  // isScrubbing = true;
  //  var touches = e.changedTouches;
  if(e.touches!=undefined){
    // colPos = e.touches[0].pageX;
    drawCanvas.startStroke(e.touches[0].pageX, e.touches[0].pageY);
  }
}

function onResize(){
  imageCanvas.resize(window.innerWidth, window.innerHeight);
  drawCanvas.resize(window.innerWidth, window.innerHeight);
  playheadCanvas.width = window.innerWidth;
  playheadCanvas.height = window.innerHeight;
}

function handleTouchMove(e) {
  drawCanvas.continueStroke(e.touches[0].pageX, e.touches[0].pageY);
  
}

function handleTouchEnd(e) {
  drawCanvas.endStroke();
}

function handleTouchCancel(e) {
  
}