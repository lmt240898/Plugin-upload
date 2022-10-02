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
        const selectors = this;
        // Default parameters
        const defaults = {
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
        const params = $.extend({}, defaults, objparams || {});

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
            btn_remove          : 'btn_remove',
            btn_edit            : 'btn_edit',
            icon_remove         : 'fas fa-trash-alt remove-file glyphicon glyphicon-trash',
            icon_edit           : 'fas fa-pencil-alt edit-file glyphicon glyphicon-pencil',
            icon_file           : "ic-file",
            icon_upload         : 'fas fa-cloud-upload-alt',  
            icon_alert          : 'fas fa-exclamation-triangle',
            alert               : "alert_message",
            overlay             : "bg-overlay",
            detect              : params.type + "_init",
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
                reader.onload = function(e) {
                    // Khi đọc xong, gán src cho thẻ img
                    elmImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }

            // trigger file upload
            triggerClickUpload() {
                var _this = this;
                $(document).on('click', '.' + params.className.detect, function(e) {
                    if (!$(e.target).hasClass('fas')) {
                        e.stopPropagation();
                        $(_this.selector).trigger('click');
                    }
                });

                // listen file upload
                $(document).on('change', '.' + _this.selector.className, function() {
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
                $(document).on('dragenter, dragover', '.' + params.className.detect, function(e) {
                    let __this_dragenter = this;
                    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                        __this_dragenter.addEventListener(evtName, (e) => e.preventDefault());
                    });

                    $(__this_dragenter).addClass("active_drag");
                });

                // Leave file and remove border
                $(document).on('dragleave', '.' + params.className.detect, function(e) {
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
                $(document).on('click', '.' + params.className.btn_remove, function(e) {
                    e.stopPropagation();
                    Swal.fire({
                        title: 'Do you want to delete?',
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $(_this.selector).parent('div').find('.' + params.className.box_image).remove();
                            _this.messageUpload();
                        }
                    });
                });
            }

            // trigger edit file
            triggerEditFile() {
                var _this = this;
                $(document).on('click', '.' + params.className.btn_edit, function(e) {
                    e.stopPropagation();
                    const imageUrl = $(this).closest('.' + params.className.container_image).find('.' + params.className.item_image).attr('src');
                    common.openModal(imageUrl);
                });
            }

            // set init function for single
            init() {
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
                // call trigger remove file
                this.triggerRemoveFile();
                // call trigger edit file
                this.triggerEditFile();
            }
        }

        class Common {
            constructor() {}
            
            // Function to create and handle the modal editor
            modalEdit() {
                // Create modal container
                const modal = document.createElement('div');
                modal.className = modalClassName.modal;
                
                // Create modal content
                const modalContent = document.createElement('div');
                modalContent.className = modalClassName.modal_content;
                
                // Create button container
                const buttonContainer = document.createElement('div');
                buttonContainer.className = modalClassName.button_container;
                
                // Create crop button
                const cropButton = document.createElement('button');
                cropButton.className = `${modalClassName.button} ${modalClassName.crop_button}`;
                cropButton.innerHTML = '<i class="glyphicon glyphicon-retweet"></i>'; 
                
                // Create rotate left button
                const rotateLeftButton = document.createElement('button');
                rotateLeftButton.className = `${modalClassName.button} ${modalClassName.rotate_left_button}`;
                rotateLeftButton.innerHTML = '<i class="glyphicon glyphicon-repeat"></i>';
                
                // Create rotate right button
                const rotateRightButton = document.createElement('button');
                rotateRightButton.className = `${modalClassName.button} ${modalClassName.rotate_right_button}`;
                rotateRightButton.innerHTML = '<i class="glyphicon glyphicon-refresh"></i>';
                
                // Add buttons to button container
                buttonContainer.appendChild(cropButton);
                buttonContainer.appendChild(rotateLeftButton);
                buttonContainer.appendChild(rotateRightButton);
                
                // Create close button
                const closeButton = document.createElement('span');
                closeButton.className = modalClassName.close_button;
                closeButton.innerHTML = '&times;';
                closeButton.onclick = () => {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300); 
                };
                
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
                
                // Function to open the modal with an image
                this.openModal = function(imageUrl) {
                    image.src = imageUrl;
                    modal.style.display = 'block';
                    
                    // Trigger reflow to ensure the transition works
                    modal.offsetHeight;
                    
                    // Add show class to start animation
                    setTimeout(() => {
                        modal.classList.add('show');
                    }, 10);
                };
                
                // Add event listeners for edit buttons
                cropButton.addEventListener('click', function() {
                    console.log('Crop button clicked');
                    
                    // Check if overlay already exists
                    let overlay = wrapperImage.querySelector('.crop-overlay');
                    let cropBox = wrapperImage.querySelector('.crop-box');
                    
                    if (overlay) {
                        // Toggle overlay and crop box visibility if they already exist
                        const isVisible = overlay.style.display !== 'none';
                        overlay.style.display = isVisible ? 'none' : 'block';
                        if (cropBox) cropBox.style.display = isVisible ? 'none' : 'block';
                    } else {
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
                        
                        // Set background to match the original image
                        cropBox.style.backgroundImage = `url(${image.src})`;
                        cropBox.style.backgroundRepeat = 'no-repeat';
                        
                        // Create resize handle
                        const resizeHandle = document.createElement('div');
                        resizeHandle.className = 'resize-handle';
                        resizeHandle.style.position = 'absolute';
                        resizeHandle.style.width = '10px';
                        resizeHandle.style.height = '10px';
                        resizeHandle.style.bottom = '0';
                        resizeHandle.style.right = '0';
                        resizeHandle.style.background = 'white';
                        resizeHandle.style.cursor = 'nwse-resize';
                        
                        cropBox.appendChild(resizeHandle);
                        
                        // Add elements to wrapper
                        wrapperImage.appendChild(overlay);
                        wrapperImage.appendChild(cropBox);
                        
                        // Initialize background position
                        updateCropBoxBackground();
                        
                        // Initialize drag and resize functionality
                        initCropBoxInteraction(cropBox, wrapperImage, image);
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
                
                // Function to initialize crop box interaction
                function initCropBoxInteraction(cropBox, wrapperImage, image) {
                    let isDragging = false;
                    let isResizing = false;
                    let startX, startY;
                    let startLeft, startTop, startWidth, startHeight;
                    
                    // Handle dragging the crop box
                    cropBox.addEventListener('mousedown', function(e) {
                        if (e.target.classList.contains('resize-handle')) {
                            return; // Skip if clicking on resize handle
                        }
                        isDragging = true;
                        startX = e.clientX;
                        startY = e.clientY;
                        startLeft = parseInt(window.getComputedStyle(cropBox).left, 10);
                        startTop = parseInt(window.getComputedStyle(cropBox).top, 10);
                        e.preventDefault();
                    });
                    
                    // Handle resizing with the resize handle
                    const resizeHandle = cropBox.querySelector('.resize-handle');
                    resizeHandle.addEventListener('mousedown', function(e) {
                        isResizing = true;
                        startX = e.clientX;
                        startY = e.clientY;
                        startWidth = parseInt(window.getComputedStyle(cropBox).width, 10);
                        startHeight = parseInt(window.getComputedStyle(cropBox).height, 10);
                        e.stopPropagation();
                        e.preventDefault();
                    });
                    
                    // Handle mouse movement for both dragging and resizing
                    document.addEventListener('mousemove', function(e) {
                        if (isDragging) {
                            const dx = e.clientX - startX;
                            const dy = e.clientY - startY;
                            let newLeft = startLeft + dx;
                            let newTop = startTop + dy;
                            
                            // Constrain within image boundaries
                            const imgRect = image.getBoundingClientRect();
                            const cropRect = cropBox.getBoundingClientRect();
                            const wrapperRect = wrapperImage.getBoundingClientRect();
                            
                            const maxLeft = imgRect.width - cropRect.width;
                            const maxTop = imgRect.height - cropRect.height;
                            
                            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                            newTop = Math.max(0, Math.min(newTop, maxTop));
                            
                            cropBox.style.left = newLeft + 'px';
                            cropBox.style.top = newTop + 'px';
                            updateCropBoxBackground();
                        }
                        if (isResizing) {
                            const dx = e.clientX - startX;
                            const dy = e.clientY - startY;
                            let newWidth = startWidth + dx;
                            let newHeight = startHeight + dy;
                            
                            // Minimum size constraints
                            newWidth = Math.max(newWidth, 50);
                            newHeight = Math.max(newHeight, 50);
                            
                            // Maximum size constraints
                            const imgRect = image.getBoundingClientRect();
                            const cropLeft = parseInt(cropBox.style.left, 10);
                            const cropTop = parseInt(cropBox.style.top, 10);
                            
                            if (cropLeft + newWidth > imgRect.width) {
                                newWidth = imgRect.width - cropLeft;
                            }
                            if (cropTop + newHeight > imgRect.height) {
                                newHeight = imgRect.height - cropTop;
                            }
                            
                            cropBox.style.width = newWidth + 'px';
                            cropBox.style.height = newHeight + 'px';
                            updateCropBoxBackground();
                        }
                    });
                    
                    // Handle mouse up to stop dragging or resizing
                    document.addEventListener('mouseup', function() {
                        isDragging = false;
                        isResizing = false;
                    });
                }
                
                rotateLeftButton.addEventListener('click', function() {
                    console.log('Rotate left button clicked');
                    // Rotate left functionality would be implemented here
                });
                
                rotateRightButton.addEventListener('click', function() {
                    console.log('Rotate right button clicked');
                    // Rotate right functionality would be implemented here
                });
            }
        }

        // Create single instance of Common class
        const common = new Common();
        // Initialize the modal editor
        common.modalEdit();

        // Object function
        const functions = {
            single: Single  // Update to use the new class
        };

        if (functions[params.type]) {
            return $.each(selectors, function(index, selector) {
                return new functions[params.type](selector).init();
            });
        }
        
    };
})();