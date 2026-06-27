import { mard221 } from '../palettes/mard-221.js';
import { mard291 } from '../palettes/mard-291.js';

var PALETTES = { mard221: { name: 'MARD 221 色', data: mard221 }, mard291: { name: 'MARD 291 色', data: mard291 } };

// ---- Color science ----
function srgbToLinear(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToLab(r, g, b) {
  var R = srgbToLinear(r), G = srgbToLinear(g), B = srgbToLinear(b);
  var X = 0.4124564 * R + 0.3575761 * G + 0.1804375 * B;
  var Y = 0.2126729 * R + 0.7151522 * G + 0.0721750 * B;
  var Z = 0.0193339 * R + 0.1191920 * G + 0.9503041 * B;
  var Xn = 0.95047, Yn = 1.0, Zn = 1.08883;
  function f(t) { return t > 0.008856 ? Math.pow(t, 1/3) : 7.787 * t + 16/116; }
  return { L: 116 * f(Y / Yn) - 16, a: 500 * (f(X / Xn) - f(Y / Yn)), b: 200 * (f(Y / Yn) - f(Z / Zn)) };
}

function deltaE(l1, a1, b1, l2, a2, b2) {
  var dL = l1 - l2, da = a1 - a2, db = b1 - b2;
  return dL * dL + da * da + db * db;
}

// ---- Palette with precomputed Lab ----
var paletteCache = {};

function getPaletteWithLab(key) {
  if (paletteCache[key]) return paletteCache[key];
  var pal = PALETTES[key].data.map(function (c) {
    var lab = rgbToLab(c.r, c.g, c.b);
    return { code: c.code, hex: c.hex, r: c.r, g: c.g, b: c.b, L: lab.L, a: lab.a, b: lab.b };
  });
  paletteCache[key] = pal;
  return pal;
}

function findClosest(palette, r, g, b) {
  var lab = rgbToLab(r, g, b);
  var best = null, bestDist = Infinity;
  for (var i = 0; i < palette.length; i++) {
    var c = palette[i];
    var d = deltaE(lab.L, lab.a, lab.b, c.L, c.a, c.b);
    if (d < bestDist) { bestDist = d; best = c; }
  }
  return best;
}

function isLight(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) > 140;
}

// ---- Template ----
export function renderTools() {
  return '<div class="main-content"><div class="container"><div class="page-header page-header--article"><h1 class="page-title">拼豆图纸生成器</h1><p class="page-subtitle">上传图片，自动生成 MARD 拼豆图纸与材料清单</p></div><div class="tools-layout" id="toolsLayout"><div class="tool-panel" id="toolPanel"><div class="tool-panel-section"><div class="tool-panel-title">📁 上传图片</div><div class="upload-zone" id="uploadZone"><input type="file" accept="image/*" id="fileInput" style="display:none"><div class="upload-zone-content"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><p class="upload-text">点击或拖拽上传图片</p><p class="upload-hint">支持 JPG / PNG / WebP</p></div><div class="upload-preview" id="uploadPreview" style="display:none"><img id="previewImg" alt=""><button class="upload-remove" id="uploadRemove" title="移除">&times;</button></div></div></div><div class="tool-panel-section"><div class="tool-panel-title">🎨 色卡选择</div><div class="tool-panel-row"><label class="tool-label"><input type="radio" name="paletteKey" value="mard221" checked> MARD 221 色</label></div><div class="tool-panel-row"><label class="tool-label"><input type="radio" name="paletteKey" value="mard291"> MARD 291 色</label></div></div><div class="tool-panel-section"><div class="tool-panel-title">⚙️ 参数设置</div><div class="tool-panel-row"><label class="tool-label">最大宽度（颗）</label><input type="number" class="tool-input" id="maxWidth" value="64" min="16" max="200"></div><div class="tool-panel-row"><label class="tool-label"><input type="checkbox" id="limitColors"> 限制颜色数</label></div><div class="tool-panel-row" id="colorLimitRow" style="display:none"><input type="number" class="tool-input" id="colorLimit" value="16" min="2" max="64" style="width:80px;margin-left:24px"><span class="tool-hint">色</span></div><div class="tool-panel-row"><label class="tool-label"><input type="checkbox" id="enableDither"> 抖动 (Floyd-Steinberg)</label></div></div><div class="tool-panel-section"><div class="tool-panel-title">🏷️ 显示选项</div><div class="tool-panel-row"><label class="tool-label"><input type="checkbox" id="showColorValue" checked> 显示色值</label></div><div class="tool-panel-row"><label class="tool-label"><input type="checkbox" id="showCoord" checked> 显示坐标</label></div></div><button class="btn btn-primary" id="generateBtn" disabled>✨ 生成图纸</button></div><div class="tool-content" id="toolContent"><div class="tool-empty" id="toolEmpty"><p>请上传图片并点击「生成图纸」</p></div><div class="tool-results" id="toolResults" style="display:none"><div class="preview-container"><canvas id="beadCanvas" class="preview-canvas"></canvas></div><div class="stats-bar" id="statsBar"></div><div class="export-bar"><button class="btn btn-secondary" id="exportPngBtn">📥 导出 PNG</button><button class="btn btn-secondary" id="exportCsvBtn">📄 导出 CSV</button><button class="btn btn-secondary" id="exportPrintBtn">🖨 打印版</button></div><div class="material-section"><h3 class="material-title">📋 豆子清单</h3><div class="table-wrap"><table class="material-table" id="materialTable"><thead><tr><th>色号</th><th>颜色</th><th>HEX</th><th>数量</th><th>占比</th></tr></thead><tbody id="materialBody"></tbody></table></div></div></div></div></div></div></div>';
}

// ---- Init ----
export function initTools() {
  var state = { image: null, grid: null, palette: null, paletteKey: 'mard221', paletteLab: null };

  var $ = function (id) { return document.getElementById(id); };
  var uploadZone = $('uploadZone');
  var fileInput = $('fileInput');
  var previewImg = $('previewImg');
  var uploadPreview = $('uploadPreview');
  var uploadRemove = $('uploadRemove');
  var generateBtn = $('generateBtn');
  var beadCanvas = $('beadCanvas');
  var toolEmpty = $('toolEmpty');
  var toolResults = $('toolResults');
  var materialBody = $('materialBody');
  var statsBar = $('statsBar');
  var maxWidthInput = $('maxWidth');
  var limitColorsCheck = $('limitColors');
  var colorLimitRow = $('colorLimitRow');
  var colorLimitInput = $('colorLimit');
  var enableDitherCheck = $('enableDither');
  var paletteRadios = document.querySelectorAll('input[name="paletteKey"]');

  function getPalette() {
    var key = 'mard221';
    paletteRadios.forEach(function (r) { if (r.checked) key = r.value; });
    state.paletteKey = key;
    state.paletteLab = getPaletteWithLab(key);
    return { key: key, data: PALETTES[key].data, lab: state.paletteLab };
  }

  function enableGenerate() { generateBtn.disabled = !state.image; }

  // Upload via input
  fileInput.addEventListener('change', function () { if (fileInput.files && fileInput.files[0]) loadImage(fileInput.files[0]); });

  // Drag & drop
  uploadZone.addEventListener('dragover', function (e) { e.preventDefault(); uploadZone.classList.add('upload-zone--active'); });
  uploadZone.addEventListener('dragleave', function () { uploadZone.classList.remove('upload-zone--active'); });
  uploadZone.addEventListener('drop', function (e) { e.preventDefault(); uploadZone.classList.remove('upload-zone--active'); if (e.dataTransfer.files && e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0]); });
  uploadZone.addEventListener('click', function () { fileInput.click(); });
  uploadRemove.addEventListener('click', function (e) { e.stopPropagation(); removeImage(); });

  function loadImage(file) {
    if (!file.type.match(/^image\//)) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      state.image = new Image();
      state.image.onload = function () {
        uploadPreview.style.display = 'flex';
        previewImg.src = state.image.src;
        uploadZone.querySelector('.upload-zone-content').style.display = 'none';
        enableGenerate();
      };
      state.image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    state.image = null;
    state.grid = null;
    uploadPreview.style.display = 'none';
    uploadZone.querySelector('.upload-zone-content').style.display = '';
    toolEmpty.style.display = '';
    toolResults.style.display = 'none';
    enableGenerate();
  }

  // Show/hide color limit row
  limitColorsCheck.addEventListener('change', function () { colorLimitRow.style.display = limitColorsCheck.checked ? 'flex' : 'none'; });

  // Display checkboxes — re-render without reprocessing
  function onDisplayChange() {
    if (!state.grid) return;
    var showVal = $('showColorValue').checked;
    var showCoord = $('showCoord').checked;
    renderCanvas(state.grid, state.grid.length > 0 ? state.grid[0].length : 0, state.grid.length, showVal, showCoord);
  }
  $('showColorValue').addEventListener('change', onDisplayChange);
  $('showCoord').addEventListener('change', onDisplayChange);

  // Generate
  generateBtn.addEventListener('click', generate);

  function generate() {
    if (!state.image) return;
    var p = getPalette();
    var maxW = parseInt(maxWidthInput.value, 10) || 64;
    if (maxW < 16) maxW = 16;
    if (maxW > 200) maxW = 200;

    var img = state.image;
    var aspect = img.naturalWidth / img.naturalHeight;
    var gridW = maxW;
    var gridH = Math.max(1, Math.round(gridW / aspect));

    // Draw image to small canvas to sample pixels
    var sampleCanvas = document.createElement('canvas');
    var sampleCtx = sampleCanvas.getContext('2d');
    sampleCanvas.width = gridW;
    sampleCanvas.height = gridH;
    sampleCtx.drawImage(img, 0, 0, gridW, gridH);
    var imageData = sampleCtx.getImageData(0, 0, gridW, gridH);
    var pixels = imageData.data;

    var palette = p.lab;
    var limitColors = limitColorsCheck.checked ? parseInt(colorLimitInput.value, 10) || 16 : 0;
    var dither = enableDitherCheck.checked;

    // Color mapping with optional dithering
    var grid = [];
    var errR = [], errG = [], errB = [];
    if (dither) {
      for (var i = 0; i < gridW * gridH; i++) { errR[i] = 0; errG[i] = 0; errB[i] = 0; }
    }

    for (var y = 0; y < gridH; y++) {
      grid[y] = [];
      for (var x = 0; x < gridW; x++) {
        var idx = (y * gridW + x) * 4;
        var r = pixels[idx];
        var g = pixels[idx + 1];
        var b = pixels[idx + 2];

        if (dither) {
          var eIdx = y * gridW + x;
          r = Math.min(255, Math.max(0, r + errR[eIdx]));
          g = Math.min(255, Math.max(0, g + errG[eIdx]));
          b = Math.min(255, Math.max(0, b + errB[eIdx]));
        }

        var matched = findClosest(palette, r, g, b);
        grid[y][x] = matched;

        if (dither) {
          var qr = (r / 255 - matched.r / 255);
          var qg = (g / 255 - matched.g / 255);
          var qb = (b / 255 - matched.b / 255);
          function distribute(nx, ny, factor) {
            if (nx >= 0 && nx < gridW && ny >= 0 && ny < gridH) {
              var ei = ny * gridW + nx;
              errR[ei] += qr * 255 * factor;
              errG[ei] += qg * 255 * factor;
              errB[ei] += qb * 255 * factor;
            }
          }
          distribute(x + 1, y, 7 / 16);
          distribute(x - 1, y + 1, 3 / 16);
          distribute(x, y + 1, 5 / 16);
          distribute(x + 1, y + 1, 1 / 16);
        }
      }
    }

    // Color limit: keep top N, merge rest to closest kept
    if (limitColors > 0) {
      var countMap = {};
      for (var y2 = 0; y2 < gridH; y2++) {
        for (var x2 = 0; x2 < gridW; x2++) {
          var c = grid[y2][x2];
          countMap[c.code] = (countMap[c.code] || 0) + 1;
        }
      }
      var sorted = Object.keys(countMap).sort(function (a, b) { return countMap[b] - countMap[a]; });
      if (sorted.length > limitColors) {
        var keep = {};
        for (var i2 = 0; i2 < limitColors; i2++) keep[sorted[i2]] = true;
        // Build map from removed -> closest kept
        var replaceMap = {};
        for (var y3 = 0; y3 < gridH; y3++) {
          for (var x3 = 0; x3 < gridW; x3++) {
            var cell = grid[y3][x3];
            if (!keep[cell.code]) {
              if (!replaceMap[cell.code]) {
                var best = null, bestDist2 = Infinity;
                for (var k in keep) {
                  var kc = palette.find(function (p2) { return p2.code === k; });
                  if (kc) {
                    var d2 = deltaE(cell.L, cell.a, cell.b, kc.L, kc.a, kc.b);
                    if (d2 < bestDist2) { bestDist2 = d2; best = kc; }
                  }
                }
                replaceMap[cell.code] = best;
              }
              grid[y3][x3] = replaceMap[cell.code];
            }
          }
        }
      }
    }

    state.grid = grid;

    // Render
    var showVal = $('showColorValue').checked;
    var showCoord = $('showCoord').checked;
    renderCanvas(grid, gridW, gridH, showVal, showCoord);
    renderStats(grid, gridW, gridH);
    renderMaterial(grid);
    toolEmpty.style.display = 'none';
    toolResults.style.display = '';
  }

  function renderCanvas(grid, w, h, showVal, showCoord) {
    var container = beadCanvas.parentElement;
    var maxW = container.clientWidth - 4;
    var labelS = showCoord ? 18 : 0;
    var padL = labelS, padR = labelS;
    var padT = (showVal || showCoord) ? 18 : 0;
    var padB = showCoord ? 18 : 0;
    var avaiW = maxW - padL - padR;
    var cellSize = Math.min(24, Math.floor(avaiW / w));
    if (cellSize < 8) { cellSize = 8; padL = 0; padR = 0; padT = 0; padB = 0; }

    beadCanvas.width = w * cellSize + padL + padR;
    beadCanvas.height = h * cellSize + padT + padB;
    var ctx = beadCanvas.getContext('2d');

    ctx.fillStyle = '#e8e4dc';
    ctx.fillRect(0, 0, beadCanvas.width, beadCanvas.height);

    var gap = Math.max(1, Math.floor(cellSize * 0.12));
    var beadR = (cellSize - gap) / 2;

    // Coordinate labels on 4 edges
    if (showCoord && padL > 0) {
      ctx.font = Math.max(7, Math.floor(cellSize * 0.3)) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#666';
      for (var xi = 0; xi < w; xi++) {
        ctx.fillText(xi + 1, xi * cellSize + cellSize / 2 + padL, padT / 2);
        ctx.fillText(xi + 1, xi * cellSize + cellSize / 2 + padL, h * cellSize + padT + padB / 2);
      }
      ctx.textAlign = 'center';
      for (var yi = 0; yi < h; yi++) {
        ctx.fillText(yi + 1, padL / 2, yi * cellSize + cellSize / 2 + padT);
        ctx.fillText(yi + 1, w * cellSize + padL + padR / 2, yi * cellSize + cellSize / 2 + padT);
      }
    }

    // Grid border
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(padL, padT, w * cellSize, h * cellSize);

    // Beads
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var c = grid[y][x];
        var cx = x * cellSize + cellSize / 2 + padL;
        var cy = y * cellSize + cellSize / 2 + padT;

        ctx.beginPath();
        ctx.arc(cx + 1, cy + 1, beadR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, beadR, 0, Math.PI * 2);
        ctx.fillStyle = c.hex;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx - beadR * 0.25, cy - beadR * 0.25, beadR * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fill();

        // MARD code on bead
        if (showVal && cellSize >= 14) {
          var txtColor = isLight(c.r, c.g, c.b) ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.85)';
          ctx.font = 'bold ' + Math.max(6, Math.floor(cellSize * 0.3)) + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = txtColor;
          ctx.fillText(c.code, cx, cy + 1);
        }
      }
    }
  }

  function renderStats(grid, w, h) {
    var count = {};
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var c = grid[y][x].code;
        count[c] = (count[c] || 0) + 1;
      }
    }
    var total = w * h;
    var unique = Object.keys(count).length;
    statsBar.innerHTML = '<span class="stats-item">📐 ' + w + ' × ' + h + ' = ' + total + ' 颗</span><span class="stats-sep"></span><span class="stats-item">🎨 ' + unique + ' 种颜色</span>';
  }

  function renderMaterial(grid) {
    var count = {};
    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[0].length; x++) {
        var c = grid[y][x].code;
        count[c] = (count[c] || 0) + 1;
      }
    }
    var total = grid.length * grid[0].length;
    var sorted = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; });
    var paletteMap = {};
    state.paletteLab.forEach(function (c) { paletteMap[c.code] = c; });

    var html = '';
    sorted.forEach(function (code) {
      var c = paletteMap[code];
      if (!c) return;
      var pct = (count[code] / total * 100).toFixed(1);
      html += '<tr><td class="cell-code">' + code + '</td><td><span class="color-swatch" style="background:' + c.hex + '"></span></td><td class="cell-hex">' + c.hex + '</td><td class="cell-num">' + count[code] + '</td><td class="cell-pct">' + pct + '%</td></tr>';
    });
    materialBody.innerHTML = html;
  }

  // ---- Export ----
  function getExportBeadCanvas(cellSize, showVal, showCoord) {
    if (!state.grid || state.grid.length === 0) return null;
    var h = state.grid.length, w = state.grid[0].length;
    var labelS = showCoord ? 22 : 0;
    var padL = labelS, padR = labelS;
    var padT = (showVal || showCoord) ? 22 : 0;
    var padB = showCoord ? 22 : 0;
    var canvas = document.createElement('canvas');
    canvas.width = w * cellSize + padL + padR;
    canvas.height = h * cellSize + padT + padB;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#e8e4dc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Coordinate labels on 4 edges
    if (showCoord) {
      ctx.font = Math.max(8, Math.floor(cellSize * 0.3)) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#666';
      for (var xi = 0; xi < w; xi++) {
        ctx.fillText(xi + 1, xi * cellSize + cellSize / 2 + padL, padT / 2);
        ctx.fillText(xi + 1, xi * cellSize + cellSize / 2 + padL, h * cellSize + padT + padB / 2);
      }
      ctx.textAlign = 'center';
      for (var yi = 0; yi < h; yi++) {
        ctx.fillText(yi + 1, padL / 2, yi * cellSize + cellSize / 2 + padT);
        ctx.fillText(yi + 1, w * cellSize + padL + padR / 2, yi * cellSize + cellSize / 2 + padT);
      }
    }

    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(padL, padT, w * cellSize, h * cellSize);

    var gap = Math.max(1, Math.floor(cellSize * 0.12));
    var beadR = (cellSize - gap) / 2;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var c = state.grid[y][x];
        var cx = x * cellSize + cellSize / 2 + padL;
        var cy = y * cellSize + cellSize / 2 + padT;

        ctx.beginPath();
        ctx.arc(cx + 1, cy + 1, beadR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, beadR, 0, Math.PI * 2);
        ctx.fillStyle = c.hex;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx - beadR * 0.25, cy - beadR * 0.25, beadR * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fill();

        // MARD code on bead (export always shows if requested)
        if (showVal && cellSize >= 14) {
          var txtColor = isLight(c.r, c.g, c.b) ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.85)';
          ctx.font = 'bold ' + Math.max(7, Math.floor(cellSize * 0.3)) + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = txtColor;
          ctx.fillText(c.code, cx, cy + 1);
        }
      }
    }
    return canvas;
  }

  function getExportComposite(scale) {
    if (!state.grid || state.grid.length === 0) return null;
    var h = state.grid.length, w = state.grid[0].length;
    var cellSize = 20 * (scale || 2);
    var hPad = 40, vPad = 30;
    var headH = 60;
    var gapY = 24;

    // Count colors for material list
    var count = {};
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var code = state.grid[y][x].code;
        count[code] = (count[code] || 0) + 1;
      }
    }
    var paletteMap = {};
    state.paletteLab.forEach(function (c) { paletteMap[c.code] = c; });
    var sorted = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; });

    // Bead canvas (export always shows both labels)
    var beadCanvas = getExportBeadCanvas(cellSize, true, true);
    var beadW = beadCanvas.width, beadH = beadCanvas.height;

    // Material list — width matches bead grid width
    var tableW = beadW;
    var colPct = [20, 16, 24, 16, 16]; // percentage weights
    var colW = colPct.map(function (p) { return Math.round(tableW * p / 100); });
    // Adjust last column for rounding
    var sumCols = colW.reduce(function (a, b) { return a + b; }, 0);
    colW[colW.length - 1] += tableW - sumCols;

    var rowH = Math.round(cellSize * 0.7);
    if (rowH < 18) rowH = 18;
    var tableH = rowH * (sorted.length + 1) + 4;

    var totalW = beadW + hPad * 2;
    var totalH = vPad + headH + gapY + beadH + gapY + tableH + vPad;

    var canvas = document.createElement('canvas');
    canvas.width = totalW;
    canvas.height = totalH;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalW, totalH);

    // Header
    ctx.fillStyle = '#222';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(hPad, vPad, '拼豆图纸 — ' + state.paletteKey.toUpperCase());
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText(hPad, vPad + 28, w + ' × ' + h + ' = ' + (w * h) + ' 颗  ·  ' + sorted.length + ' 种颜色');

    // Bead grid — centered
    var gridX = Math.round((totalW - beadW) / 2);
    ctx.drawImage(beadCanvas, gridX, vPad + headH);

    // Material list — same width as bead grid, aligned to left of grid
    var tableX = gridX;
    var tableY = vPad + headH + beadH + gapY;

    // Header row
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(tableX, tableY, tableW, rowH);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    var headers = ['色号', 'HEX', 'R,G,B', '数量', '占比'];
    var cx2 = tableX;
    for (var i = 0; i < headers.length; i++) {
      ctx.strokeRect(cx2, tableY, colW[i], rowH);
      ctx.fillStyle = '#333';
      ctx.font = 'bold ' + Math.max(11, rowH * 0.45) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(headers[i], cx2 + colW[i] / 2, tableY + rowH / 2);
      cx2 += colW[i];
    }

    // Data rows
    var total = w * h;
    sorted.forEach(function (code, idx) {
      var c = paletteMap[code];
      if (!c) return;
      var ry = tableY + rowH * (idx + 1);
      if (idx % 2 === 1) {
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(tableX, ry, tableW, rowH);
      }
      ctx.strokeStyle = '#eee';
      ctx.lineWidth = 1;
      var vals = [code, c.hex, c.r + ',' + c.g + ',' + c.b, '' + count[code], (count[code] / total * 100).toFixed(1) + '%'];
      var cx3 = tableX;
      for (var i2 = 0; i2 < vals.length; i2++) {
        ctx.strokeRect(cx3, ry, colW[i2], rowH);
        if (i2 === 0) {
          ctx.fillStyle = c.hex;
          ctx.fillRect(cx3 + 4, ry + 3, colW[i2] - 8, rowH - 6);
          ctx.fillStyle = isLight(c.r, c.g, c.b) ? '#333' : '#fff';
          ctx.font = 'bold ' + Math.max(10, rowH * 0.4) + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(code, cx3 + colW[i2] / 2, ry + rowH / 2);
        } else {
          ctx.fillStyle = '#444';
          ctx.font = Math.max(10, rowH * 0.4) + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(vals[i2], cx3 + colW[i2] / 2, ry + rowH / 2);
        }
        cx3 += colW[i2];
      }
    });

    return canvas;
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function ts() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + '_' + pad2(d.getHours()) + pad2(d.getMinutes()) + pad2(d.getSeconds());
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  $('exportPngBtn').addEventListener('click', function () {
    var canvas = getExportComposite(3);
    if (!canvas) return;
    var stamp = ts();
    canvas.toBlob(function (blob) { downloadBlob(blob, 'bead-pattern-' + stamp + '.png'); });
  });

  $('exportCsvBtn').addEventListener('click', function () {
    if (!state.grid) return;
    var count = {};
    for (var y = 0; y < state.grid.length; y++) {
      for (var x = 0; x < state.grid[0].length; x++) {
        var c = state.grid[y][x].code;
        count[c] = (count[c] || 0) + 1;
      }
    }
    var paletteMap = {};
    state.paletteLab.forEach(function (c) { paletteMap[c.code] = c; });
    var sorted = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; });
    var lines = ['\uFEFF色号,HEX,R,G,B,数量'];
    sorted.forEach(function (code) {
      var c = paletteMap[code];
      if (c) lines.push(code + ',' + c.hex + ',' + c.r + ',' + c.g + ',' + c.b + ',' + count[code]);
    });
    var blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, 'bead-material-list-' + ts() + '.csv');
  });

  $('exportPrintBtn').addEventListener('click', function () {
    if (!state.grid) return;
    var canvas = getExportComposite(3);
    var dataUrl = canvas.toDataURL('image/png');
    var w = state.grid[0].length, h = state.grid.length;
    var win = window.open('', '_blank');
    win.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>拼豆图纸 - ' + state.paletteKey + '</title><style>body{font-family:sans-serif;padding:20px;max-width:1100px;margin:0 auto;color:#333}h1{font-size:20px;margin-bottom:8px}.meta{color:#666;font-size:13px;margin-bottom:16px}img{max-width:100%;height:auto;display:block;margin-bottom:24px}@media print{body{padding:12px}img{page-break-after:auto}h1,.meta{margin-bottom:8px}}</style></head><body><h1>拼豆图纸</h1><div class="meta">色卡: ' + state.paletteKey + ' | 规格: ' + w + ' × ' + h + ' = ' + (w * h) + ' 颗</div><img src="' + dataUrl + '"><script>window.onload=function(){setTimeout(function(){window.print()},500)}<\/script></body></html>');
    win.document.close();
  });

  enableGenerate();
}
