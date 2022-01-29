import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full_positive() {
		const tag = new Tag.Int("my_int", 2147483647);
		const length = tag.size();

		assert_eq(length, 7 + tag.name.length, "Failed Tag.Int [full_positive] length equality");

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			3, // Type
			0, 6, 109, 121, 95, 105, 110, 116, // Name
			127, 255, 255, 255 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Int [full_positive] buffer equality");
	},

	encode_full_negative() {
		const tag = new Tag.Int("my_int", -2147483648);
		const length = tag.size();

		assert_eq(length, 7 + tag.name.length, "Failed Tag.Int [full_negative] length equality");

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			3, // Type
			0, 6, 109, 121, 95, 105, 110, 116, // Name
			128, 0, 0, 0 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Int [full_negative] buffer equality");
	},

	encode_no_type() {
		const tag = new Tag.Int("my_int", 17);
		const length = tag.size(false);

		assert_eq(length, 6 + tag.name.length, "Failed Tag.Int [no_type] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 6, 109, 121, 95, 105, 110, 116, // Name
			0, 0, 0, 17 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Int [no_type] buffer equality");
	},

	encode_min() {
		const tag = new Tag.Int(null, 42);
		const length = tag.size(false);

		assert_eq(length, 4, "Failed Tag.Int [min] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 0, 0, 42 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Int [min] buffer equality");
	}
};
;
