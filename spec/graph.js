/* global graph, describe, it, expect, should */

describe('graph()', function () {
  'use strict';
  var graph;

  beforeEach(function () {
    graph = new Graph();
    graph.addNode(1);
    graph.addNode(2);
    graph.addNode(3);
  });

  it('exists', function () {
    expect(Graph).to.be.a('function');

  });

  it('stores nodes', function () {
    expect(graph.nodeCount).to.equal(3);
    expect(graph.contains(2)).to.equal(true);
  });

  it('links two nodes', function () {
    expect(graph.getEdge(1, 2)).to.equal(true);
  });
  
  // Add more assertions here
});
