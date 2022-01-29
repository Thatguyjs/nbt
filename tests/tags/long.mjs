import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full_positive() {
		const tag = new Tag.Long("my_long", 2n ** 63n - 1n);
		const length = tag.size();

		if(!assert_eq(length, 11 + tag.name.length, "Failed Tag.Long [full_positive] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			4, // Type
			0, 7, 109, 121, 95, 108, 111, 110, 103, // Name
			127, 255, 255, 255, 255, 255, 255, 255 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Long [full_positive] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_full_negative() {
		const tag = new Tag.Long("my_long", -(2n ** 63n));
		const length = tag.size();

		if(!assert_eq(length, 11 + tag.name.length, "Failed Tag.Long [full_negative] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			4, // Type
			0, 7, 109, 121, 95, 108, 111, 110, 103, // Name
			128, 0, 0, 0, 0, 0, 0, 0 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Long [full_negative] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_no_type() {
		const tag = new Tag.Long("my_long", 17n);
		const length = tag.size(false);

		if(!assert_eq(length, 10 + tag.name.length, "Failed Tag.Long [no_type] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 7, 109, 121, 95, 108, 111, 110, 103, // Name
			0, 0, 0, 0, 0, 0, 0, 17 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Long [no_type] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_min() {
		const tag = new Tag.Long(null, 42n);
		const length = tag.size(false);

		if(!assert_eq(length, 8, "Failed Tag.Long [min] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 0, 0, 0, 0, 0, 0, 42 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.Long [min] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	}
};
;
;
