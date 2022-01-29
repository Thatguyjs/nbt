import { assert, assert_eq, assert_eq_iter } from "../utils.mjs";
import { File, Tag } from "../../src/lib.mjs";

import fs from "fs";
import zlib from "zlib";


function check_tag(tag, expected, ...message) {
	assert(tag instanceof expected.tag, ...[...message, '(instanceof)']);
	assert_eq(tag.name, expected.name, ...[...message, '(name)']);

	if(Array.isArray(expected.payload)) {
		for(let p in expected.payload)
			check_tag(tag.payload[p], expected.payload[p], ...[...message, `(nested payload: ${tag.name})`]);
	}
	else if(Buffer.isBuffer(expected.payload))
		assert_eq_iter(tag.payload, expected.payload, ...[...message, `(payload: ${tag.name})`]);
	else
		assert_eq(tag.payload, expected.payload, ...[...message, `(payload: ${tag.name})`]);
}


export default {
	read_hello_world() {
		const buffer = fs.readFileSync('tests/hello_world.nbt');
		const root = File.read_data(buffer)[0];

		assert(root instanceof Tag.Compound, "Failed File.read_data [hello_world] tag equality");
		assert_eq(root.name, "hello world", "Failed File.read_data [hello_world] name equality");
		assert_eq(root.payload.length, 1, "Failed File.read_data [hello_world] payload length equality");

		assert(root.payload[0] instanceof Tag.String, "Failed File.read_data [hello_world] payload tag equality");
		assert_eq(root.payload[0].name, "name", "Failed File.read_data [hello_world] payload name equality");
		assert_eq(root.payload[0].payload, "Bananrama", "Failed File.read_data [hello_world] payload data equality");

		return true;
	},

	read_bigtest() {
		const buffer = zlib.unzipSync(fs.readFileSync('tests/bigtest.nbt'));
		const root = File.read_data(buffer)[0];

		function equation_nums() {
			let result = Buffer.alloc(1000);

			for(let n = 0; n < 1000; n++)
				result.writeUInt8((n * n * 255 + n * 7) % 100, n);

			return result;
		}

		assert(root instanceof Tag.Compound, "Failed File.read_data [bigtest] tag equality");
		assert_eq(root.name, "Level", "Failed File.read_data [bigtest] name equality");
		assert_eq(root.payload.length, 11, "Failed File.read_data [bigtest] payload length equality");

		const expected = [
			{ tag: Tag.Long, name: 'longTest', payload: 9223372036854775807n },
			{ tag: Tag.Short, name: 'shortTest', payload: 32767 },
			{ tag: Tag.String, name: 'stringTest', payload: "HELLO WORLD THIS IS A TEST STRING ÅÄÖ!" },
			{ tag: Tag.Float, name: 'floatTest', payload: 0.4982314705848694 },
			{ tag: Tag.Int, name: 'intTest', payload: 2147483647 },
			{ tag: Tag.Compound, name: 'nested compound test', payload: [
				{ tag: Tag.Compound, name: 'ham', payload: [
					{ tag: Tag.String, name: 'name', payload: "Hampus" },
					{ tag: Tag.Float, name: 'value', payload: 0.75 }
				] },
				{ tag: Tag.Compound, name: 'egg', payload: [
					{ tag: Tag.String, name: 'name', payload: "Eggbert" },
					{ tag: Tag.Float, name: 'value', payload: 0.5 }
				] }
			] },
			{ tag: Tag.List, name: 'listTest (long)', payload: [
				{ tag: Tag.Long, payload: 11n },
				{ tag: Tag.Long, payload: 12n },
				{ tag: Tag.Long, payload: 13n },
				{ tag: Tag.Long, payload: 14n },
				{ tag: Tag.Long, payload: 15n }
			] },
			{ tag: Tag.List, name: 'listTest (compound)', payload: [
				{ tag: Tag.Compound, payload: [
					{ tag: Tag.String, name: 'name', payload: "Compound tag #0" },
					{ tag: Tag.Long, name: 'created-on', payload: 1264099775885n }
				] },
				{ tag: Tag.Compound, payload: [
					{ tag: Tag.String, name: 'name', payload: "Compound tag #1" },
					{ tag: Tag.Long, name: 'created-on', payload: 1264099775885n }
				] }
			] },
			{ tag: Tag.Byte, name: 'byteTest', payload: 127 },
			{
				tag: Tag.ByteArray, name: 'byteArrayTest (the first 1000 values of (n*n*255+n*7)%100, starting with n=0 (0, 62, 34, 16, 8, ...))',
				payload: equation_nums()
			},
			{ tag: Tag.Double, name: 'doubleTest', payload: 0.4931287132182315 }
		];

		for(let p in root.payload)
			check_tag(root.payload[p], expected[p], "Failed File.read_data [bigtest] payload equality");
	}
};
