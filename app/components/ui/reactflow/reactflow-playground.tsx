import { ReactFlow, Controls, Background, applyEdgeChanges, applyNodeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { ReactflowSidebar } from './reactflow-sidebar';
import { ActionNode } from './nodes/ActionNode';
import { TriggerNode } from './nodes/TriggerNode';
import { useShallow } from 'zustand/react/shallow';
import useStore from '@/app/store/store';

const selector = (state: any) => ({
	nodes: state.nodes,
	edges: state.edges,
	onNodesChange: state.onNodesChange,
	onEdgesChange: state.onEdgesChange,
	onConnect: state.onConnect,
});

function ReactflowPlayground() {
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
		useShallow(selector),
	);
	const [newId, setNewId] = useState<number>(0);

	useEffect(() => {
		let largest = 0;
		for (const node of nodes) {
			if (Number(node.id) > largest) {
				largest = Number(node.id);
			}
		}
		setNewId(largest + 1);
	}, [nodes]);


	const nodeTypes = useMemo(() => ({ actionNode: ActionNode, triggerNode: TriggerNode }), []);

	return (
		<div className='flex border-2 bg-stone-50 w-screen z-0 fixed top-16 left-0 '>
			<ReactFlow className='min-h-[800px] h-full w-full basis-3/4'
				nodes={nodes} edges={edges} onConnect={onConnect}
				onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
				nodeTypes={nodeTypes}
				zoomOnScroll={false}>
				<Background />
				<Controls />
			</ReactFlow>
			<ReactflowSidebar nodes={nodes} edges={edges} newId={newId}></ReactflowSidebar>
		</div >
	);
}

export default ReactflowPlayground;
