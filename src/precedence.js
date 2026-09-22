function buildGraph(pairs) {
  const vertices = new Set();
  const graph = new Map();

  for (const [before, after] of pairs) {
    vertices.add(before);
    vertices.add(after);

    if (!graph.has(before)) {
      graph.set(before, new Set());
    }

    graph.get(before).add(after);

    if (!graph.has(after)) {
      graph.set(after, new Set());
    }
  }

  return { vertices: [...vertices], graph };
}

function findReachable(start, graph) {
  const reachable = new Set();
  const stack = [start];

  while (stack.length > 0) {
    const current = stack.pop();

    for (const next of graph.get(current) || []) {
      if (!reachable.has(next)) {
        reachable.add(next);
        stack.push(next);
      }
    }
  }

  return reachable;
}

function analyzePrecedence(pairs) {
  const { vertices, graph } = buildGraph(pairs);
  const reachability = new Map();

  for (const vertex of vertices) {
    reachability.set(vertex, findReachable(vertex, graph));
  }

  let contradictory = false;

  for (const vertex of vertices) {
    if (reachability.get(vertex).has(vertex)) {
      contradictory = true;
      break;
    }
  }

  if (!contradictory) {
    for (let i = 0; i < vertices.length; i += 1) {
      for (let j = i + 1; j < vertices.length; j += 1) {
        const first = vertices[i];
        const second = vertices[j];
        const ordered = reachability.get(first).has(second)
          || reachability.get(second).has(first);

        if (!ordered) {
          return {
            complete: false,
            contradictory: false,
            vertices,
          };
        }
      }
    }
  }

  return {
    complete: !contradictory,
    contradictory,
    vertices,
  };
}

module.exports = {
  analyzePrecedence,
};
