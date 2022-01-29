import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full() {
		const tag = new Tag.IntArray("my_int_array", [-17, 42, 2147483647, -2147483648]);
		const length = tag.size(true);

		assert_eq(length, 7 + tag.name.length + tag.payload.length * 4, "Failed Tag.IntArray [full] length equality");

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			11, // Type
			0, 12, 109, 121, 95, 105, 110, 116, 95, 97, 114, 114, 97, 121, // Name
			0, 0, 0, 4, 255, 255, 255, 239, 0, 0, 0, 42, 127, 255, 255, 255, 128, 0, 0, 0 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.IntArray [full] buffer equality");
	},

	encode_no_type() {
		const tag = new Tag.IntArray("my_int_array", [-17, 42, 2147483647, -2147483648]);
		const length = tag.size(false);

		assert_eq(length, 6 + tag.name.length + tag.payload.length * 4, "Failed Tag.IntArray [no_type] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 12, 109, 121, 95, 105, 110, 116, 95, 97, 114, 114, 97, 121, // Name
			0, 0, 0, 4, 255, 255, 255, 239, 0, 0, 0, 42, 127, 255, 255, 255, 128, 0, 0, 0 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.IntArray [no_type] buffer equality");
	},

	encode_min() {
		const tag = new Tag.IntArray(null, [-17, 42, 2147483647, -2147483648]);
		const length = tag.size(false);

		assert_eq(length, 4 + tag.payload.length * 4, "Failed Tag.IntArray [min] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 0, 0, 4, 255, 255, 255, 239, 0, 0, 0, 42, 127, 255, 255, 255, 128, 0, 0, 0 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.IntArray [min] buffer equality");
	},

	encode_empty() {
		const tag = new Tag.IntArray(null, []);
		const length = tag.size(false);

		assert_eq(length, 4, "Failed Tag.IntArray [empty] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 0, 0, 0 // Payload (length only)
		]);

		assert_eq_iter(buf, expected, "Failed Tag.IntArray [empty] buffer equality");
	}
};
