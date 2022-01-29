import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full_positive() {
		const tag = new Tag.Short("my_short", 32767);
		const length = tag.size();

		assert_eq(length, 5 + tag.name.length, "Failed Tag.Short [full_positive] length equality");

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			2, // Type
			0, 8, 109, 121, 95, 115, 104, 111, 114, 116, // Name
			127, 255 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Short [full_positive] buffer equality");
	},

	encode_full_negative() {
		const tag = new Tag.Short("my_short", -32768);
		const length = tag.size();

		assert_eq(length, 5 + tag.name.length, "Failed Tag.Short [full_negative] length equality");

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			2, // Type
			0, 8, 109, 121, 95, 115, 104, 111, 114, 116, // Name
			128, 0 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Short [full_negative] buffer equality");
	},

	encode_no_type() {
		const tag = new Tag.Short("my_short", 17);
		const length = tag.size(false);

		assert_eq(length, 4 + tag.name.length, "Failed Tag.Short [no_type] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 8, 109, 121, 95, 115, 104, 111, 114, 116, // Name
			0, 17 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Short [no_type] buffer equality");
	},

	encode_min() {
		const tag = new Tag.Short(null, 42);
		const length = tag.size(false);

		assert_eq(length, 2, "Failed Tag.Short [min] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 42 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Short [min] buffer equality");
	}
};
