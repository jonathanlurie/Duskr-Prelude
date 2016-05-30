var AppController = function(){
    // array of images and their data
    this.images = [];

    this.eventEmiter = new EventEmitter();
    this.fileIO = new FileIO();
    this.generator = new Generator();

    this._registerEvents();
}



AppController.prototype._registerEvents = function(){
    var that = this;

    // listen from file dialog
    this.eventEmiter.on('addImageFiles', function (data) {
        that.addImageFiles(data.filepaths);
    });
}


AppController.prototype.addImageFiles = function(filepaths){

    // create a ImageData instance for each files
    for(var i=0; i< filepaths.length; i++){
        this.images.push(new ImageData(filepaths[i]));
    }

    $("#imageLoadedInfo").text(filepaths.length + " images loaded");
}


AppController.prototype.generateImageInfo = function(){
    var outputString = "";

    for(var i=0; i<this.images.length; i++){
        outputString += this.generator.generateImageInfoFromImageData(this.images[i]);
    }

    $("#output").val(outputString);
}


AppController.prototype.flushImages = function(){
    this.images = [];
    $("#imageLoadedInfo").text("0 image loaded");
    $("#output").val("");
}

/*

    // listen
    appController.eventEmiter.on('loadNewTrack', function (data) {
        that.loadNewTrack(data.filepath, data.filetype, data.buffer);
    });

    // emit
    appController.eventEmiter.emit('fileAlreadyLoaded', { filepath: filepath});
*/
