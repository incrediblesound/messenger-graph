Messenger Graph
===============

This project is an attempt to develop an expressive system for querying graphs. It was inspired by the Pregel paper released by Google, and reflects my attempt to grapple with the concepts contained in that paper.


Graph Constructor
-----

The graph.js file contains a constructor function for building graphs. A graph has the following properties:

nodes: Object { Node1, Node2, ...}    
events: Object    
nodeCount: Integer        
edgeCount: Integer    
inactive: Integer   

Graphs also have standard methods like: addNode, contains, removeNode, addEdge, getEdge, removeEdge

Vertex Constructor
------

Vertices are stored as instances of the "Node" constructor in the nodes property of the graph, their constructor has the following properties:

connectedTo: Object { Node2, Node3, ...}    
value: //any possible value   
active: Boolean   
events: Object { Array }    

MessagePass
------

The special thing about this graph is the messagePass function. This function takes a message object, with a 'run' method and a 'value' property, as its only argument. So long as there are active vertices in the graph, the messagePass will iterate over them and reset the value property of the message object to the result of invoking the run method with the current vertex and the value property. It is the job of the run method to decide when a given node is deactivated, at which point it sets the active property of that node to false and triggers the 'deactivate' event which increments the inactive property of the graph. Here is some psuedo-code:    

graph.messagePass(message) ->    
..while(graph.inactive < graph.nodes.length)    
....for each node in graph    
......if node.active    
........message.value = message.run(node, message.value)    

Why?
----

The active property allows the message function to control which vertices are processed, allowing the message object to propogate information or gather it for as long as there are active vertices. This way a function can be written to selectively process the values of the vertices while keeping a tally of the result, only stopping when some pre-defined condition is met. Because the message object has access to each vertex, the messagePass method can be used to selectively mutate vertices or re-activate the neighbors of the current vertex. There's probably a lot that could be done, but I reccommend starting with the basic message objects 'message' and 'mostEdges'. 
