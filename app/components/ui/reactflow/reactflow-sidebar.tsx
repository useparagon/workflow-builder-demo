import { useEffect, useState } from "react";
import { paragon } from "@useparagon/connect";
import useParagon from "@/app/hooks/useParagon";
import { ActionButton } from "./nodes/ActionButton";
import useStore from "@/app/store/store";

export const ReactflowSidebar = ({ nodes, edges, newId }: { nodes: Array<any>, edges: any, newId: number }) => {
	const [sidebarState, setSidebarState] = useState<{ integrations: Array<any>, actions: any, activeDropdown: string, output: string, paramInputs: any }>({
		integrations: [], actions: {}, activeDropdown: "", output: "", paramInputs: {}
	});
	const { paragonUser } = useParagon();
	const setNodes = useStore((state) => state.setNodes);
	const setEdges = useStore((state) => state.setEdges);
	const clearSelectedNode = useStore((state) => state.setSelectedNode);
	const selectedNodeArray = useStore((state) => state.selectedNode);

	let selectedNode = undefined;
	for (const node of selectedNodeArray) {
		if (node !== undefined) {
			selectedNode = node;
		}
	}

	useEffect(() => {
		fetchActions().then((actions) => {
			fetchIntegrationMetadata().then((metadata: any) => {
				setSidebarState((prev) => ({ ...prev, integrations: metadata, actions: actions }));
			})
		});
	}, []);

	const toggleDropdown = (integrationName: string) => {
		setSidebarState((prev) => ({ ...prev, activeDropdown: prev.activeDropdown === integrationName ? "" : integrationName }));
	}

	const addNode = (actionName: string, action: any, pic: string) => {
		setNodes([...nodes, {
			id: String(newId),
			data: { id: String(newId), label: String(newId) + ") " + actionName, pic: pic, functionData: action },
			position: { x: (newId * 100) + 100, y: (newId * 100) + 100 },
			type: 'actionNode'
		}]);
	};


	const clearWorkflow = () => {
		setNodes([]);
		setEdges([]);
	}

	const triggerWorkflow = async () => {
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", "Bearer " + sessionStorage.getItem("jwt"));


		const response = await fetch(window.location.href + "/api/workflow", {
			method: "POST",
			headers: headers,
			body: JSON.stringify({ nodes: nodes, edges: edges })
		});
		const body = await response.json();
		console.log(body);
		setSidebarState((prev) => ({ ...prev, output: JSON.stringify(body.body).replaceAll(",", ",\n") }));
	}

	const fetchIntegrationMetadata = async () => {
		const metadataUrl = "https://api.useparagon.com/projects/" + process.env.NEXT_PUBLIC_PARAGON_PROJECT_ID + "/sdk/metadata";

		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", "Bearer " + sessionStorage.getItem("jwt"));
		const metadataResponse = await fetch(metadataUrl, {
			method: "GET",
			headers: headers
		});
		const metadataBody = await metadataResponse.json();
		return metadataBody;
	}

	const fetchActions = async () => {
		const actionsUrl = "https://actionkit.useparagon.com/projects/" + process.env.NEXT_PUBLIC_PARAGON_PROJECT_ID

		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", "Bearer " + sessionStorage.getItem("jwt"));
		const params = new URLSearchParams({
			format: "json_schema",
			limit_to_available: "true"
		}).toString();

		const actionResponse = await fetch(actionsUrl + "/actions/?" + params, {
			method: "GET",
			headers: headers
		});
		const actionBody = await actionResponse.json();
		return actionBody;
	}

	const closeNodeMenu = () => {
		//@ts-ignore
		clearSelectedNode([]);
	}

	const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		//@ts-ignore
		selectedNode.data.funcProperties.parameters = { ...selectedNode.data.funcProperties.parameters, [evt.target.name]: evt.target.value };
		setSidebarState((prev) => ({ ...prev, paramInputs: { ...prev.paramInputs, [evt.target.name]: evt.target.value } }));
	};

	const clearOutput = () => {
		setSidebarState((prev) => ({ ...prev, output: "" }));
	};


	const testStep = async () => {
		const url = window.location.href + "/api/test-step";
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", "Bearer " + sessionStorage.getItem("jwt"));

		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify({ selectedNodeId: selectedNode?.id, nodes: nodes, edges: edges }),
			headers: headers
		});

		const body = await response.json();

		//@ts-ignore
		selectedNode.data.funcProperties = { ...selectedNode.data.funcProperties, output: JSON.stringify(body.body).replaceAll(",", ",\n") };
		//@ts-ignore
		setSidebarState((prev) => ({ ...prev, output: selectedNode.data.funcProperties.output }));
	}

	const formatCamelCase = (camelStr: string) => {
		const result = camelStr.replace(/([A-Z])/g, " $1");
		return result.charAt(0).toUpperCase() + result.slice(1);
	}

	return (
		<div className='basis-1/4 m-1 p-2 flex flex-col items-center space-y-1 h-[800px] overflow-y-auto border-l-2'>
			<div className="flex justify-between space-x-4">
				<button className='border-2 rounded-lg bg-green-200 hover:bg-green-400 p-2 text-sm font-bold flex justify-center items-center' onClick={triggerWorkflow}>
					<svg className="mr-1" viewBox="0 0 24 24" height="20px" width="20px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#000000" strokeWidth="2" strokeLinejoin="round"></path> </g></svg>
					Run Workflow
				</button>
				<button className='border-2 rounded-lg bg-red-200  hover:bg-red-400 p-2 text-sm font-bold flex items-center justify-center' onClick={clearWorkflow}>
					<svg className="mr-1" viewBox="0 0 24 24" height="20px" width="20px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12L14 16M14 12L10 16M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
					Clear Workflow
				</button>
			</div>
			{selectedNode === undefined && sidebarState.integrations.map((integration) => {
				const integrationEnabled = paragonUser?.authenticated && paragonUser.integrations[integration.type]?.enabled;
				return (
					<div key={integration.type} className="w-full overflow-scroll">
						<button className='flex space-x-2 p-2 items-center justify-between w-full border-b-2 border-b-stone-200'
							onClick={integrationEnabled ? () => toggleDropdown(integration.type) : () => paragon.connect(integration.type, {})}>
							<img src={integration.icon} style={{ maxWidth: "30px" }} />
							<p className={integrationEnabled ? "font-semibold" : "text-stone-400"}>
								{integration.name}
							</p>
							{sidebarState.activeDropdown !== integration.type && <svg fill="#000000" height="15px" width="15px" version="1.1" id="Layer_1" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"></path> </g></svg>
							}
							{sidebarState.activeDropdown === integration.type && <svg fill="#000000" height="15px" width="15px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path> </g></svg>
							}
						</button>
						{
							integration.type === sidebarState.activeDropdown &&
							<div className="flex flex-col space-y-2 mt-2">
								{sidebarState.actions[integration.type]?.map((action: any) => {
									return (
										<ActionButton key={action.function.name} action={action} addNode={addNode} pic={integration.icon} />);
								})}
								<button onClick={() => paragon.connect(integration.type, {})}
									className="border-b-2 border-l-2 font-semibold hover:font-bold text-sm w-fit p-1">
									~ Configure {integration.type}
								</button>
							</div>
						}
					</div>
				);
			})
			}
			{
				selectedNode !== undefined && <div className="w-full py-2 flex flex-col justify-center items-center space-y-2">
					<button className="place-self-end" onClick={() => closeNodeMenu()}> x </button>
					<div className='flex flex-col space-y-2 '>
						{Object.keys(selectedNode?.data?.functionData?.function.parameters.properties).map((prop: string) => {
							return (
								<label key={prop}>{formatCamelCase(prop)}:
									<input value={selectedNode.data?.funcProperties?.parameters[prop]} onChange={onChange} id="text" name={prop} className="rounded-lg p-1 nodrag ml-2 border-2" />
								</label>
							)
						})
						}
						<button className='bg-green-200 hover:bg-green-400 rounded-lg border-2 p-1' onClick={testStep}> Test Step </button>
						{sidebarState.output !== "" &&
							<div className="flex flex-col space-y-1 shadow-md p-1 border-1 bg-stone-50 absolute bottom-5 w-96 right-5 ">
								<div className="flex justify-between">
									<div className="font-semibold text-sm">Last Test Output:</div>
									<button onClick={clearOutput}>x</button>
								</div>
								<textarea readOnly className='w-full p-1 whitespace-pre-line z-30 h-96 overflow-scroll'
									value={sidebarState.output} />
							</div>
						}

					</div>

				</div>
			}
			{sidebarState.output !== "" &&
				<div className="flex flex-col space-y-1 shadow-md p-1 border-1 bg-stone-50 absolute bottom-5 w-96 right-5 ">
					<div className="flex justify-between">
						<div className="font-semibold text-sm">Last Test Output:</div>
						<button onClick={clearOutput}>x</button>
					</div>
					<textarea readOnly className='w-full p-1 whitespace-pre-line z-30 h-96 overflow-scroll'
						value={sidebarState.output} />
				</div>
			}

			<div className="text-sm text-stone-400 pt-6 text-center">Integration actions powered by Paragon</div>
		</div >
	);
};
