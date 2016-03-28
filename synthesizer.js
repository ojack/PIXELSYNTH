class Synthesizer {
	constructor(frequencies, compressor, ctx){
		this.frequencies = frequencies;
		this.ctx = ctx;
		this.oscillators = [];
		this.compressor = compressor;
		this.initOscillators(frequencies);
	}

	playNote(index, gainVal){
		var osc = this.ctx.createOscillator();
		osc.type = 'sine';
	//	//console.log(osc.frequency);
		osc.frequency.value = this.frequencies[this.frequencies.length-1-index];
		var gain = this.ctx.createGain();
    	gain.connect(this.compressor);
    	gain.gain.value = 0;
    	osc.connect(gain);
    	gain.gain.linearRampToValueAtTime(gainVal, this.ctx.currentTime+0.1);
    	gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime+0.8);
    	osc.start();
    	osc.stop(this.ctx.currentTime+ 0.8);
	}
	initOscillators(frequencies){	
		//console.log(frequencies);
  		for(var i = 0; i < frequencies.length; i++){
    		var osc = this.ctx.createOscillator();
   			osc.type = 'sine';
   			var gain = this.ctx.createGain();
    		gain.connect(this.compressor);
    		gain.gain.value = 0.0;
    		osc.connect(gain);
    		osc.frequency.value = frequencies[frequencies.length-1-i];
    		//console.log(osc);
    		osc.start(this.ctx.currentTime);
    		this.oscillators[i] = {osc: osc, gain: gain, val: 0};
  		}
  		//console.log(this.oscillators);, 0
	}

	updateGains(gainVals){
		for(var i = 0; i < gainVals.length; i++){
			if(this.oscillators[i].val!=gainVals[i]){
      			this.oscillators[i].val=gainVals[i];
      			this.oscillators[i].gain.gain.cancelScheduledValues(this.ctx.currentTime);
        		this.oscillators[i].gain.gain.linearRampToValueAtTime(gainVals[i], this.ctx.currentTime+0.1);
      		}
		}
		
	}

	endSynth(){
		//console.log(this.oscillators);
		for(var i = 0; i < this.oscillators.length; i++){
			this.oscillators[i].gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime+0.8);
			this.oscillators[i].osc.stop(this.ctx.currentTime+0.8);
		}
	}
}

export { Synthesizer as default}