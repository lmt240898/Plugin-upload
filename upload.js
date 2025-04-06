(function () {

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
     * @param {string} objparams.server_url - Server URL for API requests, example: "https://api.example.com"
     * @param {string} objparams.endpoint_remove - Endpoint for removing images, example: "remove-file"
     */
    $.fn.Upload = function (objparams) {
        const selectors = this;
        // Default parameters
        const defaults = {
            type: 'single',
            server_url: '',
            allow_ext: [{ ext: 'jpg', mime: 'image/jpeg' }, { ext: 'png', mime: 'image/png' }],
            text_upload: '<p >Drag and drop or select files </p> <p>(.jpg, .png and max size 2mb)</p> ',
            alert_ext: "Invalid file extension",
            alert_same_file: "Invalid files",
            alert_max_file_size: "File size exceeds limit",
            alert_max_images: "Too many images",
            max_file_size: 2,
            max_images: 1,
            input_name: 'default_file',
            endpoint_remove: ''
        };

        // Merge provided parameters with defaults
        const params = $.extend({}, defaults, objparams || {});

        // Class name for created elements
        params.className = {
            container_upload: 'container_upload',
            container_image: 'container_image',
            box_image: 'box_image',
            container_no_image: 'container_no_image',
            box_icon_upload: 'box_icon_upload',
            box_button: 'box_button',
            mess_upload: 'mess_upload',
            mess_alert: 'mess_alert',
            item_image: 'item_image',
            btn_remove: 'btn_remove',
            btn_edit: 'btn_edit',
            icon_remove: 'fas fa-trash-alt remove-file glyphicon glyphicon-trash',
            icon_edit: 'fas fa-pencil-alt edit-file glyphicon glyphicon-pencil',
            icon_file: "ic-file",
            icon_upload: 'fas fa-cloud-upload-alt',
            icon_alert: 'fas fa-exclamation-triangle',
            alert: "alert_message",
            overlay: "bg-overlay",
            detect: params.type + "_init",
        }

        const modalClassName = {
            modal: 'image-edit-modal',
            modal_content: 'modal-content',
            button_container: 'button-container',
            button: 'edit-button',
            crop_button: 'crop-button',
            rotate_left_button: 'rotate-left-button',
            rotate_right_button: 'rotate-right-button',
            close_button: 'close-button',
            image_container: 'image-container',
            edit_image: 'edit-image'
        }

        // hide input file
        $(selectors).hide();

        class Single {
            constructor(selector) {
                this.selector = selector;
                this.parentSelector = selector.parentElement;
            }

            // set container function for single
            container() {
                // create container upload
                this.containerUpload = document.createElement("DIV");
                this.containerUpload.classList.add(params.className.container_upload, params.className.detect);
                $(this.parentSelector).append(this.containerUpload);

                // create container image
                this.containerImage = document.createElement("DIV");
                this.containerImage.className = params.className.container_image;
                $(this.containerUpload).append(this.containerImage);

                // create background overplay when hover
                this.backgroundOverplay = document.createElement("SPAN");
                this.backgroundOverplay.classList.add(params.className.overlay);
                $(this.containerUpload).append(this.backgroundOverplay);
            }

            // create mess explain upload
            messageUpload() {
                this.messUpload = document.createElement("DIV");
                this.messUpload.className = params.className.mess_upload;
                $(this.containerImage).append(this.messUpload);

                // create element text upload
                this.textUpload = document.createElement("p");
                $(this.textUpload).html(params.text_upload);
                $(this.messUpload).html(params.text_upload);
            }

            // create box image
            createBoxImage() {
                this.boxImage = document.createElement("DIV");
                this.boxImage.className = params.className.box_image;

                this.elmImage = document.createElement("img");
                this.elmImage.className = params.className.item_image;
                this.elmImage.src = "";

                $(this.boxImage).html(this.elmImage);
                $(this.containerImage).html(this.boxImage);

                this.btnRemoveEdit();

                if (this.file) {
                    this.showImage(this.file, this.elmImage);
                }
            }

            // create button edit, remove
            btnRemoveEdit() {
                // create button edit, remove
                this.boxButton = document.createElement("DIV");
                this.boxButton.className = params.className.box_button;

                this.elmSpanEdit = document.createElement("span");
                this.elmSpanEdit.className = params.className.btn_edit;
                this.elmButtonEdit = document.createElement("i");
                this.elmButtonEdit.className = params.className.icon_edit;
                $(this.elmSpanEdit).append(this.elmButtonEdit);

                this.elmSpanRemove = document.createElement("span");
                this.elmSpanRemove.className = params.className.btn_remove;
                this.elmButtonRemove = document.createElement("i");
                this.elmButtonRemove.className = params.className.icon_remove;
                $(this.elmSpanRemove).append(this.elmButtonRemove);

                $(this.boxButton).append(this.elmSpanEdit);
                $(this.boxButton).append(this.elmSpanRemove);

                $(this.containerImage).append(this.boxButton);
            }

            // show image
            showImage(file, elmImage) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    // Khi đọc xong, gán src cho thẻ img
                    elmImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }

            // trigger file upload
            triggerClickUpload() {
                var _this = this;
                $(document).on('click', '.' + params.className.detect, function (e) {
                    if (!$(e.target).hasClass('fas')) {
                        e.stopPropagation();
                        $(_this.selector).trigger('click');
                    }
                });

                // listen file upload
                $(document).on('change', '.' + _this.selector.className, function () {
                    const files = this.files;
                    if (files.length > 0) {
                        _this.uploadFile(files);
                    }
                });
            }

            // trigger drag file upload
            triggerDragUpload() {
                var _this = this;

                // add event for drag and drop
                let getDropare = $(_this.selector).parent('div').find('.' + params.className.detect);
               
                $(getDropare).each((key, obj) => {
                    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                        obj.addEventListener(evtName, (e) => e.preventDefault());
                    });
                });

                // Drag file and active border
                $(document).on('dragenter, dragover', '.' + params.className.detect, function (e) {
                    let __this_dragenter = this;
                    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                        __this_dragenter.addEventListener(evtName, (e) => e.preventDefault());
                    });

                    $(__this_dragenter).addClass("active_drag");
                });

                // Leave file and remove border
                $(document).on('dragleave', '.' + params.className.detect, function (e) {
                    let __this_dragleave = this;
                    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                        __this_dragleave.addEventListener(evtName, (e) => e.preventDefault());
                    });

                    $(__this_dragleave).removeClass("active_drag");
                });
            }

            // trigger drop file
            triggerDropUpload() {
                var _this = this;
                $(document).on('drop', '.' + params.className.detect, function (e) {
                    e.preventDefault();
                    $(this).removeClass('active_drag');
                    const files = e.originalEvent.dataTransfer.files;
                    if (files.length > 0) {
                        _this.uploadFile(files);
                    }
                });
            }

            // message when invalid file or no file
            handleMessageUpload(mess) {
                $(this.messUpload).html('');

                let elmicon = document.createElement("i");
                elmicon.className = params.className.mess_upload;
                $(this.messUpload).append(elmicon);

                let elmMessage = document.createElement("p");
                elmMessage.className = params.className.alert;
                $(elmMessage).addClass(params.className.alert);
                $(elmMessage).html(mess);
                $(this.messUpload).append(elmMessage);
            }

            // upload file
            uploadFile(files) {
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

                this.file = files[0];
                // show image
                this.createBoxImage();
            }

            // trigger remove file
            triggerRemoveFile() {
                var _this = this;
                $(document).on('click', '.' + params.className.btn_remove, function (e) {
                    e.stopPropagation();
                    
                    // Check if there's an ID in the remove button or the image
                    const $removeBtn = $(this);
                    const imageId = $removeBtn.data('id') || 
                                    $removeBtn.closest('.' + params.className.container_image)
                                             .find('.' + params.className.item_image)
                                             .data('id');
                    
                    Swal.fire({
                        title: 'Do you want to delete?',
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // If ID exists, we need to handle server removal
                            if (imageId) {
                                // Construct API URL based on whether server_url exists
                                let apiUrl = params.endpoint_remove;
                                
                                // If server_url is provided, combine it with endpoint
                                if (params.server_url) {
                                    // Check if server_url ends with a slash and format accordingly
                                    if (params.server_url.charAt(params.server_url.length - 1) !== '/') {
                                        apiUrl = params.server_url + '/' + params.endpoint_remove;
                                    } else {
                                        apiUrl = params.server_url + params.endpoint_remove;
                                    }
                                }
                                
                                // Make AJAX request to remove image
                                $.ajax({
                                    url: apiUrl,
                                    method: 'POST',
                                    data: { id: imageId },
                                    success: function(response) {
                                        // Remove from DOM on success
                                        $(_this.selector).parent('div').find('.' + params.className.box_image).remove();
                                        _this.messageUpload();
                                        
                                        Swal.fire('Deleted!', 'The image has been deleted.', 'success');
                                    },
                                    error: function(xhr, status, error) {
                                        Swal.fire('Error!', 'Failed to delete image from server.', 'error');
                                        console.error('Error deleting image:', error);
                                    }
                                });
                            } else {
                                // No ID, just remove from DOM (local file)
                                $(_this.selector).parent('div').find('.' + params.className.box_image).remove();
                                _this.messageUpload();
                            }
                        }
                    });
                });
            }

            // trigger edit file
            triggerEditFile() {
                var _this = this;
                $(document).on('click', '.' + params.className.btn_edit, function (e) {
                    e.stopPropagation();
                    const imageUrl = $(this).closest('.' + params.className.container_image).find('.' + params.className.item_image).attr('src');
                    common.openModal(imageUrl, _this);
                });
            }

            // Load existing image from input element with class 'image-exist'
            loadExistingImage() {
                const existingImage = $(this.parentSelector).find('.image-exist');
                if (existingImage.length === 0) return;

                // Get image URL and ID from data attributes
                const imageUrl = $(existingImage).data('image');
                const imageId = $(existingImage).data('id');
                
                if (imageUrl) {
                    // Create box image
                    this.createBoxImage();
                    
                    // Set the source of the image
                    $(this.elmImage).attr('src', imageUrl);
                    
                    // Store the ID for server operations if needed
                    $(this.elmImage).data('id', imageId);
                }
            }

            // set init function for single
            init() {
                // create container upload
                this.container();
                // create mess explain upload like: "Drag and drop or select files"
                this.messageUpload();
                // Load existing image from HTML
                this.loadExistingImage();
                // call trigger click upload
                this.triggerClickUpload();
                // call trigger drag file
                this.triggerDragUpload();
                // call trigger drop file
                this.triggerDropUpload();
                // call trigger remove file
                this.triggerRemoveFile();
                // call trigger edit file
                this.triggerEditFile();
            }
        }

        class Multiple {
            constructor(selector) {
                this.selector = selector;
                this.parentSelector = selector.parentElement;
                this.files = [];
                this.serverImages = [];
            }

            // set container function for single
            container() {
                // create container upload
                this.containerUpload = document.createElement("DIV");
                this.containerUpload.classList.add(params.className.container_upload, params.className.detect);
                $(this.parentSelector).append(this.containerUpload);

                // create container image
                this.containerImage = document.createElement("DIV");
                this.containerImage.className = params.className.container_image;
                $(this.containerUpload).append(this.containerImage);

                // create background overplay when hover
                this.backgroundOverplay = document.createElement("SPAN");
                this.backgroundOverplay.classList.add(params.className.overlay);
                $(this.containerUpload).append(this.backgroundOverplay);
            }

            // create mess explain upload
            messageUpload() {
                this.messUpload = document.createElement("DIV");
                this.messUpload.className = params.className.mess_upload;
                $(this.containerImage).append(this.messUpload);

                // create element text upload
                this.textUpload = document.createElement("p");
                $(this.textUpload).html(params.text_upload);
                $(this.messUpload).html(params.text_upload);
            }

            // trigger file upload
            triggerClickUpload() {
                var _this = this;
                $(document).on('click', '.' + params.className.detect, function (e) {
                    if (!$(e.target).hasClass('fas')) {
                        e.stopPropagation();
                        $(_this.selector).trigger('click');
                    }
                });

                // listen file upload
                $(document).on('change', '.' + _this.selector.className, function () {
                    const files = this.files;
                    if (files.length > 0) {
                        _this.uploadFile(files);
                    }
                });
            }

            // upload file
            uploadFile(files) {
                if (files.length > params.max_images) {
                    this.handleMessageUpload(params.alert_max_images);
                    return;
                }

                // Track validation results for each file
                let validFiles = [];
                let invalidFiles = [];

                // Validate each file
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    // Check file extension
                    const fileExt = file.name.split('.').pop().toLowerCase();
                    const isValidExt = params.allow_ext.some(extObj => extObj.ext === fileExt);

                    // Check file size
                    const fileSizeMB = file.size / (1024 * 1024);
                    const isValidSize = fileSizeMB <= params.max_file_size;

                    if (isValidExt && isValidSize) {
                        validFiles.push(file);
                    } else {
                        invalidFiles.push(file);
                    }
                }

                // If all files are invalid, show error message
                if (validFiles.length === 0 && invalidFiles.length > 0) {
                    this.handleMessageUpload('Invalid files');
                    return;
                }
                console.log('validFiles');
                console.log(validFiles);
                this.files = validFiles;
                this.createBoxImages();

            }

            // create boxes for all images
            createBoxImages() {
                // Clear the container first
                $(this.containerImage).html('');

                // Create a wrapper for all image boxes
                this.imageWrapper = document.createElement("DIV");
                this.imageWrapper.className = "multiple_images_wrapper";

                // Add wrapper to container
                $(this.containerImage).append(this.imageWrapper);
             
                // Create a box for each file
                for (let i = 0; i < this.files.length; i++) {
                    const file = this.files[i];
                    this.createSingleImageBox(file, null, i);
                }
                
                // Re-add server images
                for (let serverImage of this.serverImages) {
                    this.createServerImageBox(serverImage.url, serverImage.id);
                }
            }

            // create a single image box
            createSingleImageBox(file, boxWidth, index) {
                // Create box
                const boxImage = document.createElement("DIV");
                boxImage.className = params.className.box_image;

                // Create image element
                const elmImage = document.createElement("img");
                elmImage.className = params.className.item_image;

                // Create hidden input file for this image
                const hiddenInput = document.createElement("input");
                hiddenInput.type = "file";
                hiddenInput.style.display = "none";
                hiddenInput.name = `${params.input_name}[${index}]`;
                hiddenInput.dataset.index = index;

                // Create a DataTransfer object and add the file to it
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                // Set the files property of the input element
                hiddenInput.files = dataTransfer.files;

                // Add image and hidden input to box
                $(boxImage).append(elmImage);
                $(boxImage).append(hiddenInput);

                // Add box to wrapper
                $(this.imageWrapper).append(boxImage);

                // Add edit and remove buttons to the box
                this.addButtonsToBox(boxImage);

                // Show image
                this.showImage(file, elmImage);
            }

            // Create a box for server images
            createServerImageBox(imageUrl, imageId) {
                // Create box
                const boxImage = document.createElement("DIV");
                boxImage.className = params.className.box_image;

                // Create image element
                const elmImage = document.createElement("img");
                elmImage.className = params.className.item_image;
                elmImage.src = imageUrl;

                // Add image to box
                $(boxImage).append(elmImage);

                // Add box to wrapper
                $(this.imageWrapper).append(boxImage);

                // Create button container
                const boxButton = document.createElement("DIV");
                boxButton.className = params.className.box_button;

                // Create edit button
                const elmSpanEdit = document.createElement("span");
                elmSpanEdit.className = params.className.btn_edit;
                const elmButtonEdit = document.createElement("i");
                elmButtonEdit.className = params.className.icon_edit;
                $(elmSpanEdit).append(elmButtonEdit);

                // Create remove button with data-id attribute
                const elmSpanRemove = document.createElement("span");
                elmSpanRemove.className = params.className.btn_remove;
                elmSpanRemove.setAttribute('data-id', imageId);
                
                const elmButtonRemove = document.createElement("i");
                elmButtonRemove.className = params.className.icon_remove;
                $(elmSpanRemove).append(elmButtonRemove);

                // Add direct event handler to remove button
                const _this = this;
                $(elmSpanRemove).on('click', function (e) {
                    e.stopPropagation();
                    _this.removeImage(this);
                });

                // Add buttons to container
                $(boxButton).append(elmSpanEdit);
                $(boxButton).append(elmSpanRemove);

                // Add container to box
                $(boxImage).append(boxButton);
            }

            // Add edit and remove buttons to a box
            addButtonsToBox(boxImage) {
                // Create button container
                const boxButton = document.createElement("DIV");
                boxButton.className = params.className.box_button;

                // Create edit button
                const elmSpanEdit = document.createElement("span");
                elmSpanEdit.className = params.className.btn_edit;
                const elmButtonEdit = document.createElement("i");
                elmButtonEdit.className = params.className.icon_edit;
                $(elmSpanEdit).append(elmButtonEdit);

                // Create remove button
                const elmSpanRemove = document.createElement("span");
                elmSpanRemove.className = params.className.btn_remove;
                const elmButtonRemove = document.createElement("i");
                elmButtonRemove.className = params.className.icon_remove;
                $(elmSpanRemove).append(elmButtonRemove);

                // Add direct event handler to remove button
                const _this = this;
                $(elmSpanRemove).on('click', function (e) {
                    e.stopPropagation();
                    _this.removeImage(this);
                });

                // Add buttons to container
                $(boxButton).append(elmSpanEdit);
                $(boxButton).append(elmSpanRemove);

                // Add container to box
                $(boxImage).append(boxButton);
            }

            // show image
            showImage(file, elmImage) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    // Set image source when file is read
                    elmImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }

            // message when invalid file or no file
            handleMessageUpload(mess) {
                $(this.messUpload).html('');

                let elmicon = document.createElement("i");
                elmicon.className = params.className.mess_upload;
                $(this.messUpload).append(elmicon);

                let elmMessage = document.createElement("p");
                elmMessage.className = params.className.alert;
                $(elmMessage).addClass(params.className.alert);
                $(elmMessage).html(mess);
                $(this.messUpload).append(elmMessage);
            }

            // Remove a specific image from the multiple image upload
            removeImage(targetElement) {
                // Find the closest box_image parent element
                const boxImage = $(targetElement).closest('.' + params.className.box_image);
                if (!boxImage.length) return;

                // Check if it's a server image (has data-id attribute)
                const imageId = $(targetElement).data('id');
                if (imageId) {
                    // Determine the API endpoint
                    let apiUrl = params.endpoint_remove;
                    if (params.server_url) {
                        if (params.server_url.charAt(params.server_url.length - 1) !== '/') {
                            apiUrl = params.server_url + '/' + params.endpoint_remove;
                        } else {
                            apiUrl = params.server_url + params.endpoint_remove;
                        }
                    }

                    // Ask for confirmation before deleting
                    Swal.fire({
                        title: 'Do you want to delete this image?',
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Make AJAX request to delete from server
                            $.ajax({
                                url: apiUrl,
                                method: 'POST',
                                data: { id: imageId },
                                success: function(response) {
                                    // Remove from DOM
                                    boxImage.remove();
                                    
                                    // Remove from serverImages array
                                    _this.serverImages = _this.serverImages.filter(img => img.id !== imageId);
                                    
                                    // Check if there are any images left
                                    const remainingImages = $(_this.containerImage).find('.' + params.className.box_image);
                                    if (remainingImages.length === 0) {
                                        _this.messageUpload();
                                    }
                                    
                                    Swal.fire('Deleted!', 'The image has been deleted.', 'success');
                                },
                                error: function(xhr, status, error) {
                                    Swal.fire('Error!', 'Failed to delete image from server.', 'error');
                                    console.error('Error deleting image:', error);
                                }
                            });
                        }
                    });
                } else {
                    // Handle non-server image removal (existing functionality)
                    Swal.fire({
                        title: 'Do you want to delete this image?',
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Find the index attribute from the hidden input
                            const hiddenInput = boxImage.find('input[type="file"]')[0];
                            const indexToRemove = hiddenInput ? parseInt(hiddenInput.dataset.index) : -1;

                            // Remove this file from our files array if we have an index
                            if (indexToRemove >= 0 && this.files) {
                                this.files = this.files.filter((_, i) => i !== indexToRemove);

                                // If we removed all files, show the message upload
                                if (this.files.length === 0 && this.serverImages.length === 0) {
                                    $(this.containerImage).html('');
                                    this.messageUpload();
                                } else {
                                    // Remove the box from the DOM
                                    boxImage.remove();

                                    // Re-render all images to update indexes
                                    this.createBoxImages();
                                }
                            } else {
                                // If we can't find the index, just remove the element
                                boxImage.remove();

                                // Check if there are any images left
                                const remainingImages = $(this.containerImage).find('.' + params.className.box_image);
                                if (remainingImages.length === 0) {
                                    this.messageUpload();
                                }
                            }
                        }
                    });
                }
            }

            // trigger remove file
            triggerRemoveFile() {
                const _this = this;
                $(document).on('click', '.' + params.className.btn_remove, function (e) {
                    e.stopPropagation();
                    _this.removeImage(this);
                });
            }

            // trigger drag file upload
            triggerDragUpload() {
                var _this = this;

                // add event for drag and drop
                let getDropare = $(_this.selector).parent('div').find('.' + params.className.detect);
                $(getDropare).each((key, obj) => {
                    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                        obj.addEventListener(evtName, (e) => e.preventDefault());
                    });
                });

                // Drag file and active border
                $(document).on('dragenter, dragover', '.' + params.className.detect, function (e) {
                    let __this_dragenter = this;
                    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                        __this_dragenter.addEventListener(evtName, (e) => e.preventDefault());
                    });

                    $(__this_dragenter).addClass("active_drag");
                });

                // Leave file and remove border
                $(document).on('dragleave', '.' + params.className.detect, function (e) {
                    let __this_dragleave = this;
                    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                        __this_dragleave.addEventListener(evtName, (e) => e.preventDefault());
                    });

                    $(__this_dragleave).removeClass("active_drag");
                });
            }

            // trigger drop file
            triggerDropUpload() {
                var _this = this;
                $(document).on('drop', '.' + params.className.detect, function (e) {
                    e.preventDefault();
                    $(this).removeClass('active_drag');
                    const files = e.originalEvent.dataTransfer.files;
                    if (files.length > 0) {
                        _this.uploadFile(files);
                    }
                });
            }

            // trigger edit file
            triggerEditFile() {
                var _this = this;
                $(document).on('click', '.' + params.className.btn_edit, function (e) {
                    e.stopPropagation();
                    const imageUrl = $(this).closest('.' + params.className.box_image).find('.' + params.className.item_image).attr('src');
                    common.openModal(imageUrl, _this);
                });
            }

            // Load existing images from input elements with class 'image-exist'
            loadExistingImages() {
                const existingImages = $(this.parentSelector).find('.image-exist');
                if (existingImages.length === 0) return;

                // Create the wrapper if it doesn't exist yet
                if (!this.imageWrapper) {
                    $(this.containerImage).html('');
                    this.imageWrapper = document.createElement("DIV");
                    this.imageWrapper.className = "multiple_images_wrapper";
                    $(this.containerImage).append(this.imageWrapper);
                }

                // Process each existing image
                existingImages.each((index, el) => {
                    const imageUrl = $(el).data('image');
                    const imageId = $(el).data('id');
                    
                    if (imageUrl) {
                        this.serverImages.push({
                            id: imageId,
                            url: imageUrl
                        });
                        
                        // Create box for server image
                        this.createServerImageBox(imageUrl, imageId);
                    }
                });
            }

            // set init function for single
            init() {
                // create container upload
                this.container();
                // create mess explain upload like: "Drag and drop or select files"
                this.messageUpload();
                // Load existing images from HTML
                this.loadExistingImages();
                // call trigger click upload
                this.triggerClickUpload();
                // call trigger drag file
                this.triggerDragUpload();
                // call trigger drop file
                this.triggerDropUpload();
                // No need to call triggerRemoveFile() and triggerEditFile() since we use direct event binding
            }
        }

        class Common {
            constructor() { }

            openModal(imageUrl, singleInstance) {
                // Remove any existing modals first
                const existingModals = document.querySelectorAll('.' + modalClassName.modal);
                existingModals.forEach(modal => modal.remove());

                const modal = document.createElement('div');
                modal.className = modalClassName.modal;

                const modalContent = document.createElement('div');
                modalContent.className = modalClassName.modal_content;

                // Create button container
                const buttonContainer = document.createElement('div');
                buttonContainer.className = modalClassName.button_container;

                // Create save button
                const saveButton = document.createElement('button');
                saveButton.className = `${modalClassName.button} save-button`;
                saveButton.innerHTML = '<i class="glyphicon glyphicon-floppy-disk"></i> Save';

                // Create crop button
                const cropButton = document.createElement('button');
                cropButton.className = `${modalClassName.button} ${modalClassName.crop_button}`;
                cropButton.innerHTML = '<i class="glyphicon glyphicon-retweet"></i> Crop';

                // Create rotate left button
                const rotateLeftButton = document.createElement('button');
                rotateLeftButton.className = `${modalClassName.button} ${modalClassName.rotate_left_button}`;
                rotateLeftButton.innerHTML = '<i class="glyphicon glyphicon-repeat"></i> Rotate Left';

                // Create rotate right button
                const rotateRightButton = document.createElement('button');
                rotateRightButton.className = `${modalClassName.button} ${modalClassName.rotate_right_button}`;
                rotateRightButton.innerHTML = '<i class="glyphicon glyphicon-refresh"></i> Rotate Right';

                // Add buttons to button container
                buttonContainer.appendChild(saveButton);
                buttonContainer.appendChild(cropButton);
                buttonContainer.appendChild(rotateLeftButton);
                buttonContainer.appendChild(rotateRightButton);

                // Create close button
                const closeButton = document.createElement('span');
                closeButton.className = modalClassName.close_button;
                closeButton.innerHTML = '&times;';

                // Create image container
                const imageContainer = document.createElement('div');
                imageContainer.className = modalClassName.image_container;

                // Create wrapper for the image with position relative
                const wrapperImage = document.createElement('div');
                wrapperImage.className = 'wrapper-image';
                wrapperImage.style.position = 'relative';
                wrapperImage.style.width = 'auto';
                wrapperImage.style.height = 'auto';

                // Create image element
                const image = document.createElement('img');
                image.className = modalClassName.edit_image;
                image.src = imageUrl;

                // Track state
                let cropMode = false;
                let rotationAngle = 0;

                // Add image to wrapper and wrapper to container
                wrapperImage.appendChild(image);
                imageContainer.appendChild(wrapperImage);

                // Add elements to modal content
                modalContent.appendChild(closeButton);
                modalContent.appendChild(buttonContainer);
                modalContent.appendChild(imageContainer);

                // Add modal content to modal
                modal.appendChild(modalContent);

                // Add modal to body
                document.body.appendChild(modal);

                // Show modal with animation
                modal.style.display = 'block';
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);

                // Close button handler - completely removes the modal
                closeButton.onclick = () => {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.remove(); // Remove from DOM completely
                    }, 300);
                };

                // Add event listeners for edit buttons
                cropButton.addEventListener('click', function () {
                    // Don't allow cropping when image is rotated
                    if (rotationAngle !== 0) {
                        console.log('Cannot crop rotated image. Please reset rotation first.');
                        return;
                    }

                    console.log('Crop button clicked');

                    // Check if overlay already exists
                    let overlay = wrapperImage.querySelector('.crop-overlay');
                    let cropBox = wrapperImage.querySelector('.crop-box');

                    if (overlay) {
                        // Toggle overlay and crop box visibility if they already exist
                        const isVisible = overlay.style.display !== 'none';
                        overlay.style.display = isVisible ? 'none' : 'block';
                        if (cropBox) cropBox.style.display = isVisible ? 'none' : 'block';

                        // Toggle crop mode and update button states
                        cropMode = !isVisible;
                        rotateLeftButton.disabled = cropMode;
                        rotateRightButton.disabled = cropMode;

                        // Add visual indication of disabled state
                        if (cropMode) {
                            rotateLeftButton.classList.add('disabled');
                            rotateRightButton.classList.add('disabled');
                        } else {
                            rotateLeftButton.classList.remove('disabled');
                            rotateRightButton.classList.remove('disabled');
                        }
                    } else {
                        // Store original image for restoration later
                        const originalImageSrc = image.src;
                        wrapperImage.dataset.originalImage = originalImageSrc;

                        // If image is rotated, we need to create a new image with rotation applied
                        if (rotationAngle !== 0) {
                            // Create a temporary canvas to generate a rotated image
                            const tempCanvas = document.createElement('canvas');
                            const tempCtx = tempCanvas.getContext('2d');

                            // Create temporary image to ensure dimensions are loaded
                            const tempImg = new Image();
                            tempImg.src = image.src;

                            tempImg.onload = function () {
                                // Set canvas dimensions based on rotation
                                if (rotationAngle === 90 || rotationAngle === 270) {
                                    tempCanvas.width = tempImg.naturalHeight;
                                    tempCanvas.height = tempImg.naturalWidth;
                                } else {
                                    tempCanvas.width = tempImg.naturalWidth;
                                    tempCanvas.height = tempImg.naturalHeight;
                                }

                                // Rotate and draw
                                tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
                                tempCtx.rotate((rotationAngle * Math.PI) / 180);

                                if (rotationAngle === 90 || rotationAngle === 270) {
                                    tempCtx.drawImage(
                                        tempImg,
                                        -tempImg.naturalWidth / 2,
                                        -tempImg.naturalHeight / 2,
                                        tempImg.naturalWidth,
                                        tempImg.naturalHeight
                                    );
                                } else {
                                    tempCtx.drawImage(
                                        tempImg,
                                        -tempImg.naturalWidth / 2,
                                        -tempImg.naturalHeight / 2,
                                        tempImg.naturalWidth,
                                        tempImg.naturalHeight
                                    );
                                }

                                // Store the rotation angle
                                wrapperImage.dataset.rotationAngle = rotationAngle;

                                // Create a new image with rotation applied
                                const rotatedDataUrl = tempCanvas.toDataURL();

                                // Replace the image with rotated one
                                image.style.transform = ''; // Remove rotation transform
                                image.src = rotatedDataUrl;

                                // Now create the crop elements as usual
                                createCropElements();
                            };
                        } else {
                            // No rotation, create crop elements directly
                            createCropElements();
                        }

                        function createCropElements() {
                            // Create overlay element
                            overlay = document.createElement('div');
                            overlay.className = 'crop-overlay';
                            overlay.style.position = 'absolute';
                            overlay.style.top = '0';
                            overlay.style.left = '0';
                            overlay.style.width = '100%';
                            overlay.style.height = '100%';
                            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                            overlay.style.zIndex = '10';

                            // Create crop box
                            cropBox = document.createElement('div');
                            cropBox.className = 'crop-box';
                            cropBox.style.position = 'absolute';
                            cropBox.style.zIndex = '20';
                            cropBox.style.border = '2px dashed white';
                            cropBox.style.boxSizing = 'border-box';

                            // Set initial size and position (centered, 50% of image size)
                            const imgRect = image.getBoundingClientRect();
                            const initialWidth = Math.min(imgRect.width * 0.5, imgRect.height * 0.5);
                            const initialHeight = initialWidth;

                            cropBox.style.width = initialWidth + 'px';
                            cropBox.style.height = initialHeight + 'px';
                            cropBox.style.top = ((imgRect.height / 2 - initialHeight / 2) - 45) + 'px';
                            cropBox.style.left = (imgRect.width / 2 - initialWidth / 2) + 'px';

                            // Set background to match the current image
                            cropBox.style.backgroundImage = `url(${image.src})`;
                            cropBox.style.backgroundRepeat = 'no-repeat';

                            // Create resize handles for all four corners
                            const cornerPositions = [
                                { position: 'top-left', cursor: 'nwse-resize', top: '0', left: '0', bottom: 'auto', right: 'auto' },
                                { position: 'top-right', cursor: 'nesw-resize', top: '0', left: 'auto', bottom: 'auto', right: '0' },
                                { position: 'bottom-left', cursor: 'nesw-resize', top: 'auto', left: '0', bottom: '0', right: 'auto' },
                                { position: 'bottom-right', cursor: 'nwse-resize', top: 'auto', left: 'auto', bottom: '0', right: '0' }
                            ];

                            cornerPositions.forEach(corner => {
                                const resizeHandle = document.createElement('div');
                                resizeHandle.className = `resize-handle ${corner.position}`;
                                resizeHandle.style.position = 'absolute';
                                resizeHandle.style.width = '10px';
                                resizeHandle.style.height = '10px';
                                resizeHandle.style.background = 'white';
                                resizeHandle.style.cursor = corner.cursor;
                                resizeHandle.style.top = corner.top;
                                resizeHandle.style.left = corner.left;
                                resizeHandle.style.bottom = corner.bottom;
                                resizeHandle.style.right = corner.right;
                                resizeHandle.dataset.position = corner.position;

                                cropBox.appendChild(resizeHandle);
                            });

                            // Add elements to wrapper
                            wrapperImage.appendChild(overlay);
                            wrapperImage.appendChild(cropBox);

                            // Initialize background position
                            updateCropBoxBackground();

                            // Initialize drag and resize functionality
                            initCropBoxInteraction(cropBox, wrapperImage, image);

                            // Set crop mode and disable rotation buttons
                            cropMode = true;
                            rotateLeftButton.disabled = true;
                            rotateRightButton.disabled = true;
                            rotateLeftButton.classList.add('disabled');
                            rotateRightButton.classList.add('disabled');
                        }
                    }
                });

                // Function to update crop box background position
                function updateCropBoxBackground() {
                    const cropBox = wrapperImage.querySelector('.crop-box');
                    if (!cropBox) return;

                    const cropRect = cropBox.getBoundingClientRect();
                    const imgRect = image.getBoundingClientRect();
                    const wrapperRect = wrapperImage.getBoundingClientRect();

                    const offsetX = cropRect.left - imgRect.left;
                    const offsetY = cropRect.top - imgRect.top;

                    cropBox.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
                    cropBox.style.backgroundSize = `${imgRect.width}px ${imgRect.height}px`;
                }

                // Placeholder for crop box interaction function - to be implemented
                function initCropBoxInteraction(cropBox, wrapperImage, image) {
                    // Variables to track dragging state
                    let isDragging = false;
                    let isResizing = false;
                    let currentResizeHandle = null;
                    let startX, startY;
                    let startTop, startLeft, startWidth, startHeight;

                    // Event listeners for drag functionality
                    cropBox.addEventListener('mousedown', function (e) {
                        // Ignore if clicked on a resize handle
                        if (e.target.classList.contains('resize-handle')) return;

                        isDragging = true;
                        startX = e.clientX;
                        startY = e.clientY;
                        startTop = parseInt(cropBox.style.top) || 0;
                        startLeft = parseInt(cropBox.style.left) || 0;

                        e.preventDefault();
                    });

                    // Event listeners for resize handles
                    const resizeHandles = cropBox.querySelectorAll('.resize-handle');
                    resizeHandles.forEach(handle => {
                        handle.addEventListener('mousedown', function (e) {
                            isResizing = true;
                            currentResizeHandle = handle.dataset.position;
                            startX = e.clientX;
                            startY = e.clientY;
                            startTop = parseInt(cropBox.style.top) || 0;
                            startLeft = parseInt(cropBox.style.left) || 0;
                            startWidth = parseInt(cropBox.style.width) || cropBox.clientWidth;
                            startHeight = parseInt(cropBox.style.height) || cropBox.clientHeight;

                            e.preventDefault();
                            e.stopPropagation(); // Prevent triggering the cropBox mousedown
                        });
                    });

                    // Event listener for mouse move (handles both drag and resize)
                    document.addEventListener('mousemove', function (e) {
                        // Handle drag
                        if (isDragging) {
                            const diffX = e.clientX - startX;
                            const diffY = e.clientY - startY;

                            // Calculate new position
                            let newTop = startTop + diffY;
                            let newLeft = startLeft + diffX;

                            // Get image boundaries
                            const imgRect = image.getBoundingClientRect();
                            const wrapperRect = wrapperImage.getBoundingClientRect();
                            const cropBoxRect = cropBox.getBoundingClientRect();

                            // Constrain movement within the image bounds
                            if (newLeft < 0) newLeft = 0;
                            if (newTop < 0) newTop = 0;

                            const maxLeft = imgRect.width - cropBoxRect.width;
                            const maxTop = imgRect.height - cropBoxRect.height;

                            if (newLeft > maxLeft) newLeft = maxLeft;
                            if (newTop > maxTop) newTop = maxTop;

                            // Apply new position
                            cropBox.style.top = newTop + 'px';
                            cropBox.style.left = newLeft + 'px';

                            // Update background position to show the proper part of the image
                            updateCropBoxBackground();
                        }
                        // Handle resize
                        else if (isResizing) {
                            const diffX = e.clientX - startX;
                            const diffY = e.clientY - startY;
                            let newTop = startTop, newLeft = startLeft;
                            let newWidth = startWidth, newHeight = startHeight;

                            // Handle different resize corners
                            switch (currentResizeHandle) {
                                case 'top-left':
                                    newTop = startTop + diffY;
                                    newLeft = startLeft + diffX;
                                    newWidth = startWidth - diffX;
                                    newHeight = startHeight - diffY;
                                    break;
                                case 'top-right':
                                    newTop = startTop + diffY;
                                    newWidth = startWidth + diffX;
                                    newHeight = startHeight - diffY;
                                    break;
                                case 'bottom-left':
                                    newLeft = startLeft + diffX;
                                    newWidth = startWidth - diffX;
                                    newHeight = startHeight + diffY;
                                    break;
                                case 'bottom-right':
                                    newWidth = startWidth + diffX;
                                    newHeight = startHeight + diffY;
                                    break;
                            }

                            // Enforce minimum dimensions
                            const minSize = 20;
                            if (newWidth < minSize) newWidth = minSize;
                            if (newHeight < minSize) newHeight = minSize;

                            // Get image boundaries
                            const imgRect = image.getBoundingClientRect();

                            // Constrain within image bounds
                            if (newTop < 0) newTop = 0;
                            if (newLeft < 0) newLeft = 0;

                            if (newLeft + newWidth > imgRect.width) {
                                if (currentResizeHandle.includes('left')) {
                                    newLeft = imgRect.width - newWidth;
                                } else {
                                    newWidth = imgRect.width - newLeft;
                                }
                            }

                            if (newTop + newHeight > imgRect.height) {
                                if (currentResizeHandle.includes('top')) {
                                    newTop = imgRect.height - newHeight;
                                } else {
                                    newHeight = imgRect.height - newTop;
                                }
                            }

                            // Apply new dimensions and position
                            cropBox.style.top = newTop + 'px';
                            cropBox.style.left = newLeft + 'px';
                            cropBox.style.width = newWidth + 'px';
                            cropBox.style.height = newHeight + 'px';

                            // Update background position to show the proper part of the image
                            updateCropBoxBackground();
                        }
                    });

                    // Event listener for mouse up (stop drag or resize)
                    document.addEventListener('mouseup', function () {
                        isDragging = false;
                        isResizing = false;
                        currentResizeHandle = null;
                    });

                    // Event listener for mouse leave (stop drag or resize)
                    document.addEventListener('mouseleave', function () {
                        isDragging = false;
                        isResizing = false;
                        currentResizeHandle = null;
                    });
                }

                // Rotate left 90 degrees
                rotateLeftButton.addEventListener('click', function () {
                    if (cropMode) return; // Don't rotate if in crop mode

                    rotationAngle -= 90;
                    if (rotationAngle < 0) rotationAngle += 360;
                    image.style.transform = `rotate(${rotationAngle}deg)`;
                    console.log('Rotated left to:', rotationAngle);

                    // Disable crop button when image is rotated
                    if (rotationAngle !== 0) {
                        cropButton.disabled = true;
                        cropButton.classList.add('disabled');
                    } else {
                        cropButton.disabled = false;
                        cropButton.classList.remove('disabled');
                    }
                });

                // Rotate right 90 degrees
                rotateRightButton.addEventListener('click', function () {
                    if (cropMode) return; // Don't rotate if in crop mode

                    rotationAngle += 90;
                    if (rotationAngle >= 360) rotationAngle -= 360;
                    image.style.transform = `rotate(${rotationAngle}deg)`;
                    console.log('Rotated right to:', rotationAngle);

                    // Disable crop button when image is rotated
                    if (rotationAngle !== 0) {
                        cropButton.disabled = true;
                        cropButton.classList.add('disabled');
                    } else {
                        cropButton.disabled = false;
                        cropButton.classList.remove('disabled');
                    }
                });

                // Save the edited image
                saveButton.addEventListener('click', function () {
                    // Create a canvas to draw the edited image
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Get original image dimensions and source
                    const originalImage = new Image();
                    originalImage.src = wrapperImage.dataset.originalImage || image.src;

                    // Need to ensure image is loaded for canvas operations
                    originalImage.onload = function () {
                        // If we're in crop mode, apply the crop
                        if (cropMode) {
                            const cropBox = wrapperImage.querySelector('.crop-box');
                            if (cropBox) {
                                const imgRect = image.getBoundingClientRect();
                                const cropRect = cropBox.getBoundingClientRect();

                                // Calculate crop dimensions relative to displayed image
                                const scaleX = image.naturalWidth / imgRect.width;
                                const scaleY = image.naturalHeight / imgRect.height;

                                const cropLeft = (cropRect.left - imgRect.left) * scaleX;
                                const cropTop = (cropRect.top - imgRect.top) * scaleY;
                                const cropWidth = cropRect.width * scaleX;
                                const cropHeight = cropRect.height * scaleY;

                                // Create a temporary image from the current displayed image (which may be already rotated)
                                const currentImage = new Image();
                                currentImage.src = image.src;

                                currentImage.onload = function () {
                                    // Set canvas to crop size
                                    canvas.width = cropWidth;
                                    canvas.height = cropHeight;

                                    // Draw only the cropped portion
                                    ctx.drawImage(
                                        currentImage,
                                        cropLeft, cropTop, cropWidth, cropHeight,
                                        0, 0, cropWidth, cropHeight
                                    );

                                    completeImageProcessing();
                                };
                            }
                        }
                        // If only rotating (no crop)
                        else if (rotationAngle !== 0) {
                            let resultWidth, resultHeight;

                            // Handle rotation cases where we need to swap dimensions
                            if (rotationAngle === 90 || rotationAngle === 270) {
                                resultWidth = originalImage.naturalHeight;
                                resultHeight = originalImage.naturalWidth;
                            } else {
                                resultWidth = originalImage.naturalWidth;
                                resultHeight = originalImage.naturalHeight;
                            }

                            canvas.width = resultWidth;
                            canvas.height = resultHeight;

                            // Move to center, rotate, and draw
                            ctx.translate(canvas.width / 2, canvas.height / 2);
                            ctx.rotate((rotationAngle * Math.PI) / 180);

                            // Draw rotated image
                            if (rotationAngle === 90 || rotationAngle === 270) {
                                ctx.drawImage(
                                    originalImage,
                                    -originalImage.naturalWidth / 2,
                                    -originalImage.naturalHeight / 2,
                                    originalImage.naturalWidth,
                                    originalImage.naturalHeight
                                );
                            } else {
                                ctx.drawImage(
                                    originalImage,
                                    -originalImage.naturalWidth / 2,
                                    -originalImage.naturalHeight / 2,
                                    originalImage.naturalWidth,
                                    originalImage.naturalHeight
                                );
                            }

                            completeImageProcessing();
                        }
                        // No edits, just copy the original
                        else {
                            canvas.width = originalImage.naturalWidth;
                            canvas.height = originalImage.naturalHeight;
                            ctx.drawImage(originalImage, 0, 0);
                            completeImageProcessing();
                        }

                        // Function to complete the image processing and close modal
                        function completeImageProcessing() {
                            // Convert canvas to data URL
                            const dataURL = canvas.toDataURL('image/png');

                            // Find all item_image instances and update the one that matches our original source
                            const itemImages = document.querySelectorAll('.' + params.className.item_image);
                            itemImages.forEach(img => {
                                if (img.src === originalImage.src) {
                                    img.src = dataURL;
                                }
                            });

                            // NEW CODE: Update the input file with the edited image
                            if (singleInstance && singleInstance.selector) {
                                // Convert the dataURL to a Blob
                                const binaryString = atob(dataURL.split(',')[1]);
                                const len = binaryString.length;
                                const bytes = new Uint8Array(len);

                                for (let i = 0; i < len; i++) {
                                    bytes[i] = binaryString.charCodeAt(i);
                                }

                                const blob = new Blob([bytes.buffer], { type: 'image/png' });

                                // Get the original filename or generate a new one
                                const originalFileName = singleInstance.file ? singleInstance.file.name : "edited-image.png";
                                const fileNameParts = originalFileName.split('.');
                                const fileExt = fileNameParts.pop();
                                const fileName = fileNameParts.join('.') + "-edited." + fileExt;

                                // Create a new File from the Blob
                                const newFile = new File([blob], fileName, {
                                    type: 'image/png',
                                    lastModified: new Date().getTime()
                                });

                                // Use DataTransfer to set the files property of the input
                                try {
                                    const dataTransfer = new DataTransfer();
                                    dataTransfer.items.add(newFile);

                                    // Update the file input
                                    singleInstance.selector.files = dataTransfer.files;

                                    // Also update the file property in the Single instance
                                    singleInstance.file = newFile;
                                } catch (error) {
                                    console.error('Error updating file input:', error);
                                }
                            }

                            // Close and remove the modal
                            modal.classList.remove('show');
                            setTimeout(() => {
                                modal.remove();
                            }, 300);
                        }
                    };
                });
            }
        }

        // Init common
        const common = new Common();

        // Object function
        const functions = {
            single: Single,
            multiple: Multiple,
        };

        if (functions[params.type]) {
            return $.each(selectors, function (index, selector) {
                return new functions[params.type](selector).init();
            });
        }

    };
})();