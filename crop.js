(function() {
    const cropBox = document.querySelector('.crop-box');
    const container = document.querySelector('.container');
    
    // Cập nhật background-position của crop-box sao cho nó "lấy" đúng phần của ảnh gốc
    function updateCropBoxBackground() {
      const cropRect = cropBox.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offsetX = cropRect.left - containerRect.left;
      const offsetY = cropRect.top - containerRect.top;
      cropBox.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
      // Đảm bảo background-size bằng với kích thước container (ảnh gốc)
      cropBox.style.backgroundSize = `${containerRect.width}px ${containerRect.height}px`;
    }
    
    // Cập nhật ban đầu
    updateCropBoxBackground();
    
    let isDragging = false;
    let isResizing = false;
    let startX, startY;
    let startLeft, startTop, startWidth, startHeight;
    
    // Xử lý kéo di chuyển crop-box (trừ vùng resize handle)
    cropBox.addEventListener('mousedown', function(e) {
      if (e.target.classList.contains('resize-handle')) {
        return; // bỏ qua nếu click vào handle
      }
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(window.getComputedStyle(cropBox).left, 10);
      startTop = parseInt(window.getComputedStyle(cropBox).top, 10);
      e.preventDefault();
    });
    
    // Xử lý sự kiện mousemove cho kéo di chuyển và resize
    document.addEventListener('mousemove', function(e) {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;
        
        // Giới hạn crop-box không ra ngoài container
        const containerRect = container.getBoundingClientRect();
        const cropRect = cropBox.getBoundingClientRect();
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + cropRect.width > containerRect.width) newLeft = containerRect.width - cropRect.width;
        if (newTop + cropRect.height > containerRect.height) newTop = containerRect.height - cropRect.height;
        
        cropBox.style.left = newLeft + 'px';
        cropBox.style.top = newTop + 'px';
        updateCropBoxBackground();
      }
      if (isResizing) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newWidth = startWidth + dx;
        let newHeight = startHeight + dy;
        // Giới hạn kích thước tối thiểu
        newWidth = Math.max(newWidth, 50);
        newHeight = Math.max(newHeight, 50);
        
        // Giới hạn kích thước để không ra ngoài container
        const cropLeft = parseInt(cropBox.style.left, 10);
        const cropTop = parseInt(cropBox.style.top, 10);
        const containerRect = container.getBoundingClientRect();
        if (cropLeft + newWidth > containerRect.width) {
          newWidth = containerRect.width - cropLeft;
        }
        if (cropTop + newHeight > containerRect.height) {
          newHeight = containerRect.height - cropTop;
        }
        
        cropBox.style.width = newWidth + 'px';
        cropBox.style.height = newHeight + 'px';
        updateCropBoxBackground();
      }
    });
    
    document.addEventListener('mouseup', function(e) {
      isDragging = false;
      isResizing = false;
    });
    
    // Xử lý resize: sử dụng handle ở góc dưới bên phải
    const resizeHandle = document.querySelector('.resize-handle');
    resizeHandle.addEventListener('mousedown', function(e) {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(window.getComputedStyle(cropBox).width, 10);
      startHeight = parseInt(window.getComputedStyle(cropBox).height, 10);
      // Ngăn không cho sự kiện mousedown lan ra crop-box
      e.stopPropagation();
      e.preventDefault();
    });
    
  })();