import { Handle, Position } from '@xyflow/react';

export function TriggerNode({ data }: { data: any }) {
	console.log(data);
	return (
		<>
			<div className='flex flex-col rounded-lg border-2 bg-stone-100 p-2'>
				<div className='font-bold text-blue-700' > {data.label}</div>
				<button className='bg-green-200 border-2 border-stone-800 rounded-lg hover:bg-green-400' onClick={data.triggerWorkflow}> Run </button>
			</div>
			<Handle type="source" position={Position.Bottom} id="a" />
		</>
	);
}
