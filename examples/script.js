import 'select' from 'd3-selection';

var svg = select('svg');

var paths = svg.selectAll('path').data([['M', 100, 200, 'L', 300, 400], ['M', 100, 200, 'L', 200, 400]]);

var pathEnter = paths.enter().append('path');

paths.merge(pathEnter).attr('d', function (d) {
    return d.join(' ');
});



