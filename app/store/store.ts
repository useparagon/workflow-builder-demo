import { create } from 'zustand';
import {
	type Edge,
	type Node,
	type OnNodesChange,
	type OnEdgesChange,
	type OnConnect,
} from '@xyflow/react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<AppState>((set, get) => ({
	nodes: [],
	edges: [],
	selectedNode: [],
	onNodesChange: (changes) => {
		set({
			nodes: applyNodeChanges(changes, get().nodes),
		});
	},
	onEdgesChange: (changes) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		});
	},
	onConnect: (connection) => {
		set({
			edges: addEdge(connection, get().edges),
		});
	},
	setNodes: (nodes) => {
		set({ nodes });
	},
	setEdges: (edges) => {
		set({ edges });
	},
	setSelectedNode: (nodeId) => {
		set({
			selectedNode: get().nodes.map((node) => {
				if (node.id === nodeId) {
					return node;
				}
			}),
		})
	},
	clearSelectedNode: (nodes) => {
		set({ selectedNode: nodes })
	},
}));

export default useStore;



export type AppNode = Node;

export type AppState = {
	nodes: AppNode[];
	edges: Edge[];
	selectedNode: AppNode[];
	onNodesChange: OnNodesChange<AppNode>;
	onEdgesChange: OnEdgesChange;
	onConnect: OnConnect;
	setNodes: (nodes: AppNode[]) => void;
	setEdges: (edges: Edge[]) => void;
	setSelectedNode: (nodeId: string) => void;
	clearSelectedNode: (nodes: AppNode[]) => void;
};
