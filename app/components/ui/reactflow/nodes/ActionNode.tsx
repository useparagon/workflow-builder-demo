import { useCallback, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';
import useStore from '@/app/store/store';

export function ActionNode({ data }: { data: any }) {
	const [params, setParams] = useState<{ parameters: any, output: string }>({ parameters: {}, output: "" });
	const setSelectedNode = useStore((state) => state.setSelectedNode);

	useEffect(() => {
		data.funcProperties = { action: data.functionData.function.name, parameters: {}, output: "" };
		for (const param of Object.keys(data.functionData.function.parameters.properties)) {
			data.funcProperties.parameters[param] = "";
		}
	}, []);


	const toggleSidebar = (id: string) => {
		setSelectedNode(id);
	}

	return (
		<>
			{data.label.charAt(0) !== '1' && <Handle type="target" position={Position.Top} />}
			<div className='flex flex-col rounded-lg border-2 bg-stone-100 p-4 space-y-2'>
				<div className='flex space-x-2'>
					<img src={data.pic} style={{ maxWidth: "30px" }} />
					<button onClick={() => toggleSidebar(data.id)} className='font-bold text-stone-600'>{data.label}</button>
				</div>
			</div>
			<Handle type="source" position={Position.Bottom} id="a" />
		</>
	);
}
