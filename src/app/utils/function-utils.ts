
export async function later(delay: number): Promise<void> {
	return new Promise(function (resolve) {
		setTimeout(resolve, delay);
	});
}

export function importAll(r: __WebpackModuleApi.RequireContext) {
	return r.keys().map(r);
}
