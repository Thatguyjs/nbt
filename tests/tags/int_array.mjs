import { assert_eq_iter } from "../utils.mjs";
import { Tag } from "../../src/lib.mjs";


export default {
	encode_full() {
		const tag = new Tag.String("my_string", "Hello, world!");
		const buf = Buffer.alloc(5 + tag.name.length + tag.payload.length);

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
	}
};
