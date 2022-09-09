export const indexToCoord = (index, { cols, rows }) => {

	const x = index % cols;

	const y = (index - x) / rows;

	return [x, y];
}

export const coordToIndex = ([x, y], { cols }) => {

	return cols * y + x;
}