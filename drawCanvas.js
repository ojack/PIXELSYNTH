class drawCanvas {
	constructor(settings){
		//output canvas
		this.canvas = document.createElement("canvas");
	   this.canvas.width = window.innerWidth;
	   this.canvas.height = window.innerHeight;
	   this.canvas.style.position = "fixed";
	   this.canvas.style.top = "0px";
	   this.canvas.style.left = "0px";
	 this.settings = settings;
	 this.isDrawing = false;
	  this.ctx = this.canvas.getContext('2d');
	 this.ctx.lineJoin="round";
	 this.ctx.lineCap="round";

	  document.body.appendChild(this.canvas);
	  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	   this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
	        //Data of what is currently being displayed
	    this.imageData = this.data.data;
	}

	startStroke(x, y){
		this.prevX = x;
		this.prevY = y;
   		this.ctx.strokeStyle = "#fff";
   		//this.ctx.fillRect(x, y, 10, 10);
   		this.isDrawing = true;
   		//console.log(this.settings.eraser);
   		if(this.settings.eraser == 1){
   			console.log("erasing");
   			this.ctx.globalCompositeOperation = "destination-out";
   			this.ctx.strokeStyle = "rgba(0,0,0,1)";
   			this.ctx.lineWidth = 10.0 + this.settings.stroke_width*100;

		} else {
			this.ctx.globalCompositeOperation = "source-over";
   			this.ctx.strokeStyle = "rgba(255, 255, 255,"+this.settings.stroke_opacity + ")";
   			this.ctx.lineWidth = 0.1 + (this.settings.stroke_width*4+1)*(this.settings.stroke_width*4+1)*(this.settings.stroke_width*4+1);

		}
	}

	continueStroke(x, y){
		if(this.isDrawing){
			var repetitions = 1;
			if(!this.settings.eraser) repetitions = Math.ceil(this.settings.stroke_repetitions*10);
			var xOffset = this.settings.stroke_offset.x*200 -100;
			var yOffset = this.settings.stroke_offset.y*200 -100;
			//console.log(repetitions);

			for(var i = 0; i < repetitions; i++){
				//this.ctx.fillRect(x, y, 10, 10);
				//this.ctx.lineWidth = 0.1 + (this.settings.stroke_width*4+1)*(this.settings.stroke_width*4+1)*(this.settings.stroke_width*4+1);
				this.ctx.beginPath();
	      		this.ctx.moveTo(this.prevX+xOffset*i, this.prevY+yOffset*i);
	      		this.ctx.lineTo(x+xOffset*i, y+yOffset*i);
	      		this.ctx.stroke();
	      		
			}
			this.prevX = x;
	      	this.prevY = y;
		}
	}

	resize(w, h){
		var tempCanvas = document.createElement("canvas");
	   tempCanvas.width = w;
	   tempCanvas.height = h;
	   var tempCtx = tempCanvas.getContext('2d');
	   tempCtx.drawImage(this.canvas, 0, 0, w, h);
		this.canvas.width = w;
		this.canvas.height = h;
		this.ctx.drawImage(tempCanvas, 0, 0);
		  this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
	    this.imageData = this.data.data;
	}

	clear(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.imageData = this.data.data;
	}
	endStroke(){
		this.isDrawing = false;
		this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.imageData = this.data.data;
	}

}

export { drawCanvas as default}