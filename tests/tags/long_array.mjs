import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full() {
		const tag = new Tag.LongArray("my_long_array", [-17, 42, 2n ** 63n - 1n, -(2n ** 63n)]);
		const length = tag.size(true);

		assert_eq(length, 7 + tag.name.length + tag.payload.length * 8, "Failed Tag.LongArray [full] length equality");

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			12, // Type
			0, 13, 109, 121, 95, 108, 111, 110, 103, 95, 97, 114, 114, 97, 121, // Name
			0, 0, 0, 4, // Payload (length)
			255, 255, 255, 255, 255, 255, 255, 239, 0, 0, 0, 0, 0, 0, 0, 42, 127, 255, 255, 255, 255, 255, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0 // Payload (data)
		]);

		assert_eq_iter(buf, expected, "Failed Tag.LongArray [full] buffer equality");
	},

	encode_no_type() {
		const tag = new Tag.LongArray("my_long_array", [-17, 42, 2n ** 63n - 1n, -(2n ** 63n)]);
		const length = tag.size(false);

		assert_eq(length, 6 + tag.name.length + tag.payload.length * 8, "Failed Tag.LongArray [no_type] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 13, 109, 121, 95, 108, 111, 110, 103, 95, 97, 114, 114, 97, 121, // Name
			0, 0, 0, 4, // Payload (length)
			255, 255, 255, 255, 255, 255, 255, 239, 0, 0, 0, 0, 0, 0, 0, 42, 127, 255, 255, 255, 255, 255, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0 // Payload (data)
		]);

		assert_eq_iter(buf, expected, "Failed Tag.LongArray [no_type] buffer equality");
	},

	encode_min() {
		const tag = new Tag.LongArray(null, [-17, 42, 2n ** 63n - 1n, -(2n ** 63n)]);
		const length = tag.size(false);

		assert_eq(length, 4 + tag.payload.length * 8, "Failed Tag.LongArray [min] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 0, 0, 4, // Payload (length)
			255, 255, 255, 255, 255, 255, 255, 239, 0, 0, 0, 0, 0, 0, 0, 42, 127, 255, 255, 255, 255, 255, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0 // Payload (data)
		]);

		assert_eq_iter(buf, expected, "Failed Tag.LongArray [min] buffer equality");
	},

	encode_empty() {
		const tag = new Tag.LongArray(null, []);
		const length = tag.size(false);

		assert_eq(length, 4, "Failed Tag.LongArray [empty] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 0, 0, 0 // Payload (length only)
		]);

		assert_eq_iter(buf, expected, "Failed Tag.LongArray [empty] buffer equality");
	}
};
