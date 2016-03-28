class ImageCanvas {
	constructor(settings, handlePlay){
		//output canvas
		this.canvas = document.createElement("canvas");
	   this.canvas.width = window.innerWidth;
	   this.canvas.height = window.innerHeight;
	   this.canvas.style.position = "fixed";
	   this.canvas.style.top = "0px";
	   this.canvas.style.left = "0px";
	 this.settings = settings;
	 this.handlePlay = handlePlay;

	 //filtered image
	 this.filterCanvas = document.createElement("canvas");
	   this.filterCanvas.width = window.innerWidth;
	   this.filterCanvas.height = window.innerHeight;
	  this.filterCtx = this.filterCanvas.getContext('2d');
	  this.ctx = this.canvas.getContext('2d');
	  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	  //this.ctx = ctx;
	  document.body.appendChild(this.canvas);
	   this.loadImage("./images/nightsky.jpg");
	}

	

	clearImage(){
		console.log("clearing");
			this.ctx.globalCompositeOperation="source-over";

		this.filterCtx.fillStyle = "rgb(0, 0, 0)";
		this.filterCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "rgb(0, 0, 0)";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		//var data = [];
		 this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
	        //Data of what is currently being displayed
	        this.imageData = this.data.data;
	        //data of original image
	        	this.originalData = [];
	   	for(var i = 0; i < this.data.data.length; i++){
	   		this.originalData[i] = this.data.data[i];
	   	}
	}

	loadImage(filename){
   		console.log(filename);
    	var img = new Image();
    	img.src = filename;
    	img.onload = function() {
    		this.filterCtx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    		 this.ctx.fillStyle = "rgb(0, 0, 0)";
	   		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	  		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	        this.ctx.drawImage(this.filterCanvas, 0, 0, this.canvas.width, this.canvas.height);
	        this.toGrayscale();
	         if(this.settings.play) this.handlePlay();
        }.bind(this);
        this.img = img;
	}

	resize(w, h){
		this.canvas.width = w;
		this.canvas.height = h;
		this.filterCanvas.width = w;
		this.filterCanvas.height = h;
		this.filterCtx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(this.filterCanvas, 0, 0, this.canvas.width, this.canvas.height);
		this.toGrayscale();
	}

	toGrayscale(){
		//0.299r + 0.587g + 0.114b.
		  this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		  var imageData = this.data.data;
		 for(var i = 0; i < imageData.length; i += 4) {
	          var grey = imageData[i]*0.299 + imageData[i+1]*0.587 + imageData[i+2]*0.114;
	          imageData[i] = grey;
	          // green
	          imageData[i + 1] = grey;
	          // blue
	          imageData[i + 2] = grey;
	        }
	     //  this.data.data = imageData;
	    this.ctx.putImageData(this.data, 0, 0);
	    this.filterCtx.putImageData(this.data, 0, 0);
	    this.imageData = imageData;
	  
	   
	   	this.originalData = [];
	   	for(var i = 0; i < imageData.length; i++){
	   		this.originalData[i] = imageData[i];
	   	}
	   	console.log(this.originalData);
	   	console.log(imageData);
	   	// this.ctx.putImageData(this.data, 0, 0);
	   if(this.settings.invert){
	        	this.invert();
	        } else {
	        	this.calculatePixels();
	        }
	}

	drawRepetitions(){
		var rotation = this.settings.rotation*Math.PI*2;
		var width = this.canvas.width/(1+this.settings.repetitions.x*5);
		var height = this.canvas.height/(1+this.settings.repetitions.y*5);
		console.log(this.settings.spacing.x);
		var spacingX = (3*this.settings.spacing.x + 0.5)*width;
		var spacingY = (3*this.settings.spacing.y + 0.5)*height;
		var numCols = this.canvas.width/spacingX;
		var numRows = this.canvas.height/spacingY;
		 var modCanvas = document.createElement("canvas");
	   modCanvas.width = width;
	   modCanvas.height = height;
	  var modCtx = modCanvas.getContext('2d');
	  modCtx.translate(width/2, height/2);
	  modCtx.rotate(rotation);
	  modCtx.drawImage(this.filterCanvas, -width/2, -height/2, width, height);
	  this.ctx.fillStyle = "rgb(0, 0, 0)";
	   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.globalCompositeOperation="lighter";
	  for(var i = 0; i < numCols+1; i++){
	  	for(var j = 0; j < numRows; j++){
	  		var xPos = i*spacingX- this.settings.offset.x*spacingX*j;
	  		var yPos = j*spacingY- this.settings.offset.y*spacingY*i;

	  		if(xPos <= -spacingX) xPos += this.canvas.width;
	  		if(yPos <= -spacingY) yPos += this.canvas.height;
	  		//if(xPos > this.canvas.width) xPos -= this.canvas.width;
	  		this.ctx.drawImage(modCanvas, xPos, yPos, width, height);
	  	}
	  }
	 // this.ctx.drawImage(modCanvas, 0, 0, width, height);
	   this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
	        this.imageData = this.data.data;
	        //this.originalData = this.data.data.slice(0);
	}

	invert(){
	 // imageData ;

	   for(var i = 0; i < this.imageData.length; i += 4) {
	   	//if(this.originalData[i] < 10) console.log(this.imageData[i]);
	          //red
	          this.imageData[i] = 255 - this.originalData[i];
	          // green
	          this.imageData[i + 1] = 255 - this.originalData[i + 1];
	          // blue
	          this.imageData[i + 2] = 255 - this.originalData[i + 2];
	        }
	    this.ctx.putImageData(this.data, 0, 0);
	     this.filterCtx.putImageData(this.data, 0, 0);
	   		this.originalData = [];
	   	for(var i = 0; i < this.data.data.length; i++){
	   		this.originalData[i] = this.data.data[i];
	   	}
	  this.calculatePixels();
	}

	regenerateImage(){

	}
	//adjust brightness and contrast based on settings
	calculatePixels(){
		//var this.settings.contrast = e.value*255*2 -255;
	  	var contrast = 255*this.settings.contrast*2 - 255;
	  	var brightness = 255 * this.settings.brightness*2 - 255;
	  	console.log(contrast);
	  	var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
	  	for(var i = 0; i < this.imageData.length; i += 4) {
	          // red
        	this.imageData[i] = factor * (this.originalData[i]+brightness - 128) + 128;
        	this.imageData[i+1] = factor * (this.originalData[i+1]+brightness - 128) + 128;
        	this.imageData[i+2] = factor * (this.originalData[i+2]+brightness - 128) + 128;
    	}
    	this.ctx.putImageData(this.data, 0, 0);
    	this.filterCtx.putImageData(this.data, 0, 0);
    	this.drawRepetitions();
	}
}

export { ImageCanvas as default}