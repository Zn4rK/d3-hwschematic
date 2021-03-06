
function hyperEdgeListToEdges(eList, newEdges, idOffset) {
	for (var ei = 0; ei < eList.length; ei++) {
		var e = eList[ei];
		var isHyperEdge = typeof e.sources !== "undefined";
		if (isHyperEdge) {
			for (var s = 0; s < e.sources.length; s++) {
				var src = e.sources[s];
				for (var t = 0; t < e.targets.length; t++) {
					var dst = e.targets[t];
					idOffset += 1;
					newEdges.push({
						"hwMeta": { "parent": e },
						"id": "" + idOffset,
						"source": src[0],
						"sourcePort": src[1],
						"target": dst[0],
						"targetPort": dst[1],
					});
				}
			}
		} else {
			newEdges.push(e);
		}
	}
	return idOffset;
}

/**
 * Convert hyperedges to edges in whole graph
 * 
 * @param n root node
 * @param idOffset int, max id in graph, used for generating
 *                 of new edges from hyperedges 
 **/
export function hyperEdgesToEdges(n, idOffset) {
	if (n.edges) {
		var newEdges = [];
		idOffset = hyperEdgeListToEdges(n.edges, newEdges, idOffset);
		n.edges = newEdges;
	}
	if (n._edges) {
		var newEdges = [];
		idOffset = hyperEdgeListToEdges(n._edges, newEdges, idOffset);
		n._edges = newEdges;
	}
	if (n.children) {
		for (var i = 0; i < n.children.length; i++) {
			idOffset = hyperEdgesToEdges(n.children[i], idOffset);
		}
	}
	if (n._children) {
		for (var i = 0; i < n._children.length; i++) {
			idOffset = hyperEdgesToEdges(n._children[i], idOffset);
		}
	}
	return idOffset
}

/**
 * Get parent of net for net
 **/
export function getNet(e) {
	if (typeof e.hwMeta.parent !== "undefined") {
		return e.hwMeta.parent;
	} else {
		return e;
	}
}

export function initNodeParents(node, parent) {
	node.hwMeta.parent = parent;
	(node.children || []).forEach(function(n) {
		initNodeParents(n, node);
	});
	(node._children || []).forEach(function(n) {
		initNodeParents(n, node);
	});
}
