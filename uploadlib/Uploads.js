(function ( $ ) {
    //=================== UPLOAD 1 HÌNH 
    $.fn.UploadSingle = function(options) {
        
        function Plugin(selector) {
           let canChangetOptions  = {
                                       classRemove          : "default_btn_remove", 
                                       textUpload           : "Choose file upload",
                                       classFormData        : "",
                                       classEdit            : "btnEdit", 
                                       messAlert            : "",
                                       //======= VALIDATE ==========
                                       defaultValidate      : false,
                                       urlValidate          : "", // Bắt buộc nếu defaultValidate = true
                                       inputFileName        : "", 
                                       //https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
                                       //[{ext: "pdf",mime:"application/pdf"},{ext: "xls",mime:"application/vnd.ms-excel"}] 
                                       allowExtension       : "", // Bắt buộc nếu defaultValidate = true
                                       alertExtension       : "", // Bắt buộc nếu defaultValidate = true
                                       alertMaxsize         : "", // Bắt buộc nếu defaultValidate = true
                                       maxSize              : "", // Bắt buộc nếu defaultValidate = true (MB)
                                   };
           UploadSingle                   = this;     
           this.element                   = selector;
           UploadSingle.defaultSetting  = {
                                                typeIsImage          : ['image/jpeg','image/jpg','image/png'],     // x
                                                selector             : selector,                                   // x
                                                classIconRemove      : "fas fa-trash-alt",
                                                classIconEdit        : "fas fa-pencil-alt",                        // x                         // x     
                                                classIconFileNotIMG  : "ic-file ",                                 // x
                                                classBoxSingleImage  : "box__single_image",                        // x 
                                                classParent          : "parentImage",                              // x
                                                classSameparent      : "sameParent",                               // x
                                                classBoxUpload       : "box_icon_upload",                          // x
                                                classImgTag          : "showImg",                                  // x
                                                classNotImg          : "notimage",                                 // x
                                                classOverplay        : "overplay",                                 // x
                                                classIconUpload      : "fas fa-cloud-upload-alt",                  // x
                                                classTextUpload      : "textUpload",                               // x
                                                classBoxAlert        : "box_alert",                                // x
                                                classIconAlert       : "fas fa-exclamation-triangle",              // x
                                                classAlert           : "alert",                                    // x
                                            }
           this.input                     = $(this.selector);   
           UploadSingle.settings          = $.extend(true, canChangetOptions, options); 
           UploadSingle.createFrame();
           this.triggerClick              = this.triggerClick.bind(this);
          $(this.element).parent().find("."+UploadSingle.defaultSetting.classSameparent).on("click",this.triggerClick);
           this.choosFile                 = this.choosFile.bind(this);
          $(this.element).on("change",this.choosFile);        
          // xoá
          this.remove              = this.remove.bind(this);
          $(this.element).parent().find(".btnRemove").on("click",this.remove);
          // đồng ý xoá 
          this.UploadSingle = UploadSingle;
          this.confirm_remove              = this.confirm_remove.bind(this);
          $(this.element).parent().find(".confirm").on("click",this.confirm_remove);
          // huỷ xoá 
          this.cancel_remove              = this.cancel_remove.bind(this);
          $(this.element).parent().find(".cancel").on("click",this.cancel_remove);

        }
        //==================\ TẠO KHUNG HÌNH ====================
        Plugin.prototype.createFrame    = function () 
        { 
           $(UploadSingle.defaultSetting.selector).hide();
           let checkExistIMG                  = UploadSingle.defaultSetting.selector.dataset.image;
               //============
           let parentImage                    = document.createElement("DIV");
           let mergeClass                     = UploadSingle.defaultSetting.classParent + " " +UploadSingle.defaultSetting.classSameparent;
               parentImage.className          = mergeClass ;
               parentImage.setAttribute("data-validate","true");
               // khung chứa hình sau khi chọn
           let box__single_image              = document.createElement("DIV");
               box__single_image.className    = UploadSingle.defaultSetting.classBoxSingleImage;
             
               // Button xoá 
           let btnRemove                      = document.createElement("button"); 
               btnRemove.className            = UploadSingle.settings.classRemove+ " btnRemove";
               btnRemove.type                 = "button";
               $.each($(UploadSingle.defaultSetting.selector).data(), function(key, value) {
                   $(btnRemove).attr('data-'+key,value );
               });
               // icon xoá 
           let iconRemove                     = document.createElement("I");
               iconRemove.className           = UploadSingle.defaultSetting.classIconRemove;   
             
               // icon file 
           let iconFile                       = document.createElement("I");
               iconFile.className             = UploadSingle.defaultSetting.classIconFileNotIMG;   
               // append icon vào btnRemove
               $(btnRemove).append(iconRemove);
               // Tag img
           let imageTag                       = document.createElement("IMG"); 
               imageTag.className             = UploadSingle.defaultSetting.classImgTag;
               imageTag.src                   = checkExistIMG != undefined ? checkExistIMG : "";
               $(box__single_image).append(iconFile);
               $(box__single_image).append(btnRemove);
               
                UploadSingle.btnEditElement(box__single_image);

               $(box__single_image).append(imageTag);
               $(parentImage).append(box__single_image);
               let overplay                   = document.createElement("SPAN");
               overplay.className             = UploadSingle.defaultSetting.classOverplay;
               //Không có hình 
           let notimage                       = document.createElement("DIV");
               notimage.className             = UploadSingle.defaultSetting.classNotImg;
               $(notimage).append(overplay);
               //icon upload
           let box_icon_upload                = document.createElement("DIV");
               box_icon_upload.className      = UploadSingle.defaultSetting.classBoxUpload;
           let icon_upload                    = document.createElement("I");    
               icon_upload.className          = UploadSingle.defaultSetting.classIconUpload; 
               // text upload 
           let textUpload                     = document.createElement("div");
               textUpload.className           = UploadSingle.defaultSetting.classTextUpload;    
               textUpload.innerText           = UploadSingle.settings.textUpload;
               //append div
                $(box_icon_upload).append(icon_upload);
                $(box_icon_upload).append(textUpload);
                $(notimage).append(box_icon_upload);
               //Thông báo
           let box_alert                      = document.createElement("DIV");
               box_alert.className            = UploadSingle.defaultSetting.classBoxAlert;      
           let icon_alert                     = document.createElement("I");     
               icon_alert.className           = UploadSingle.defaultSetting.classIconAlert;    
           let mess_alert                     = document.createElement("DIV");
               mess_alert.className           = UploadSingle.defaultSetting.classAlert;     
               mess_alert.innerText           = UploadSingle.settings.messAlert ;
               $(box_alert).append(icon_alert);
               $(box_alert).append(mess_alert);
               $(notimage).append(box_alert);
               $(parentImage).append(notimage);
                //============
           let parentWrap                     = $(UploadSingle.defaultSetting.selector).parent();    
                $(parentWrap).addClass("parentWrap");
                $(parentWrap).attr("id",this.element.className);
                $(parentWrap).append(`<div class="boxAlert"> 
                                            <div class="boxAlert_bgOverplay"></div>
                                            <div class="boxAlert_messenger">
                                                <div class="iconAlert"><i class="far fa-bell"></i></div>
                                                <div class="textAlert">Do you want delete?</div>
                                                <div class="boxBtnAlert">
                                                    <span class="confirm">confirm</span>
                                                    <span class="cancel">cancel</span>
                                                </div>
                                            </div>
                                        </div>`);
               $(parentWrap).append(parentImage);
               //=============
               // Kiểm tra hình tồn tại (có hình là edit)
               if(checkExistIMG != undefined)
               {
                   $(UploadSingle.defaultSetting.selector).parent().find("."+UploadSingle.settings.classEdit).hide();
                   $(UploadSingle.defaultSetting.selector).parent().find("."+UploadSingle.defaultSetting.classNotImg).hide();
                   $(UploadSingle.defaultSetting.selector).parent().find("."+UploadSingle.defaultSetting.classBoxSingleImage).show();
               }
             


        }
         //======================\ BUTTON EDIT ======================
        Plugin.prototype.btnEditElement        = function (box__single_image)
        {
            let btnEdit                        = document.createElement("button"); 
                btnEdit.className              = UploadSingle.settings.classEdit;
                btnEdit.type                   = "button";
                btnEdit.setAttribute("data-classInputFile",UploadSingle.defaultSetting.selector.className);
                $(box__single_image).append(btnEdit);
                // icon chỉnh sửa 
            let iconEdit                       = document.createElement("I");
                iconEdit.className             = UploadSingle.defaultSetting.classIconEdit;   
                // append icon vào btnRemove
                $(btnEdit).append(iconEdit);
        }
        //============\ TRIGGER CLICK TỚI INPUT FILE ============
        Plugin.prototype.triggerClick     = function (e) 
        { 
               let checkElement           = e.target;
               if(checkElement.className != this.settings.classRemove && checkElement.localName != "i" )
               {
                  let input_file                  = this.element;
                      this.settings.inputFileName = input_file.name;
                  $(input_file).trigger("click");
                  
               }
         }
        //====================\ CHỌN FILE ======================
        Plugin.prototype.choosFile        = function () 
        {  
               let _this                  = this;
               let inputData              = _this.element;
               let formData               = new FormData();
               let isImage  = true;
               if (inputData.files.length >= 1) {   
                let typeFile               =  UploadSingle.defaultSetting.typeIsImage.includes(inputData.files[0].type);
                  if( _this.settings.defaultValidate == false) // Không validate = ajax
                  {
                       let reader       = new FileReader();
                       reader.onload    = function(e) {
                           let srcImg   = e.target.result;
                          
                          //=============================================
                          let curentImage = $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag);
                              curentImage.removeClass("icon__file");
                              curentImage.removeClass("icon__file_pdf");
                              curentImage.removeClass("icon__file_excel");
                              curentImage.removeClass("icon__file_word");
                           $(inputData).parent().find(".textFiles").text("");
                           if(typeFile == false) // không phải hình
                           {
                               $(inputData).parent().find("."+UploadSingle.defaultSetting.classParent).append(`<span class="textFiles" >${inputData.files[0].name} </span>`);
                           }
                           if(inputData.files[0].type == "application/pdf") 
                           {
                               srcImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/267px-PDF_file_icon.svg.png";
                               $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag).addClass("icon__file_pdf");
                               isImage = false;
                            }
                           if(inputData.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") // không phải hình 
                           {
                               srcImg = "https://www.networkwise.com/wp-content/uploads/2019/04/xlsx.png";
                               $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag).addClass("icon__file_excel");
                               isImage = false;
                            }
                           if(inputData.files[0].type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") // không phải hình 
                           {
                               srcImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/.doc_icon_%282000-03%29.svg/94px-.doc_icon_%282000-03%29.svg.png";
                               $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag).addClass("icon__file_word");
                               isImage = false;
                           }
                           //=============================================
                          
                           $(inputData).parent().find("."+UploadSingle.defaultSetting.classBoxSingleImage).show();
                           $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag).attr('src', srcImg);
                           $(inputData).parent().find("."+UploadSingle.defaultSetting.classNotImg).hide();
                       }
                       reader.readAsDataURL(inputData.files[0]);   
                  }                                            // validate = ajax
                  else
                  {
                      formData.append(_this.settings.inputFileName,inputData.files[0]);
                      let flag        = true;
                      let alertEmpty  = "";
                      if(_this.settings.allowExtension == "")
                      {
                           alertEmpty ="Please set allowExtension";
                           flag       = false;
                      }
                      if(_this.settings.alertExtension == "")
                      {
                           alertEmpty ="Please set alertExtension";
                           flag       = false;
                      }
                      if(_this.settings.alertMaxsize == "")
                      {
                           alertEmpty ="Please set alertMaxsize";
                           flag       = false;
                      }
                      if(_this.settings.maxSize == "")
                      {
                           alertEmpty ="Please set maxSize";
                           flag       = false;
                      }
                      if(flag == false)
                      {
                           Swal.fire({
                               title: alertEmpty,
                               type: "warning",
                               showCancelButton: false,
                               confirmButtonColor: "#3085d6",
                               confirmButtonText: "Yes"
                           });
                      }else
                      {
                      
                       let data = {
                                       inputFileName   : _this.settings.inputFileName,
                                       allowExtension  : _this.settings.allowExtension,
                                       alertExtension  : _this.settings.alertExtension,
                                       alertMaxsize    : _this.settings.alertMaxsize,
                                       maxSize         : _this.settings.maxSize,
                                   };
                                  
                       data.allowExtension.map((obj,key)=>{
                           formData.append('ext['+key+']',  obj.ext);
                           formData.append('mime['+key+']', obj.mime);
                       });
                       formData.append('inputFileName',  data.inputFileName);
                       formData.append('allowExtension', data.allowExtension);
                       formData.append('alertExtension', data.alertExtension);
                       formData.append('alertMaxsize',   data.alertMaxsize);
                       formData.append('maxSize',        data.maxSize);
                    //    $.ajax({
                    //        headers: {
                    //            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    //        },
                    //        type        : "POST",
                    //        url         : _this.settings.urlValidate,
                    //        data        : formData,
                    //        processData : false,
                    //        contentType : false,
                    //        dataType    : "JSON",
                    //        success: function (res) {
                    //            if(res.type  == "error")
                    //            {
                    //                 inputData.value = "";
                    //                inputData.nextElementSibling.setAttribute("data-validate","false");
                    //                $(inputData).parent().find("."+UploadSingle.defaultSetting.classBoxAlert).show();
                    //                $(inputData).parent().find("."+UploadSingle.defaultSetting.classNotImg).show();
                    //                $(inputData).parent().find("."+UploadSingle.defaultSetting.classAlert).text(res.alert_mess);
                    //                //======
                    //                $(inputData).parent().find("."+UploadSingle.defaultSetting.classBoxSingleImage).hide();
                    //                $(inputData).parent().find("."+UploadSingle.defaultSetting.classBoxUpload).hide();
                    //            }else
                    //            {
                                  
                    //            }
                    //        }
                    //    });     
                       
                       

                       //
                       let reader      = new FileReader();
                       reader.onload   = function(e) {
                           let srcImg  = e.target.result;
                           //=============================================
                           $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag).removeClass("icon__file");
                           if(typeFile == false) // không phải hình
                           {
                               $(inputData).parent().find("."+UploadSingle.defaultSetting.classParent).append(`<span class="textFiles" >${inputData.files[0].name} </span>`);
                               
                           }
                           if(inputData.files[0].type == "application/pdf") // không phải hình 
                           {
                                isImage = false; 
                               srcImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/267px-PDF_file_icon.svg.png";
                               $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag).addClass("icon__file_pdf");
                               $(inputData).parent().find("."+UploadSingle.settings.classEdit).hide();
                           }
                           if(inputData.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") // không phải hình 
                           {
                                isImage = false; 
                               srcImg = "https://www.networkwise.com/wp-content/uploads/2019/04/xlsx.png";
                               $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag).addClass("icon__file_excel");
                               $(inputData).parent().find("."+UploadSingle.settings.classEdit).hide();
                            }
                           if(inputData.files[0].type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") // không phải hình 
                           {
                               isImage = false;    
                               srcImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/.doc_icon_%282000-03%29.svg/94px-.doc_icon_%282000-03%29.svg.png";
                               $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag).addClass("icon__file_word");
                               $(inputData).parent().find("."+UploadSingle.settings.classEdit).hide();
                            }
                           //=============================================
                           $(inputData).parent().find(".box__single_image").append(`
                                <div class="namesize_overplay">
                                    <div class="namefile">${inputData.files[0].name.substr(0, 30)+"..."}</div>
                                    <div class="sizefile">${10}</div>
                                </div>
                           `);
                            //=============================================
                            if(isImage == true)
                            {
                                $(inputData).parent().find(".box__single_image").append(`
                                     <div class="backgound_overplay" style="background-image: url('${srcImg}')"> </div>
                                `);
                            }
                           
                           $(inputData).parent().find("."+UploadSingle.defaultSetting.classBoxSingleImage).show();
                           $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag).attr('src', srcImg);
                           $(inputData).parent().find("."+UploadSingle.defaultSetting.classNotImg).hide();
                           //======
                           $(inputData).parent().find("."+UploadSingle.defaultSetting.classBoxAlert).hide();
                           $(inputData).parent().find("."+UploadSingle.defaultSetting.classAlert).text("");
                       }
                       reader.readAsDataURL(inputData.files[0]);   
                      }
    
                  }
               }else
               {
                    $(inputData).parent().find("."+UploadSingle.defaultSetting.classSameparent).find(".backgound_overplay").remove();
                   $(inputData).parent().find("."+UploadSingle.defaultSetting.classSameparent).find(".namesize_overplay").remove();
                   $(inputData).parent().find("."+UploadSingle.defaultSetting.classBoxSingleImage).hide();
                   $(inputData).parent().find("."+UploadSingle.defaultSetting.classImgTag).attr('src', "");
                   $(inputData).parent().find("."+UploadSingle.defaultSetting.classNotImg).show();
               }
        } 
        Plugin.prototype.remove        = function ()
        {
           $(this.element).parent().find(".boxAlert").fadeIn();
        }
        Plugin.prototype.confirm_remove_component = function (inputFile, __this) {  
            $(inputFile).parent().find(".boxAlert").hide();
            $(inputFile).parent().find(".box__single_image").hide();
            $(inputFile).parent().find(".textFiles").hide();
            $(inputFile).parent().find(".showImg").attr("src","");
            $(inputFile).parent().find(".notimage").show();
            $(inputFile).parent().find(".box_icon_upload").show();
            $(inputFile).parent().find("input").attr("data-image","");
            $(inputFile).parent().find(".backgound_overplay").remove();
            $(inputFile).parent().find(".namesize_overplay").remove();
            $(inputFile).parent().find("."+__this.UploadSingle.settings.classEdit).show();
        }
        Plugin.prototype.confirm_remove        = function ()
        {
            let inputFile = this.element;
            let __this = this;
            inputFile.value = "";
           let urlDelete = $(this.element).data('urldelete');
           let id = $(this.element).data('id');
           let path = $(this.element).data('path');
           let type = $(this.element).data('type');

           // urldelete chỉ xuất hiện khi hình trả về từ database
           if (urlDelete === undefined) {
            this.confirm_remove_component(inputFile, __this);
           } else {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: "POST",
                url: urlDelete,
                data: {
                    id: id,
                    path: path,
                    type: type
                },
                dataType: "JSON",
                success: function (response) {
                    if(response.success) {
                        __this.confirm_remove_component(inputFile, __this);
                        $.toast({
                            heading: "",
                            text: response.sdMessage,
                            position: "top-right",
                            loaderBg: "#5ba035",
                            icon: "success",
                            hideAfter: 3e3,
                            stack: 1
                        })                    
                    } else {
                        $.toast({
                            heading: "",
                            text: response.sdErrors,
                            position: "top-right",
                            loaderBg: "#bf441d",
                            icon: "error",
                            hideAfter: 3e3,
                            stack: 1
                        })        
                    }

                }
            });            
           }

        }
        Plugin.prototype.cancel_remove        = function ()
        {
            $(this.element).parent().find(".boxAlert").hide();
        }
       let selectors = $(this);
        return [
                   $.each(selectors, function(index, selector){
                        new Plugin(selector);   
                   })
               ];
    };
    //=================== UPLOAD NHIỀU HÌNH
    $.fn.UploadMultiple = function(options) {
        function Plugin(selector) {
            let canChangetOptions  = {
                                        classInputFile       : "",
                                        inputCountFiles      : "", // name="", không đuọc trùng name
                                        classRemove          : "btnRemove", 
                                        classEdit            : "btnEdit", 
                                        textUpload           : "Chọn file tải lên",
                                        classFormData        : "",
                                        messAlert            : "",
                                        maxImage             : 1,
                                        //======= VALIDATE ==========
                                        defaultValidate      : false,
                                        urlValidate          : "", // Bắt buộc nếu defaultValidate = true
                                        inputName            : "", // Bắt buộc nếu defaultValidate = true
                                        //https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
                                        //[{ext: "pdf",mime:"application/pdf"},{ext: "xls",mime:"application/vnd.ms-excel"}] 
                                        allowExtension       : "", // Bắt buộc nếu defaultValidate = true
                                        alertExtension       : "", // Bắt buộc nếu defaultValidate = true
                                        alertMaxsize         : "", // Bắt buộc nếu defaultValidate = true
                                        maxSize              : "", // Bắt buộc nếu defaultValidate = true (Kiểu KB không phải MB)
                                    };
            UploadMultiple                 = this;  
            UploadMultiple.element         = selector;
            //============ DEFAULT SETTING ===========
            UploadMultiple.defaultSetting  = {
                _thisClick           : null,
                typeIsImage          : ['image/jpeg','image/jpg','image/png'],
                selector             : selector,
                classIconEdit        : "fas fa-pencil-alt",            // x
                classIconRemove      : "fas fa-trash-alt",             // x
                classIconFileNotIMG  : "ic-file ",                     // x
                classBoxSingleImage  : "box__single_image",            // x
                nodeWrapParent       : null,                           // x
                classWrapParent      : "Wrap_parent",                  // x
                classChildBorder     : "ChildBorder",                  // x
                classParent          : "parentImage_Multiple",         // x
                classSameparent      : "sameParent",  
                classBoxUpload       : "box_icon_upload",              // x
                classImgTag          : "showImg",                      // x
                classNotImg          : "notimage",                     // x
                classOverplay        : "overplay",                     // x
                classIconUpload      : "far fa-images",                // x , fas fa-cloud-upload-alt
                classTextUpload      : "textUpload",                   // x
                classBoxAlert        : "box_alert",                    // x
                classIconAlert       : "fas fa-exclamation-triangle",  // x
                classAlert           : "alert",                        // x 
            }                            
            //========================================
            UploadMultiple.settings        = $.extend(true, canChangetOptions, options); 
            UploadMultiple.createFrame();
            //================= THAO TÁC CLICK, CHANGE ==================
            this.triggerClick              = this.triggerClick.bind(this);
            $(UploadMultiple.element).on("click","."+UploadMultiple.defaultSetting.classChildBorder,this.triggerClick);
            //------
            this.remove                    = this.remove.bind(this);
            $(UploadMultiple.element).on("click","."+UploadMultiple.settings.classRemove,this.remove);
            //======================== kéo thả file =====================
            let getDropare                 = document.querySelectorAll("."+UploadMultiple.defaultSetting.classParent);
            const ePreventDedault          = (e) => e.preventDefault();
            $(getDropare).each((key,obj)=>{
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                    obj.addEventListener(evtName, ePreventDedault);
                });
            }); 
            $(document).on('dragenter, dragover','.'+UploadMultiple.defaultSetting.classParent, function(e) 
            {
                let __this_dragenter = this;
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
                    __this_dragenter.addEventListener(evtName, ePreventDedault);
                });
                $(__this_dragenter).find("."+UploadMultiple.defaultSetting.classChildBorder).addClass("active_drag");
            });
            $(document).on('drop','.'+UploadMultiple.defaultSetting.classParent, this.getFileList);
            //===========================================================
            let getWidth = $(UploadMultiple.element).find("."+UploadMultiple.defaultSetting.classWrapParent)[0].offsetWidth;
            if(getWidth > 825 && getWidth <= 1024)
            {
                $("body").append(`
                    <style>
                        .${UploadMultiple.defaultSetting.classParent}
                        {
                            width : calc(100% / 5);
                        }
                    </style>
                `);
            }
            if(getWidth > 665 && getWidth <= 825)
            {
                $("body").append(`
                    <style>
                        .${UploadMultiple.defaultSetting.classParent}
                        {
                            width : calc(100% / 4);
                        }
                    </style>
                `);
            }
            if(getWidth > 475 && getWidth <= 665)
            {
                $("body").append(`
                    <style>
                        .${UploadMultiple.defaultSetting.classParent}
                        {
                            width : calc(100% / 3);
                        }
                    </style>
                `);
            }
            if(getWidth <= 475)
            {
                $("body").append(`
                    <style>
                        .${UploadMultiple.defaultSetting.classParent}
                        {
                            width : calc(100% / 2);
                        }
                    </style>
                `);
            }
        }
        //===============\ LẤY CÁC FILE KÉO THẢ ================
        Plugin.prototype.getFileList      = function (e)
        {
                let __this_drop = this;
                let drag        = true;
                $(__this_drop).find("."+UploadMultiple.defaultSetting.classChildBorder).removeClass("active_drag");
                UploadMultiple.choosFile(e, drag);
        }
        //==================\ TẠO KHUNG HÌNH ====================
        Plugin.prototype.createFrame      = function () 
        { 
                //============
            let WrapparentImage                = document.createElement("DIV");
                WrapparentImage.className      = UploadMultiple.defaultSetting.classWrapParent;
            let parentImage                    = UploadMultiple.sameFrame();  
            let divOverplay                    = document.createElement("DIV");
                divOverplay.className          = "divOverplay";
            let imgOverplay                    = document.createElement("IMG"); 
                imgOverplay.className          = "imgOverplay";
                imgOverplay.src                = "/assets/images/loading-1.gif";
                $(divOverplay).append(imgOverplay);
                $(WrapparentImage).append(divOverplay);
                //=============
                $(WrapparentImage).append(parentImage);
                // tạo  input đếm  file 
            let CountInputFile                 = document.createElement("INPUT");
                CountInputFile.className       = UploadMultiple.settings.inputCountFiles;
                CountInputFile.setAttribute("name",UploadMultiple.settings.inputCountFiles);
                CountInputFile.setAttribute("value",0);
                CountInputFile.style.display   = "none";     
                $(UploadMultiple.element).append(CountInputFile);
        
                $(WrapparentImage).append(parentImage);
                UploadMultiple.defaultSetting.nodeWrapParent  = WrapparentImage;
                //============
                
                $(UploadMultiple.defaultSetting.selector).append(WrapparentImage);

                $("."+UploadMultiple.settings.classInputFile).prepend(`<div class="t_color_red">*${UploadMultiple.settings.alertExtension}</div>`);
        }
        //============\ TRIGGER CLICK TỚI INPUT FILE ============
        Plugin.prototype.triggerClick     = function (e) { 
            UploadMultiple                = this // gán object UploadMultiple khi bind
            let __this                    = e.currentTarget;
                
            let thisErrorValidate         = $(__this).parent().attr("data-validate");
            let checkExistFile            = $(__this).find("."+UploadMultiple.defaultSetting.classImgTag).attr("src");
                if(checkExistFile == undefined && thisErrorValidate != "false")
                {
                    $(__this).parent().find("."+UploadMultiple.settings.classInputFile).trigger("click");
                    // Huỷ sự kiện
                    $(__this).parent().find("."+UploadMultiple.settings.classInputFile).unbind("change");
                    // Bắt đầu sự kiện
                    UploadMultiple.choosFile      = UploadMultiple.choosFile.bind(UploadMultiple);
                    $(__this).parent().find("."+UploadMultiple.settings.classInputFile).on("change",UploadMultiple.choosFile);  
                }
        }
        //====================\ CHỌN FILE ======================
        Plugin.prototype.choosFile        = function (e,drag = false) 
        {     
                let UploadMultiple         = this;
                let checkMaxImage          = $(UploadMultiple.element).find("."+UploadMultiple.defaultSetting.classParent);
                let initialClass           = UploadMultiple.element;
                let _this                  = e.currentTarget;
                let getParent              = initialClass; // class khởi tạo
                let inputData              = drag == false ? _this.files : e.originalEvent.dataTransfer.files;
                let formData               = new FormData();
                let detectMaxImage         = ((checkMaxImage.length - 1 ) + inputData.length )  <= UploadMultiple.settings.maxImage ? true : false;
                if (detectMaxImage == true) {   
                    if(drag == false)
                    {
                        $(_this).parent().remove();
                    }else
                    {
                        $(_this).remove();
                    }
                    //===========================
                    $(UploadMultiple.element).find(".divOverplay").show();
                    let MaxImage =  UploadMultiple.settings.maxImage;
                    var countItem = 0;
                    [...inputData].forEach(async (file,key) =>{
                        var resultData = await UploadMultiple.fnc_validate(getParent,formData,inputData,file,key);
                    } );
                    
                }else
                {
                    Swal.fire({
                        title: "Không được vượt quá "+UploadMultiple.settings.maxImage+" hình",
                        type: "warning",
                        showCancelButton: true,
                        showConfirmButton: false
                    });
                    $(_this).closest("."+UploadMultiple.defaultSetting.classParent).remove();
                   // Reset lại khung rỗng
                   UploadMultiple.sameFrame(null);
                   let dataElement   =  UploadMultiple.sameFrame(null);
                   $(getParent).find("."+ UploadMultiple.defaultSetting.classWrapParent).append(dataElement);
                   //===============\ LẤY TỔNG SỐ FILE ============
                   UploadMultiple.changeValueName(getParent);
                    
                }
             
        } 
        //====================\ VALIDATE ==========================
        Plugin.prototype.fnc_validate          =  function (getParent,formData,inputData,file,key) 
        {
            return new Promise((resolve, reject)=>
            {
                // dùng validate server
                if( UploadMultiple.settings.defaultValidate == true) 
                {
                    formData.append(UploadMultiple.settings.inputName,file);
                    let flag        = true;
                    let alertEmpty  = "";
                    if(UploadMultiple.settings.allowExtension == "")
                    {
                            alertEmpty ="Vui lòng set allowExtension";
                            flag       = false;
                    }
                    if(UploadMultiple.settings.alertExtension == "")
                    {
                            alertEmpty ="Vui lòng set alertExtension";
                            flag       = false;
                    }
                    if(UploadMultiple.settings.alertMaxsize == "")
                    {
                            alertEmpty ="Vui lòng set alertMaxsize";
                            flag       = false;
                    }
                    if(UploadMultiple.settings.maxSize == "")
                    {
                            alertEmpty ="Vui lòng set maxSize";
                            flag       = false;
                    }
                    if(flag == false)
                    {
                            Swal.fire({
                                title: alertEmpty,
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#3085d6",
                                confirmButtonText: "Đồng ý"
                            });
                    }else
                    {
                    
                        let data = {
                                        inputFileName   : UploadMultiple.settings.inputName,
                                        allowExtension  : UploadMultiple.settings.allowExtension,
                                        alertExtension  : UploadMultiple.settings.alertExtension,
                                        alertMaxsize    : UploadMultiple.settings.alertMaxsize,
                                        maxSize         : UploadMultiple.settings.maxSize,
                                    };
                        
                        data.allowExtension.map((obj,key)=>{
                            formData.append('ext['+key+']',  obj.ext);
                            formData.append('mime['+key+']', obj.mime);
                        });
                        formData.append('inputFileName',  data.inputFileName);
                        formData.append('allowExtension', data.allowExtension);
                        formData.append('alertExtension', data.alertExtension);
                        formData.append('alertMaxsize',   data.alertMaxsize);
                        formData.append('maxSize',        data.maxSize);

                        console.log(formData);
                        $.ajax({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            type        : "POST",
                            url         : UploadMultiple.settings.urlValidate,
                            data        : formData,
                            processData : false,
                            contentType : false,
                            dataType    : "JSON",
                            success: function (res) {
                                
                                let alertValidate = res.alert_mess;
                                if(res.type == "success")
                                {
                                    let reader         = new FileReader();
                                    reader.onload      = function(e) {
                                        let srcImg     = e.target.result;
                                        let dataObj    = {
                                                            files: file,
                                                            srcImg : srcImg
                                                        }
                                        let dataElement    = UploadMultiple.sameFrame(dataObj);
                                            $(getParent).find("."+ UploadMultiple.defaultSetting.classWrapParent).append(dataElement);
                                    
                                    }
                                    reader.readAsDataURL(file); 
                                }else
                                {
                                    $(UploadMultiple.element).find(".divOverplay").hide();
                                    let dataElement   =  UploadMultiple.sameFrame(null,alertValidate);
                                    $(getParent).find("."+ UploadMultiple.defaultSetting.classWrapParent).append(dataElement);
                                }
                                //========================
                                let MaxImage    =  UploadMultiple.settings.maxImage;
                                let NotMaxCheck = (MaxImage == 0 && (key+1) == inputData.length) ?  true : false;
                                let MaxCheck    = (MaxImage > 0 &&  (key+1) ==  MaxImage) ?  true : false;  
                                console.log("================ START ==================");
                                console.log(`MaxImage : ${MaxImage}`);  
                                console.log(`NotMaxCheck : ${NotMaxCheck}`);  
                                console.log(`MaxCheck : ${MaxCheck}`);  
                                console.log(`inputData : ${inputData.length}`);    
                                console.log(`key : ${key+1}`);  
                                console.log(`key check: ${(key+1) == inputData.length}`);    
                                console.log("================ END ==================");
                                if((key + 1) == inputData.length) 
                                {
                                    resolve({type: "success"});
                                }
                            }
                        });                       
                    }
                }
                // Không dùng validate server
                else
                {

                    if(UploadMultiple.settings.allowExtension.includes(file.type) == false ) {
                        let MaxImage    =  UploadMultiple.settings.maxImage;
                        let NotMaxCheck = (MaxImage == 0 && (key+1) == inputData.length) ?  true : false;
                        let MaxCheck    = (MaxImage > 0 &&  (key+1) ==  MaxImage) ?  true : false;  
                        if(NotMaxCheck == true || MaxCheck == true || (key+1) == inputData.length )
                        {
                            setTimeout(()=>{
                                $(UploadMultiple.element).find(".divOverplay").hide();
                                let dataElement   =  UploadMultiple.sameFrame(null);
                                $(getParent).find("."+ UploadMultiple.defaultSetting.classWrapParent).append(dataElement);
                                resolve({type: "success"});
                            },200)
                        }
                    } else {
                        let reader         = new FileReader();
                        reader.onload      = function(e) {
                            let srcImg     = e.target.result;
                            let dataObj    = {
                                                files: file,
                                                srcImg : srcImg
                                            }
                            let dataElement    = UploadMultiple.sameFrame(dataObj);
                                $(getParent).find("."+ UploadMultiple.defaultSetting.classWrapParent).append(dataElement);
                            let MaxImage    =  UploadMultiple.settings.maxImage;
                            let NotMaxCheck = (MaxImage == 0 && (key+1) == inputData.length) ?  true : false;
                            let MaxCheck    = (MaxImage > 0 &&  (key+1) ==  MaxImage) ?  true : false;  
                            if(NotMaxCheck == true || MaxCheck == true || (key+1) == inputData.length )
                            {
                                setTimeout(()=>{
                                    $(UploadMultiple.element).find(".divOverplay").hide();
                                    let dataElement   =  UploadMultiple.sameFrame(null);
                                    $(getParent).find("."+ UploadMultiple.defaultSetting.classWrapParent).append(dataElement);
                                    //===============\ LẤY TỔNG SỐ FILE ============
                                    UploadMultiple.changeValueName(getParent);
                                    //===============/ LẤY TỔNG SỐ FILE ============
                                    resolve({type: "success"});
                                },200)
                                //===================
                            }
                        }
                        reader.readAsDataURL(file); 
                    }

                } 
            });
        }
        //=============\ KHUNG HÌNH DÙNG CHUNG ====================
        Plugin.prototype.sameFrame             =  function (dataObject = null,alertValidate = "") 
        {
            if(dataObject == null){
              var className = UploadMultiple.defaultSetting.classParent + " " + UploadMultiple.defaultSetting.classSameparent + ' itemFirst';
            }else{
              var className = UploadMultiple.defaultSetting.classParent + " " + UploadMultiple.defaultSetting.classSameparent;
            }
            let parentImage                    = document.createElement("DIV");
                parentImage.className          = className;
                // parentImage.className          = UploadMultiple.defaultSetting.classParent+ " "+UploadMultiple.defaultSetting.classSameparent;
                parentImage.setAttribute("data-validate","true");
                // tạo input file 
            let InputFile                      = document.createElement("INPUT");
                InputFile.className            = UploadMultiple.settings.classInputFile;
                if(dataObject == null) // item không có hình thì cho chọn nhiều file, item cập nhật hình thì chọn 1 file
                {
                    InputFile.setAttribute("multiple","");
                }
                InputFile.type                 = "file";
                InputFile.style.display        = "none";
                InputFile.name                 = UploadMultiple.settings.inputName;
                // TẠO FILELIST
                if(dataObject != null)
                {
                    let dT = new DataTransfer();
                    dT.items.add(dataObject.files);
                    InputFile.files =  dT.files ;                
                }
                $(parentImage).append(InputFile);
            let Childborder                    = document.createElement("DIV");
                Childborder.className          = UploadMultiple.defaultSetting.classChildBorder;
                // khung chứa hình sau khi chọn
            let box__single_image              = document.createElement("DIV");
                box__single_image.className    = UploadMultiple.defaultSetting.classBoxSingleImage;
    
                // Tag img
            let imageTag                       = document.createElement("IMG"); 
                imageTag.className             = UploadMultiple.defaultSetting.classImgTag;
            
                $(box__single_image).append(imageTag);
                $(Childborder).append(box__single_image);
                let overplay                   = document.createElement("SPAN");
                overplay.className             = UploadMultiple.defaultSetting.classOverplay;
                //Không có hình 
            let notimage                       = document.createElement("DIV");
                notimage.className             = UploadMultiple.defaultSetting.classNotImg;
                $(notimage).append(overplay);
                //icon upload
            let box_icon_upload                = document.createElement("DIV");
                box_icon_upload.className      = UploadMultiple.defaultSetting.classBoxUpload;
            let icon_upload                    = document.createElement("I");    
                icon_upload.className          = UploadMultiple.defaultSetting.classIconUpload; 
                // text upload 
            let textUpload                     = document.createElement("DIV");
                textUpload.className           = UploadMultiple.defaultSetting.classTextUpload;    
                textUpload.innerHTML           = UploadMultiple.settings.textUpload;
                //append div
                $(box_icon_upload).append(icon_upload);
                $(box_icon_upload).append(textUpload);
             
                $(notimage).append(box_icon_upload);
                //Thông báo
            let box_alert                      = document.createElement("DIV");
                box_alert.className            = UploadMultiple.defaultSetting.classBoxAlert;      
            let icon_alert                     = document.createElement("I");     
                icon_alert.className           = UploadMultiple.defaultSetting.classIconAlert;    
            let mess_alert                     = document.createElement("DIV");
                mess_alert.className           = UploadMultiple.defaultSetting.classAlert;     
                mess_alert.innerHTML           = UploadMultiple.settings.messAlert ;
                $(box_alert).append(icon_alert);
                $(box_alert).append(mess_alert);
                $(notimage).append(box_alert);
                $(Childborder).append(notimage);
                $(parentImage).append(Childborder);
                //==================================================================
                if(dataObject != null)
                {
                    imageTag.src                    = dataObject.srcImg;
                    //======================================
                    box__single_image.style.display = "block";
                    notimage.style.display          = "none";
                    // BUTTON XOÁ 
                    UploadMultiple.btnRemoveElement(parentImage,box__single_image);
                    UploadMultiple.btnEditElement(parentImage,box__single_image);
                }
                //===================== THÔNG BÁO VALIDATE =========================
                if(alertValidate != "")
                {
                    parentImage.setAttribute("data-validate","false");
                    //============
                    notimage.style.display          = "block";
                    box_icon_upload.style.display   = "none";
                    box_alert.style.display         = "block";
                    mess_alert.innerText            = alertValidate;
                    // BUTTON XOÁ 
                    UploadMultiple.btnRemoveElement(parentImage,box__single_image);
                }
               
               
                return parentImage;
                
        }
        //========\ THAY ĐỖI VALUE VÀ NAME KHI CHỌN HÌNH ==========
        Plugin.prototype.changeValueName      = function (getParent)
        {
            let allFiles      = $(getParent).find("."+UploadMultiple.settings.classInputFile);
                $(getParent).find("."+UploadMultiple.settings.inputCountFiles).attr("value",allFiles.length);
                // thay đổi name input 
                $(allFiles).each((key,obj)=>{
                    //  let nameInput = $(obj).attr("name");
                        $(obj).attr("name",UploadMultiple.settings.inputName+key);
                });
        
        }
        //======================\ BUTTON XOÁ ======================
        Plugin.prototype.btnRemoveElement      = function (parentImage,box__single_image)
        {
            let btnRemove                     = document.createElement("button"); 
            btnRemove.className               = UploadMultiple.settings.classRemove;
            btnRemove.type                    = "button";
            $(parentImage).append(btnRemove);
            // icon xoá 
            let iconRemove                     = document.createElement("I");
                iconRemove.className           = UploadMultiple.defaultSetting.classIconRemove;   
                // icon file 
            let iconFile                       = document.createElement("I");
                iconFile.className             = UploadMultiple.defaultSetting.classIconFileNotIMG;   
                // append icon vào btnRemove
                $(btnRemove).append(iconRemove);
                $(box__single_image).append(iconFile);
        }
         //======================\ BUTTON EDIT ======================
         Plugin.prototype.btnEditElement      = function (parentImage,box__single_image)
         {
             let btnEdit                        = document.createElement("button"); 
                 btnEdit.className              = UploadMultiple.settings.classEdit;
                 btnEdit.type                   = "button";
                 btnEdit.setAttribute("data-classInputFile",UploadMultiple.settings.classInputFile);
                 $(parentImage).append(btnEdit);
                 // icon chỉnh sửa 
             let iconEdit                       = document.createElement("I");
                 iconEdit.className             = UploadMultiple.defaultSetting.classIconEdit;   
                 // append icon vào btnRemove
                 $(btnEdit).append(iconEdit);
         }
        //=======================\ XOÁ ============================
        Plugin.prototype.remove        = function (e)
        {
            UploadMultiple  = this;
            let _this       = e.currentTarget;
            let getParent = $(_this).parent().parent().parent();
            $(_this).parent().remove();
            //===============\ LẤY TỔNG SỐ FILE ============
            UploadMultiple.changeValueName(getParent);
            //===============/ LẤY TỔNG SỐ FILE ============
        }
        //=======================\ LÀM CHẬM LẠI ============================
        Plugin.prototype.sleep = function (milliseconds) 
        {  
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }
        let selectors = $(this);
        return [
                    $.each(selectors, function(index, selector){
                        new Plugin(selector);   
                    })
                ];
    };
 }( jQuery ));
 //=====================================
 ModalUpload(); 
 function ModalUpload()
 {
    $(document).ready(function(){
        //=========================== THÊM THƯ VIỆN =======================================
        $("body").append(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.1.0/sweetalert2.min.css" />`);
        $("body").append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.1.2/sweetalert2.min.js" ></script>`);
        $("body").append(`<link href="https://unpkg.com/cropperjs/dist/cropper.css" rel="stylesheet"/>`);
        $("body").append(`<script src="https://unpkg.com/cropperjs"></script>`);
        //============================== TẠO MODAL ========================================
        $("body").append(` <div class="modal " id="modal_upload" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-lg" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" id="crs_rotate_to" data-rotateto="0" class="btn btn-primary" ><i class="fas fa-undo"></i></button>
                                        <button type="button" id="crs_rotate_back" data-rotateback="0"  class="btn btn-primary" ><i class="fas fa-undo"></i></button>
                                        <button type="button" id="crs_crop" class="btn btn-primary"><i class="fas fa-crop-alt"></i></button>
                                        <button type="button" id="crs_save" class="btn btn-primary">Lưu</button>
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="img-container">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="wrap_img">
                                                        <span class="overplayIMG"></span>
                                                        <img src="" id="sample_image" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            </div>`);
        //============================== THAO TÁC =========================================
        let $modal            = $('#modal_upload');
        let image             = document.getElementById('sample_image');
        let cropper;
        let $fileName         = "";
        let currentChoiceFile = null;
        let findImage         = null;
        //$modal.modal('show');
        $(document).on("click",".btnEdit",function (e) {
            let _this                 = $(this);
            let checkSingleOrmultiple = _this[0].offsetParent.classList[0];
            let classInputFile     = $(_this).attr("data-classInputFile");
            if(checkSingleOrmultiple === "parentImage") // single
            {
                currentChoiceFile  = $(_this).closest(".sameParent").parent().find("."+classInputFile)[0];
                findImage          = $(_this).closest(".sameParent").parent().find(".showImg")[0];
            }else                                       // multiple
            {
                currentChoiceFile  = $(_this).closest(".sameParent").find("."+classInputFile)[0];
                findImage          = $(_this).closest(".sameParent").find(".showImg")[0];
            }
                image.src          = findImage.src;
                $fileName          = currentChoiceFile.files[0].name;
                $modal.modal('show');
        })
        $modal.on('shown.bs.modal', function() 
        {
            cropper = new Cropper(image, {
                viewMode: 0,
                dragMode: "move",
                zoomable: false,
                zoomOnTouch:false,
                movable: true,
                autoCrop: false,
            });
            cropper.setDragMode("move");
        }).on('hidden.bs.modal', function(){
            cropper.destroy();
            cropper = null;
        });
        // XOAY TỚI
        $('#crs_rotate_to').click(function(){
            cropper.crop();
            let numRotate       = parseInt($(this).attr("data-rotateto")) ;
            let numRotateBack   = parseInt($('#crs_rotate_back').attr("data-rotateback")) ;
                numRotate       = numRotateBack == -90 ? 0 + 90 : numRotateBack + 90 ;
            $('#crs_rotate_back').attr("data-rotateback",numRotate);    
            $(this).attr("data-rotateto",numRotate);
            cropper.rotate(numRotate);
        });
        // XOAY NGƯỢC LẠI
        $('#crs_rotate_back').click(function(){
            cropper.crop();
            let numRotateTo = parseInt($('#crs_rotate_to').attr("data-rotateto"));
            let numRotate   = parseInt($(this).attr("data-rotateback"));
                numRotate   = numRotateTo == 90 ? 0 - 90 : numRotateTo - 90 ;
            $('#crs_rotate_to').attr("data-rotateto",numRotate)
            $(this).attr("data-rotateback",numRotate);
            cropper.rotate(numRotate);
        });
        // CẮT
        let statusCrop = 0;
        $('#crs_crop').click(function(){
            if(statusCrop == 0)
            {
                $(".overplayIMG").hide();
                statusCrop = 1;
                cropper.crop();
            }else
            {
                $(".overplayIMG").show();
                statusCrop = 0;
                cropper.clear();
            }
        });
        // LƯU
        $('#crs_save').click(function(){
            let dataCanvas   = cropper.getCanvasData();
            let dataCropbox  = cropper.getCropBoxData();
            let canvasWidth  = dataCropbox.width != undefined ? dataCropbox.width   :  dataCanvas.width;
            let canvasHeight = dataCropbox.height != undefined ? dataCropbox.height : dataCanvas.height ;
            canvas = cropper.getCroppedCanvas({
                width :canvasWidth,
                height:canvasHeight
            });
            canvas.toBlob(function(blob){
               
                let createfile  = new File([blob], "change-"+$fileName,{type:"image/png", lastModified:new Date().getTime()})
                let dT          = new DataTransfer();
                    dT.items.add(createfile);
                    currentChoiceFile.files   =  dT.files ;   
                    //==========================
                    let reader         = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend   = function(){
                        let base64data = reader.result;
                        $(findImage).attr("src",base64data);
                        $modal.modal('hide');
                    };
            });
        });
    });
 }