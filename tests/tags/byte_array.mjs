import { assert_eq, assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full() {
		const tag = new Tag.ByteArray("my_byte_array", Buffer.from("Hello, world!"));
		const length = tag.size(true);

		if(!assert_eq(length, 7 + tag.name.length + tag.payload.length, "Failed Tag.ByteArray [full] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(true, buf);

		const expected = Buffer.from([
			7, // Type
			0, 13, 109, 121, 95, 98, 121, 116, 101, 95, 97, 114, 114, 97, 121, // Name
			0, 0, 0, 13, 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.ByteArray [full] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_no_type() {
		const tag = new Tag.ByteArray("my_byte_array", Buffer.from("Hello, world!"));
		const length = tag.size(false);

		if(!assert_eq(length, 6 + tag.name.length + tag.payload.length, "Failed Tag.ByteArray [no_type] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 13, 109, 121, 95, 98, 121, 116, 101, 95, 97, 114, 114, 97, 121, // Name
			0, 0, 0, 13, 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 // Payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.ByteArray [no_type] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_min() {
		const tag = new Tag.ByteArray(null, Buffer.from("Hello, world!"));
		const length = tag.size(false);

		if(!assert_eq(length, 4 + tag.payload.length, "Failed Tag.ByteArray [min] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 0, 0, 13, 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 // payload
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.ByteArray [min] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	},

	encode_empty() {
		const tag = new Tag.ByteArray(null, Buffer.alloc(0));
		const length = tag.size(false);

		if(!assert_eq(length, 4, "Failed Tag.ByteArray [empty] length equality"))
			return false;

		const buf = Buffer.alloc(length);
		tag.write(false, buf);

		const expected = Buffer.from([
			0, 0, 0, 0 // Payload (length only)
		]);

		if(!assert_eq_iter(buf, expected, "Failed Tag.ByteArray [empty] buffer equality")) {
			console.log(buf, expected);
			return false;
		}

		return true;
	}
};
