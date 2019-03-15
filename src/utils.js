export const parseQueryParams = selection => {
  return selection
    .map((v, i) => {
      return i === 0 ? `?selected=${v.value}` : `,${v.value}`;
    })
    .join('');
};
