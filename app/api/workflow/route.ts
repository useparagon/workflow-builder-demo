import { NextRequest, NextResponse } from "next/server";
import { performAction } from "../test-step/route";

export async function POST(request: NextRequest) {
	try {
		const contents = await request.json();
		const headers = request.headers;
		if (headers.get("authorization")) {
			const token = headers.get("authorization")?.split(" ")[1];
			const nodes = contents.nodes;
			const edges = contents.edges;
			if (token && nodes.length > 0) {
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
					console.log(nodeId);
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
					{ status: 200, body: Object.fromEntries(resMap) },
				);
			}
		}
	} catch (error) {
		console.error("[WORKFLOW]", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}

export const performWorkflowAction = async (resMap: Map<string, any>, token: string, contents: { action: string, parameters: any, output?: any }) => {
	for (let param of Object.keys(contents.parameters)) {
		const matches = contents.parameters[param].match(/\{(.*?)\}/);
		if (matches) {
			const variableString = matches[1];
			const variableElements = variableString.split('.');
			if (resMap.has(variableElements[0])) {
				let replacement = resMap.get(variableElements[0]);
				variableElements.shift();
				while (variableElements.length > 0) {
					let index = variableElements.shift();
					if (index) {
						//@ts-ignore
						replacement = replacement[index];
					}
				}
				contents.parameters[param] = contents.parameters[param].replace("{" + variableString + "}", replacement);
			}
		}

	}
	const resBody = await performAction(token, contents);
	return resBody;
}
