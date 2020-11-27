const indextocoord = (index, { cols, rows }) => {
  const x = index % cols;
  const y = (index - x) / rows;
  return [x, y];
}

const coordtoindex = ([x, y], { cols }) => {
  return cols * y + x;
}

export {
  indextocoord,
  coordtoindex
}
