/*!
 * img-resize.js v1.0.0
 * (c) 2019-2019 freecare github
 * Released under the MIT License.
 */
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/**
 * for android jpeg 压缩质量修复 
 * https://github.com/owencm/javascript-jpeg-encoder/blob/master/jpeg_encoder_basic.js
 */

/*


  Basic GUI blocking jpeg encoder ported to JavaScript and optimized by 
  Andreas Ritter, www.bytestrom.eu, 11/2009.
  Example usage is given at the bottom of this file.
  ---------
  Copyright (c) 2008, Adobe Systems Incorporated
  All rights reserved.
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are
  met:
  * Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
  * Neither the name of Adobe Systems Incorporated nor the names of its
    contributors may be used to endorse or promote products derived from
    this software without specific prior written permission.
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function JPEGEncoder(quality) {
  var ffloor = Math.floor;
  var YTable = new Array(64);
  var UVTable = new Array(64);
  var fdtbl_Y = new Array(64);
  var fdtbl_UV = new Array(64);
  var YDC_HT;
  var UVDC_HT;
  var YAC_HT;
  var UVAC_HT;
  var bitcode = new Array(65535);
  var category = new Array(65535);
  var outputfDCTQuant = new Array(64);
  var DU = new Array(64);
  var byteout = [];
  var bytenew = 0;
  var bytepos = 7;
  var YDU = new Array(64);
  var UDU = new Array(64);
  var VDU = new Array(64);
  var clt = new Array(256);
  var RGB_YUV_TABLE = new Array(2048);
  var currentQuality;
  var ZigZag = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63];
  var std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
  var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  var std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
  var std_ac_luminance_values = [0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa];
  var std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
  var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  var std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77];
  var std_ac_chrominance_values = [0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71, 0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91, 0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0, 0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34, 0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa];

  function initQuantTables(sf) {
    var YQT = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];

    for (var i = 0; i < 64; i++) {
      var t = ffloor((YQT[i] * sf + 50) / 100);

      if (t < 1) {
        t = 1;
      } else if (t > 255) {
        t = 255;
      }

      YTable[ZigZag[i]] = t;
    }

    var UVQT = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99];

    for (var j = 0; j < 64; j++) {
      var u = ffloor((UVQT[j] * sf + 50) / 100);

      if (u < 1) {
        u = 1;
      } else if (u > 255) {
        u = 255;
      }

      UVTable[ZigZag[j]] = u;
    }

    var aasf = [1.0, 1.387039845, 1.306562965, 1.175875602, 1.0, 0.785694958, 0.541196100, 0.275899379];
    var k = 0;

    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        fdtbl_Y[k] = 1.0 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0);
        fdtbl_UV[k] = 1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0);
        k++;
      }
    }
  }

  function computeHuffmanTbl(nrcodes, std_table) {
    var codevalue = 0;
    var pos_in_table = 0;
    var HT = new Array();

    for (var k = 1; k <= 16; k++) {
      for (var j = 1; j <= nrcodes[k]; j++) {
        HT[std_table[pos_in_table]] = [];
        HT[std_table[pos_in_table]][0] = codevalue;
        HT[std_table[pos_in_table]][1] = k;
        pos_in_table++;
        codevalue++;
      }

      codevalue *= 2;
    }

    return HT;
  }

  function initHuffmanTbl() {
    YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
    UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
    YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
    UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
  }

  function initCategoryNumber() {
    var nrlower = 1;
    var nrupper = 2;

    for (var cat = 1; cat <= 15; cat++) {
      //Positive numbers
      for (var nr = nrlower; nr < nrupper; nr++) {
        category[32767 + nr] = cat;
        bitcode[32767 + nr] = [];
        bitcode[32767 + nr][1] = cat;
        bitcode[32767 + nr][0] = nr;
      } //Negative numbers


      for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
        category[32767 + nrneg] = cat;
        bitcode[32767 + nrneg] = [];
        bitcode[32767 + nrneg][1] = cat;
        bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
      }

      nrlower <<= 1;
      nrupper <<= 1;
    }
  }

  function initRGBYUVTable() {
    for (var i = 0; i < 256; i++) {
      RGB_YUV_TABLE[i] = 19595 * i;
      RGB_YUV_TABLE[i + 256 >> 0] = 38470 * i;
      RGB_YUV_TABLE[i + 512 >> 0] = 7471 * i + 0x8000;
      RGB_YUV_TABLE[i + 768 >> 0] = -11059 * i;
      RGB_YUV_TABLE[i + 1024 >> 0] = -21709 * i;
      RGB_YUV_TABLE[i + 1280 >> 0] = 32768 * i + 0x807FFF;
      RGB_YUV_TABLE[i + 1536 >> 0] = -27439 * i;
      RGB_YUV_TABLE[i + 1792 >> 0] = -5329 * i;
    }
  } // IO functions


  function writeBits(bs) {
    var value = bs[0];
    var posval = bs[1] - 1;

    while (posval >= 0) {
      if (value & 1 << posval) {
        bytenew |= 1 << bytepos;
      }

      posval--;
      bytepos--;

      if (bytepos < 0) {
        if (bytenew == 0xFF) {
          writeByte(0xFF);
          writeByte(0);
        } else {
          writeByte(bytenew);
        }

        bytepos = 7;
        bytenew = 0;
      }
    }
  }

  function writeByte(value) {
    byteout.push(clt[value]); // write char directly instead of converting later
  }

  function writeWord(value) {
    writeByte(value >> 8 & 0xFF);
    writeByte(value & 0xFF);
  } // DCT & quantization core


  function fDCTQuant(data, fdtbl) {
    var d0, d1, d2, d3, d4, d5, d6, d7;
    /* Pass 1: process rows. */

    var dataOff = 0;
    var i;
    var I8 = 8;
    var I64 = 64;

    for (i = 0; i < I8; ++i) {
      d0 = data[dataOff];
      d1 = data[dataOff + 1];
      d2 = data[dataOff + 2];
      d3 = data[dataOff + 3];
      d4 = data[dataOff + 4];
      d5 = data[dataOff + 5];
      d6 = data[dataOff + 6];
      d7 = data[dataOff + 7];
      var tmp0 = d0 + d7;
      var tmp7 = d0 - d7;
      var tmp1 = d1 + d6;
      var tmp6 = d1 - d6;
      var tmp2 = d2 + d5;
      var tmp5 = d2 - d5;
      var tmp3 = d3 + d4;
      var tmp4 = d3 - d4;
      /* Even part */

      var tmp10 = tmp0 + tmp3;
      /* phase 2 */

      var tmp13 = tmp0 - tmp3;
      var tmp11 = tmp1 + tmp2;
      var tmp12 = tmp1 - tmp2;
      data[dataOff] = tmp10 + tmp11;
      /* phase 3 */

      data[dataOff + 4] = tmp10 - tmp11;
      var z1 = (tmp12 + tmp13) * 0.707106781;
      /* c4 */

      data[dataOff + 2] = tmp13 + z1;
      /* phase 5 */

      data[dataOff + 6] = tmp13 - z1;
      /* Odd part */

      tmp10 = tmp4 + tmp5;
      /* phase 2 */

      tmp11 = tmp5 + tmp6;
      tmp12 = tmp6 + tmp7;
      /* The rotator is modified from fig 4-8 to avoid extra negations. */

      var z5 = (tmp10 - tmp12) * 0.382683433;
      /* c6 */

      var z2 = 0.541196100 * tmp10 + z5;
      /* c2-c6 */

      var z4 = 1.306562965 * tmp12 + z5;
      /* c2+c6 */

      var z3 = tmp11 * 0.707106781;
      /* c4 */

      var z11 = tmp7 + z3;
      /* phase 5 */

      var z13 = tmp7 - z3;
      data[dataOff + 5] = z13 + z2;
      /* phase 6 */

      data[dataOff + 3] = z13 - z2;
      data[dataOff + 1] = z11 + z4;
      data[dataOff + 7] = z11 - z4;
      dataOff += 8;
      /* advance pointer to next row */
    }
    /* Pass 2: process columns. */


    dataOff = 0;

    for (i = 0; i < I8; ++i) {
      d0 = data[dataOff];
      d1 = data[dataOff + 8];
      d2 = data[dataOff + 16];
      d3 = data[dataOff + 24];
      d4 = data[dataOff + 32];
      d5 = data[dataOff + 40];
      d6 = data[dataOff + 48];
      d7 = data[dataOff + 56];
      var tmp0p2 = d0 + d7;
      var tmp7p2 = d0 - d7;
      var tmp1p2 = d1 + d6;
      var tmp6p2 = d1 - d6;
      var tmp2p2 = d2 + d5;
      var tmp5p2 = d2 - d5;
      var tmp3p2 = d3 + d4;
      var tmp4p2 = d3 - d4;
      /* Even part */

      var tmp10p2 = tmp0p2 + tmp3p2;
      /* phase 2 */

      var tmp13p2 = tmp0p2 - tmp3p2;
      var tmp11p2 = tmp1p2 + tmp2p2;
      var tmp12p2 = tmp1p2 - tmp2p2;
      data[dataOff] = tmp10p2 + tmp11p2;
      /* phase 3 */

      data[dataOff + 32] = tmp10p2 - tmp11p2;
      var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781;
      /* c4 */

      data[dataOff + 16] = tmp13p2 + z1p2;
      /* phase 5 */

      data[dataOff + 48] = tmp13p2 - z1p2;
      /* Odd part */

      tmp10p2 = tmp4p2 + tmp5p2;
      /* phase 2 */

      tmp11p2 = tmp5p2 + tmp6p2;
      tmp12p2 = tmp6p2 + tmp7p2;
      /* The rotator is modified from fig 4-8 to avoid extra negations. */

      var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433;
      /* c6 */

      var z2p2 = 0.541196100 * tmp10p2 + z5p2;
      /* c2-c6 */

      var z4p2 = 1.306562965 * tmp12p2 + z5p2;
      /* c2+c6 */

      var z3p2 = tmp11p2 * 0.707106781;
      /* c4 */

      var z11p2 = tmp7p2 + z3p2;
      /* phase 5 */

      var z13p2 = tmp7p2 - z3p2;
      data[dataOff + 40] = z13p2 + z2p2;
      /* phase 6 */

      data[dataOff + 24] = z13p2 - z2p2;
      data[dataOff + 8] = z11p2 + z4p2;
      data[dataOff + 56] = z11p2 - z4p2;
      dataOff++;
      /* advance pointer to next column */
    } // Quantize/descale the coefficients


    var fDCTQuant;

    for (i = 0; i < I64; ++i) {
      // Apply the quantization and scaling factor & Round to nearest integer
      fDCTQuant = data[i] * fdtbl[i];
      outputfDCTQuant[i] = fDCTQuant > 0.0 ? fDCTQuant + 0.5 | 0 : fDCTQuant - 0.5 | 0;
    }

    return outputfDCTQuant;
  }

  function writeAPP0() {
    writeWord(0xFFE0); // marker

    writeWord(16); // length

    writeByte(0x4A); // J

    writeByte(0x46); // F

    writeByte(0x49); // I

    writeByte(0x46); // F

    writeByte(0); // = "JFIF",'\0'

    writeByte(1); // versionhi

    writeByte(1); // versionlo

    writeByte(0); // xyunits

    writeWord(1); // xdensity

    writeWord(1); // ydensity

    writeByte(0); // thumbnwidth

    writeByte(0); // thumbnheight
  }

  function writeSOF0(width, height) {
    writeWord(0xFFC0); // marker

    writeWord(17); // length, truecolor YUV JPG

    writeByte(8); // precision

    writeWord(height);
    writeWord(width);
    writeByte(3); // nrofcomponents

    writeByte(1); // IdY

    writeByte(0x11); // HVY

    writeByte(0); // QTY

    writeByte(2); // IdU

    writeByte(0x11); // HVU

    writeByte(1); // QTU

    writeByte(3); // IdV

    writeByte(0x11); // HVV

    writeByte(1); // QTV
  }

  function writeDQT() {
    writeWord(0xFFDB); // marker

    writeWord(132); // length

    writeByte(0);

    for (var i = 0; i < 64; i++) {
      writeByte(YTable[i]);
    }

    writeByte(1);

    for (var j = 0; j < 64; j++) {
      writeByte(UVTable[j]);
    }
  }

  function writeDHT() {
    writeWord(0xFFC4); // marker

    writeWord(0x01A2); // length

    writeByte(0); // HTYDCinfo

    for (var i = 0; i < 16; i++) {
      writeByte(std_dc_luminance_nrcodes[i + 1]);
    }

    for (var j = 0; j <= 11; j++) {
      writeByte(std_dc_luminance_values[j]);
    }

    writeByte(0x10); // HTYACinfo

    for (var k = 0; k < 16; k++) {
      writeByte(std_ac_luminance_nrcodes[k + 1]);
    }

    for (var l = 0; l <= 161; l++) {
      writeByte(std_ac_luminance_values[l]);
    }

    writeByte(1); // HTUDCinfo

    for (var m = 0; m < 16; m++) {
      writeByte(std_dc_chrominance_nrcodes[m + 1]);
    }

    for (var n = 0; n <= 11; n++) {
      writeByte(std_dc_chrominance_values[n]);
    }

    writeByte(0x11); // HTUACinfo

    for (var o = 0; o < 16; o++) {
      writeByte(std_ac_chrominance_nrcodes[o + 1]);
    }

    for (var p = 0; p <= 161; p++) {
      writeByte(std_ac_chrominance_values[p]);
    }
  }

  function writeSOS() {
    writeWord(0xFFDA); // marker

    writeWord(12); // length

    writeByte(3); // nrofcomponents

    writeByte(1); // IdY

    writeByte(0); // HTY

    writeByte(2); // IdU

    writeByte(0x11); // HTU

    writeByte(3); // IdV

    writeByte(0x11); // HTV

    writeByte(0); // Ss

    writeByte(0x3f); // Se

    writeByte(0); // Bf
  }

  function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
    var EOB = HTAC[0x00];
    var M16zeroes = HTAC[0xF0];
    var pos;
    var I16 = 16;
    var I63 = 63;
    var I64 = 64;
    var DU_DCT = fDCTQuant(CDU, fdtbl); //ZigZag reorder

    for (var j = 0; j < I64; ++j) {
      DU[ZigZag[j]] = DU_DCT[j];
    }

    var Diff = DU[0] - DC;
    DC = DU[0]; //Encode DC

    if (Diff == 0) {
      writeBits(HTDC[0]); // Diff might be 0
    } else {
      pos = 32767 + Diff;
      writeBits(HTDC[category[pos]]);
      writeBits(bitcode[pos]);
    } //Encode ACs


    var end0pos = 63; // was const... which is crazy

    for (; end0pos > 0 && DU[end0pos] == 0; end0pos--) {} //end0pos = first element in reverse order !=0


    if (end0pos == 0) {
      writeBits(EOB);
      return DC;
    }

    var i = 1;
    var lng;

    while (i <= end0pos) {
      var startpos = i;

      for (; DU[i] == 0 && i <= end0pos; ++i) {}

      var nrzeroes = i - startpos;

      if (nrzeroes >= I16) {
        lng = nrzeroes >> 4;

        for (var nrmarker = 1; nrmarker <= lng; ++nrmarker) {
          writeBits(M16zeroes);
        }

        nrzeroes = nrzeroes & 0xF;
      }

      pos = 32767 + DU[i];
      writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
      writeBits(bitcode[pos]);
      i++;
    }

    if (end0pos != I63) {
      writeBits(EOB);
    }

    return DC;
  }

  function initCharLookupTable() {
    var sfcc = String.fromCharCode;

    for (var i = 0; i < 256; i++) {
      ///// ACHTUNG // 255
      clt[i] = sfcc(i);
    }
  }

  this.encode = function (image, quality, toRaw) // image data object
  {
    if (quality) setQuality(quality); // Initialize bit writer

    byteout = new Array();
    bytenew = 0;
    bytepos = 7; // Add JPEG headers

    writeWord(0xFFD8); // SOI

    writeAPP0();
    writeDQT();
    writeSOF0(image.width, image.height);
    writeDHT();
    writeSOS(); // Encode 8x8 macroblocks

    var DCY = 0;
    var DCU = 0;
    var DCV = 0;
    bytenew = 0;
    bytepos = 7;
    this.encode.displayName = "_encode_";
    var imageData = image.data;
    var width = image.width;
    var height = image.height;
    var quadWidth = width * 4; // var tripleWidth = width * 3;

    var x,
        y = 0;
    var r, g, b;
    var start, p, col, row, pos;

    while (y < height) {
      x = 0;

      while (x < quadWidth) {
        start = quadWidth * y + x;
        p = start;
        col = -1;
        row = 0;

        for (pos = 0; pos < 64; pos++) {
          row = pos >> 3; // /8

          col = (pos & 7) * 4; // %8

          p = start + row * quadWidth + col;

          if (y + row >= height) {
            // padding bottom
            p -= quadWidth * (y + 1 + row - height);
          }

          if (x + col >= quadWidth) {
            // padding right
            p -= x + col - quadWidth + 4;
          }

          r = imageData[p++];
          g = imageData[p++];
          b = imageData[p++];
          /* // calculate YUV values dynamically
          YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
          UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
          VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
          */
          // use lookup table (slightly faster)

          YDU[pos] = (RGB_YUV_TABLE[r] + RGB_YUV_TABLE[g + 256 >> 0] + RGB_YUV_TABLE[b + 512 >> 0] >> 16) - 128;
          UDU[pos] = (RGB_YUV_TABLE[r + 768 >> 0] + RGB_YUV_TABLE[g + 1024 >> 0] + RGB_YUV_TABLE[b + 1280 >> 0] >> 16) - 128;
          VDU[pos] = (RGB_YUV_TABLE[r + 1280 >> 0] + RGB_YUV_TABLE[g + 1536 >> 0] + RGB_YUV_TABLE[b + 1792 >> 0] >> 16) - 128;
        }

        DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
        DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
        DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
        x += 32;
      }

      y += 8;
    } ////////////////////////////////////////////////////////////////
    // Do the bit alignment of the EOI marker


    if (bytepos >= 0) {
      var fillbits = [];
      fillbits[1] = bytepos + 1;
      fillbits[0] = (1 << bytepos + 1) - 1;
      writeBits(fillbits);
    }

    writeWord(0xFFD9); //EOI

    if (toRaw) {
      var len = byteout.length;
      var data = new Uint8Array(len);

      for (var i = 0; i < len; i++) {
        data[i] = byteout[i].charCodeAt();
      } //cleanup


      byteout = [];
      return data;
    }

    var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));
    byteout = [];
    return jpegDataUri;
  };

  function setQuality(quality) {
    if (quality <= 0) {
      quality = 1;
    }

    if (quality > 100) {
      quality = 100;
    }

    if (currentQuality == quality) return; // don't recalc if unchanged

    var sf = 0;

    if (quality < 50) {
      sf = Math.floor(5000 / quality);
    } else {
      sf = Math.floor(200 - quality * 2);
    }

    initQuantTables(sf);
    currentQuality = quality;
  }

  function init() {
    if (!quality) quality = 50; // Create tables

    initCharLookupTable();
    initHuffmanTbl();
    initCategoryNumber();
    initRGBYUVTable();
    setQuality(quality);
  }

  init();
}

var getUa = function getUa() {
  var ua = navigator.userAgent;
  var isIOS = /OS (\d+)_.* like Mac OS X/g.exec(ua);
  var isAndroid = /Android[\s/](\d.*?)[\s;]/g.exec(ua);
  return {
    oldIOS: isIOS ? +isIOS.pop() < 8 : false,
    oldAndroid: isAndroid ? +isAndroid.pop().substring(0, 3) < 4.5 : false,
    ios: /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua),
    android: /Android/g.test(ua),
    mQQBrowser: /MQQBrowser/g.test(ua)
  };
};

/**
* Detect subsampling in loaded image.
* In iOS, larger images than 2M pixels may be subsampled in rendering.
*/
function detectSubsampling(img) {
  var iw = img.naturalWidth,
      ih = img.naturalHeight;

  if (iw * ih > 1024 * 1024) {
    // subsampling may happen over megapixel image
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, -iw + 1, 0); // subsampled image becomes half smaller in rendering size.
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
  var data = ctx.getImageData(0, 0, 1, ih).data; // search image edge pixel position in case it is squashed vertically.

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

    py = ey + sy >> 1;
  }

  var ratio = py / ih;
  return ratio === 0 ? 1 : ratio;
}
/**
* Transform canvas coordination according to specified frame size and orientation
* Orientation value is from EXIF tag
*/


function transformCoordinate(canvas, ctx, width, height, orientation) {
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
* Rendering image element (with resizing) into the canvas element
*/

function renderImageToCanvas(img, canvas, options, doSquash) {
  var iw = img.naturalWidth,
      ih = img.naturalHeight;
  var width = options.width,
      height = options.height;
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
function renderImageToCanvasNormal(img, canvas, width, height) {
  var ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  ctx.save();
  ctx.drawImage(img, 0, 0, width, height);
  ctx.restore();
}
function renderBase64ToFile(base64, filename) {
  var arr = base64.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {
    type: mime
  });
}

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var ImgResize =
/*#__PURE__*/
function () {
  function ImgResize(file, options) {
    _classCallCheck(this, ImgResize);

    this.file = file;
    this.options = Object.assign({
      // width, // 最大宽度
      // height, // 最大高度
      quality: 0.8,
      // 图片质量
      orientation: 1,
      // 图片旋转方向
      type: 'image/jpeg'
    }, options);
    var ua = getUa();
    this.isIOS = ua.ios;
    this.needEncoder = ua.oldAndroid || ua.mQQBrowser || !navigator.userAgent;
    this.canvas = document.createElement('canvas');
    this.img = null;
  }

  _createClass(ImgResize, [{
    key: "resize",
    value: function resize() {
      var _this = this;

      return this.getImage().then(function (img) {
        _this.img = img;
        var _this$options = _this.options,
            width = _this$options.width,
            height = _this$options.height,
            quality = _this$options.quality,
            orientation = _this$options.orientation; // 计算真实的图片宽度和高度

        var _this$getSize = _this.getSize(width, height, _this.img.width, _this.img.height),
            _this$getSize2 = _slicedToArray(_this$getSize, 2),
            w = _this$getSize2[0],
            h = _this$getSize2[1];

        _this.options.width = w;
        _this.options.height = h;

        if (_this.isIOS) {
          // 修复 IOS drawImage画面扭曲
          renderImageToCanvas(_this.img, _this.canvas, {
            width: w,
            height: h,
            quality: quality,
            orientation: orientation
          }, true);
        } else {
          renderImageToCanvasNormal(_this.img, _this.canvas, w, h);
        }

        return _this.file, _this.canvas;
      });
    }
  }, {
    key: "init",
    value: function init() {
      if (this.img) {
        return Promise.resolve();
      }

      return this.resize();
    }
  }, {
    key: "resizeToBase64",
    value: function resizeToBase64() {
      try {
        var _this3 = this;

        return _await(_this3.init(), function () {
          return _this3.createBase64();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "resizeToFile",
    value: function resizeToFile() {
      try {
        var _this5 = this;

        return _await(_this5.resizeToBase64(), function (base64) {
          return renderBase64ToFile(base64, _this5.file.name);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "rotateToBase64",
    value: function rotateToBase64(orientation) {
      try {
        var _this7 = this;

        return _await(_this7.init(), function () {
          return _await(_this7.rotate(orientation), function () {
            return _this7.createBase64();
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "rotateToFile",
    value: function rotateToFile(orientation) {
      try {
        var _this9 = this;

        return _await(_this9.rotateToBase64(orientation), function (base64) {
          return renderBase64ToFile(base64, _this9.file.name);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * 旋转图片
     * @param {Boolean|Number} orientation 旋转角度1~8或true递增false递减
     */

  }, {
    key: "rotate",
    value: function rotate() {
      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var r = this.options.orientation;

      if (orientation === r) {
        return;
      }

      if (typeof orientation === 'number') {
        r = orientation;
      } else {
        r += orientation ? 1 : -1;
      }

      r = r % 8 || 8;
      this.options.orientation = r;
      var ctx = this.canvas.getContext('2d');
      transformCoordinate(this.canvas, ctx, this.options.width, this.options.height, this.options.orientation);
      var _this$canvas = this.canvas,
          width = _this$canvas.width,
          height = _this$canvas.height;

      if (r > 4) {
        var _ref = [height, width];
        width = _ref[0];
        height = _ref[1];
      }

      ctx.drawImage(this.img, 0, 0, width, height);
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

  }, {
    key: "getImage",
    value: function getImage() {
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        var fileType = Object.prototype.toString.call(_this10.file);

        if (fileType === '[object File]') {
          _this10.options.type = _this10.file.type; // 创建一个图片对象

          var img = new Image();

          img.onload = function () {
            return resolve(img);
          };

          img.onerror = function (err) {
            return reject(err);
          }; // 开始加载图片


          img.src = URL.createObjectURL(_this10.file);
        } else if (fileType === '[object HTMLImageElement]') {
          // 需要是加载完成的 Image 对象
          resolve(_this10.file);
        } else {
          reject();
        }
      });
    }
    /**
     * 通过canvas生成Base64
     */

  }, {
    key: "createBase64",
    value: function createBase64() {
      var _this$options2 = this.options,
          width = _this$options2.width,
          height = _this$options2.height,
          quality = _this$options2.quality;

      if (this.needEncoder) {
        // for android jpeg 压缩质量修复 
        var encoder = new JPEGEncoder(quality * 100);
        var ctx = this.canvas.getContext('2d');
        return encoder.encode(ctx.getImageData(0, 0, width, height));
      } else {
        return this.canvas.toDataURL(this.options.type, quality);
      }
    }
    /**
     * 根据最大尺寸，计算压缩后的图片尺寸
     * @param {Number} width 限制最大宽度
     * @param {Number} height 限制最大高度
     * @param {Number} imgWidth 图片宽度
     * @param {Number} imgHeight 图片高度
     */

  }, {
    key: "getSize",
    value: function getSize() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3264;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2448;
      var imgWidth = arguments.length > 2 ? arguments[2] : undefined;
      var imgHeight = arguments.length > 3 ? arguments[3] : undefined;
      // 在IOS上，超过这个值base64无法生成 w>=3264,h>=2448
      width = Math.min(width, 3264);
      height = Math.min(height, 2448); // 如果原图尺寸小于设定的最大尺寸，采用原图尺寸

      if (imgWidth <= width && imgHeight <= height) {
        return [imgWidth, imgHeight];
      } // 图片宽高比


      var imgScale = imgHeight ? imgWidth / imgHeight : 1;

      if (imgWidth > width) {
        imgWidth = width;
        imgHeight = Math.ceil(imgWidth / imgScale);
      }

      if (imgHeight > height) {
        imgHeight = height;
        imgWidth = Math.ceil(imgHeight * imgScale);
      }

      return [imgWidth, imgHeight];
    }
  }]);

  return ImgResize;
}();

export default ImgResize;
//# sourceMappingURL=img-resize.esm.js.map
