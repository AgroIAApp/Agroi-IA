/* eslint-disable import/prefer-default-export */
export const NDVI_COLOR_RANGES = [
  {
    min: -Infinity, max: 0, color: '#a50026', interval: '≤ 0',
  },
  {
    min: 0, max: 0.1, color: '#d73027', interval: '0 - 0.1',
  },
  {
    min: 0.1, max: 0.2, color: '#f46d43', interval: '0.1 - 0.2',
  },
  {
    min: 0.2, max: 0.3, color: '#fdae61', interval: '0.2 - 0.3',
  },
  {
    min: 0.3, max: 0.4, color: '#fee08b', interval: '0.3 - 0.4',
  },
  {
    min: 0.4, max: 0.5, color: '#ffffbf', interval: '0.4 - 0.5',
  },
  {
    min: 0.5, max: 0.6, color: '#d9ef8b', interval: '0.5 - 0.6',
  },
  {
    min: 0.6, max: 0.7, color: '#a6d96a', interval: '0.6 - 0.7',
  },
  {
    min: 0.7, max: 0.8, color: '#66bd63', interval: '0.7 - 0.8',
  },
  {
    min: 0.8, max: 0.9, color: '#1a9850', interval: '0.8 - 0.9',
  },
  {
    min: 0.9, max: 1, color: '#006837', interval: '0.9 - 1',
  },
];

export const NDSI_COLOR_RANGES = [
  {
    min: -Infinity, max: 0, color: '#ffffb2', interval: '≤ 0',
  },
  {
    min: 0, max: 0.1, color: '#fed976', interval: '0 - 0.1',
  },
  {
    min: 0.1, max: 0.2, color: '#feb24c', interval: '0.1 - 0.2',
  },
  {
    min: 0.2, max: 0.3, color: '#fd8d3c', interval: '0.2 - 0.3',
  },
  {
    min: 0.3, max: 0.4, color: '#fc4e2a', interval: '0.3 - 0.4',
  },
  {
    min: 0.4, max: 0.5, color: '#e31a1c', interval: '0.4 - 0.5',
  },
  {
    min: 0.5, max: 0.6, color: '#b10026', interval: '0.5 - 0.6',
  },
];

export const NDMI_COLOR_RANGES = [
  {
    min: -Infinity, max: 0, color: '#67001f', interval: '≤ 0',
  },
  {
    min: 0, max: 0.1, color: '#b2182b', interval: '0 - 0.1',
  },
  {
    min: 0.1, max: 0.2, color: '#d6604d', interval: '0.1 - 0.2',
  },
  {
    min: 0.2, max: 0.3, color: '#f4a582', interval: '0.2 - 0.3',
  },
  {
    min: 0.3, max: 0.4, color: '#fddbc7', interval: '0.3 - 0.4',
  },
  {
    min: 0.4, max: 0.5, color: '#f7f7f7', interval: '0.4 - 0.5',
  },
  {
    min: 0.5, max: 0.6, color: '#d1e5f0', interval: '0.5 - 0.6',
  },
  {
    min: 0.6, max: 0.7, color: '#92c5de', interval: '0.6 - 0.7',
  },
  {
    min: 0.7, max: 0.8, color: '#4393c3', interval: '0.7 - 0.8',
  },
  {
    min: 0.8, max: 0.9, color: '#2166ac', interval: '0.8 - 0.9',
  },
  {
    min: 0.9, max: 1, color: '#053061', interval: '0.9 - 1',
  },
];

export const COLOR_RANGES = {
  ndvi: NDVI_COLOR_RANGES,
  ndsi: NDSI_COLOR_RANGES,
  ndmi: NDMI_COLOR_RANGES,
};
