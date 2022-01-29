import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full_positive() {
		const tag = new Tag.Double("my_double", 2 ** 53); // Large enough
		const length = tag.size();

		if(!assert_eq(length, 11 + tag.name.length, "Failed Tag.Double [full_positive] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			6, // Type
			0, 9, 109, 121, 95, 100, 111, 117, 98, 108, 101, // Name
			67, 64, 0, 0, 0, 0, 0, 0 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Double [full_positive] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_full_negative() {
		const tag = new Tag.Double("my_double", -(2 ** 53)); // Small enough
		const length = tag.size();

		if(!assert_eq(length, 11 + tag.name.length, "Failed Tag.Double [full_negative] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			6, // Type
			0, 9, 109, 121, 95, 100, 111, 117, 98, 108, 101, // Name
			195, 64, 0, 0, 0, 0, 0, 0 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Double [full_negative] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_no_type() {
		const tag = new Tag.Double("my_double", 17.5);
		const length = tag.size(false);

		if(!assert_eq(length, 10 + tag.name.length, "Failed Tag.Double [no_type] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 9, 109, 121, 95, 100, 111, 117, 98, 108, 101, // Name
			64, 49, 128, 0, 0, 0, 0, 0 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Double [no_type] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_min() {
		const tag = new Tag.Double(null, 42.5);
		const length = tag.size(false);

		if(!assert_eq(length, 8, "Failed Tag.Double [min] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			64, 69, 64, 0, 0, 0, 0, 0 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Double [min] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	}
};
