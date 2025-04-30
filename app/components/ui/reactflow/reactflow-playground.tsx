import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useEffect, useMemo } from 'react';
import { ReactflowSidebar } from './reactflow-sidebar';
import { ActionNode } from './nodes/ActionNode';
import { TriggerNode } from './nodes/TriggerNode';
import { useShallow } from 'zustand/react/shallow';
import useStore from '@/app/store/store';
import { toast } from 'react-toastify';

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
	const [playgroundState, setPlaygroundState] = useState<{ newId: number, sidebarOutput: any, triggerWorkflow: () => Promise<void> }>({ newId: 0, sidebarOutput: {}, triggerWorkflow: async () => { return } });
	const setNodes = useStore((state) => state.setNodes);

	const runWorkflow = async () => {
		toast.success("running workflow");
		const currentState = useStore.getState();
		const curNodes = currentState.nodes;
		const curEdges = currentState.edges;

		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", "Bearer " + sessionStorage.getItem("jwt"));

		const response = await fetch(window.location.href + "/api/workflow", {
			method: "POST",
			headers: headers,
			body: JSON.stringify({ nodes: curNodes, edges: curEdges })
		});
		const body = await response.json();
		console.log(body);
		setPlaygroundState((prev) => ({ ...prev, sidebarOutput: JSON.stringify(body.body).replaceAll(",", ",\n") }));
	}

	useEffect(() => {
		let largest = 0;
		for (const node of nodes) {
			if (Number(node.id) > largest) {
				largest = Number(node.id);
			}
		}
		if (nodes.length === 0) {
			setNodes([...nodes, {
				id: String(playgroundState.newId),
				data: { id: String(playgroundState.newId), label: "Trigger", triggerWorkflow: runWorkflow },
				position: { x: (playgroundState.newId * 100) + 100, y: (playgroundState.newId * 100) + 100 },
				type: 'triggerNode'
			}]);

		}
		setPlaygroundState((prev) => ({ ...prev, newId: largest + 1, triggerWorkflow: runWorkflow }));
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
			<ReactflowSidebar nodes={nodes} edges={edges} newId={playgroundState.newId}
				workflowOutput={playgroundState.sidebarOutput} triggerWorkflow={playgroundState.triggerWorkflow}></ReactflowSidebar>
		</div >
	);
}

export default ReactflowPlayground;
