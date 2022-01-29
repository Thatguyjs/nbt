export function assert(assertion, ...args) {
	if(!assertion) throw new Error(`Failed Assertion: ${args.join(' ')}`);
}

export function assert_eq(item1, item2, ...args) {
	assert(item1 === item2, ...args);
}

export function assert_eq_iter(item1, item2, ...args) {
	if(item1 === item2) return;
	assert_eq(item1.length, item2.length, ...args);

	const length = item1.length;

	for(let i = 0; i < length; i++)
		assert_eq(item1[i], item2[i], ...args);
}
