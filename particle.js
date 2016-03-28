class Particle {
	constructor(x, y, color, ctx, audioCtx){
		console.log("construction particle");
		this.color = color;
		this.x = x;
		this.y = y;
		this.prevX = x;
		this.prevY = y;
		this.ctx = ctx;
		this.oscillator = audioCtx.createOscillator();
		this.envelope = audioCtx.createGain();
		this.oscillator.frequency.value = 440;
		this.oscillator.type = 'sine';
		this.envelope.connect(audioCtx.destination);
		this.envelope.gain.value = 0;
		this.envelope.gain.setTargetAtTime(1, audioCtx.currentTime, 0.1)

		this.oscillator.connect(this.envelope);
		this.oscillator.start(audioCtx.currentTime);
		this.audioCtx = audioCtx;
		this.updatePosition(x, y, 10);

		 this.vibrato = audioCtx.createGain()
		this.vibrato.gain.value = 30;
		this.vibrato.connect(this.oscillator.detune)

		this.lfo = audioCtx.createOscillator()
		this.lfo.connect(this.vibrato)
		this.lfo.frequency.value = x/10

		this.lfo.start(this.audioCtx.currentTime);
//this.vibrato = vibrato;

//lfo.stop(endTime + 2)
	}

	draw(){

	}

	updatePosition(x, y, radius){
		this.prevX = this.x;
		this.prevY = this.y;
		this.x = x;
		this.y = y;
		this.ctx.fillStyle = this.color;
  		
  		var d = Math.floor(y/20*100);

  		
  		console.log(d);
  		this.oscillator.detune.value = d;
  		
  		var drawX = Math.floor(x/10)*10;
  		var drawY = Math.floor(y/10)*10;
  		var diffY = this.prevY - this.y;
  		var width;
  		if(diffY < 0.01){
  			width =  10000;
  		} else {
  			width = 300-Math.abs(this.prevY - this.y)*5;
  		}
  		var diffX =  2+Math.abs(this.prevX - this.x)*2
  		this.ctx.fillRect(drawX-width/2, drawY,width,diffX);
  	//	this.envelope.gain.value = x/10;
  		if(this.vibrato){
  			//this.lfo.frequency.value = x/10;
  			this.vibrato.gain.value = x*0.2;
  		}
  		console.log(this.lfo);
  		
  		// this.ctx.beginPath();
    //   this.ctx.arc(x, y, 20, 0, 2 * Math.PI, false);
    //   this.ctx.fillStyle = this.color;
    //   this.ctx.fill();
	}

	end(){
	
		// var envelope = this.audioCtx.createGain()
  // 		envelope.connect(this.audioCtx.destination)
  // 		this.oscillator.connect(envelope);
  	//	this.envelope.gain.value = 1
  		var dif = 0.2 + Math.abs(this.prevX - this.x)*0.1;
  
  this.envelope.gain.setTargetAtTime(0, this.audioCtx.currentTime, dif)
  this.oscillator.stop(this.audioCtx.currentTime+dif+2);
	}
}

export { Particle as default}