var Unit = function(){};

Unit.prototype.on = function(e, callback) {
    object.events[e] = object.events[e] || [];
    object.events[e].push(cb);
};

Unit.prototype.trigger = function(e) {
  var i;
  var thisEvent = this.events[e];
  var l_ = thisEvent.length;
  for(i = 0; i < l_; i++) {
    thisEvent[i](this);
  }
};

var Graph = function(){
  this.nodes = {};
  this.events = {};
  this.nodeCount = 0;
  this.edgeCount = 0;
  this.inactive = 0;
};

Graph.prototype = new Object(Unit.prototype);

Graph.prototype.addNode = function(newNode, toNode){
  this.nodes[newNode] = new Node(newNode, this);
  this.nodeCount++;
  if(Object.keys(this.nodes).length === 2){
    var firstNode = Object.keys(this.nodes)[0];
    this.addEdge(firstNode, newNode);
  }
  if(toNode !== undefined){
    this.nodeCount++;
    this.nodes[toNode] = new Node(toNode, this);
    this.edgeCount++;
    this.addEdge(newNode, toNode);
  }
};

Graph.prototype.contains = function(node){
  return (this.nodes[node] !== undefined);
};

Graph.prototype.removeNode = function(node){
  for(var other in this.nodes[node].connectedTo){
    this.removeEdge(node, other);
  }
  delete this.nodes[node];
  this.nodeCount--;
};

Graph.prototype.getEdge = function(fromNode, toNode){
  return this.nodes[fromNode].connectedTo[toNode] !== undefined;
};

Graph.prototype.addEdge = function(fromNode, toNode){
  this.nodes[fromNode].connectedTo[toNode] = this.nodes[toNode];
  this.nodes[toNode].connectedTo[fromNode] = this.nodes[fromNode];
  this.edgeCount++;
};

Graph.prototype.removeEdge = function(fromNode, toNode){
  if (this.getEdge(fromNode, toNode)) {
    delete this.nodes[fromNode].connectedTo[toNode];
    delete this.nodes[toNode].connectedTo[fromNode];
    this.edgeCount--;
  }
  if(Object.keys(this.nodes[fromNode].connectedTo).length < 1) {
    this.removeNode(fromNode);
    this.nodeCount--;
  }
  if(Object.keys(this.nodes[toNode].connectedTo).length < 1) {
    this.removeNode(toNode);
    this.nodeCount--;
  }
};

Graph.prototype.tally = function(node){
  this.inactive++;
}

Graph.prototype.unTally = function(){
  this.inactive--;
}

Graph.prototype.messagePass = function(msg){
  while(this.inactive < this.nodeCount){
    for(var node in this.nodes) {
      node = this.nodes[node];
      if(node.active) {
        msg.value = msg.run(node, msg.value);
      }
    }
  }
  return msg.value;
};

var Node = function(value, graph) {
  this.connectedTo = {};
  this.value = value;
  this.inbox = [];
  this.active = true;
  this.events = {
    'activate': [function(){graph.unTally()}],
    'deactivate': [function(node){ graph.tally(node) }]
  }
};

Node.prototype = new Object(Unit.prototype);

Node.prototype.receive = function(msg) {
  return msg(this);
};

var message = function(value){
  return {
    run: function(node, value){
        if(node.value < value){
          node.value = value;
          if(!node.active){
            node.active = true;
            node.trigger('activate');
          }
        } else {
          node.active = false;
          node.trigger('deactivate', node);
          value = node.value;
        }
        return value;
      },
    value: value
  };
};

var mostEdges = function(min){
  return {
    run: function(node, value){
      var edges = Object.keys(node.connectedTo).length;
      if(edges <= value.max){
        node.active = false;
        node.trigger('deactivate', node);
      } else {
        value.node = node;
        value.max = edges;
        node.active = false;
        node.trigger('deactivate', node);
      }
      return value;
    },
    value: {max: min, node: null}
  };
};