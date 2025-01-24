import { NextRequest, NextResponse } from "next/server";
import { performWorkflowAction } from "../workflow/route";

export async function POST(request: NextRequest) {
	try {
		const contents = await request.json();
		const headers = request.headers;
		if (headers.get("authorization")) {
			const token = headers.get("authorization")?.split(" ")[1];
			const nodes = contents.nodes;
			const edges = contents.edges;
			const selectedNodeId = contents.selectedNodeId;
			if (token) {
				const edgeMap = new Map();
				const nodeMap = new Map();
				const resMap = new Map();
				const queue = [];

				for (const edge of edges) {
					if (edgeMap.has(edge.source)) {
						edgeMap.set(edge.source, [...edgeMap.get(edge.source), edge.target]);
					} else {
						edgeMap.set(edge.source, [edge.target]);
					}
				}
				for (const node of nodes) {
					nodeMap.set(node.id, node.data.funcProperties);
				}

				queue.push('1');
				while (queue.length > 0) {
					const nodeId = queue.shift();
					const selectedNode = nodeMap.get(nodeId);
					let res = await performWorkflowAction(resMap, token, selectedNode)
					resMap.set(nodeId, res);
					if (edgeMap.has(nodeId)) {
						for (const id of edgeMap.get(nodeId)) {
							queue.push(id);
						}
					}
				}
				console.log(resMap);

				return NextResponse.json(
					{ status: 200, body: resMap.get(selectedNodeId) },
				);

			}
		}
	} catch (error) {
		console.error("[TEST STEP]", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}

export async function performAction(jwt: string, contents: { action: string, parameters: any, output?: any }) {
	const toDel = [];
	for (const param of Object.keys(contents.parameters)) {
		if (contents.parameters[param] === '') {
			toDel.push(param);
		}
	}
	for (const param of toDel) {
		delete contents.parameters[param];
	}


	const actionsUrl = "https://actionkit.useparagon.com/projects/" + process.env.NEXT_PUBLIC_PARAGON_PROJECT_ID
	const actionHeaders = new Headers();
	actionHeaders.append("Content-Type", "application/json");
	actionHeaders.append("Authorization", "Bearer " + jwt);
	const actionResponse = await fetch(actionsUrl + "/actions", {
		method: "POST",
		headers: actionHeaders,
		body: JSON.stringify({ action: contents.action, parameters: contents.parameters }),
	});
	const actionBody = await actionResponse.json();
	return actionBody;
}
