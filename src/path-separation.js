function splitPaths (path1, path2, joinBase) {
	var path1Breaks = getBreakPoints(path1),
		path2Breaks = getBreakPoints(path2),
		break1Len = path1Breaks.length,
		break2Len = path2Breaks.length,
		breakDiff = Math.abs(break1Len - break2Len),
		len,
		point,
		breakCount,
		bIndex;

	if (break1Len === break2Len) {
		return [path1, path2];
	}
	else if (break1Len > break2Len) {
		// breakCount = break2Len / breakDiff;
		separatePath(path2, path1, breakDiff, joinBase);
	}
	else {
		// breakCount = break1Len / breakDiff;
		separatePath(path1, path2, breakDiff, joinBase);
	}
}

function separatePath (path1, path2, breakCount) {
	var breakIndex,
		bIndex,
		point,
		index,
		nextIndex,
		extraIndex = 0,
		len;

	for (let i = 0; i < path1.length; i++) {
		point1 = path1[i];
		point2 = path2[i];

		if (point1[0] !== 'M' && point2[0] === 'M') {
			path1.splice(i, 0, ['M', lastPoint[1], lastPoint[2]]);
			i++;
			if (breakCount--) {
				break;
			}
		}
		lastPoint = point1;
	}
	// for (let i = 0; i < pathBreaks.length - 1; i++) {
	// 	index = pathBreaks[i] + extraIndex;
	// 	nextIndex = pathBreaks[i + 1] + extraIndex;
	// 	len = i ? Math.floor(breakLen) : Math.ceil(breakLen);
	// 	breakIndex = (nextIndex - index) / (len + 1);
	// 	bIndex = index;
	// 	for (let ii = 0; ii < len; ii++) {
	// 		bIndex = ii ? Math.floor(breakIndex) + bIndex + 1: Math.floor(breakIndex) + bIndex + 1;
	// 		point = path[joinBase ? bIndex - 1 : bIndex];
	// 		joinBase ? path.splice(bIndex, 0, ['L', point[1], 400], ['M', point[1], 400],
	// 			['L', point[1], point[2]]) :
	// 			path.splice(bIndex + 1, 0, ['M', point[1], point[2]]);
	// 		extraIndex++;
	// 	}
	// 	breakLen--;
	// }
}


function separatePath (path1, path2, breakCount) {
	var breakIndex,
		bIndex,
		point,
		index,
		nextIndex,
		extraIndex = 0,
		len;

	for (let i = 0; i < path1.length; i++) {
		point1 = path1[i];
		point2 = path2[i];

		if (point1[0] !== 'M' && point2[0] === 'M') {
			path1.splice(i, 0, ['M', lastPoint[1], lastPoint[2]]);
			i++;
			if (!(--breakCount)) {
				break;
			}
		}
		lastPoint = point1;
	}
	// for (let i = 0; i < pathBreaks.length - 1; i++) {
	// 	index = pathBreaks[i] + extraIndex;
	// 	nextIndex = pathBreaks[i + 1] + extraIndex;
	// 	len = i ? Math.floor(breakLen) : Math.ceil(breakLen);
	// 	breakIndex = (nextIndex - index) / (len + 1);
	// 	bIndex = index;
	// 	for (let ii = 0; ii < len; ii++) {
	// 		bIndex = ii ? Math.floor(breakIndex) + bIndex + 1: Math.floor(breakIndex) + bIndex + 1;
	// 		point = path[joinBase ? bIndex - 1 : bIndex];
	// 		joinBase ? path.splice(bIndex, 0, ['L', point[1], 400], ['M', point[1], 400],
	// 			['L', point[1], point[2]]) :
	// 			path.splice(bIndex + 1, 0, ['M', point[1], point[2]]);
	// 		extraIndex++;
	// 	}
	// 	breakLen--;
	// }
}

function getBreakPoints (path) {
	let indices = [], point;

	for (let i = 0, len = path.length; i < len; i++) {
		point = path[i];
		if (point[0] === 'M' && i) {
			indices.push(i);
		}
	}

	return indices;
}

export default splitPaths;
