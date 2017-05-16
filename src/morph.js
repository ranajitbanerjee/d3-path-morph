
import splitPaths from './path-separation';
import {interpolateArray} from 'd3-interpolate';

function getTotalLength (path) {
    var i, len, totalDistance = 0, distance, sortedDistances = [],
        point1,
        point2;
    for (i = 0, len = path.length; i < len - 1; i++) {
        point1 = path[i];
        point2 = path[i + 1];
        sortedDistances.push(totalDistance);
        distance = dist(point1[1], point1[2], point2[1], point2[2]);
        totalDistance += distance;
    }

    sortedDistances.push(totalDistance);
    return {
        totalDistance: totalDistance,
        sortedDistances: sortedDistances
    };
}

function getClosestIndexOf (arr, value, side) {
    var low = 0,
       arrLen = arr.length,
       high = arrLen - 1,
       highVal,
       mid,
       d1,
       d2;

    while (low < high) {
        mid = Math.floor((low + high) / 2);
        d1 = Math.abs(arr[mid] - value);
        d2 = Math.abs(arr[mid + 1] - value);

        if (d2 < d1) {
            low = mid + 1;
        }
        else {
            high = mid;
        }
    }

    if (!side) {
        return high;
    }

    highVal = arr[high];
    if (highVal === value) {
        return high;
    } else if (highVal > value) {
        if (high === 0) { return high; }
        return side === 'left'? high - 1 : high;
    } else {
        if (high === arr.length - 1) { return high; }
        return side === 'left'? high : high + 1;
    }
}

function getPointAtLength (path, length, sortedDistances) {
    var i, len, totalDistance = 0, distance, prevDist = 0, t, point1, point2, x, y;
    i = getClosestIndexOf(sortedDistances, length, 'left');

    point1 = path[i];
    point2 = path[i + 1] || path[i];
    distance = dist(point1[1], point1[2], point2[1], point2[2]);
    prevDist = sortedDistances[i];
    t = distance === 0 ? 0 : (length - prevDist) / distance;
    x = ((1 - t) * point1[1] + t * point2[1]);
    y = ((1 - t) * point1[2] + t * point2[2]);
    return {
        x: x,
        y: y
    };
    // for (i = 0, len = path.length; i < len - 1; i++) {
    //     point1 = path[i];
    //     point2 = path[i + 1];
    //     distance = dist(point1[1], point1[2], point2[1], point2[2]);
    //     totalDistance += distance;
    //     if (length >= prevDist && length <= totalDistance) {

    //     }

    //     prevDist = totalDistance;
    // }
}

function dist (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function r (max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function convertToSubArray(path) {
    var i, len, command, pathArr = [], arr;
    for (i = 0, len = path.length; i < len; i += 3) {
        command = path[i];
        arr = [];
        arr.push(command, path[i + 1], path[i + 2]);
        pathArr.push(arr);
    }
    return pathArr;
}

function concatArr (d) {
    var pathArr = [];

    for (let i = 0; i < d.length; i++) {
        pathArr = pathArr.concat(d[i]);
    }
    return pathArr;
}

function morphPath (path1, path2, callback) {
    var mPath, pathArr1 = [], pathArr2 = [],
        interpolator;

    path1 = path1[0] instanceof Array ? path1 : [path1];
    path2 = path2[0] instanceof Array ? path2 : [path2];

    for (let i = 0, len = path1.length; i < len; i++) {
        mPath = getMorphedPath(path1[i], path2[i]);
        pathArr1 = pathArr1.concat(mPath[0]);
        pathArr2 = pathArr2.concat(mPath[1]);
    }

    interpolator = interpolateArray(pathArr1, pathArr2);
    return function (t) {
        if (t >=0 && t<=1) {
            callback && callback(t);
            return interpolator(t).join(' ');
        }

    }
}


function getMorphedPath (path1, path2) {
    var path1Arr = convertToSubArray(path1),
    path2Arr = convertToSubArray(path2),
    paths,
    pathArr1 = [],
    pathArr2 = [],
    i,
    len,
    equalPaths;

    splitter(path1Arr, path2Arr);
    splitPaths(path1Arr, path2Arr);
    paths = segmentPath(path1Arr, path2Arr);

    for (i = 0, len = Math.max(paths[0].length, paths[1].length); i < len; i++) {
        path1 = paths[0][i];
        path2 = paths[1][i];
        equalPaths = equalizePath(path1, path2, 4);
        pathArr1 = pathArr1.concat(equalPaths[0]);
        pathArr2 = pathArr2.concat(equalPaths[1]);
    }
    return [pathArr1, pathArr2];
}

function splitter (p1, p2) {
    var i, len, point1, point2, lastPoint1, lastPoint2;

    for (i = 0, len = Math.max(p1.length, p2.length); i < len; i++) {
        point1 = p1[i];
        point2 = p2[i];
        appendPoint(p1, point1, lastPoint1);
        appendPoint(p2, point2, lastPoint2);
        lastPoint1 = p1[i];
        lastPoint2 = p2[i];
    }
}

function appendM(p1, p2, point, i) {
    if (p1[i][0] === 'M' && p2[i][0] !== 'M') {
        p2.splice(i, 0, ['M', point[1], point[2]]);
    }
}

function segmentPath(p1, p2) {
    var i, len,
        path1Arr = [],
        path2Arr = [],
        command,
        arr = [];

    for (i = 0, len = p1.length; i < len; i++) {
        command = p1[i][0];
        if (command === 'M') {
            arr = [];
            path1Arr.push(arr);
        }

        arr.push(p1[i]);
    }
    for (i = 0, len = p2.length; i < len; i++) {
        command = p2[i][0];
        if (command === 'M') {
            arr = [];
            path2Arr.push(arr);
        }
        arr.push(p2[i]);
    }
    return [path1Arr, path2Arr];
}

// Divides both the path into equal parts and returns both the path
function equalizePath (p1, p2, precision) {
    var path1Arr = [], path2Arr = [],
        t,
        point1,
        point2,
        len,
        totalLength,
        sortedDistances1,
        sortedDistances2,
        p1Len,
        p2Len,
        pointI,
        pointII,
        count1 = 1,
        count2 = 1,
        M = 'M',
        L = 'L';

    totalLength = getTotalLength(p1);
    sortedDistances1 = totalLength.sortedDistances;
    p1Len = totalLength.totalDistance;
    totalLength = getTotalLength(p2);
    p2Len = totalLength.totalDistance;
    sortedDistances2 = totalLength.sortedDistances;
    // p1Len = path1.node().getTotalLength(),
    // p2Len = path2.node().getTotalLength();
    // Uniform sampling of distance based on specified precision.
    var i = 0, dt = 4 / Math.max(p1Len, p2Len);
    // while ((i += dt) < 1) distances.push(i);
    // distances.push(1);

    var now = performance.now();
    for (i = 0; i <= 1; i += dt) {
        // pointI = path1.node().getPointAtLength(i * p1Len);
      //  pointII = path2.node().getPointAtLength(i * p2Len);
        // if (Math.abs(i * p1Len - sortedDistances1[count1]) <= dt * p1Len) {
        //     pointI = getPointAtLength(p1, sortedDistances1[count1], sortedDistances1);
        //     count1++;
        // }
        // else {
            pointI = getPointAtLength(p1, i * p1Len, sortedDistances1);
        // }

        // if (Math.abs(i * p2Len - sortedDistances2[count2]) <= dt * p2Len) {
        //     pointII = getPointAtLength(p1, sortedDistances2[count2], sortedDistances2);
        //     count2++;
        // }
        // else {
            pointII = getPointAtLength(p2, i * p2Len, sortedDistances2);
        // }
        // console.log(point1.x, point1.y, pointI.x, pointI.y);
        i ? path1Arr.push(L, pointI.x, pointI.y) : path1Arr.push(M, pointI.x, pointI.y);
        i ? path2Arr.push(L, pointII.x, pointII.y) : path2Arr.push(M, pointII.x, pointII.y);
    }
    if (i !== 1) {
        // pointI = getPointAtLength(p1, 1 * p1Len, sortedDistances1);
        // pointII = getPointAtLength(p2, 1 * p2Len, sortedDistances2);
        // console.log(point1.x, point1.y, pointI.x, pointI.y);
        i ? path1Arr.push(L, p1[p1.length - 1][1], p1[p1.length - 1][2]) : path1Arr.push(M, pointI.x, pointI.y);
        i ? path2Arr.push(L, p2[p2.length - 1][1], p2[p2.length - 1][2]) : path2Arr.push(M, pointII.x, pointII.y);
    }

    console.log('getPointAtLength ', performance.now() - now);
    return [path1Arr, path2Arr];
}

function appendPoint(arr, point1, lastPoint) {
    if (!point1) {
        arr.push(['L', lastPoint[1], lastPoint[2]]);
    }
}

export default morphPath;
