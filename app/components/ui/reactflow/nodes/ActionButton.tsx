export const ActionButton = ({ action, addNode, pic }: { action: any, addNode: any, pic: string }) => {

	const parseNames = (name: string) => {
		const nameArray = name.split("_");
		let res = "";
		for (const name of nameArray) {
			let newName = name.toLowerCase();
			newName = String(newName.charAt(0).toUpperCase()) + newName.slice(1);
			res += newName + " ";
		}
		return res.slice(0, -1);
	}

	return (
		<div>
			<button
				className='text-sm font-semibold pl-1 border-l-2 border-b-2 text-stone-600 hover:text-stone-400'
				onClick={() => addNode(parseNames(action.function.name), action, pic)}>
				+ {parseNames(action.function.name)}
			</button>
		</div>
	);
}
