import { File, Tag } from "../../src/lib.mjs";
import ReadTests from "./read.mjs";


export default {
	write_hello_world() {
		const root = new Tag.Compound("hello world", [
			new Tag.String("name", "Bananrama")
		]);

		File.write_tags(root, "tests/output_hello_world.nbt", {
			compression: null,
			sync: true
		});

		// Easier to validate by reusing tests
		ReadTests.read_hello_world('tests/output_hello_world.nbt');
	},

	write_bigtest() {
		function equation_nums() {
			let result = Buffer.alloc(1000);

			for(let n = 0; n < 1000; n++)
				result.writeUInt8((n * n * 255 + n * 7) % 100, n);

			return result;
		}

		const root = new Tag.Compound("Level", [
			new Tag.Long("longTest", 9223372036854775807n),
			new Tag.Short("shortTest", 32767),
			new Tag.String("stringTest", "HELLO WORLD THIS IS A TEST STRING ÅÄÖ!"),
			new Tag.Float("floatTest", 0.4982314705848694),
			new Tag.Int("intTest", 2147483647),
			new Tag.Compound("nested compound test", [
				new Tag.Compound("ham", [
					new Tag.String("name", "Hampus"),
					new Tag.Float("value", 0.75)
				]),
				new Tag.Compound("egg", [
					new Tag.String("name", "Eggbert"),
					new Tag.Float("value", 0.5)
				])
			]),
			new Tag.List("listTest (long)", Tag.Long, [11n, 12n, 13n, 14n, 15n]),
			new Tag.List("listTest (compound)", Tag.Compound, [
				[
					new Tag.String("name", "Compound tag #0"),
					new Tag.Long("created-on", 1264099775885n)
				],
				[
					new Tag.String("name", "Compound tag #1"),
					new Tag.Long("created-on", 1264099775885n)
				]
			]),
			new Tag.Byte("byteTest", 127),
			new Tag.ByteArray("byteArrayTest (the first 1000 values of (n*n*255+n*7)%100, starting with n=0 (0, 62, 34, 16, 8, ...))", equation_nums()),
			new Tag.Double("doubleTest", 0.4931287132182315)
		]);

		File.write_tags(root, "tests/output_bigtest.nbt", { sync: true });

		// Easier to validate by reusing tests
		ReadTests.read_bigtest('tests/output_bigtest.nbt');
	}
};
