import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full_positive() {
		const tag = new Tag.Float("my_float", 2147483647);
		const length = tag.size();

		if(!assert_eq(length, 7 + tag.name.length, "Failed Tag.Float [full_positive] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			5, // Type
			0, 8, 109, 121, 95, 102, 108, 111, 97, 116, // Name
			79, 0, 0, 0 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Float [full_positive] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_full_negative() {
		const tag = new Tag.Float("my_float", -2147483648);
		const length = tag.size();

		if(!assert_eq(length, 7 + tag.name.length, "Failed Tag.Float [full_negative] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			5, // Type
			0, 8, 109, 121, 95, 102, 108, 111, 97, 116, // Name
			207, 0, 0, 0 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Float [full_negative] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_no_type() {
		const tag = new Tag.Float("my_float", 17.5);
		const length = tag.size(false);

		if(!assert_eq(length, 6 + tag.name.length, "Failed Tag.Float [no_type] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 8, 109, 121, 95, 102, 108, 111, 97, 116, // Name
			65, 140, 0, 0 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Float [no_type] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_min() {
		const tag = new Tag.Float(null, 42.5);
		const length = tag.size(false);

		if(!assert_eq(length, 4, "Failed Tag.Float [min] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			66, 42, 0, 0 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Float [min] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	}
};
