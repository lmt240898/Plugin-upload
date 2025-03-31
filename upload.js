(function() {

    /**
     * Upload plugin
     * @param {Object} objparams - Config parameters
     * @param {string} objparams.server_url_validate - URL endpoint for file validation, example: "validate-file"
     * @param {Array} objparams.allow_ext - Array of allowed file extension with MIME types
     *                                      example: [{ext: "jpg", mime: "image/jpeg"}, {ext: "png", mime: "image/png"}]
     * @param {string} objparams.alert_ext - Error message for invalid file extension, example: "Please choose file jpg, png"
     * @param {string} objparams.alert_max_file_size - Error message for file size limit, example: "File does not exceed 2MB"
     * @param {string} objparams.alert_max_images - Error message for maximum images, example: "allow uploading 5 images"
     * @param {number} objparams.max_file_size - Maximum file size allowed in MB, example: 2
     * @param {number} objparams.max_images - Maximum number of images allowed, example: 5
     */
    $.fn.Upload = function(objparams) {
        let selectors = this;
        
        // Default parameters
        let defaults = {
            type                : 'Single',
            server_url_validate : '',
            allow_ext           : [{ext: 'jpg', mime: 'image/jpeg'}, {ext: 'png', mime: 'image/png'}],
            text_upload:        'Drag and drop or select files',
            alert_ext           : "Invalid file extension",
            alert_max_file_size : "File size exceeds limit",
            alert_max_images    : "Too many images",
            max_file_size       : 2,
            max_images          : 5
        };
        
        // Merge provided parameters with defaults
        let params = $.extend({}, defaults, objparams || {});

        // Class name for created elements
        params.className = {
            container_upload    : 'container_upload',
            container_image     : 'container_image',
            container_no_image  : 'container_no_image',
            box_icon_upload     : 'box_icon_upload',
            text_upload         : 'text_upload',
            item_image          : 'item_image',
            icon_remove         : 'fas fa-trash-alt',
            icon_edit           : 'fas fa-pencil-alt',
            icon_file           : "ic-file",
            icon_upload         : 'fas fa-cloud-upload-alt',  
            icon_alert          : 'fas fa-exclamation-triangle',
            alert               : "alert",
            overlay             : "overlay",        
        }

        // hide input file
        $(selectors).hide();

        function Single(selector) {
            // set selector for prototype used
            this.selector = selector;
            this.parentSelector = selector.parentElement;
            this.container();
        }

        // set container function for Single
        Single.prototype.container = function() {
            // create container upload
            let containerUpload            = document.createElement("DIV");
            containerUpload.className      = params.className.container_upload;
            $(this.parentSelector).append(containerUpload);

            //  create container image
            let containerImage            = document.createElement("DIV");
            containerImage.className      = params.className.container_image;
            $(containerUpload).append(containerImage);

            // create text upload
            let textUpload               = document.createElement("DIV");
        }; 

        // set init function for Single
        Single.prototype.init = function() { console.log('init') }; 

        // Object function
        const functions = {
            Single
        };

        if (functions[params.type]) {
            return $.each(selectors, function(index, selector) {
                return new functions[params.type](selector);
            });
        }
        
    };
})();