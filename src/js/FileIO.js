var FileIO = function(){

}


//  Callback: function to open the file from clicking the "open" button
FileIO.prototype.openImgDialog = function() {



    dialog.showOpenDialog({
        filters: [{
            name: 'Image files',
            extensions: ['jpeg', 'JPEG', 'jpg', 'JPG'] }
        ],
        properties: [ 'openFile', 'multiSelections' ]},

        function (fileNames) {
            if (fileNames === undefined)
                return;

            appController.eventEmiter.emit('addImageFiles', { filepaths: fileNames});

        }
    );
}
