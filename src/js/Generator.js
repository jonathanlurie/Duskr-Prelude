var Generator = function(){
    this.defaultTemplate =
`**{{cameraModel}}**{{#if lensModel}} & **{{lensModel}}**{{/if}}{{#if focalLength35}} at **{{focalLength35}}mm**,{{/if}}{{#if speed}} a speed of **{{speed}}sec**,{{/if}}{{#if Fnumber}} an aperture of **f/{{Fnumber}}**{{/if}}{{#if iso}} and **ISO{{iso}}**{{/if}}.{{#if gpsLat}} [See on a map](http://maps.google.com/?q={{gpsLat}},{{gpsLon}}){{/if}}  
![]({{urlPrefix}}/{{basename}})

`

    this.inUseTemplate = this.defaultTemplate;

    this.availableFields = [
        "{{cameraModel}}",
        "{{lensModel}}",
        "{{dateTaken}}",
        "{{Fnumber}}",
        "{{speed}}",
        "{{iso}}",
        "{{focalLength35}}",
        "{{gpsLat}}",
        "{{gpsLon}}",
        "{{basename}}",
        "{{urlPrefix}}"
    ];

    this.compiledTemplate = null;
    this.initializeTextarea();
    this.displayFieldButtons();

}


Generator.prototype.compileTemplate = function(){
    this.compiledTemplate = handlebars.compile($("#userTemplate").val());
}


/*
    TODO: allows loading a template from an external file (hbs)
*/
Generator.prototype.loadTemplate = function(filepath){

}


Generator.prototype.initializeTextarea = function(){
    console.log(this.inUseTemplate);
    $("#userTemplate").val(this.inUseTemplate);
}


Generator.prototype.displayFieldButtons = function(){

    var that = this;

    for(var f=0; f<this.availableFields.length; f++){

        var tempFieldButton = jQuery('<span/>', {
            field: this.availableFields[f],
            class: "button"
        });

        tempFieldButton.text(this.availableFields[f]);

        tempFieldButton.on('click', function(e){

            var fieldName = e.target.attributes.field.value
            var currentTaValue = $("#userTemplate").val();

            // if the cursor is at the end of the text area. also works when empty
            if($("#userTemplate").caret() == currentTaValue.length){
                $("#userTemplate").val(currentTaValue + fieldName);
            }
            // the cursor is somewhere in the text area
            else{
                var firstPart = currentTaValue.substring(0, $("#userTemplate").caret());
                var secondPart = currentTaValue.substring($("#userTemplate").caret(), currentTaValue.length);
                $("#userTemplate").val(firstPart + fieldName + secondPart);
            }
        });

        $(tempFieldButton).appendTo("#allFields");
    }

    /*
    var thumbWrapperDiv = jQuery('<div/>', {
        id: fileID,
    });
    $(thumbnail).appendTo(thumbWrapperDiv);
    */

}
/*
    uses an instance of ImageData and the Handlebars template
    to generate the image info (description)
*/
Generator.prototype.generateImageInfoFromImageData = function(imageData){

    this.compileTemplate();

    var availableFields = imageData.createMapOfAvailableFields();
    availableFields["urlPrefix"] = $("#urlPrefix").val();

    var generatedImageInfo = this.compiledTemplate(availableFields);

    return generatedImageInfo;
}
