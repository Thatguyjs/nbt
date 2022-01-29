import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full() {
		const tag = new Tag.String("my_string", "Hello, world!");
		const length = tag.size();

		if(!assert_eq(length, 5 + tag.name.length + tag.payload.length, "Failed Tag.String [full] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			8, // Type
			0, 9, 109, 121, 95, 115, 116, 114, 105, 110, 103, // Name
			0, 13, 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.String [full] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_no_type() {
		const tag = new Tag.String("my_string", "Hello, world!");
		const length = tag.size(false);

		if(!assert_eq(length, 4 + tag.name.length + tag.payload.length, "Failed Tag.String [no_type] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 9, 109, 121, 95, 115, 116, 114, 105, 110, 103, // Name
			0, 13, 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.String [no_type] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_min() {
		const tag = new Tag.String(null, "Hello, world!");
		const length = tag.size(false);

		if(!assert_eq(length, 2 + tag.payload.length, "Failed Tag.String [min] length equality"))
			return false;

		const buf = Buffer.alloc(length);

		tag.write(false, buf);

		const expected = Buffer.from([
			0, 13, 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.String [min] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_empty() {
		const tag = new Tag.String(null, "");
		const length = tag.size(false);

		if(!assert_eq(length, 2, "Failed Tag.String [empty] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 0 // Payload (length only)
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.String [empty] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	}
};
