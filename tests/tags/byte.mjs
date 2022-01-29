import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full_positive() {
		const tag = new Tag.Byte("my_byte", 127);
		const length = tag.size();

		assert_eq(length, 4 + tag.name.length, "Failed Tag.Byte [full_positive] length equality");

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			1, // Type
			0, 7, 109, 121, 95, 98, 121, 116, 101, // Name
			127 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Byte [full_positive] buffer equality");
	},

	encode_full_negative() {
		const tag = new Tag.Byte("my_byte", -128);
		const length = tag.size();

		assert_eq(length, 4 + tag.name.length, "Failed Tag.Byte [full_negative] length equality");

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			1, // Type
			0, 7, 109, 121, 95, 98, 121, 116, 101, // Name
			-128 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Byte [full_negative] buffer equality");
	},

	encode_no_type() {
		const tag = new Tag.Byte("my_byte", 17);
		const length = tag.size(false);

		assert_eq(length, 3 + tag.name.length, "Failed Tag.Byte [no_type] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 7, 109, 121, 95, 98, 121, 116, 101, // Name
			17 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Byte [no_type] buffer equality");
	},

	encode_min() {
		const tag = new Tag.Byte(null, 42);
		const length = tag.size(false);

		assert_eq(length, 1, "Failed Tag.Byte [min] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			42 // Payload
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Byte [min] buffer equality");
	}
};
