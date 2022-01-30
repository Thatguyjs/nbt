# nbt
A simple, easy-to-use [NBT](https://wiki.vg/NBT) parser / generator


# Docs

## File

### async read_tags(filepath[, compression])

Parses all NBT tags at `filepath`.

`compression` can be any of the following:
 - Any falsy value or `'none'`
 - `'gzip'` (default)
 - `'zlib'` or `'deflate'`

### read_data(buffer)

Parses all NBT tags from `buffer`.

### [async] write_tags(tags, filepath[, options])

Buffers and writes all `tags` to `filepath`.

`options` can have the following:
 - `compression` - Any compression value, uses the same values as `read_tags()`.
 - `sync` - `true` or `false`, whether the function should operate synchronously.

### async write_buffer(buffer, filepath)

Writes `buffer` to `filepath` asynchronously.

### write_buffer_sync(buffer, filepath)

Same as `write_buffer()`, but synchronous.


## Tags

NBT tags make up all NBT data. All tags listed below take `name` and `payload` arguments (besides `End` tags),
although `name` can be set to `null` or `undefined` in some cases. As a general good practice, pass
all arguments to constructors and functions unless they're explicitly optional, to avoid strange errors
or miscalculations from the library.


## Tag-Generic Functions

These are functions that all Tags implement, to make it easier to do most tasks.

### static read(buffer[, offset])

Parses a specific tag from `buffer`. `End` tags are the only tags that *don't* implement this method.

`offset` (default: `0`) - The byte offset to start reading from.  
`[returns]` A new offset equal to `offset` + `this.size()`.

### write(buffer[, offset])

Writes a specific tag to `buffer`.

`offset` (default: `0`) - The byte offset to start writing at.  
`[returns]` A new offset equal to `offset` + `this.size()`.

### size()

Calculates and returns the size in bytes that a specific tag will take up in binary form.

`[returns]` The size in bytes that this tag will occupy.


## Tag Classes & Global Methods

### read_tag(buffer[, offset[, read_name]])

Detects and parses the next Tag from `buffer`.

`offset` (default: `0`) - The byte offset to start reading from.  
`read_name` (default: `true`) - Whether to read the tag's name.

### class End()

An `End` tag, only used to terminate `Compound` tags. This is accounted for automatically when parsing / generating NBT data.

### class Byte(name, payload)

A `Byte` tag, holds an 8-bit signed integer.

### class Short(name, payload)

A `Short` tag, holds a 16-bit signed integer.

### class Int(name, payload)

An `Int` tag, holds a 32-bit signed integer.

### class Long(name, payload)

A `Long` tag, holds a 64-bit signed integer. `payload` is a `BigInt` instead of a `Number`.

### class Float(name, payload)

A `Float` tag, holds a 32-bit floating point number ([IEEE-754](https://en.wikipedia.org/wiki/IEEE_754-2008_revision)).

### class Double(name, payload)

A `Double` tag, holds a 64-bit floating point number ([IEEE-754](https://en.wikipedia.org/wiki/IEEE_754-2008_revision)).

### class ByteArray(name, payload)

A `ByteArray` tag, holds a `Buffer`.

### class String(name, payload)

A `String` tag, holds a JS `String`.

### class List(name, item_type, payload)

A `List` tag, holds an array of unnamed tags of type `item_type`. `item_type` should be either a number representing
a tag's type, or a class *(not an instance)* from this list.

`payload` - An array containing unnamed tags *or* raw payload data that matches what `item_type` specifies.

Example with tags:
```
new Tag.List("myList", Tag.String, [  
	new Tag.String(null, "String #0"),
	new Tag.String(null, "String #1")
]);
```

Example with raw payload data:
```
new Tag.List("myList", Tag.String, [
	"String #0",
	"String #1"
]);
```

### class Compound(name, payload)

A `Compound` tag, holds an array of named tags of any type.

`payload` - An array containing named tags.

### IntArray(name, payload)

An `IntArray` tag, holds an array of 32-bit signed integers.

### LongArray(name, payload)

A `LongArray` tag, holds an array of 64-bit signed integers. All array elements should be `BigInt`
instances, not `Number` instances.
