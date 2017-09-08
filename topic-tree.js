// node index for search
//ver https://bl.ocks.org/mbostock/4339184
var nodeIndex = {};
// root node
var hobjArr = [{ name: 'root', parent: '', value: null }];
// tree data
var root = d3.stratify()
	.id(function (d) { return d.name; })
	.parentId(function (d) { return d.parent; })
	(hobjArr);

var margin = { top: 20, right: 90, bottom: 30, left: 90 },
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").
	append("svg").
	attr("width", width + margin.right + margin.left).
	attr("height", height + margin.top + margin.bottom).
	append("g").
	attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0, duration = 750, root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
//root = d3.hierarchy(data, function (d) {
//	return d.children;
//});
root.x0 = height / 2;
root.y0 = 0;

update(root);


function update(source) {
	var link = g.selectAll(".link")
		.data(tree(source).links())
		.enter().append("path")
		.attr("class", "link")
		.attr("d", d3.linkHorizontal()
			.x(function (d) { return d.y; })
			.y(function (d) { return d.x; }));

	var node = g.selectAll(".node")
		.attr("hot-id", function (d) {
			nodeIndex[d.id] = d;
			return d.id;
		})
		.data(source.descendants())
		.enter().append("g")
		.attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
		.attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })

	node.append("circle")
		.attr("r", 2.5);

	node.append("text")
		.attr("dy", 3)
		.attr("x", function (d) {
			nodeIndex[d.id] = d;
			return d.children ? -8 : 8;
		})
		.style("text-anchor", function (d) { return d.children ? "end" : "start"; })
		.text(function (d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
}



function updateTopic(topic, payload) {
	if (!nodeIndex[topic]) {
		var splitPath = topic.split('/');
		var prevPath = 'root';

		splitPath.forEach((element) => {
			var elementPath = prevPath + '/' + element;
			addNode(nodeIndex[prevPath], element, 1);
		});
	}


}

function addNode(parent, id, value) {

	var frut = {
		id: id,
		name: id,
		parent: parent,
		data: {
			name: id,
			path: id,
			value: value
		}
	};
	if (parent.children) parent.children.push(frut); else parent.children = [frut];

	update(frut);
};

setTimeout(autoRefresh, 3000);


function autoRefresh() {
	//update(root);
	setTimeout(autoRefresh, 3000);
}