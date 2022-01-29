import Tag from "./tag.mjs";

import pfs from "fs/promises";
import zlib from "zlib";


const File = {
	// compression can be either 'none' / any falsy value, 'gzip', or 'zlib' / 'deflate'
	read_tags: async function(filepath, compression='gzip') {
		const buffer = await pfs.readFile(filepath);
		let data;

		if(!compression || compression === 'none')
			data = buffer;
		else if(compression === 'gzip' || compression === 'zlib' || compression === 'deflate') {
			data = await new Promise((res, rej) => {
				zlib.unzip(buffer, (err, result) => {
					if(err) rej(err);
					else res(result);
				});
			});
		}
		else throw new Error(`Invalid compression type: ${compression}`);

		return this.read_data(data);
	},

	// Parses a buffer of data directly, instead of reading from a file
	read_data: function(buffer) {
		const length = buffer.length;
		let tags = [];
		let offset = 0;

		while(offset < length) {
			let next = Tag.read_tag(buffer, offset);
			if(next === null) return null;

			tags.push(next[0]);
			offset = next[1];
		}

		if(tags[0] instanceof Tag.Compound && !tags[0].name)
			tags = tags[0].payload;

		return tags;
	}
};


export default File;
