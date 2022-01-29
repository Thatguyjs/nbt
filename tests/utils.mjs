export function assert(assertion, ...args) {
	console.assert(assertion, ...args);
	return assertion;
}

export function assert_eq(item1, item2, ...args) {
	return assert(item1 === item2, ...args);
}

export function assert_eq_iter(item1, item2, ...args) {
	if(item1 === item2) return false;
	if(!assert_eq(item1.length, item2.length, ...args)) return false;

	const length = item1.length;

	for(let i = 0; i < length; i++)
		if(!assert_eq(item1[i], item2[i], ...args)) return false;

	return true;
}
