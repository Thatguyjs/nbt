import Tag from "./tag.mjs";

import fs from "fs";
import pfs from "fs/promises";
import zlib from "zlib";


const File = {
	// compression can be either 'none' / any falsy value, 'gzip', or 'zlib' / 'deflate'
	read_tags: async function(filepath, compression='gzip') {
		const buffer = await pfs.readFile(filepath);
		let data;

		if(!compression || compression === 'none')
			data = buffer;
		else if(compression === 'gzip' || compression === 'zlib' || compression === 'deflate')
			data = zlib.unzipSync(buffer);
		else
			throw new Error(`Invalid compression type: ${compression}`);

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
	},

	// Write tags to a file
	write_tags: function(tags, filepath, { compression='gzip', sync=false }) {
		if(!(tags instanceof Tag.Compound))
			tags = new Tag.Compound(null, tags);

		let buffer = Buffer.alloc(tags.size());
		tags.write(true, buffer);

		if(compression === 'gzip')
			buffer = zlib.gzipSync(buffer);
		else if(compression === 'zlib' || compression === 'deflate')
			buffer = zlib.deflateSync(buffer);
		else if(compression && compression !== 'none')
			throw new Error(`Invalid compression type: ${compression}`);

		return sync ?
			this.write_buffer_sync(buffer, filepath) :
			this.write_buffer(buffer, filepath);
	},

	// Write an NBT buffer to a file
	write_buffer: async function(buffer, filepath) {
		return pfs.writeFile(filepath, buffer);
	},

	// Same as write_buffer() but synchronous
	write_buffer_sync: function(buffer, filepath) {
		return fs.writeFileSync(filepath, buffer);
	}
};


export default File;
