# 图片压缩

一个可以将图片根据质量、尺寸的要求进行压缩和旋转的工具

## 安装

**没有 `NPM`**

下载或克隆 `git clone https://github.com/freecare/img-resize.git`

- 在浏览器中使用

```html
<script src="./dist/img-resize.js"></script>
```

- esm 方式

```html
import ImgResize from './dis/img-resize.esm.js'
```

- 或者在 nodejs 中用 commonjs 方式

```html
const ImgResize = require('./dis/img-resize.common.js')
```

## 使用

**JavaScript**:

```javascript
document.getElementById('input1').onchange = function(e) {
  const file = e.target.files[0]
  if (!file) return

  document.getElementById('size1').innerText = file.size
  setImgSrc('img1', file)

  // 创建 ImgResize 实例
  const imgResize = new ImgResize(file, {
    width: 800, // 最大宽度
    height: 600, // 最大高度
    quality: 0.8 // 图片质量 0~1，默认0.8
  })

  // 开始压缩，返回 <File>Promise
  imgResize.resizeToFile().then(resFile => {
    document.getElementById('size2').innerText = resFile.size
    setImgSrc('img2', resFile)
  })

  // 或者以base64返回 <String>Promise
  // imgResize.resizeToBase64().then(base64 => {
  //   console.log(base64)
  // })

  // 旋转图片（已经压缩）
  // 参数：1~8 或 true（递增）false（递减）
  // imgResize.rotateToFile().then(refFile => {
  //   document.getElementById('size2').innerText = resFile.size
  //   setImgSrc('img2', resFile)
  // })

  // 相应的旋转为base64
  // imgResize.rotateToBase64().then(base64 => {})
}

function setImgSrc(img, file) {
  const sourceUrl = URL.createObjectURL(file)
  document.getElementById(img).setAttribute('src', sourceUrl)
}
```

**HTML**:

```html
<script src="./dist/img-resize.js"></script>

<input type="file" id="input1" />

<img src="" id="img1" />
<div>原图大小：<span id="size1"></span></div>

<img src="" id="img2" />
<div>压缩后大小：<span id="size1"></span></div>
```

## 开发

**development**

```
npm run dev
```

**production**

```
npm run build
```
