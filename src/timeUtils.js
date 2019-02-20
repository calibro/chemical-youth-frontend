export const timeLabels = {
  0: '3 months',
  3: '6 months',
  6: '1 year',
  12: '2 years',
  24: '3 years',
  36: 'more than 3 years'
};

export const quantizeTime = time => {
  if (time < 3) {
    return 0;
  } else if (time >= 3 && time < 6) {
    return 3;
  } else if (time >= 6 && time < 12) {
    return 6;
  } else if (time >= 12 && time < 24) {
    return 12;
  } else if (time >= 24 && time < 36) {
    return 24;
  } else if (time >= 36) {
    return 36;
  }
};
