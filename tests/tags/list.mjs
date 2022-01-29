import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full_string() {
		const tag = new Tag.List("my_list", Tag.String, ["Hello", "world!"]);
		const length = tag.size(true);

		if(!assert_eq(length, 8 + tag.name.length + 7 + 8, "Failed Tag.List [full_string] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			9, // Type
			0, 7, 109, 121, 95, 108, 105, 115, 116, // Name
			8, 0, 0, 0, 2, 0, 5, 72, 101, 108, 108, 111, 0, 6, 119, 111, 114, 108, 100, 33 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.List [full_string] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_full_int() {
		const tag = new Tag.List("my_list", Tag.Int, [-12, 34]);
		const length = tag.size(true);

		if(!assert_eq(length, 8 + tag.name.length + tag.payload.length * 4, "Failed Tag.List [full_int] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			9, // Type
			0, 7, 109, 121, 95, 108, 105, 115, 116, // Name
			3, 0, 0, 0, 2, 255, 255, 255, 244, 0, 0, 0, 34 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.List [full_int] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_no_type() {
		const tag = new Tag.List("my_list", Tag.String, ["Hello", "world!"]);
		const length = tag.size(false);

		if(!assert_eq(length, 7 + tag.name.length + 7 + 8, "Failed Tag.List [no_type] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 7, 109, 121, 95, 108, 105, 115, 116, // Name
			8, 0, 0, 0, 2, 0, 5, 72, 101, 108, 108, 111, 0, 6, 119, 111, 114, 108, 100, 33 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.List [no_type] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_min() {
		const tag = new Tag.List(null, Tag.String, ["Hello", "world!"]);
		const length = tag.size(false);

		if(!assert_eq(length, 5 + 7 + 8, "Failed Tag.List [min] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			8, 0, 0, 0, 2, 0, 5, 72, 101, 108, 108, 111, 0, 6, 119, 111, 114, 108, 100, 33 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.List [min] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_empty() {
		const tag = new Tag.List(null, []);
		const length = tag.size(false);

		if(!assert_eq(length, 5, "Failed Tag.List [empty] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 0, 0, 0, 0 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.List [empty] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	}
};
