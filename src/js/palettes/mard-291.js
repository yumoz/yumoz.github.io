// MARD 全色 291 (A~M + P/Q/R/T/Y/ZG)
import { mard221, mard221Series } from './mard-221.js';

// 扩展色：P 系列 (P1-P23)
const mardExtP = [
  { code: 'P1', hex: '#FCF7F8', r: 252, g: 247, b: 248 },
  { code: 'P2', hex: '#B0A9AC', r: 176, g: 169, b: 172 },
  { code: 'P3', hex: '#AFDCAB', r: 175, g: 220, b: 171 },
  { code: 'P4', hex: '#FEA49F', r: 254, g: 164, b: 159 },
  { code: 'P5', hex: '#EE8C3E', r: 238, g: 140, b: 62 },
  { code: 'P6', hex: '#5FD0A7', r: 95, g: 208, b: 167 },
  { code: 'P7', hex: '#EB9270', r: 235, g: 146, b: 112 },
  { code: 'P8', hex: '#F0D958', r: 240, g: 217, b: 88 },
  { code: 'P9', hex: '#D9D9D9', r: 217, g: 217, b: 217 },
  { code: 'P10', hex: '#D9C7EA', r: 217, g: 199, b: 234 },
  { code: 'P11', hex: '#F3ECC9', r: 243, g: 236, b: 201 },
  { code: 'P12', hex: '#E6EEF2', r: 230, g: 238, b: 242 },
  { code: 'P13', hex: '#AACBEF', r: 170, g: 203, b: 239 },
  { code: 'P14', hex: '#337680', r: 51, g: 118, b: 128 },
  { code: 'P15', hex: '#668575', r: 102, g: 133, b: 117 },
  { code: 'P16', hex: '#FEBF45', r: 254, g: 191, b: 69 },
  { code: 'P17', hex: '#FEA324', r: 254, g: 163, b: 36 },
  { code: 'P18', hex: '#FEB89F', r: 254, g: 184, b: 159 },
  { code: 'P19', hex: '#FFFEEC', r: 255, g: 254, b: 236 },
  { code: 'P20', hex: '#FEBECF', r: 254, g: 190, b: 207 },
  { code: 'P21', hex: '#ECBEBF', r: 236, g: 190, b: 191 },
  { code: 'P22', hex: '#E4A89F', r: 228, g: 168, b: 159 },
  { code: 'P23', hex: '#A56268', r: 165, g: 98, b: 104 },
];

// 扩展色：Q 系列 (Q1-Q5) 荧光系
const mardExtQ = [
  { code: 'Q1', hex: '#F2A5E8', r: 242, g: 165, b: 232 },
  { code: 'Q2', hex: '#E9EC91', r: 233, g: 236, b: 145 },
  { code: 'Q3', hex: '#FFFF00', r: 255, g: 255, b: 0 },
  { code: 'Q4', hex: '#FFEBFA', r: 255, g: 235, b: 250 },
  { code: 'Q5', hex: '#76CEDE', r: 118, g: 206, b: 222 },
];

// 扩展色：R 系列 (R1-R28) 亮色系
const mardExtR = [
  { code: 'R1', hex: '#D50D21', r: 213, g: 13, b: 33 },
  { code: 'R2', hex: '#F92F83', r: 249, g: 47, b: 131 },
  { code: 'R3', hex: '#FD8324', r: 253, g: 131, b: 36 },
  { code: 'R4', hex: '#F8EC31', r: 248, g: 236, b: 49 },
  { code: 'R5', hex: '#35C75B', r: 53, g: 199, b: 91 },
  { code: 'R6', hex: '#238891', r: 35, g: 136, b: 145 },
  { code: 'R7', hex: '#19779D', r: 25, g: 119, b: 157 },
  { code: 'R8', hex: '#1A60C3', r: 26, g: 96, b: 195 },
  { code: 'R9', hex: '#9A56B4', r: 154, g: 86, b: 180 },
  { code: 'R10', hex: '#FFDB4C', r: 255, g: 219, b: 76 },
  { code: 'R11', hex: '#FFEBFA', r: 255, g: 235, b: 250 },
  { code: 'R12', hex: '#D8D5CE', r: 216, g: 213, b: 206 },
  { code: 'R13', hex: '#55514C', r: 85, g: 81, b: 76 },
  { code: 'R14', hex: '#9FE4DF', r: 159, g: 228, b: 223 },
  { code: 'R15', hex: '#77CEE9', r: 119, g: 206, b: 233 },
  { code: 'R16', hex: '#3ECFCA', r: 62, g: 207, b: 202 },
  { code: 'R17', hex: '#4A867A', r: 74, g: 134, b: 122 },
  { code: 'R18', hex: '#7FCD9D', r: 127, g: 205, b: 157 },
  { code: 'R19', hex: '#CDE55D', r: 205, g: 229, b: 93 },
  { code: 'R20', hex: '#E8C7B4', r: 232, g: 199, b: 180 },
  { code: 'R21', hex: '#AD6F3C', r: 173, g: 111, b: 60 },
  { code: 'R22', hex: '#6C372F', r: 108, g: 55, b: 47 },
  { code: 'R23', hex: '#FEB872', r: 254, g: 184, b: 114 },
  { code: 'R24', hex: '#F3C1C0', r: 243, g: 193, b: 192 },
  { code: 'R25', hex: '#C9675E', r: 201, g: 103, b: 94 },
  { code: 'R26', hex: '#D293BE', r: 210, g: 147, b: 190 },
  { code: 'R27', hex: '#EA8CB1', r: 234, g: 140, b: 177 },
  { code: 'R28', hex: '#9C87D6', r: 156, g: 135, b: 214 },
];

// 扩展色：T 系列 (T1) 纯白系
const mardExtT = [
  { code: 'T1', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
];

// 扩展色：Y 系列 (Y1-Y5) 特效系
const mardExtY = [
  { code: 'Y1', hex: '#FD6FB4', r: 253, g: 111, b: 180 },
  { code: 'Y2', hex: '#FEB481', r: 254, g: 180, b: 129 },
  { code: 'Y3', hex: '#D7FAA0', r: 215, g: 250, b: 160 },
  { code: 'Y4', hex: '#8BDBFA', r: 139, g: 219, b: 250 },
  { code: 'Y5', hex: '#E987EA', r: 233, g: 135, b: 234 },
];

// 扩展色：ZG 系列 (ZG1-ZG8) 特别系
const mardExtZG = [
  { code: 'ZG1', hex: '#DAABB3', r: 218, g: 171, b: 179 },
  { code: 'ZG2', hex: '#D6AA87', r: 214, g: 170, b: 135 },
  { code: 'ZG3', hex: '#C1BD8D', r: 193, g: 189, b: 141 },
  { code: 'ZG4', hex: '#96869F', r: 150, g: 134, b: 159 },
  { code: 'ZG5', hex: '#8490A6', r: 132, g: 144, b: 166 },
  { code: 'ZG6', hex: '#94BFE2', r: 148, g: 191, b: 226 },
  { code: 'ZG7', hex: '#E2A9D2', r: 226, g: 169, b: 210 },
  { code: 'ZG8', hex: '#AB91C0', r: 171, g: 145, b: 192 },
];

export const mard291 = [
  ...mard221,
  ...mardExtP,
  ...mardExtQ,
  ...mardExtR,
  ...mardExtT,
  ...mardExtY,
  ...mardExtZG,
];

export const mard291Series = [
  ...mard221Series,
  { name: '扩展系', code: 'P', count: 23, colors: mardExtP },
  { name: '荧光系', code: 'Q', count: 5, colors: mardExtQ },
  { name: '亮色系', code: 'R', count: 28, colors: mardExtR },
  { name: '纯白系', code: 'T', count: 1, colors: mardExtT },
  { name: '特效系', code: 'Y', count: 5, colors: mardExtY },
  { name: '特别系', code: 'ZG', count: 8, colors: mardExtZG },
];
