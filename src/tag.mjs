// https://wiki.vg/NBT#Specification


function buffer_read_name(buffer, offset) {
	const length = buffer.readUint16BE(offset);
	offset += 2;
	return [buffer.subarray(offset, offset + length).toString(), offset + length];
}

function write_name(name, buffer, offset) {
	offset = buffer.writeUint16BE(name.length, offset);
	return offset + buffer.write(name, offset);
}

// Convert a class or number to a Tag type
function tag_type(value) {
	if(typeof value === 'number')
		return value;

	switch(value) {
		case Tag.End:
			return 0;
		case Tag.Byte:
			return 1;
		case Tag.Short:
			return 2;
		case Tag.Int:
			return 3;
		case Tag.Long:
			return 4;
		case Tag.Float:
			return 5;
		case Tag.Double:
			return 6;
		case Tag.ByteArray:
			return 7;
		case Tag.String:
			return 8;
		case Tag.List:
			return 9;
		case Tag.Compound:
			return 10;
		case Tag.IntArray:
			return 11;
		case Tag.LongArray:
			return 12;

		default:
			return -1;
	}
}

// Returns a Tag class for a given type
function class_from_type(type) {
	return [
		Tag.End,
		Tag.Byte,
		Tag.Short,
		Tag.Int,
		Tag.Long,
		Tag.Float,
		Tag.Double,
		Tag.ByteArray,
		Tag.String,
		Tag.List,
		Tag.Compound,
		Tag.IntArray,
		Tag.LongArray
	][type];
}


const Tag = {
	// Read the next tag from a buffer
	read_tag: function(buffer, offset=0, read_type=true, read_name=true) {
		const tag_class = class_from_type(buffer[offset]);
		if(!tag_class) return null;

		return tag_class.read(buffer, offset, read_type, read_name);
	},


	End: class {
		static read(buffer, offset=0) {
			if(buffer[offset] !== 0) return null;
			return [new Tag.End(), ++offset];
		}

		write(buffer, offset=0) {
			return buffer.writeUint8(0, offset);
		}

		size(type=true) {
			return type ? 1 : 0;
		}
	},

	Byte: class {
		name = "";
		payload = null;

		constructor(name, payload) {
			this.name = name;
			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 1) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);
			let payload = buffer.readInt8(offset);

			return [new Tag.Byte(name, payload), offset + 1];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(1, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			return buffer.writeInt8(this.payload, offset);
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 1;
		}
	},

	Short: class {
		name = "";
		payload = null;

		constructor(name, payload) {
			this.name = name;
			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 2) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);
			let payload = buffer.readInt16BE(offset);

			return [new Tag.Short(name, payload), offset + 2];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(2, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			return buffer.writeInt16BE(this.payload, offset);
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 2;
		}
	},

	Int: class {
		name = "";
		payload = null;

		constructor(name, payload) {
			this.name = name;
			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 3) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);
			let payload = buffer.readInt32BE(offset);

			return [new Tag.Int(name, payload), offset + 4];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(3, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			return buffer.writeInt32BE(this.payload, offset);
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 4;
		}
	},

	Long: class {
		name = "";
		payload = null;

		constructor(name, payload) {
			this.name = name;
			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 4) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);
			let payload = buffer.readBigInt64BE(offset);

			return [new Tag.Long(name, payload), offset + 8];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(4, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			return buffer.writeBigInt64BE(this.payload, offset);
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 8;
		}
	},

	Float: class {
		name = "";
		payload = null;

		constructor(name, payload) {
			this.name = name;
			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 5) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);
			let payload = buffer.readFloatBE(offset);

			return [new Tag.Float(name, payload), offset + 4];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(5, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			return buffer.writeFloatBE(this.payload, offset);
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 4;
		}
	},

	Double: class {
		name = "";
		payload = null;

		constructor(name, payload) {
			this.name = name;
			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 6) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);
			let payload = buffer.readDoubleBE(offset);

			return [new Tag.Double(name, payload), offset + 8];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(6, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			return buffer.writeDoubleBE(this.payload, offset);
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 8;
		}
	},

	ByteArray: class {
		name = "";
		payload = null;

		constructor(name, payload) {
			if(!Buffer.isBuffer(payload))
				payload = Buffer.from(payload);

			this.name = name;
			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 7) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);

			const length = buffer.readInt32BE(offset);
			const payload = buffer.subarray(offset + 4, offset + 4 + length);

			return [new Tag.ByteArray(name, payload), offset + 4 + length];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(7, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			offset = buffer.writeInt32BE(this.payload.length, offset);
			return offset + this.payload.copy(buffer, offset);
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 4 + this.payload.length;
		}
	},

	String: class {
		name = "";
		payload = "";

		constructor(name, payload) {
			if(typeof payload !== 'string') {
				console.warn(`Payload "${payload}" is not a String. The default conversion may lose data!`);
				payload = payload.toString();
			}

			this.name = name;
			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 8) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);

			const length = buffer.readUint16BE(offset);
			const payload = buffer.subarray(offset + 2, offset + 2 + length).toString();

			return [new Tag.String(name, payload), offset + 2 + length];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(8, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			offset = buffer.writeUint16BE(Buffer.byteLength(this.payload, 'utf8'), offset);
			return offset + buffer.write(this.payload, offset);
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 2 + Buffer.byteLength(this.payload, 'utf8');
		}
	},

	List: class {
		name = "";
		item_type = null;
		payload = [];

		constructor(name, item_type, payload) {
			if(Array.isArray(item_type) && item_type.length === 0) {
				item_type = Tag.End;
				payload = [];
			}

			if(!Array.isArray(payload)) {
				console.warn(`Payload "${payload}" is not an Array. The default conversion may lose data!`);
				payload = Array.from(payload);
			}

			this.name = name;
			this.item_type = tag_type(item_type);

			const item_class = class_from_type(this.item_type);

			for(let p in payload) {
				if(payload[p] instanceof item_class) continue;
				payload[p] = new item_class(null, payload[p]);
			}

			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 9) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);

			const tag_class = class_from_type(buffer.readUint8(offset++));
			const length = buffer.readInt32BE(offset);
			offset += 4;

			let payload = [];

			for(let i = 0; i < length; i++) {
				let next = tag_class.read(buffer, offset, false, false);
				if(!next) return null;

				payload.push(next[0]);
				offset = next[1];
			}

			return [new Tag.List(name, tag_class, payload), offset];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(9, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			offset = buffer.writeUint8(this.item_type, offset);
			offset = buffer.writeInt32BE(this.payload.length, offset);

			for(let p in this.payload)
				offset = this.payload[p].write(false, buffer, offset);

			return offset;
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			let sum = this.payload.reduce((prev, curr) => prev + curr.size(false), 0);
			return header + 5 + sum;
		}
	},

	Compound: class {
		name = "";
		payload = [];

		constructor(name, payload) {
			if(typeof payload !== 'object') // Arrays are objects too
				console.warn(`Payload "${payload}" is not an Object. The default conversion may lose data!`);

			this.name = name;

			for(let key in payload) {
				const item_class = class_from_type(payload[key].type);
				if(item_class === undefined) continue;

				payload[key] = new item_class(key, payload[key].payload ?? payload[key].value);
			}

			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 10) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);
			let payload = [];

			while(buffer[offset] !== 0) {
				let next = Tag.read_tag(buffer, offset);
				if(!next) return null;

				payload.push(next[0]);
				offset = next[1];
			}

			return [new Tag.Compound(name, payload), offset + 1];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(10, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			for(let p in this.payload)
				offset = this.payload[p].write(true, buffer, offset);

			return buffer.writeUint8(0, offset);
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			let sum = 0;
			for(let p in this.payload)
				sum += this.payload[p].size();

			return header + sum + 1;
		}
	},

	IntArray: class {
		name = "";
		payload = null;

		constructor(name, payload) {
			if(!Array.isArray(payload)) {
				console.warn(`Payload "${payload}" is not an Array. The default conversion may lose data!`);
				payload = Array.from(payload);
			}

			this.name = name;
			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 11) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);

			const length = buffer.readInt32BE(offset);
			let payload = [];

			for(let i = 0; i < length; i++) {
				offset += 4;
				payload.push(buffer.readInt32BE(offset));
			}

			return [new Tag.IntArray(name, payload), offset + 4];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(11, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			offset = buffer.writeInt32BE(this.payload.length, offset);
			for(let p in this.payload)
				offset = buffer.writeInt32BE(this.payload[p], offset);

			return offset;
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 4 + this.payload.length * 4;
		}
	},

	LongArray: class {
		name = "";
		payload = null;

		constructor(name, payload) {
			if(!Array.isArray(payload)) {
				console.warn(`Payload "${payload}" is not an Array. The default conversion may lose data!`);
				payload = Array.from(payload);
			}

			this.name = name;

			for(let p in payload)
				if(!(payload[p] instanceof BigInt))
					payload[p] = BigInt(payload[p]);

			this.payload = payload;
		}

		static read(buffer, offset=0, read_type=true, read_name=true) {
			if(read_type && buffer[offset++] !== 12) return null;

			let name;
			if(read_name) [name, offset] = buffer_read_name(buffer, offset);

			const length = buffer.readInt32BE(offset);
			let payload = [];

			for(let i = 0; i < length; i++) {
				offset += 8;
				payload.push(buffer.readBigInt64BE(offset));
			}

			return [new Tag.LongArray(name, payload), offset + 8];
		}

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(12, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			offset = buffer.writeInt32BE(this.payload.length, offset);
			for(let p in this.payload)
				offset = buffer.writeBigInt64BE(this.payload[p], offset);

			return offset;
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 4 + this.payload.length * 8;
		}
	}
};


export default Tag;
