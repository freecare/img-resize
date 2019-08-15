// import EXIF from 'exif-js'
import JPEGEncoder from './utils/jpeg-encoder'
import { getUa } from './utils/devices'
import {
  renderBase64ToFile,
  renderImageToCanvas,
  renderImageToCanvasNormal,
  transformCoordinate
} from './utils/convert'

class ImgResize {
  constructor(file, options) {
    this.file = file
    this.options = Object.assign({
      // width, // 最大宽度
      // height, // 最大高度
      quality: 0.8, // 图片质量
      orientation: 1, // 图片旋转方向
      type: 'image/jpeg'
    }, options)

    const ua = getUa()
    this.isIOS = ua.ios
    this.needEncoder = ua.oldAndroid || ua.mQQBrowser || !navigator.userAgent
    this.canvas = document.createElement('canvas')

    this.img = null
  }

  resize() {
    return this.getImage().then(img => {
      this.img = img
      const { width, height, quality, orientation } = this.options

      // 计算真实的图片宽度和高度
      const [w, h] = this.getSize(width, height, this.img.width, this.img.height)
      this.options.width = w
      this.options.height = h

      if (this.isIOS) {
        // 修复 IOS drawImage画面扭曲
        renderImageToCanvas(this.img, this.canvas, { width: w, height: h, quality, orientation }, true)
      } else {
        renderImageToCanvasNormal(this.img, this.canvas, w, h)
      }

      return (this.file, this.canvas)
    })
  }

  init() {
    if (this.img) {
      return Promise.resolve()
    }
    return this.resize()
  }

  async resizeToBase64() {
    await this.init()
    return this.createBase64()
  }

  async resizeToFile() {
    const base64 = await this.resizeToBase64()
    return renderBase64ToFile(base64, this.file.name)
  }

  async rotateToBase64(orientation) {
    await this.init()
    await this.rotate(orientation)
    return this.createBase64()
  }

  async rotateToFile(orientation) {
    const base64 = await this.rotateToBase64(orientation)
    return renderBase64ToFile(base64, this.file.name)
  }

  /**
   * 旋转图片
   * @param {Boolean|Number} orientation 旋转角度1~8或true递增false递减
   */
  rotate(orientation = false) {
    let { orientation: r } = this.options
    if (orientation === r) { return }

    if (typeof orientation === 'number') {
      r = orientation
    } else {
      r += orientation ? 1 : -1
    }
    r = r % 8 || 8

    this.options.orientation = r
    const ctx = this.canvas.getContext('2d')
    transformCoordinate(
      this.canvas,
      ctx,
      this.options.width,
      this.options.height,
      this.options.orientation
    )

    let { width, height } = this.canvas
    if (r > 4) {
      [width, height] = [height, width]
    }
    ctx.drawImage(this.img, 0, 0, width, height)
  }

  /**
   * 处理IOS方向问题
   * @param {Image} img 
   */
  // static getExif(img) {
  //   return new Promise(resolve => {
  //     try {
  //       EXIF.getData(img, function () {
  //         resolve(this)// this为附加exifdata的图片
  //       })
  //     } catch (err) {
  //       resolve(img, err)
  //     }
  //   })
  // }

  /**
   * 根据 file 生成 Image 对象
   */
  getImage() {
    return new Promise((resolve, reject) => {
      const fileType = Object.prototype.toString.call(this.file)
      if (fileType === '[object File]') {
        this.options.type = this.file.type

        // 创建一个图片对象
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = err => reject(err)

        // 开始加载图片
        img.src = URL.createObjectURL(this.file)
      } else if (fileType === '[object HTMLImageElement]') {
        // 需要是加载完成的 Image 对象
        resolve(this.file)
      } else {
        reject()
      }
    })
  }

  /**
   * 通过canvas生成Base64
   */
  createBase64() {
    const { width, height, quality } = this.options
    if (this.needEncoder) {
      // for android jpeg 压缩质量修复 
      const encoder = new JPEGEncoder(quality * 100)
      const ctx = this.canvas.getContext('2d')
      return encoder.encode(ctx.getImageData(0, 0, width, height))
    } else {
      return this.canvas.toDataURL(this.options.type, quality)
    }
  }

  /**
   * 根据最大尺寸，计算压缩后的图片尺寸
   * @param {Number} width 限制最大宽度
   * @param {Number} height 限制最大高度
   * @param {Number} imgWidth 图片宽度
   * @param {Number} imgHeight 图片高度
   */
  getSize(width = 3264, height = 2448, imgWidth, imgHeight) {
    // 在IOS上，超过这个值base64无法生成 w>=3264,h>=2448
    width = Math.min(width, 3264)
    height = Math.min(height, 2448)

    // 如果原图尺寸小于设定的最大尺寸，采用原图尺寸
    if (imgWidth <= width && imgHeight <= height) {
      return [imgWidth, imgHeight]
    }

    // 图片宽高比
    const imgScale = imgHeight ? imgWidth / imgHeight : 1

    if (imgWidth > width) {
      imgWidth = width
      imgHeight = Math.ceil(imgWidth / imgScale)
    }
    if (imgHeight > height) {
      imgHeight = height
      imgWidth = Math.ceil(imgHeight * imgScale)
    }

    return [imgWidth, imgHeight]
  }
}

export default ImgResize
