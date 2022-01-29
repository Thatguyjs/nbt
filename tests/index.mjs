const Tests = {};

async function load_tests(filepath) {
	const items = await import('./' + filepath);
	filepath = filepath.slice(0, filepath.lastIndexOf('.'));

	Tests[filepath] = {};
	Object.assign(Tests[filepath], items.default);
}


// Load tests from files
const loading = [
	load_tests("tags/byte.mjs"),
	load_tests("tags/short.mjs"),
	load_tests("tags/int.mjs"),
	load_tests("tags/long.mjs"),
	load_tests("tags/float.mjs"),
	load_tests("tags/double.mjs"),
	load_tests("tags/byte_array.mjs"),
	load_tests("tags/string.mjs"),
	load_tests("tags/list.mjs"),
	load_tests("tags/compound.mjs"),
	load_tests("tags/int_array.mjs"),
	load_tests("tags/long_array.mjs")
];


// Run all tests
await Promise.all(loading);

let total_ran = 0;
let total_failed = 0;

for(let g in Tests) {
	console.info("Starting test group:", g);
	let group_total = 0;
	let group_failed = 0;

	for(let t in Tests[g]) {
		try {
			group_total++;

			if(!Tests[g][t]()) {
				console.error(`Test failed: "${g}/${t}"`);
				group_failed++;
			}
		}
		catch(err) {
			console.error("\nCaught Test Error:");
			console.error(err);
		}
	}

	total_ran += group_total;
	total_failed += group_failed;

	if(group_failed === 0)
		console.info("All tests passed:", g);
	else
		console.info(`${group_failed} of ${group_total} tests failed for group: ${g}`);
}

console.info(`\n${total_ran} tests finished, ${total_failed} tests failed`);
