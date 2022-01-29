// https://wiki.vg/NBT#Specification


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
	End: class {
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
			if(!Buffer.isBuffer(payload)) {
				console.warn(`Payload "${payload}" is not a Buffer. The default conversion may lose data!`);
				payload = Buffer.from(payload);
			}

			this.name = name;
			this.payload = payload;
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

		write(write_type, buffer, offset=0) {
			if(write_type) offset = buffer.writeUint8(8, offset);
			if(this.name) offset = write_name(this.name, buffer, offset);

			offset = buffer.writeUint16BE(this.payload.length, offset);
			return offset + buffer.write(this.payload, offset);
		}

		size(type=true) {
			let header = type ? 1 : 0;
			if(this.name) header += 2 + this.name.length;

			return header + 2 + this.payload.length;
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
			if(typeof payload !== 'object')
				console.warn(`Payload "${payload}" is not an Object. The default conversion may lose data!`);

			this.name = name;

			for(let key in payload) {
				const item_class = class_from_type(payload[key].type);
				if(item_class === undefined) continue;

				payload[key] = new item_class(key, payload[key].payload ?? payload[key].value);
			}

			this.payload = payload;
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
