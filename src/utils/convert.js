/**
* Detect subsampling in loaded image.
* In iOS, larger images than 2M pixels may be subsampled in rendering.
*/
function detectSubsampling(img) {
  var iw = img.naturalWidth, ih = img.naturalHeight;
  if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, -iw + 1, 0);
    // subsampled image becomes half smaller in rendering size.
    // check alpha channel value to confirm image is covering edge pixel or not.
    // if alpha value is 0 image is not covering, hence subsampled.
    return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
  } else {
    return false;
  }
}

/**
* Detecting vertical squash in loaded image.
* Fixes a bug which squash image vertically while drawing into canvas for some images.
*/
function detectVerticalSquash(img, iw, ih) {
  var canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = ih;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  var data = ctx.getImageData(0, 0, 1, ih).data;
  // search image edge pixel position in case it is squashed vertically.
  var sy = 0;
  var ey = ih;
  var py = ih;
  while (py > sy) {
    var alpha = data[(py - 1) * 4 + 3];
    if (alpha === 0) {
      ey = py;
    } else {
      sy = py;
    }
    py = (ey + sy) >> 1;
  }
  var ratio = (py / ih);
  return (ratio === 0) ? 1 : ratio;
}

/**
* Transform canvas coordination according to specified frame size and orientation
* Orientation value is from EXIF tag
*/
export function transformCoordinate(canvas, ctx, width, height, orientation) {
  switch (orientation) {
    case 5:
    case 6:
    case 7:
    case 8:
      canvas.width = height;
      canvas.height = width;
      break;
    default:
      canvas.width = width;
      canvas.height = height;
  }
  switch (orientation) {
    case 2:
      // horizontal flip
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      // 180 rotate left
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4:
      // vertical flip
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5:
      // vertical flip + 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      // 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -height);
      break;
    case 7:
      // horizontal flip + 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);
      break;
    case 8:
      // 90 rotate left
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      break;
    default:
      break;
  }
}

/**
* Rendering image element (with resizing) and get its data URL
*/
export function renderImageToDataURL(img, options, doSquash) {
  var canvas = document.createElement('canvas');
  renderImageToCanvas(img, canvas, options, doSquash);
  return canvas.toDataURL("image/jpeg", options.quality || 0.8);
}

/**
* Rendering image element (with resizing) into the canvas element
*/
export function renderImageToCanvas(img, canvas, options, doSquash) {
  var iw = img.naturalWidth, ih = img.naturalHeight;
  var width = options.width, height = options.height;
  var ctx = canvas.getContext('2d');
  ctx.save();
  transformCoordinate(canvas, ctx, width, height, options.orientation);
  var subsampled = detectSubsampling(img);
  if (subsampled) {
    iw /= 2;
    ih /= 2;
  }
  var d = 1024; // size of tiling canvas
  var tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = tmpCanvas.height = d;
  var tmpCtx = tmpCanvas.getContext('2d');
  var vertSquashRatio = doSquash ? detectVerticalSquash(img, iw, ih) : 1;
  var dw = Math.ceil(d * width / iw);
  var dh = Math.ceil(d * height / ih / vertSquashRatio);
  var sy = 0;
  var dy = 0;
  while (sy < ih) {
    var sx = 0;
    var dx = 0;
    while (sx < iw) {
      tmpCtx.clearRect(0, 0, d, d);
      tmpCtx.drawImage(img, -sx, -sy);
      ctx.drawImage(tmpCanvas, 0, 0, d, d, dx, dy, dw, dh);
      sx += d;
      dx += dw;
    }
    sy += d;
    dy += dh;
  }
  ctx.restore();
  tmpCanvas = tmpCtx = null;
}

export function renderImageToCanvasNormal(img, canvas, width, height) {
  const ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  ctx.save()
  ctx.drawImage(img, 0, 0, width, height)
  ctx.restore()
}

export function renderBase64ToFile(base64, filename) {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
