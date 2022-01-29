import { assert, assert_eq, assert_eq_iter } from "../utils.mjs";
import { File, Tag } from "../../src/lib.mjs";

import fs from "fs";


export default {
	read_hello_world() {
		const buffer = fs.readFileSync('tests/hello_world.nbt');
		const root = File.read_data(buffer)[0];

		assert(root instanceof Tag.Compound, "Failed File.read_data [hello_world] tag equality");
		assert_eq(root.name, "hello world", "Failed File.read_data [hello_world] name equality");
		assert_eq(root.payload.length, 1, "Failed File.read_data [hello_world] payload length equality");

		assert(root.payload[0] instanceof Tag.String, "Failed File.read_data [hello_world] payload tag equality");
		assert_eq(root.payload[0].name, "name", "Failed File.read_data [hello_world] payload name equality");
		assert_eq(root.payload[0].payload, "Bananrama", "Failed File.read_data [hello_world] payload data equality");

		return true;
	}
};
