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
            type                : 'single',
            server_url_validate : '',
            allow_ext           : [{ext: 'jpg', mime: 'image/jpeg'}, {ext: 'png', mime: 'image/png'}],
            text_upload         : '<p>Drag and drop or select files </p> <p>(.jpg, .png and max size 2mb)</p> ',
            alert_ext           : "Invalid file extension",
            alert_max_file_size : "File size exceeds limit",
            alert_max_images    : "Too many images",
            max_file_size       : 2,
            max_images          : 1
        };
        
        // Merge provided parameters with defaults
        let params = $.extend({}, defaults, objparams || {});

        // Class name for created elements
        params.className = {
            container_upload    : 'container_upload',
            container_image     : 'container_image',
            box_image           : 'box_image',
            container_no_image  : 'container_no_image',
            box_icon_upload     : 'box_icon_upload',
            box_button          : 'box_button',
            mess_upload         : 'mess_upload',
            mess_alert          : 'mess_alert',
            item_image          : 'item_image',
            icon_remove         : 'fas fa-trash-alt',
            icon_edit           : 'fas fa-pencil-alt',
            icon_file           : "ic-file",
            icon_upload         : 'fas fa-cloud-upload-alt',  
            icon_alert          : 'fas fa-exclamation-triangle',
            alert               : "alert_message",
            overlay             : "bg-overlay",
            detect              : params.type + "_init",
        }

        // hide input file
        $(selectors).hide();

        function single(selector) {
            // set selector for prototype used
            this.selector = selector;
            this.parentSelector = selector.parentElement;
        }

        // set container function for single
        single.prototype.container = function() {

            // create container upload
            this.containerUpload            = document.createElement("DIV");
            this.containerUpload.classList.add(params.className.container_upload, params.className.detect);
            $(this.parentSelector).append(this.containerUpload);

            // create container image
            this.containerImage             = document.createElement("DIV");
            this.containerImage.className   = params.className.container_image;
            $(this.containerUpload).append(this.containerImage);

            // create background overplay when hover
            this.backgroundOverplay         = document.createElement("SPAN");
            this.backgroundOverplay.classList.add(params.className.overlay);
            $(this.containerUpload).append(this.backgroundOverplay);

        }; 

        // create mess explain upload
        single.prototype.messageUpload = function() {
            this.messUpload  = document.createElement("DIV");
            this.messUpload.className  = params.className.mess_upload;
            $(this.containerImage).append(this.messUpload);

            // create element text upload
            this.textUpload  = document.createElement("p");
            $(this.textUpload).html(params.text_upload);
            $(this.messUpload).html(params.text_upload);
        }

        // create box image
        single.prototype.createBoxImage = function(file) {
            this.boxImage = document.createElement("DIV");
            this.boxImage.className = params.className.box_image;

            this.elmImage = document.createElement("img");
            this.elmImage.className = params.className.item_image;
            this.elmImage.src = "";

            $(this.boxImage).html(this.elmImage);
            $(this.containerImage).html(this.boxImage);

            // create button edit, remove
            this.boxButton = document.createElement("DIV");
            this.boxButton.className = params.className.box_button;

            this.elmButtonEdit  = document.createElement("i");
            this.elmButtonEdit.className = params.className.icon_edit;
            this.elmButtonRemove  = document.createElement("i");
            this.elmButtonRemove.className = params.className.icon_remove;
            $(this.boxButton).append(this.elmButtonEdit);
            $(this.boxButton).append(this.elmButtonRemove);

            $(this.containerImage).append(this.boxButton);

            if (file) {
                this.showImage(file, this.elmImage);
            }
        }

        // Show image
        single.prototype.showImage = function(file, elmImage) {
            const reader = new FileReader();
            reader.onload = function(e) {
            // Khi đọc xong, gán src cho thẻ img
            elmImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        };

        // trigger file upload
        single.prototype.triggerClickUpload = function() {
            var _this = this;
            $(document).on('click', '.' + params.className.detect, function() {
                $(_this.selector).trigger('click');
            });

            console.log(_this.selector.className);
            // // listen file upload
            $(document).on('change', '.' + _this.selector.className, function() {
                const files = this.files;
                if (files.length > 0) {
                    _this.uploadFile(files);
                    console.log(files[0]);
                }
            });
        };

        // trigger drag file upload
        single.prototype.triggerDragUpload = function() {
            var _this = this;

            // add event for drag and drop
            let getDropare = $(_this.selector).parent('div').find('.' + params.className.detect);
            $(getDropare).each((key,obj)=>{
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                    obj.addEventListener(evtName, (e) => e.preventDefault());
                });
            }); 

            // Drag file and active border
            $(document).on('dragenter, dragover', '.' + params.className.detect, function(e) 
            {
                let __this_dragenter = this;
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                    __this_dragenter.addEventListener(evtName, (e) => e.preventDefault());
                });

                $(__this_dragenter).addClass("active_drag");
            });

            // Leave file and remove border
            $(document).on('dragleave', '.' + params.className.detect, function(e) 
            {
                let __this_dragleave = this;
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                    __this_dragleave.addEventListener(evtName, (e) => e.preventDefault());
                });

                $(__this_dragleave).removeClass("active_drag");
            });
        };

        // trigger drop file
        single.prototype.triggerDropUpload = function() {
            var _this = this;
            $(document).on('drop', '.' + params.className.detect, function(e) {
                e.preventDefault();
                $(this).removeClass('active_drag');
                const files = e.originalEvent.dataTransfer.files;
                if (files.length > 0) {
                    _this.uploadFile(files);
                }
            });
        }

        // message when invalid file or no file
        single.prototype.handleMessageUpload = function(mess) {
           $(this.messUpload).html('');

           let elmicon  = document.createElement("i");
               elmicon.className = params.className.mess_upload;
           $(this.messUpload).append(elmicon);

           let elmMessage  = document.createElement("p");
               elmMessage.className = params.className.alert;
           $(elmMessage).addClass(params.className.alert);
               $(elmMessage).html(mess);
           $(this.messUpload).append(elmMessage);
        }

        single.prototype.uploadFile = function(files) {

            if (files.length > params.max_images) {
                this.handleMessageUpload(params.alert_max_images);
                return;
            }

            // check extension
            const fileExt = files[0].name.split('.').pop().toLowerCase();
            const isValidExt = params.allow_ext.some(extObj => extObj.ext === fileExt);
            if (!isValidExt) {
                this.handleMessageUpload(params.alert_ext);
                return;
            }

            // check file size
            const fileSizeMB = files[0].size / (1024 * 1024);
            if (fileSizeMB > params.max_file_size) {
                this.handleMessageUpload(params.alert_max_file_size);
                return;
            }

            // show image
            this.createBoxImage(files[0]);
        }

        // set init function for single
        single.prototype.init = function() { 
            // create container upload
            this.container(); 
            // create mess explain upload like: "Drag and drop or select files"
            this.messageUpload();
            // call trigger click upload
            this.triggerClickUpload();
            // call trigger drag file
            this.triggerDragUpload();
            // call trigger drop file
            this.triggerDropUpload();
        };

        // Object function
        const functions = {
            single
        };

        if (functions[params.type]) {
            return $.each(selectors, function(index, selector) {
                return new functions[params.type](selector).init();
            });
        }
        
    };
})();