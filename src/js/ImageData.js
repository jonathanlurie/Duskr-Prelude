/*
    see
    http://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf
    Annex C (p. 164) for translation from ApertureValue to F Number
    and from ShutterSpeed value to shutter time
*/


var ImageData = function(filepath){
    this.filepath = filepath;
    this.imageExif = null;
    this.exifSelection = {
        cameraModel: undefined,
        lensModel: undefined,
        dateTaken: undefined,
        Fnumber: undefined,
        speed: undefined,
        iso: undefined,
        focalLength35: undefined,
        gpsLat: undefined,
        gpsLon: undefined
    };

    this._loadExif();
}

ImageData.prototype._loadExif = function(){

    console.log(this.filepath);

    try{
        var jpeg = fs.readFileSync(this.filepath);
        var jpegData = jpeg.toString("binary");
        this.imageExif = piexif.load(jpegData);

        // Camera model
        try{
            this.exifSelection.cameraModel = this.imageExif["0th"][piexif.ImageIFD.Model];
        }catch(e){
            console.log("WARNING: could not fetch Camera Model")
        }

        // Lens model
        try{
            this.exifSelection.lensModel = this.imageExif["Exif"][piexif.ExifIFD.LensModel];
        }catch(e){
            console.log("WARNING: could not fetch Lens Model")
        }

        // Date
        try{
            var datetime = this.imageExif["Exif"][piexif.ExifIFD.DateTimeOriginal].split(" ");
            var date = datetime[0].replace(/:/g,'-');
            var time = datetime[1];
            var datetimeNiceFormat = date + "T" + time + "Z";
            // creating a date based on the written hour for the current TZ
            this.exifSelection.dateTaken = new Date(datetimeNiceFormat);
            this.exifSelection.dateTaken.setTime(
                this.exifSelection.dateTaken.getTime() +
                this.exifSelection.dateTaken.getTimezoneOffset()*60*1000 );
        }catch(e){
            console.log("WARNING: could not fetch Date Taken")
        }

        // Aperture
        try{
            this.exifSelection.Fnumber = this.imageExif["Exif"][piexif.ExifIFD.FNumber][0] /
                this.imageExif["Exif"][piexif.ExifIFD.FNumber][1];
        }catch(e){
            console.log("WARNING: could not fetch F Number")
        }

        // Speed
        try{
            if(this.imageExif["Exif"][piexif.ExifIFD.ExposureTime][0] > this.imageExif["Exif"][piexif.ExifIFD.ExposureTime][1]){
                this.exifSelection.speed = this.imageExif["Exif"][piexif.ExifIFD.ExposureTime][0];
            }else{
                this.exifSelection.speed = this.imageExif["Exif"][piexif.ExifIFD.ExposureTime][0] + "/" + this.imageExif["Exif"][piexif.ExifIFD.ExposureTime][1];
            }
        }catch(e){
            console.log("WARNING: could not fetch Speed")
        }

        // ISO
        try{
            this.exifSelection.iso = this.imageExif["Exif"][piexif.ExifIFD.ISOSpeedRatings]
        }catch(e){
            console.log("WARNING: could not fetch ISO")
        }

        // GPS
        try{
            var GPSLatitudeRef = this.imageExif["GPS"][piexif.GPSIFD.GPSLatitudeRef];
            var GPSLatitude = this.imageExif["GPS"][piexif.GPSIFD.GPSLatitude];
            var GPSLongitudeRef = this.imageExif["GPS"][piexif.GPSIFD.GPSLongitudeRef];
            var GPSLongitude = this.imageExif["GPS"][piexif.GPSIFD.GPSLongitude];

            var lat = (GPSLatitude[0][0]/GPSLatitude[0][1] + (GPSLatitude[1][0]/GPSLatitude[1][1])/60. + (GPSLatitude[2][0]/GPSLatitude[2][1])/3600.);

            var lon = (GPSLongitude[0][0]/GPSLongitude[0][1] + (GPSLongitude[1][0]/GPSLongitude[1][1])/60. + (GPSLongitude[2][0]/GPSLongitude[2][1])/3600.);

            if(GPSLatitudeRef=="S"){
                lat *= (-1);
            }

            if(GPSLongitudeRef=="W"){
                lon *= (-1);
            }

            this.exifSelection.gpsLat = lat;
            this.exifSelection.gpsLon = lon;
        }catch(e){
            console.log("WARNING: could not fetch GPS")
        }


        try{
            this.exifSelection.focalLength35 = this.imageExif["Exif"][piexif.ExifIFD.FocalLengthIn35mmFilm]
        }catch(e){
            console.log("WARNING: could not fetch Focal Length equiv for 35mm")
        }


    }catch(e){
        console.log("ERROR: could not read the file as image: " + this.filepath);
    }

    console.log(this.imageExif);
    console.log(this.exifSelection);

}


/*
    create a copy of this.exifSelection but with only non-undefined data
*/
ImageData.prototype.createMapOfAvailableFields = function(){
    var availableFields = {};
    availableFields["basename"] = path.basename(this.filepath);

    for(var tag in this.exifSelection){

        if (typeof this.exifSelection[tag] !== "undefined" &&
            this.exifSelection[tag] != null)
        {
            availableFields[tag] = this.exifSelection[tag];
        }
    }

    return availableFields;
}
