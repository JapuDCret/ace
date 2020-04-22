
async function later(delay: number): Promise<void> {
	return new Promise(function (resolve) {
		setTimeout(resolve, delay);
	});
}

const FunctionUtils = {
	later: later
}

export default FunctionUtils;
