import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full() {
		const tag = new Tag.Compound("my_compound", [new Tag.Int("my_int", 42), new Tag.List("my_list", Tag.String, ["first item", "second item"])]);
		const length = tag.size(true);

		assert_eq(length, 3 + tag.name.length + 13 + 40 + 1, "Failed Tag.Compound [full] length equality");

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			10, // Type
			0, 11, 109, 121, 95, 99, 111, 109, 112, 111, 117, 110, 100, // Name
			3, 0, 6, 109, 121, 95, 105, 110, 116, 0, 0, 0, 42, // Payload (int)
			9, 0, 7, 109, 121, 95, 108, 105, 115, 116, 8, 0, 0, 0, 2, // Payload (list header)
			0, 10, 102, 105, 114, 115, 116, 32, 105, 116, 101, 109, 0, 11, 115, 101, 99, 111, 110, 100, 32, 105, 116, 101, 109, // Payload (list data)
			0 // End tag
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Compound [full] buffer equality");
	},

	encode_no_type() {
		const tag = new Tag.Compound("my_compound", [new Tag.Int("my_int", 42), new Tag.List("my_list", Tag.String, ["first item", "second item"])]);
		const length = tag.size(false);

		assert_eq(length, 2 + tag.name.length + 13 + 40 + 1, "Failed Tag.Compound [no_type] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 11, 109, 121, 95, 99, 111, 109, 112, 111, 117, 110, 100, // Name
			3, 0, 6, 109, 121, 95, 105, 110, 116, 0, 0, 0, 42, // Payload (int)
			9, 0, 7, 109, 121, 95, 108, 105, 115, 116, 8, 0, 0, 0, 2, // Payload (list header)
			0, 10, 102, 105, 114, 115, 116, 32, 105, 116, 101, 109, 0, 11, 115, 101, 99, 111, 110, 100, 32, 105, 116, 101, 109, // Payload (list data)
			0 // End tag
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Compound [no_type] buffer equality");
	},

	encode_min() {
		const tag = new Tag.Compound(null, [new Tag.Int("my_int", 42), new Tag.List("my_list", Tag.String, ["first item", "second item"])]);
		const length = tag.size(false);

		assert_eq(length, 13 + 40 + 1, "Failed Tag.Compound [min] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			3, 0, 6, 109, 121, 95, 105, 110, 116, 0, 0, 0, 42, // Payload (int)
			9, 0, 7, 109, 121, 95, 108, 105, 115, 116, 8, 0, 0, 0, 2, // Payload (list header)
			0, 10, 102, 105, 114, 115, 116, 32, 105, 116, 101, 109, 0, 11, 115, 101, 99, 111, 110, 100, 32, 105, 116, 101, 109, // Payload (list data)
			0 // End tag
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Compound [min] buffer equality");
	},

	encode_empty() {
		const tag = new Tag.Compound(null, []);
		const length = tag.size(false);

		assert_eq(length, 1, "Failed Tag.Compound [empty] length equality");

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, // Payload (end tag)
		]);

		assert_eq_iter(buf, expected, "Failed Tag.Compound [empty] buffer equality");
	}
};
