# jQuery Upload Plugin

A lightweight, customizable jQuery plugin for single or multiple file uploads with drag-and-drop functionality, file validation, and image editing capabilities.

![Upload Plugin Preview](preview.png)

## Features

- Single or multiple file uploads
- Drag and drop functionality
- Customizable file validation (extension and size limits)
- Image editing (crop and rotate)
- Easy to implement and configure
- Mobile-friendly interface

## Installation

### Step 1: Include jQuery

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

### Step 2: Include SweetAlert2 (for confirmation dialogs)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```

### Step 3: Include the plugin files

```html
<link rel="stylesheet" href="upload.css">
<script src="upload.js"></script>
```

### Step 4: Add Font Awesome for icons (if not already included)

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
```

## Basic Usage

### HTML

```html
<!-- For single file upload -->
<div>
  <input type="file" id="single-upload" name="file">
</div>

<!-- For multiple files upload -->
<div>
  <input type="file" id="multiple-upload" name="files[]" multiple>
</div>
```

### JavaScript

```javascript
// Initialize single file upload
$("#single-upload").Upload({
  type: 'single',
  max_file_size: 2, // MB
  input_name: 'my_file'
});

// Initialize multiple files upload
$("#multiple-upload").Upload({
  type: 'multiple',
  max_images: 5,
  max_file_size: 2, // MB
  input_name: 'my_files'
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | `'single'` | Upload type: `'single'` or `'multiple'` |
| `server_url_validate` | string | `''` | URL endpoint for file validation |
| `allow_ext` | array | `[{ext: 'jpg', mime: 'image/jpeg'}, {ext: 'png', mime: 'image/png'}]` | Array of allowed file extensions with MIME types |
| `text_upload` | string | `'<p>Drag and drop or select files</p> <p>(.jpg, .png and max size 2mb)</p>'` | Upload box instructions text |
| `alert_ext` | string | `'Invalid file extension'` | Error message for invalid extensions |
| `alert_same_file` | string | `'Invalid files'` | Error message for duplicate files |
| `alert_max_file_size` | string | `'File size exceeds limit'` | Error message for oversized files |
| `alert_max_images` | string | `'Too many images'` | Error message for exceeding image count limit |
| `max_file_size` | number | `2` | Maximum file size in MB |
| `max_images` | number | `1` | Maximum number of images allowed |
| `input_name` | string | `'default_file'` | Name attribute for the generated file input |

## Examples

### Single Image Upload with Custom Settings

```javascript
$("#profile-image").Upload({
  type: 'single',
  max_file_size: 1,
  allow_ext: [
    {ext: 'jpg', mime: 'image/jpeg'},
    {ext: 'png', mime: 'image/png'}
  ],
  text_upload: '<p>Upload your profile picture</p><p>(JPG or PNG, max 1MB)</p>',
  alert_ext: "Please select a JPG or PNG file",
  alert_max_file_size: "Profile picture must be less than 1MB",
  input_name: 'profile_pic'
});
```

### Multiple Image Upload with Custom Limits

```javascript
$("#product-gallery").Upload({
  type: 'multiple',
  max_file_size: 3,
  max_images: 8,
  allow_ext: [
    {ext: 'jpg', mime: 'image/jpeg'},
    {ext: 'png', mime: 'image/png'},
    {ext: 'gif', mime: 'image/gif'}
  ],
  text_upload: '<p>Add product gallery images</p><p>(JPG, PNG, GIF up to 3MB each, maximum 8 images)</p>',
  alert_max_images: "You can only upload up to 8 images",
  input_name: 'product_images'
});
```

## Image Editing Features

The plugin includes built-in image editing capabilities:

- **Crop**: Select a portion of the image to keep
- **Rotate Left**: Rotate the image 90° counterclockwise
- **Rotate Right**: Rotate the image 90° clockwise

To edit an uploaded image, click the pencil icon that appears on the image.
