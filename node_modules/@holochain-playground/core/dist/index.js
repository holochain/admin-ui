import { serializeHash, getSysMetaValHeaderHash, DHTOpType, HeaderType, EntryDhtStatus, DetailsType, getEntry, ChainStatus, now, ValidationStatus as ValidationStatus$1, elementToDHTOps } from '@holochain-open-dev/core-types';
import { uniq, isEqual, cloneDeep } from 'lodash-es';
import { uniqueNamesGenerator, names } from 'unique-names-generator';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var ERROR_MSG_INPUT = 'Input must be an string, Buffer or Uint8Array';

// For convenience, let people hash a string, not just a Uint8Array
function normalizeInput (input) {
  var ret;
  if (input instanceof Uint8Array) {
    ret = input;
  } else if (input instanceof Buffer) {
    ret = new Uint8Array(input);
  } else if (typeof (input) === 'string') {
    ret = new Uint8Array(Buffer.from(input, 'utf8'));
  } else {
    throw new Error(ERROR_MSG_INPUT)
  }
  return ret
}

// Converts a Uint8Array to a hexadecimal string
// For example, toHex([255, 0, 255]) returns "ff00ff"
function toHex (bytes) {
  return Array.prototype.map.call(bytes, function (n) {
    return (n < 16 ? '0' : '') + n.toString(16)
  }).join('')
}

// Converts any value in [0...2^32-1] to an 8-character hex string
function uint32ToHex (val) {
  return (0x100000000 + val).toString(16).substring(1)
}

// For debugging: prints out hash state in the same format as the RFC
// sample computation exactly, so that you can diff
function debugPrint (label, arr, size) {
  var msg = '\n' + label + ' = ';
  for (var i = 0; i < arr.length; i += 2) {
    if (size === 32) {
      msg += uint32ToHex(arr[i]).toUpperCase();
      msg += ' ';
      msg += uint32ToHex(arr[i + 1]).toUpperCase();
    } else if (size === 64) {
      msg += uint32ToHex(arr[i + 1]).toUpperCase();
      msg += uint32ToHex(arr[i]).toUpperCase();
    } else throw new Error('Invalid size ' + size)
    if (i % 6 === 4) {
      msg += '\n' + new Array(label.length + 4).join(' ');
    } else if (i < arr.length - 2) {
      msg += ' ';
    }
  }
  console.log(msg);
}

// For performance testing: generates N bytes of input, hashes M times
// Measures and prints MB/second hash performance each time
function testSpeed (hashFn, N, M) {
  var startMs = new Date().getTime();

  var input = new Uint8Array(N);
  for (var i = 0; i < N; i++) {
    input[i] = i % 256;
  }
  var genMs = new Date().getTime();
  console.log('Generated random input in ' + (genMs - startMs) + 'ms');
  startMs = genMs;

  for (i = 0; i < M; i++) {
    var hashHex = hashFn(input);
    var hashMs = new Date().getTime();
    var ms = hashMs - startMs;
    startMs = hashMs;
    console.log('Hashed in ' + ms + 'ms: ' + hashHex.substring(0, 20) + '...');
    console.log(Math.round(N / (1 << 20) / (ms / 1000) * 100) / 100 + ' MB PER SECOND');
  }
}

var util = {
  normalizeInput: normalizeInput,
  toHex: toHex,
  debugPrint: debugPrint,
  testSpeed: testSpeed
};

// Blake2B in pure Javascript
// Adapted from the reference implementation in RFC7693
// Ported to Javascript by DC - https://github.com/dcposch



// 64-bit unsigned addition
// Sets v[a,a+1] += v[b,b+1]
// v should be a Uint32Array
function ADD64AA (v, a, b) {
  var o0 = v[a] + v[b];
  var o1 = v[a + 1] + v[b + 1];
  if (o0 >= 0x100000000) {
    o1++;
  }
  v[a] = o0;
  v[a + 1] = o1;
}

// 64-bit unsigned addition
// Sets v[a,a+1] += b
// b0 is the low 32 bits of b, b1 represents the high 32 bits
function ADD64AC (v, a, b0, b1) {
  var o0 = v[a] + b0;
  if (b0 < 0) {
    o0 += 0x100000000;
  }
  var o1 = v[a + 1] + b1;
  if (o0 >= 0x100000000) {
    o1++;
  }
  v[a] = o0;
  v[a + 1] = o1;
}

// Little-endian byte access
function B2B_GET32 (arr, i) {
  return (arr[i] ^
  (arr[i + 1] << 8) ^
  (arr[i + 2] << 16) ^
  (arr[i + 3] << 24))
}

// G Mixing function
// The ROTRs are inlined for speed
function B2B_G (a, b, c, d, ix, iy) {
  var x0 = m$1[ix];
  var x1 = m$1[ix + 1];
  var y0 = m$1[iy];
  var y1 = m$1[iy + 1];

  ADD64AA(v$1, a, b); // v[a,a+1] += v[b,b+1] ... in JS we must store a uint64 as two uint32s
  ADD64AC(v$1, a, x0, x1); // v[a, a+1] += x ... x0 is the low 32 bits of x, x1 is the high 32 bits

  // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated to the right by 32 bits
  var xor0 = v$1[d] ^ v$1[a];
  var xor1 = v$1[d + 1] ^ v$1[a + 1];
  v$1[d] = xor1;
  v$1[d + 1] = xor0;

  ADD64AA(v$1, c, d);

  // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 24 bits
  xor0 = v$1[b] ^ v$1[c];
  xor1 = v$1[b + 1] ^ v$1[c + 1];
  v$1[b] = (xor0 >>> 24) ^ (xor1 << 8);
  v$1[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);

  ADD64AA(v$1, a, b);
  ADD64AC(v$1, a, y0, y1);

  // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated right by 16 bits
  xor0 = v$1[d] ^ v$1[a];
  xor1 = v$1[d + 1] ^ v$1[a + 1];
  v$1[d] = (xor0 >>> 16) ^ (xor1 << 16);
  v$1[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);

  ADD64AA(v$1, c, d);

  // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 63 bits
  xor0 = v$1[b] ^ v$1[c];
  xor1 = v$1[b + 1] ^ v$1[c + 1];
  v$1[b] = (xor1 >>> 31) ^ (xor0 << 1);
  v$1[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
}

// Initialization Vector
var BLAKE2B_IV32 = new Uint32Array([
  0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85,
  0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
  0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C,
  0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19
]);

var SIGMA8 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
  11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
  7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
  9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
  2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
  12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
  13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
  6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
  10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
];

// These are offsets into a uint64 buffer.
// Multiply them all by 2 to make them offsets into a uint32 buffer,
// because this is Javascript and we don't have uint64s
var SIGMA82 = new Uint8Array(SIGMA8.map(function (x) { return x * 2 }));

// Compression function. 'last' flag indicates last block.
// Note we're representing 16 uint64s as 32 uint32s
var v$1 = new Uint32Array(32);
var m$1 = new Uint32Array(32);
function blake2bCompress (ctx, last) {
  var i = 0;

  // init work variables
  for (i = 0; i < 16; i++) {
    v$1[i] = ctx.h[i];
    v$1[i + 16] = BLAKE2B_IV32[i];
  }

  // low 64 bits of offset
  v$1[24] = v$1[24] ^ ctx.t;
  v$1[25] = v$1[25] ^ (ctx.t / 0x100000000);
  // high 64 bits not supported, offset may not be higher than 2**53-1

  // last block flag set ?
  if (last) {
    v$1[28] = ~v$1[28];
    v$1[29] = ~v$1[29];
  }

  // get little-endian words
  for (i = 0; i < 32; i++) {
    m$1[i] = B2B_GET32(ctx.b, 4 * i);
  }

  // twelve rounds of mixing
  // uncomment the DebugPrint calls to log the computation
  // and match the RFC sample documentation
  // util.debugPrint('          m[16]', m, 64)
  for (i = 0; i < 12; i++) {
    // util.debugPrint('   (i=' + (i < 10 ? ' ' : '') + i + ') v[16]', v, 64)
    B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
    B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
    B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
    B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
    B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
    B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
    B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
    B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
  }
  // util.debugPrint('   (i=12) v[16]', v, 64)

  for (i = 0; i < 16; i++) {
    ctx.h[i] = ctx.h[i] ^ v$1[i] ^ v$1[i + 16];
  }
  // util.debugPrint('h[8]', ctx.h, 64)
}

// Creates a BLAKE2b hashing context
// Requires an output length between 1 and 64 bytes
// Takes an optional Uint8Array key
function blake2bInit (outlen, key) {
  if (outlen === 0 || outlen > 64) {
    throw new Error('Illegal output length, expected 0 < length <= 64')
  }
  if (key && key.length > 64) {
    throw new Error('Illegal key, expected Uint8Array with 0 < length <= 64')
  }

  // state, 'param block'
  var ctx = {
    b: new Uint8Array(128),
    h: new Uint32Array(16),
    t: 0, // input count
    c: 0, // pointer within buffer
    outlen: outlen // output length in bytes
  };

  // initialize hash state
  for (var i = 0; i < 16; i++) {
    ctx.h[i] = BLAKE2B_IV32[i];
  }
  var keylen = key ? key.length : 0;
  ctx.h[0] ^= 0x01010000 ^ (keylen << 8) ^ outlen;

  // key the hash, if applicable
  if (key) {
    blake2bUpdate(ctx, key);
    // at the end
    ctx.c = 128;
  }

  return ctx
}

// Updates a BLAKE2b streaming hash
// Requires hash context and Uint8Array (byte array)
function blake2bUpdate (ctx, input) {
  for (var i = 0; i < input.length; i++) {
    if (ctx.c === 128) { // buffer full ?
      ctx.t += ctx.c; // add counters
      blake2bCompress(ctx, false); // compress (not last)
      ctx.c = 0; // counter to zero
    }
    ctx.b[ctx.c++] = input[i];
  }
}

// Completes a BLAKE2b streaming hash
// Returns a Uint8Array containing the message digest
function blake2bFinal (ctx) {
  ctx.t += ctx.c; // mark last block offset

  while (ctx.c < 128) { // fill up with zeros
    ctx.b[ctx.c++] = 0;
  }
  blake2bCompress(ctx, true); // final block flag = 1

  // little endian convert and store
  var out = new Uint8Array(ctx.outlen);
  for (var i = 0; i < ctx.outlen; i++) {
    out[i] = ctx.h[i >> 2] >> (8 * (i & 3));
  }
  return out
}

// Computes the BLAKE2B hash of a string or byte array, and returns a Uint8Array
//
// Returns a n-byte Uint8Array
//
// Parameters:
// - input - the input bytes, as a string, Buffer or Uint8Array
// - key - optional key Uint8Array, up to 64 bytes
// - outlen - optional output length in bytes, default 64
function blake2b (input, key, outlen) {
  // preprocess inputs
  outlen = outlen || 64;
  input = util.normalizeInput(input);

  // do the math
  var ctx = blake2bInit(outlen, key);
  blake2bUpdate(ctx, input);
  return blake2bFinal(ctx)
}

// Computes the BLAKE2B hash of a string or byte array
//
// Returns an n-byte hash in hex, all lowercase
//
// Parameters:
// - input - the input bytes, as a string, Buffer, or Uint8Array
// - key - optional key Uint8Array, up to 64 bytes
// - outlen - optional output length in bytes, default 64
function blake2bHex (input, key, outlen) {
  var output = blake2b(input, key, outlen);
  return util.toHex(output)
}

var blake2b_1 = {
  blake2b: blake2b,
  blake2bHex: blake2bHex,
  blake2bInit: blake2bInit,
  blake2bUpdate: blake2bUpdate,
  blake2bFinal: blake2bFinal
};

// BLAKE2s hash function in pure Javascript
// Adapted from the reference implementation in RFC7693
// Ported to Javascript by DC - https://github.com/dcposch



// Little-endian byte access.
// Expects a Uint8Array and an index
// Returns the little-endian uint32 at v[i..i+3]
function B2S_GET32 (v, i) {
  return v[i] ^ (v[i + 1] << 8) ^ (v[i + 2] << 16) ^ (v[i + 3] << 24)
}

// Mixing function G.
function B2S_G (a, b, c, d, x, y) {
  v[a] = v[a] + v[b] + x;
  v[d] = ROTR32(v[d] ^ v[a], 16);
  v[c] = v[c] + v[d];
  v[b] = ROTR32(v[b] ^ v[c], 12);
  v[a] = v[a] + v[b] + y;
  v[d] = ROTR32(v[d] ^ v[a], 8);
  v[c] = v[c] + v[d];
  v[b] = ROTR32(v[b] ^ v[c], 7);
}

// 32-bit right rotation
// x should be a uint32
// y must be between 1 and 31, inclusive
function ROTR32 (x, y) {
  return (x >>> y) ^ (x << (32 - y))
}

// Initialization Vector.
var BLAKE2S_IV = new Uint32Array([
  0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
  0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19]);

var SIGMA = new Uint8Array([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
  11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
  7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
  9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
  2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
  12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
  13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
  6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
  10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0]);

// Compression function. "last" flag indicates last block
var v = new Uint32Array(16);
var m = new Uint32Array(16);
function blake2sCompress (ctx, last) {
  var i = 0;
  for (i = 0; i < 8; i++) { // init work variables
    v[i] = ctx.h[i];
    v[i + 8] = BLAKE2S_IV[i];
  }

  v[12] ^= ctx.t; // low 32 bits of offset
  v[13] ^= (ctx.t / 0x100000000); // high 32 bits
  if (last) { // last block flag set ?
    v[14] = ~v[14];
  }

  for (i = 0; i < 16; i++) { // get little-endian words
    m[i] = B2S_GET32(ctx.b, 4 * i);
  }

  // ten rounds of mixing
  // uncomment the DebugPrint calls to log the computation
  // and match the RFC sample documentation
  // util.debugPrint('          m[16]', m, 32)
  for (i = 0; i < 10; i++) {
    // util.debugPrint('   (i=' + i + ')  v[16]', v, 32)
    B2S_G(0, 4, 8, 12, m[SIGMA[i * 16 + 0]], m[SIGMA[i * 16 + 1]]);
    B2S_G(1, 5, 9, 13, m[SIGMA[i * 16 + 2]], m[SIGMA[i * 16 + 3]]);
    B2S_G(2, 6, 10, 14, m[SIGMA[i * 16 + 4]], m[SIGMA[i * 16 + 5]]);
    B2S_G(3, 7, 11, 15, m[SIGMA[i * 16 + 6]], m[SIGMA[i * 16 + 7]]);
    B2S_G(0, 5, 10, 15, m[SIGMA[i * 16 + 8]], m[SIGMA[i * 16 + 9]]);
    B2S_G(1, 6, 11, 12, m[SIGMA[i * 16 + 10]], m[SIGMA[i * 16 + 11]]);
    B2S_G(2, 7, 8, 13, m[SIGMA[i * 16 + 12]], m[SIGMA[i * 16 + 13]]);
    B2S_G(3, 4, 9, 14, m[SIGMA[i * 16 + 14]], m[SIGMA[i * 16 + 15]]);
  }
  // util.debugPrint('   (i=10) v[16]', v, 32)

  for (i = 0; i < 8; i++) {
    ctx.h[i] ^= v[i] ^ v[i + 8];
  }
  // util.debugPrint('h[8]', ctx.h, 32)
}

// Creates a BLAKE2s hashing context
// Requires an output length between 1 and 32 bytes
// Takes an optional Uint8Array key
function blake2sInit (outlen, key) {
  if (!(outlen > 0 && outlen <= 32)) {
    throw new Error('Incorrect output length, should be in [1, 32]')
  }
  var keylen = key ? key.length : 0;
  if (key && !(keylen > 0 && keylen <= 32)) {
    throw new Error('Incorrect key length, should be in [1, 32]')
  }

  var ctx = {
    h: new Uint32Array(BLAKE2S_IV), // hash state
    b: new Uint32Array(64), // input block
    c: 0, // pointer within block
    t: 0, // input count
    outlen: outlen // output length in bytes
  };
  ctx.h[0] ^= 0x01010000 ^ (keylen << 8) ^ outlen;

  if (keylen > 0) {
    blake2sUpdate(ctx, key);
    ctx.c = 64; // at the end
  }

  return ctx
}

// Updates a BLAKE2s streaming hash
// Requires hash context and Uint8Array (byte array)
function blake2sUpdate (ctx, input) {
  for (var i = 0; i < input.length; i++) {
    if (ctx.c === 64) { // buffer full ?
      ctx.t += ctx.c; // add counters
      blake2sCompress(ctx, false); // compress (not last)
      ctx.c = 0; // counter to zero
    }
    ctx.b[ctx.c++] = input[i];
  }
}

// Completes a BLAKE2s streaming hash
// Returns a Uint8Array containing the message digest
function blake2sFinal (ctx) {
  ctx.t += ctx.c; // mark last block offset
  while (ctx.c < 64) { // fill up with zeros
    ctx.b[ctx.c++] = 0;
  }
  blake2sCompress(ctx, true); // final block flag = 1

  // little endian convert and store
  var out = new Uint8Array(ctx.outlen);
  for (var i = 0; i < ctx.outlen; i++) {
    out[i] = (ctx.h[i >> 2] >> (8 * (i & 3))) & 0xFF;
  }
  return out
}

// Computes the BLAKE2S hash of a string or byte array, and returns a Uint8Array
//
// Returns a n-byte Uint8Array
//
// Parameters:
// - input - the input bytes, as a string, Buffer, or Uint8Array
// - key - optional key Uint8Array, up to 32 bytes
// - outlen - optional output length in bytes, default 64
function blake2s (input, key, outlen) {
  // preprocess inputs
  outlen = outlen || 32;
  input = util.normalizeInput(input);

  // do the math
  var ctx = blake2sInit(outlen, key);
  blake2sUpdate(ctx, input);
  return blake2sFinal(ctx)
}

// Computes the BLAKE2S hash of a string or byte array
//
// Returns an n-byte hash in hex, all lowercase
//
// Parameters:
// - input - the input bytes, as a string, Buffer, or Uint8Array
// - key - optional key Uint8Array, up to 32 bytes
// - outlen - optional output length in bytes, default 64
function blake2sHex (input, key, outlen) {
  var output = blake2s(input, key, outlen);
  return util.toHex(output)
}

var blake2s_1 = {
  blake2s: blake2s,
  blake2sHex: blake2sHex,
  blake2sInit: blake2sInit,
  blake2sUpdate: blake2sUpdate,
  blake2sFinal: blake2sFinal
};

var blakejs = {
  blake2b: blake2b_1.blake2b,
  blake2bHex: blake2b_1.blake2bHex,
  blake2bInit: blake2b_1.blake2bInit,
  blake2bUpdate: blake2b_1.blake2bUpdate,
  blake2bFinal: blake2b_1.blake2bFinal,
  blake2s: blake2s_1.blake2s,
  blake2sHex: blake2s_1.blake2sHex,
  blake2sInit: blake2s_1.blake2sInit,
  blake2sUpdate: blake2s_1.blake2sUpdate,
  blake2sFinal: blake2s_1.blake2sFinal
};

var HashType;
(function (HashType) {
    HashType[HashType["AGENT"] = 0] = "AGENT";
    HashType[HashType["ENTRY"] = 1] = "ENTRY";
    HashType[HashType["DHTOP"] = 2] = "DHTOP";
    HashType[HashType["HEADER"] = 3] = "HEADER";
    HashType[HashType["DNA"] = 4] = "DNA";
})(HashType || (HashType = {}));
const AGENT_PREFIX = 'hCAk';
const ENTRY_PREFIX = 'hCEk';
const DHTOP_PREFIX = 'hCQk';
const DNA_PREFIX = 'hC0k';
const HEADER_PREFIX = 'hCkk';
function getPrefix(type) {
    switch (type) {
        case HashType.AGENT:
            return AGENT_PREFIX;
        case HashType.ENTRY:
            return ENTRY_PREFIX;
        case HashType.DHTOP:
            return DHTOP_PREFIX;
        case HashType.HEADER:
            return HEADER_PREFIX;
        case HashType.DNA:
            return DNA_PREFIX;
    }
}
function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
const hashCache = {};
// From https://github.com/holochain/holochain/blob/dc0cb61d0603fa410ac5f024ed6ccfdfc29715b3/crates/holo_hash/src/encode.rs
function hash(content, type) {
    const contentString = typeof content === 'string' ? content : JSON.stringify(content);
    if (hashCache[contentString])
        return hashCache[contentString];
    const hashable = new Uint8Array(str2ab(contentString));
    const bytesHash = blakejs.blake2b(hashable, null, 32);
    const strHash = serializeHash(bytesHash);
    const hash = `u${getPrefix(type)}${strHash.slice(1)}`;
    hashCache[contentString] = hash;
    return hash;
}
const hashLocationCache = {};
function location(hash) {
    if (hashLocationCache[hash])
        return hashLocationCache[hash];
    const hashable = new Uint8Array(str2ab(hash.slice(5)));
    const hash128 = blakejs.blake2b(hashable, null, 16);
    const out = [hash128[0], hash128[1], hash128[2], hash128[3]];
    for (let i = 4; i < 16; i += 4) {
        out[0] ^= hash128[i];
        out[1] ^= hash128[i + 1];
        out[2] ^= hash128[i + 2];
        out[3] ^= hash128[i + 3];
    }
    const view = new DataView(new Uint8Array(out).buffer, 0);
    const location = wrap(view.getUint32(0, false));
    hashLocationCache[hash] = location;
    return location;
}
// We return the distance as the shortest distance between two hashes in the circle
function distance(hash1, hash2) {
    const location1 = location(hash1);
    const location2 = location(hash2);
    return shortest_arc_distance(location1, location2) + 1;
}
function shortest_arc_distance(location1, location2) {
    const distance1 = wrap(location1 - location2);
    const distance2 = wrap(location2 - location1);
    return Math.min(distance1, distance2);
}
const MAX_UINT = 4294967295;
function wrap(uint) {
    if (uint < 0)
        return 1 + MAX_UINT + uint;
    if (uint > MAX_UINT)
        return uint - MAX_UINT;
    return uint;
}
function getHashType(hash) {
    const hashExt = hash.slice(1, 5);
    if (hashExt === AGENT_PREFIX)
        return HashType.AGENT;
    if (hashExt === DNA_PREFIX)
        return HashType.DNA;
    if (hashExt === DHTOP_PREFIX)
        return HashType.DHTOP;
    if (hashExt === HEADER_PREFIX)
        return HashType.HEADER;
    if (hashExt === ENTRY_PREFIX)
        return HashType.ENTRY;
    throw new Error('Could not get hash type');
}

var GetStrategy;
(function (GetStrategy) {
    GetStrategy[GetStrategy["Latest"] = 0] = "Latest";
    GetStrategy[GetStrategy["Contents"] = 1] = "Contents";
})(GetStrategy || (GetStrategy = {}));

function getValidationLimboDhtOps(state, statuses) {
    const pendingDhtOps = {};
    for (const dhtOpHash of Object.keys(state.validationLimbo)) {
        const limboValue = state.validationLimbo[dhtOpHash];
        if (statuses.includes(limboValue.status)) {
            pendingDhtOps[dhtOpHash] = limboValue;
        }
    }
    return pendingDhtOps;
}
const getValidationReceipts = (dhtOpHash) => (state) => {
    return state.validationReceipts[dhtOpHash]
        ? Object.values(state.validationReceipts[dhtOpHash])
        : [];
};
function pullAllIntegrationLimboDhtOps(state) {
    const dhtOps = state.integrationLimbo;
    state.integrationLimbo = {};
    return dhtOps;
}
function getHeadersForEntry(state, entryHash) {
    const entryMetadata = state.metadata.system_meta[entryHash];
    if (!entryMetadata)
        return [];
    return entryMetadata
        .map(h => {
        const hash = getSysMetaValHeaderHash(h);
        if (hash) {
            return state.CAS[hash];
        }
        return undefined;
    })
        .filter(header => !!header);
}
function getEntryDhtStatus(state, entryHash) {
    const meta = state.metadata.misc_meta[entryHash];
    return meta
        ? meta.EntryStatus
        : undefined;
}
function getEntryDetails(state, entry_hash) {
    const entry = state.CAS[entry_hash];
    const allHeaders = getHeadersForEntry(state, entry_hash);
    const dhtStatus = getEntryDhtStatus(state, entry_hash);
    const live_headers = {};
    const updates = {};
    const deletes = {};
    for (const header of allHeaders) {
        const headerContent = header.header.content;
        if (headerContent.original_entry_address &&
            headerContent.original_entry_address === entry_hash) {
            updates[header.header.hash] = header;
        }
        else if (headerContent.entry_hash &&
            headerContent.entry_hash === entry_hash) {
            live_headers[header.header.hash] = header;
        }
        else if (headerContent.deletes_entry_address === entry_hash) {
            deletes[header.header.hash] = header;
        }
    }
    return {
        entry,
        headers: allHeaders,
        entry_dht_status: dhtStatus,
        updates: Object.values(updates),
        deletes: Object.values(deletes),
        rejected_headers: [], // TODO: after validation is implemented
    };
}
function getHeaderModifiers(state, headerHash) {
    const allModifiers = state.metadata.system_meta[headerHash];
    if (!allModifiers)
        return {
            updates: [],
            deletes: [],
        };
    const updates = allModifiers
        .filter(m => m.Update)
        .map(m => state.CAS[m.Update]);
    const deletes = allModifiers
        .filter(m => m.Delete)
        .map(m => state.CAS[m.Delete]);
    return {
        updates,
        deletes,
    };
}
function getAllHeldEntries(state) {
    const newEntryHeaders = Object.values(state.integratedDHTOps)
        .filter(dhtOpValue => dhtOpValue.op.type === DHTOpType.StoreEntry)
        .map(dhtOpValue => dhtOpValue.op.header);
    const allEntryHashes = newEntryHeaders.map(h => h.header.content.entry_hash);
    return uniq(allEntryHashes);
}
function getAllHeldHeaders(state) {
    const headers = Object.values(state.integratedDHTOps)
        .filter(dhtOpValue => dhtOpValue.op.type === DHTOpType.StoreElement)
        .map(dhtOpValue => dhtOpValue.op.header);
    const allHeaderHashes = headers.map(h => h.header.hash);
    return uniq(allHeaderHashes);
}
function getAllAuthoredEntries(state) {
    const allHeaders = Object.values(state.authoredDHTOps).map(dhtOpValue => dhtOpValue.op.header);
    const newEntryHeaders = allHeaders.filter(h => h.header.content.entry_hash);
    return newEntryHeaders.map(h => h.header.content.entry_hash);
}
function isHoldingEntry(state, entryHash) {
    return state.metadata.system_meta[entryHash] !== undefined;
}
function isHoldingElement(state, headerHash) {
    return state.metadata.misc_meta[headerHash] === 'StoreElement';
}
function isHoldingDhtOp(state, dhtOpHash) {
    return !!state.integratedDHTOps[dhtOpHash];
}
function getDhtShard(state) {
    const heldEntries = getAllHeldEntries(state);
    const dhtShard = {};
    for (const entryHash of heldEntries) {
        dhtShard[entryHash] = {
            details: getEntryDetails(state, entryHash),
            links: getCreateLinksForEntry(state, entryHash),
        };
    }
    return dhtShard;
}
function getLinksForEntry(state, entryHash) {
    const linkMetaVals = getCreateLinksForEntry(state, entryHash);
    const link_adds = [];
    const link_removes = [];
    for (const value of linkMetaVals) {
        const header = state.CAS[value.link_add_hash];
        if (header) {
            link_adds.push(header);
        }
        const removes = getRemovesOnLinkAdd(state, value.link_add_hash);
        for (const remove of removes) {
            const removeHeader = state.CAS[remove];
            link_removes.push(removeHeader);
        }
    }
    return {
        link_adds,
        link_removes,
    };
}
function getCreateLinksForEntry(state, entryHash) {
    return state.metadata.link_meta
        .filter(({ key, value }) => isEqual(key.base, entryHash))
        .map(({ key, value }) => value);
}
function getRemovesOnLinkAdd(state, link_add_hash) {
    const metadata = state.metadata.system_meta[link_add_hash];
    if (!metadata)
        return [];
    const removes = [];
    for (const val of metadata) {
        if (val.DeleteLink) {
            removes.push(val.DeleteLink);
        }
    }
    return removes;
}
function getLiveLinks(getLinksResponses) {
    // Map and flatten adds
    const linkAdds = {};
    for (const responses of getLinksResponses) {
        for (const linkAdd of responses.link_adds) {
            linkAdds[linkAdd.header.hash] = linkAdd.header.content;
        }
    }
    for (const responses of getLinksResponses) {
        for (const linkRemove of responses.link_removes) {
            const removedAddress = linkRemove.header.content.link_add_address;
            if (linkAdds[removedAddress])
                linkAdds[removedAddress] = undefined;
        }
    }
    const resultingLinks = [];
    for (const liveLink of Object.values(linkAdds)) {
        if (liveLink)
            resultingLinks.push({
                base: liveLink.base_address,
                target: liveLink.target_address,
                tag: liveLink.tag,
            });
    }
    return resultingLinks;
}
function computeDhtStatus(allHeadersForEntry) {
    const aliveHeaders = {};
    const rejected_headers = [];
    for (const header of allHeadersForEntry) {
        if (header.header.content.type === HeaderType.Create) {
            aliveHeaders[header.header.hash] = header;
        }
    }
    for (const header of allHeadersForEntry) {
        if (header.header.content.type === HeaderType.Update ||
            header.header.content.type === HeaderType.Delete) {
            if (aliveHeaders[header.header.hash])
                rejected_headers.push(aliveHeaders[header.header.hash]);
            aliveHeaders[header.header.hash] = undefined;
        }
    }
    const isSomeHeaderAlive = Object.values(aliveHeaders).some(header => header !== undefined);
    // TODO: add more cases
    const entry_dht_status = isSomeHeaderAlive
        ? EntryDhtStatus.Live
        : EntryDhtStatus.Dead;
    return {
        entry_dht_status,
        rejected_headers,
    };
}
function hasDhtOpBeenProcessed(state, dhtOpHash) {
    return (!!state.integrationLimbo[dhtOpHash] ||
        !!state.integratedDHTOps[dhtOpHash] ||
        !!state.validationLimbo[dhtOpHash]);
}
function getIntegratedDhtOpsWithoutReceipt(state) {
    const needReceipt = {};
    for (const [dhtOpHash, integratedValue] of Object.entries(state.integratedDHTOps)) {
        if (integratedValue.send_receipt) {
            needReceipt[dhtOpHash] = integratedValue;
        }
    }
    return needReceipt;
}

function contains(dht_arc, location) {
    const do_hold_something = dht_arc.half_length !== 0;
    const only_hold_self = dht_arc.half_length === 1 && dht_arc.half_length === location;
    const dist_as_array_length = shortest_arc_distance(dht_arc.center_loc, location) + 1;
    const within_range = dht_arc.half_length > 1 && dist_as_array_length <= dht_arc.half_length;
    return do_hold_something && (only_hold_self || within_range);
}

var ValidationStatus;
(function (ValidationStatus) {
    ValidationStatus[ValidationStatus["Valid"] = 0] = "Valid";
    ValidationStatus[ValidationStatus["Rejected"] = 1] = "Rejected";
    ValidationStatus[ValidationStatus["Abandoned"] = 2] = "Abandoned";
})(ValidationStatus || (ValidationStatus = {}));
var ValidationLimboStatus;
(function (ValidationLimboStatus) {
    ValidationLimboStatus[ValidationLimboStatus["Pending"] = 0] = "Pending";
    ValidationLimboStatus[ValidationLimboStatus["AwaitingSysDeps"] = 1] = "AwaitingSysDeps";
    ValidationLimboStatus[ValidationLimboStatus["SysValidated"] = 2] = "SysValidated";
    ValidationLimboStatus[ValidationLimboStatus["AwaitingAppDeps"] = 3] = "AwaitingAppDeps";
})(ValidationLimboStatus || (ValidationLimboStatus = {}));
function query_dht_ops(integratedDHTOps, from, to, dht_arc) {
    const isDhtOpsInFilter = ([dhtOpHash, dhtOpValue]) => {
        if (from && dhtOpValue.when_integrated < from)
            return false;
        if (to && dhtOpValue.when_integrated > to)
            return false;
        if (dht_arc && !contains(dht_arc, location(dhtOpHash)))
            return false;
    };
    const ops = Object.entries(integratedDHTOps).filter(isDhtOpsInFilter);
    return ops.map(op => op[0]);
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain_cascade/src/authority.rs
class Authority {
    constructor(state, p2p) {
        this.state = state;
        this.p2p = p2p;
    }
    handle_get_entry(entry_hash, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = this.state.CAS[entry_hash];
            if (!entry)
                return undefined;
            const allHeaders = getHeadersForEntry(this.state, entry_hash);
            const entryDetails = getEntryDetails(this.state, entry_hash);
            const createHeader = allHeaders.find(header => header.header.content.entry_type);
            let entry_type = undefined;
            if (createHeader)
                entry_type = createHeader.header.content.entry_type;
            return {
                entry,
                entry_type: entry_type,
                deletes: entryDetails.deletes,
                updates: entryDetails.updates,
                live_headers: entryDetails.headers,
            };
        });
    }
    handle_get_element(header_hash, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state.metadata.misc_meta[header_hash] !== 'StoreElement') {
                return undefined;
            }
            const header = this.state.CAS[header_hash];
            let maybe_entry = undefined;
            let validation_status = ValidationStatus.Valid;
            if (header) {
                if (header.header.content.entry_hash) {
                    const entryHash = header.header
                        .content.entry_hash;
                    maybe_entry = this.state.CAS[entryHash];
                }
            }
            else {
                validation_status = ValidationStatus.Rejected;
            }
            const modifiers = getHeaderModifiers(this.state, header_hash);
            return {
                deletes: modifiers.deletes,
                updates: modifiers.updates,
                signed_header: header,
                validation_status,
                maybe_entry,
            };
        });
    }
    handle_get_links(base_address, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return getLinksForEntry(this.state, base_address);
        });
    }
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain_cascade/src/lib.rs#L1523
// TODO: refactor Cascade when sqlite gets merged
class Cascade {
    constructor(state, p2p) {
        this.state = state;
        this.p2p = p2p;
    }
    // TODO refactor when sqlite gets merged
    retrieve_header(hash, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (getHashType(hash) !== HashType.HEADER)
                throw new Error(`Trying to retrieve a header with a hash of another type`);
            const isPresent = this.state.CAS[hash];
            // TODO only return local if GetOptions::content() is given
            if (isPresent && options.strategy === GetStrategy.Contents) {
                const signed_header = this.state.CAS[hash];
                return signed_header;
            }
            const result = yield this.p2p.get(hash, options);
            if (result && result.signed_header) {
                return result.signed_header;
            }
            else
                return undefined;
        });
    }
    retrieve_entry(hash, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashType = getHashType(hash);
            if (hashType !== HashType.ENTRY && hashType !== HashType.AGENT)
                throw new Error(`Trying to retrieve a entry with a hash of another type`);
            const isPresent = this.state.CAS[hash];
            if (isPresent && options.strategy === GetStrategy.Contents) {
                const entry = this.state.CAS[hash];
                return entry;
            }
            const result = yield this.p2p.get(hash, options);
            if (result && result.entry) {
                return result.entry;
            }
            else
                return undefined;
        });
    }
    dht_get(hash, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO rrDHT arcs
            new Authority(this.state, this.p2p);
            const isPresent = this.state.CAS[hash];
            // TODO only return local if GetOptions::content() is given
            if (isPresent && options.strategy === GetStrategy.Contents) {
                const hashType = getHashType(hash);
                if (hashType === HashType.ENTRY) {
                    const entry = this.state.CAS[hash];
                    const signed_header = Object.values(this.state.CAS).find(header => header.header &&
                        header.header.content
                            .entry_hash === hash);
                    return {
                        entry,
                        signed_header,
                    };
                }
                if (hashType === HashType.HEADER) {
                    const signed_header = this.state.CAS[hash];
                    const entry = this.state.CAS[signed_header.header.content
                        .entry_hash];
                    return {
                        entry,
                        signed_header,
                    };
                }
            }
            const result = yield this.p2p.get(hash, options);
            if (!result)
                return undefined;
            if (result.signed_header) {
                return {
                    entry: result.maybe_entry,
                    signed_header: result.signed_header,
                };
            }
            else {
                return {
                    signed_header: result.live_headers[0],
                    entry: result.entry,
                };
            }
        });
    }
    dht_get_details(hash, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (getHashType(hash) === HashType.ENTRY) {
                const entryDetails = yield this.getEntryDetails(hash, options);
                if (!entryDetails)
                    return undefined;
                return {
                    type: DetailsType.Entry,
                    content: entryDetails,
                };
            }
            else if (getHashType(hash) === HashType.HEADER) {
                const elementDetails = yield this.getHeaderDetails(hash, options);
                if (!elementDetails)
                    return undefined;
                return {
                    type: DetailsType.Element,
                    content: elementDetails,
                };
            }
            return undefined;
        });
    }
    dht_get_links(base_address, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: check if we are an authority
            const linksResponses = yield this.p2p.get_links(base_address, options);
            return getLiveLinks(linksResponses);
        });
    }
    getEntryDetails(entryHash, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: check if we are an authority
            const result = yield this.p2p.get(entryHash, options);
            if (!result)
                return undefined;
            if (result.live_headers === undefined)
                throw new Error('Unreachable');
            const getEntryFull = result;
            const allHeaders = [
                ...getEntryFull.deletes,
                ...getEntryFull.updates,
                ...getEntryFull.live_headers,
            ];
            const { rejected_headers, entry_dht_status } = computeDhtStatus(allHeaders);
            return {
                entry: getEntryFull.entry,
                headers: getEntryFull.live_headers,
                deletes: getEntryFull.deletes,
                updates: getEntryFull.updates,
                rejected_headers,
                entry_dht_status,
            };
        });
    }
    getHeaderDetails(headerHash, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.p2p.get(headerHash, options);
            if (!result)
                return undefined;
            if (result.validation_status === undefined)
                throw new Error('Unreachable');
            const response = result;
            const element = {
                entry: response.maybe_entry,
                signed_header: response.signed_header,
            };
            return {
                element,
                deletes: response.deletes,
                updates: response.updates,
                validation_status: response.validation_status,
            };
        });
    }
}

const putValidationLimboValue = (dhtOpHash, validationLimboValue) => (state) => {
    state.validationLimbo[dhtOpHash] = validationLimboValue;
};
const putValidationReceipt = (dhtOpHash, validationReceipt) => (state) => {
    if (!state.validationReceipts[dhtOpHash])
        state.validationReceipts[dhtOpHash] = {};
    state.validationReceipts[dhtOpHash][validationReceipt.validator] = validationReceipt;
};
const deleteValidationLimboValue = (dhtOpHash) => (state) => {
    delete state.validationLimbo[dhtOpHash];
};
const putIntegrationLimboValue = (dhtOpHash, integrationLimboValue) => (state) => {
    state.integrationLimbo[dhtOpHash] = integrationLimboValue;
};
const putDhtOpData = (dhtOp) => (state) => {
    const headerHash = dhtOp.header.header.hash;
    state.CAS[headerHash] = dhtOp.header;
    const entry = getEntry(dhtOp);
    if (entry) {
        state.CAS[dhtOp.header.header.content.entry_hash] = entry;
    }
};
const putDhtOpMetadata = (dhtOp) => (state) => {
    const headerHash = dhtOp.header.header.hash;
    if (dhtOp.type === DHTOpType.StoreElement) {
        state.metadata.misc_meta[headerHash] = 'StoreElement';
    }
    else if (dhtOp.type === DHTOpType.StoreEntry) {
        const entryHash = dhtOp.header.header.content.entry_hash;
        if (dhtOp.header.header.content.type === HeaderType.Update) {
            register_header_on_basis(headerHash, dhtOp.header)(state);
            register_header_on_basis(entryHash, dhtOp.header)(state);
        }
        register_header_on_basis(entryHash, dhtOp.header)(state);
        update_entry_dht_status(entryHash)(state);
    }
    else if (dhtOp.type === DHTOpType.RegisterAgentActivity) {
        state.metadata.misc_meta[headerHash] = {
            ChainItem: dhtOp.header.header.content.timestamp,
        };
        state.metadata.misc_meta[dhtOp.header.header.content.author] = {
            ChainStatus: ChainStatus.Valid,
        };
    }
    else if (dhtOp.type === DHTOpType.RegisterUpdatedContent ||
        dhtOp.type === DHTOpType.RegisterUpdatedElement) {
        register_header_on_basis(dhtOp.header.header.content.original_header_address, dhtOp.header)(state);
        register_header_on_basis(dhtOp.header.header.content.original_entry_address, dhtOp.header)(state);
        update_entry_dht_status(dhtOp.header.header.content.original_entry_address)(state);
    }
    else if (dhtOp.type === DHTOpType.RegisterDeletedBy ||
        dhtOp.type === DHTOpType.RegisterDeletedEntryHeader) {
        register_header_on_basis(dhtOp.header.header.content.deletes_address, dhtOp.header)(state);
        register_header_on_basis(dhtOp.header.header.content.deletes_entry_address, dhtOp.header)(state);
        update_entry_dht_status(dhtOp.header.header.content.deletes_entry_address)(state);
    }
    else if (dhtOp.type === DHTOpType.RegisterAddLink) {
        const key = {
            base: dhtOp.header.header.content.base_address,
            header_hash: headerHash,
            tag: dhtOp.header.header.content.tag,
            zome_id: dhtOp.header.header.content.zome_id,
        };
        const value = {
            link_add_hash: headerHash,
            tag: dhtOp.header.header.content.tag,
            target: dhtOp.header.header.content.target_address,
            timestamp: dhtOp.header.header.content.timestamp,
            zome_id: dhtOp.header.header.content.zome_id,
        };
        state.metadata.link_meta.push({ key, value });
    }
    else if (dhtOp.type === DHTOpType.RegisterRemoveLink) {
        const val = {
            DeleteLink: headerHash,
        };
        putSystemMetadata(dhtOp.header.header.content.link_add_address, val)(state);
    }
};
function is_header_alive(state, headerHash) {
    const dhtHeaders = state.metadata.system_meta[headerHash];
    if (dhtHeaders) {
        const isHeaderDeleted = !!dhtHeaders.find(metaVal => metaVal.Delete);
        return !isHeaderDeleted;
    }
    return true;
}
const update_entry_dht_status = (entryHash) => (state) => {
    const headers = getHeadersForEntry(state, entryHash);
    const entryIsAlive = headers.some(header => is_header_alive(state, header.header.hash));
    state.metadata.misc_meta[entryHash] = {
        EntryStatus: entryIsAlive ? EntryDhtStatus.Live : EntryDhtStatus.Dead,
    };
};
const register_header_on_basis = (basis, header) => (state) => {
    let value;
    const headerType = header.header.content.type;
    if (headerType === HeaderType.Create) {
        value = { NewEntry: header.header.hash };
    }
    else if (headerType === HeaderType.Update) {
        value = { Update: header.header.hash };
    }
    else if (headerType === HeaderType.Delete) {
        value = { Delete: header.header.hash };
    }
    if (value) {
        putSystemMetadata(basis, value)(state);
    }
};
const putSystemMetadata = (basis, value) => (state) => {
    if (!state.metadata.system_meta[basis]) {
        state.metadata.system_meta[basis] = [];
    }
    if (!state.metadata.system_meta[basis].find(v => isEqual(v, value))) {
        state.metadata.system_meta[basis].push(value);
    }
};
const putDhtOpToIntegrated = (dhtOpHash, integratedValue) => (state) => {
    state.integratedDHTOps[dhtOpHash] = integratedValue;
};

/**
 * Returns the header hashes which don't have their DHTOps in the authoredDHTOps DB
 */
function getNewHeaders(state) {
    const dhtOps = Object.values(state.authoredDHTOps);
    const headerHashesAlreadyPublished = dhtOps.map(dhtOp => dhtOp.op.header.header.hash);
    return state.sourceChain.filter(headerHash => !headerHashesAlreadyPublished.includes(headerHash));
}
function getAllAuthoredHeaders(state) {
    return state.sourceChain.map(headerHash => state.CAS[headerHash]);
}
function getSourceChainElements(state, fromIndex, toIndex) {
    const elements = [];
    for (let i = fromIndex; i < toIndex; i++) {
        const element = getSourceChainElement(state, i);
        if (element)
            elements.push(element);
    }
    return elements;
}
function getSourceChainElement(state, index) {
    const headerHash = state.sourceChain[index];
    const signed_header = state.CAS[headerHash];
    let entry = undefined;
    const entryHash = signed_header.header.content.entry_hash;
    if (entryHash) {
        entry = state.CAS[entryHash];
    }
    return {
        entry,
        signed_header,
    };
}

function hashEntry(entry) {
    if (entry.entry_type === 'Agent')
        return entry.content;
    return hash(entry.content, HashType.ENTRY);
}
function getAppEntryType(entryType) {
    if (entryType.App)
        return entryType.App;
    return undefined;
}
function getEntryTypeString(cell, entryType) {
    const appEntryType = getAppEntryType(entryType);
    if (appEntryType) {
        const dna = cell.getSimulatedDna();
        return dna.zomes[appEntryType.zome_id].entry_defs[appEntryType.id].id;
    }
    return entryType;
}
function getDHTOpBasis(dhtOp) {
    switch (dhtOp.type) {
        case DHTOpType.StoreElement:
            return dhtOp.header.header.hash;
        case DHTOpType.StoreEntry:
            return dhtOp.header.header.content.entry_hash;
        case DHTOpType.RegisterUpdatedContent:
            return dhtOp.header.header.content.original_entry_address;
        case DHTOpType.RegisterUpdatedElement:
            return dhtOp.header.header.content.original_header_address;
        case DHTOpType.RegisterAgentActivity:
            return dhtOp.header.header.content.author;
        case DHTOpType.RegisterAddLink:
            return dhtOp.header.header.content.base_address;
        case DHTOpType.RegisterRemoveLink:
            return dhtOp.header.header.content.base_address;
        case DHTOpType.RegisterDeletedBy:
            return dhtOp.header.header.content.deletes_address;
        case DHTOpType.RegisterDeletedEntryHeader:
            return dhtOp.header.header.content.deletes_entry_address;
        default:
            return undefined;
    }
}

const putElement = (element) => (state) => {
    // Put header in CAS
    const headerHash = element.signed_header.header.hash;
    state.CAS[headerHash] = element.signed_header;
    // Put entry in CAS if it exist
    if (element.entry) {
        const entryHash = hashEntry(element.entry);
        state.CAS[entryHash] = element.entry;
    }
    state.sourceChain.push(headerHash);
};

function getTipOfChain(cellState) {
    return cellState.sourceChain[cellState.sourceChain.length - 1];
}
function getAuthor(cellState) {
    return getHeaderAt(cellState, 0).header.content.author;
}
function getDnaHash(state) {
    const firstHeaderHash = state.sourceChain[state.sourceChain.length - 1];
    const dna = state.CAS[firstHeaderHash];
    return dna.header.content.hash;
}
function getHeaderAt(cellState, index) {
    const headerHash = cellState.sourceChain[index];
    return cellState.CAS[headerHash];
}
function getNextHeaderSeq(cellState) {
    return cellState.sourceChain.length;
}
function getElement(state, headerHash) {
    const signed_header = state.CAS[headerHash];
    let entry;
    if (signed_header.header.content.type == HeaderType.Create ||
        signed_header.header.content.type == HeaderType.Update) {
        entry = state.CAS[signed_header.header.content.entry_hash];
    }
    return { signed_header, entry };
}
function getCellId(state) {
    const author = getAuthor(state);
    const dna = getDnaHash(state);
    return [dna, author];
}
function getNonPublishedDhtOps(state) {
    const nonPublishedDhtOps = {};
    for (const dhtOpHash of Object.keys(state.authoredDHTOps)) {
        const authoredValue = state.authoredDHTOps[dhtOpHash];
        if (authoredValue.last_publish_time === undefined) {
            nonPublishedDhtOps[dhtOpHash] = authoredValue.op;
        }
    }
    return nonPublishedDhtOps;
}
function valid_cap_grant(state, zome, fnName, provenance, secret) {
    if (provenance === getCellId(state)[1])
        return true;
    const aliveCapGrantsHeaders = {};
    const allHeaders = getAllAuthoredHeaders(state);
    for (const header of allHeaders) {
        if (isCapGrant(header)) {
            aliveCapGrantsHeaders[header.header.hash] = header;
        }
    }
    for (const header of allHeaders) {
        const headerContent = header.header.content;
        if (headerContent.original_header_address &&
            aliveCapGrantsHeaders[headerContent.original_header_address]) {
            delete aliveCapGrantsHeaders[headerContent.original_header_address];
        }
        if (headerContent.deletes_address &&
            aliveCapGrantsHeaders[headerContent.deletes_address]) {
            delete aliveCapGrantsHeaders[headerContent.deletes_address];
        }
    }
    const aliveCapGrants = Object.values(aliveCapGrantsHeaders).map(headerHash => state.CAS[headerHash.header.content.entry_hash].content);
    return !!aliveCapGrants.find(capGrant => isCapGrantValid(capGrant, zome, fnName, provenance, secret));
}
function isCapGrantValid(capGrant, zome, fnName, check_agent, check_secret) {
    if (!capGrant.functions.find(fn => fn.fn_name === fnName && fn.zome === zome))
        return false;
    if (capGrant.access === 'Unrestricted')
        return true;
    else if (capGrant.access.Assigned) {
        return capGrant.access.Assigned.assignees.includes(check_agent);
    }
    else {
        return (capGrant.access.Transferable.secret === check_secret);
    }
}
function isCapGrant(header) {
    const content = header.header.content;
    return !!(content.entry_hash &&
        content.entry_type === 'CapGrant');
}

function buildShh(header) {
    return {
        header: {
            content: header,
            hash: hash(header, HashType.HEADER),
        },
        signature: Uint8Array.from([]),
    };
}
function buildDna(dnaHash, agentId) {
    const dna = {
        author: agentId,
        hash: dnaHash,
        timestamp: now(),
        type: HeaderType.Dna,
    };
    return dna;
}
function buildAgentValidationPkg(state, membrane_proof) {
    const pkg = Object.assign(Object.assign({}, buildCommon(state)), { membrane_proof, type: HeaderType.AgentValidationPkg });
    return pkg;
}
function buildCreate(state, entry, entry_type) {
    const entry_hash = hashEntry(entry);
    const create = Object.assign(Object.assign({}, buildCommon(state)), { entry_hash,
        entry_type, type: HeaderType.Create });
    return create;
}
function buildCreateLink(state, zome_id, base, target, tag) {
    const create_link = Object.assign(Object.assign({}, buildCommon(state)), { base_address: base, target_address: target, tag,
        zome_id, type: HeaderType.CreateLink });
    return create_link;
}
function buildUpdate(state, entry, entry_type, original_entry_address, original_header_address) {
    const entry_hash = hashEntry(entry);
    const update = Object.assign(Object.assign({}, buildCommon(state)), { entry_hash,
        entry_type,
        original_entry_address,
        original_header_address, type: HeaderType.Update });
    return update;
}
function buildDelete(state, deletes_address, deletes_entry_address) {
    const deleteHeader = Object.assign(Object.assign({}, buildCommon(state)), { type: HeaderType.Delete, deletes_address,
        deletes_entry_address });
    return deleteHeader;
}
function buildDeleteLink(state, base_address, link_add_address) {
    const deleteHeader = Object.assign(Object.assign({}, buildCommon(state)), { type: HeaderType.DeleteLink, base_address,
        link_add_address });
    return deleteHeader;
}
/** Helpers */
function buildCommon(state) {
    const author = getAuthor(state);
    const header_seq = getNextHeaderSeq(state);
    const prev_header = getTipOfChain(state);
    const timestamp = now();
    return {
        author,
        header_seq,
        prev_header,
        timestamp,
    };
}

var WorkflowType;
(function (WorkflowType) {
    WorkflowType["CALL_ZOME"] = "Call Zome Function";
    WorkflowType["SYS_VALIDATION"] = "System Validation";
    WorkflowType["PUBLISH_DHT_OPS"] = "Publish DHT Ops";
    WorkflowType["PRODUCE_DHT_OPS"] = "Produce DHT Ops";
    WorkflowType["APP_VALIDATION"] = "App Validation";
    WorkflowType["AGENT_VALIDATION"] = "Validate Agent";
    WorkflowType["INTEGRATE_DHT_OPS"] = "Integrate DHT Ops";
    WorkflowType["GENESIS"] = "Genesis";
    WorkflowType["INCOMING_DHT_OPS"] = "Incoming DHT Ops";
    WorkflowType["VALIDATION_RECEIPT"] = "Validation Receipt";
})(WorkflowType || (WorkflowType = {}));
function workflowPriority(workflowType) {
    switch (workflowType) {
        case WorkflowType.GENESIS:
            return 0;
        case WorkflowType.CALL_ZOME:
            return 1;
        default:
            return 10;
    }
}

function getClosestNeighbors(peers, targetHash, numNeighbors) {
    const sortedPeers = peers.sort((agentA, agentB) => {
        const distanceA = distance(agentA, targetHash);
        const distanceB = distance(agentB, targetHash);
        return distanceA - distanceB;
    });
    return sortedPeers.slice(0, numNeighbors);
}
function getFarthestNeighbors(peers, targetHash) {
    const sortedPeers = peers.sort((agentA, agentB) => {
        return (wrap(location(agentA) - location(targetHash)) -
            wrap(location(agentB) - location(targetHash)));
    });
    const index35 = Math.floor(sortedPeers.length * 0.35);
    const index50 = Math.floor(sortedPeers.length / 2);
    const index65 = Math.floor(sortedPeers.length * 0.65);
    const neighbors = [
        sortedPeers[index35],
        sortedPeers[index50],
        sortedPeers[index65],
    ].filter(n => !!n);
    return uniq(neighbors);
}
function getBadActions(state) {
    const badActions = [];
    for (const [dhtOpHash, receipts] of Object.entries(state.validationReceipts)) {
        const myReceipt = receipts[state.agentPubKey];
        if (myReceipt) {
            const dhtOp = state.integratedDHTOps[dhtOpHash].op;
            const badAction = {
                badAgents: [],
                op: dhtOp,
                receipts: Object.values(receipts),
            };
            if (myReceipt.validation_status === ValidationStatus$1.Rejected) {
                badAction.badAgents.push(dhtOp.header.header.content.author);
            }
            for (const [validatorAgent, receipt] of Object.entries(receipts)) {
                if (receipt.validation_status !== myReceipt.validation_status) {
                    badAction.badAgents.push(receipt.validator);
                }
            }
            if (badAction.badAgents.length > 0) {
                badActions.push(badAction);
            }
        }
    }
    return badActions;
}
function getBadAgents(state) {
    const actions = getBadActions(state);
    const badAgents = actions.reduce((acc, next) => [...acc, ...next.badAgents], []);
    return uniq(badAgents);
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/integrate_dht_ops_workflow.rs
const validation_receipt = (workspace) => __awaiter(void 0, void 0, void 0, function* () {
    const integratedOpsWithoutReceipt = getIntegratedDhtOpsWithoutReceipt(workspace.state);
    const pretendIsValid = workspace.badAgentConfig &&
        workspace.badAgentConfig.pretend_invalid_elements_are_valid;
    for (const [dhtOpHash, integratedValue] of Object.entries(integratedOpsWithoutReceipt)) {
        const receipt = {
            dht_op_hash: dhtOpHash,
            validation_status: pretendIsValid
                ? ValidationStatus.Valid
                : integratedValue.validation_status,
            validator: workspace.state.agentPubKey,
            when_integrated: now(),
        };
        putValidationReceipt(dhtOpHash, receipt)(workspace.state);
        const badAgents = getBadAgents(workspace.state);
        const beforeCount = workspace.state.badAgents.length;
        workspace.state.badAgents = uniq([
            ...workspace.state.badAgents,
            ...badAgents,
        ]);
        if (beforeCount !== badAgents.length) {
            workspace.p2p.syncNeighbors();
        }
        integratedValue.send_receipt = false;
    }
    return {
        result: undefined,
        triggers: [],
    };
});
function validation_receipt_task() {
    return {
        type: WorkflowType.VALIDATION_RECEIPT,
        details: undefined,
        task: worskpace => validation_receipt(worskpace),
    };
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/integrate_dht_ops_workflow.rs
const integrate_dht_ops = (worskpace) => __awaiter(void 0, void 0, void 0, function* () {
    const opsToIntegrate = pullAllIntegrationLimboDhtOps(worskpace.state);
    for (const dhtOpHash of Object.keys(opsToIntegrate)) {
        const integrationLimboValue = opsToIntegrate[dhtOpHash];
        const dhtOp = integrationLimboValue.op;
        if (integrationLimboValue.validation_status === ValidationStatus.Valid) {
            putDhtOpData(dhtOp)(worskpace.state);
            putDhtOpMetadata(dhtOp)(worskpace.state);
        }
        else if (integrationLimboValue.validation_status === ValidationStatus.Rejected) {
            putDhtOpData(dhtOp)(worskpace.state);
        }
        const value = {
            op: dhtOp,
            validation_status: integrationLimboValue.validation_status,
            when_integrated: Date.now(),
            send_receipt: integrationLimboValue.send_receipt
        };
        putDhtOpToIntegrated(dhtOpHash, value)(worskpace.state);
    }
    return {
        result: undefined,
        triggers: [validation_receipt_task()],
    };
});
function integrate_dht_ops_task() {
    return {
        type: WorkflowType.INTEGRATE_DHT_OPS,
        details: undefined,
        task: worskpace => integrate_dht_ops(worskpace),
    };
}

function common_create(worskpace, entry, entry_type) {
    const create = buildCreate(worskpace.state, entry, entry_type);
    const element = {
        signed_header: buildShh(create),
        entry,
    };
    putElement(element)(worskpace.state);
    return element.signed_header.header.hash;
}

// Creates a new Create header and its entry in the source chain
const create_cap_grant = (worskpace) => (cap_grant) => __awaiter(void 0, void 0, void 0, function* () {
    if (cap_grant.access.Assigned.assignees.find(a => !!a && typeof a !== 'string')) {
        throw new Error('Tried to assign a capability to an invalid agent');
    }
    const entry = { entry_type: 'CapGrant', content: cap_grant };
    return common_create(worskpace, entry, 'CapGrant');
});

// Creates a new Create header and its entry in the source chain
const create_entry = (workspace, zome_index) => (args) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = { entry_type: 'App', content: args.content };
    const entryDefIndex = workspace.dna.zomes[zome_index].entry_defs.findIndex(entry_def => entry_def.id === args.entry_def_id);
    if (entryDefIndex < 0) {
        throw new Error(`Given entry def id ${args.entry_def_id} does not exist in this zome`);
    }
    const entry_type = {
        App: {
            id: entryDefIndex,
            zome_id: zome_index,
            visibility: workspace.dna.zomes[zome_index].entry_defs[entryDefIndex].visibility,
        },
    };
    return common_create(workspace, entry, entry_type);
});

// Creates a new CreateLink header in the source chain
const create_link = (worskpace, zome_id) => (args) => __awaiter(void 0, void 0, void 0, function* () {
    const createLink = buildCreateLink(worskpace.state, zome_id, args.base, args.target, args.tag);
    const element = {
        signed_header: buildShh(createLink),
        entry: undefined,
    };
    putElement(element)(worskpace.state);
    return element.signed_header.header.hash;
});

function common_delete(worskpace, header_hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const headerToDelete = yield worskpace.cascade.retrieve_header(header_hash, {
            strategy: GetStrategy.Contents,
        });
        if (!headerToDelete)
            throw new Error('Could not find element to be deleted');
        const deletesEntryAddress = headerToDelete.header.content
            .entry_hash;
        if (!deletesEntryAddress)
            throw new Error(`Trying to delete an element with no entry`);
        const deleteHeader = buildDelete(worskpace.state, header_hash, deletesEntryAddress);
        const element = {
            signed_header: buildShh(deleteHeader),
            entry: undefined,
        };
        putElement(element)(worskpace.state);
        return element.signed_header.header.hash;
    });
}

// Creates a new Create header and its entry in the source chain
const delete_cap_grant = (worskpace) => (deletes_address) => __awaiter(void 0, void 0, void 0, function* () {
    return common_delete(worskpace, deletes_address);
});

// Creates a new Create header and its entry in the source chain
const delete_entry = (worskpace) => (deletes_address) => __awaiter(void 0, void 0, void 0, function* () {
    return common_delete(worskpace, deletes_address);
});

// Creates a new Create header and its entry in the source chain
const delete_link = (worskpace) => (deletes_address) => __awaiter(void 0, void 0, void 0, function* () {
    const elementToDelete = yield worskpace.cascade.dht_get(deletes_address, {
        strategy: GetStrategy.Contents,
    });
    if (!elementToDelete)
        throw new Error('Could not find element to be deleted');
    const baseAddress = elementToDelete.signed_header.header
        .content.base_address;
    if (!baseAddress)
        throw new Error('Header for the given hash is not a CreateLink header');
    const deleteHeader = buildDeleteLink(worskpace.state, baseAddress, deletes_address);
    const element = {
        signed_header: buildShh(deleteHeader),
        entry: undefined,
    };
    putElement(element)(worskpace.state);
    return element.signed_header.header.hash;
});

function common_update(worskpace, original_header_hash, entry, entry_type) {
    return __awaiter(this, void 0, void 0, function* () {
        const headerToUpdate = yield worskpace.cascade.retrieve_header(original_header_hash, {
            strategy: GetStrategy.Contents,
        });
        if (!headerToUpdate)
            throw new Error('Could not find element to be updated');
        const original_entry_hash = headerToUpdate.header.content
            .entry_hash;
        if (!original_entry_hash)
            throw new Error(`Trying to update an element with no entry`);
        const updateHeader = buildUpdate(worskpace.state, entry, entry_type, original_entry_hash, original_header_hash);
        const element = {
            signed_header: buildShh(updateHeader),
            entry,
        };
        putElement(element)(worskpace.state);
        return element.signed_header.header.hash;
    });
}

// Creates a new Create header and its entry in the source chain
const update_entry = (workspace, zome_index) => (original_header_address, newEntry) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = { entry_type: 'App', content: newEntry.content };
    const entryDefIndex = workspace.dna.zomes[zome_index].entry_defs.findIndex(entry_def => entry_def.id === newEntry.entry_def_id);
    if (entryDefIndex < 0) {
        throw new Error(`Given entry def id ${newEntry.entry_def_id} does not exist in this zome`);
    }
    const entry_type = {
        App: {
            id: entryDefIndex,
            zome_id: zome_index,
            visibility: workspace.dna.zomes[zome_index].entry_defs[entryDefIndex].visibility,
        },
    };
    return common_update(workspace, original_header_address, entry, entry_type);
});

// Creates a new Create header and its entry in the source chain
const agent_info = (worskpace) => () => __awaiter(void 0, void 0, void 0, function* () {
    const cellId = getCellId(worskpace.state);
    const agentPubKey = cellId[1];
    return {
        agent_initial_pubkey: agentPubKey,
        agent_latest_pubkey: agentPubKey,
    };
});

// Creates a new Create header and its entry in the source chain
const call_remote = (workspace) => (args) => __awaiter(void 0, void 0, void 0, function* () {
    return workspace.p2p.call_remote(args.agent, args.zome, args.fn_name, args.cap_secret, args.payload);
});

// Creates a new Create header and its entry in the source chain
const get = (workspace) => (hash, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!hash)
        throw new Error(`Cannot get with undefined hash`);
    options = options || { strategy: GetStrategy.Contents };
    return workspace.cascade.dht_get(hash, options);
});

// Creates a new Create header and its entry in the source chain
const get_details = (workspace) => (hash, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!hash)
        throw new Error(`Cannot get with undefined hash`);
    options = options || { strategy: GetStrategy.Contents };
    return workspace.cascade.dht_get_details(hash, options);
});

// Creates a new Create header and its entry in the source chain
const get_links = (workspace) => (base_address, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!base_address)
        throw new Error(`Cannot get with undefined hash`);
    options = options || { strategy: GetStrategy.Contents };
    return workspace.cascade.dht_get_links(base_address, options);
});

// Creates a new Create header and its entry in the source chain
const hash_entry = (worskpace) => (args) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = { entry_type: 'App', content: args.content };
    return hashEntry(entry);
});

// Creates a new Create header and its entry in the source chain
const query = (workspace) => (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const authoredHeaders = getAllAuthoredHeaders(workspace.state);
    return authoredHeaders.map(header => {
        let entry = undefined;
        if (header.header.content.entry_hash) {
            entry =
                workspace.state.CAS[header.header.content.entry_hash];
        }
        return {
            signed_header: header,
            entry,
        };
    });
});

const ensure = (hdk) => (path) => __awaiter(void 0, void 0, void 0, function* () {
    yield hdk.create_entry({
        content: path,
        entry_def_id: 'path',
    });
    const components = path.split('.');
    if (components.length > 1) {
        components.splice(components.length - 1, 1);
        const parent = components.join('.');
        yield ensure(hdk)(parent);
        const pathHash = yield hdk.hash_entry({ content: path });
        const parentHash = yield hdk.hash_entry({ content: parent });
        yield hdk.create_link({ base: parentHash, target: pathHash, tag: path });
    }
});

function buildValidationFunctionContext(workspace, zome_index) {
    return {
        hash_entry: hash_entry(),
        get: get(workspace),
        get_details: get_details(workspace),
        get_links: get_links(workspace),
    };
}
function buildZomeFunctionContext(workspace, zome_index) {
    const hdk = Object.assign(Object.assign({}, buildValidationFunctionContext(workspace)), { create_entry: create_entry(workspace, zome_index), delete_entry: delete_entry(workspace), update_entry: update_entry(workspace, zome_index), create_link: create_link(workspace, zome_index), delete_link: delete_link(workspace), create_cap_grant: create_cap_grant(workspace), delete_cap_grant: delete_cap_grant(workspace), call_remote: call_remote(workspace), agent_info: agent_info(workspace), query: query(workspace) });
    return Object.assign(Object.assign({}, hdk), { path: {
            ensure: ensure(hdk),
        } });
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/app_validation_workflow.rs
const app_validation = (workspace) => __awaiter(void 0, void 0, void 0, function* () {
    let integrateDhtOps = false;
    const pendingDhtOps = getValidationLimboDhtOps(workspace.state, [
        ValidationLimboStatus.SysValidated,
        ValidationLimboStatus.AwaitingAppDeps,
    ]);
    for (const dhtOpHash of Object.keys(pendingDhtOps)) {
        deleteValidationLimboValue(dhtOpHash)(workspace.state);
        const validationLimboValue = pendingDhtOps[dhtOpHash];
        // If we are a bad agent, we don't validate our stuff
        let outcome = { resolved: true, valid: true };
        if (shouldValidate(workspace.state.agentPubKey, validationLimboValue.op, workspace.badAgentConfig)) {
            outcome = yield validate_op(validationLimboValue.op, validationLimboValue.from_agent, workspace);
        }
        if (!outcome.resolved) {
            validationLimboValue.status = ValidationLimboStatus.AwaitingAppDeps;
        }
        else {
            const value = {
                op: validationLimboValue.op,
                validation_status: outcome.valid
                    ? ValidationStatus.Valid
                    : ValidationStatus.Rejected,
                send_receipt: outcome.valid ? validationLimboValue.send_receipt : true, // If value is invalid we always need to make a receipt
            };
            putIntegrationLimboValue(dhtOpHash, value)(workspace.state);
            integrateDhtOps = true;
        }
    }
    return {
        result: undefined,
        triggers: integrateDhtOps ? [integrate_dht_ops_task()] : [],
    };
});
function app_validation_task(agent = false) {
    return {
        type: agent ? WorkflowType.AGENT_VALIDATION : WorkflowType.APP_VALIDATION,
        details: undefined,
        task: worskpace => app_validation(worskpace),
    };
}
function shouldValidate(agentPubKey, dhtOp, badAgentConfig) {
    if (!badAgentConfig)
        return true;
    return dhtOp.header.header.content.author !== agentPubKey;
}
function validate_op(op, from_agent, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const element = dht_ops_to_element(op);
        const entry_type = element.signed_header.header.content
            .entry_type;
        if (entry_type === 'CapClaim' || entry_type === 'CapGrant')
            return {
                valid: true,
                resolved: true,
            };
        // TODO: implement validation package
        const maybeEntryDef = yield get_associated_entry_def(element, workspace.dna, workspace);
        if (maybeEntryDef && maybeEntryDef.depsHashes)
            return {
                resolved: false,
                depsHashes: maybeEntryDef.depsHashes,
            };
        const zomes_to_invoke = yield get_zomes_to_invoke(element, workspace);
        if (zomes_to_invoke && zomes_to_invoke.depsHashes)
            return {
                resolved: false,
                depsHashes: zomes_to_invoke.depsHashes,
            };
        const zomes = zomes_to_invoke;
        const header = element.signed_header.header.content;
        if (header.type === HeaderType.DeleteLink) {
            return run_delete_link_validation_callback(zomes[0], header, workspace);
        }
        else if (header.type === HeaderType.CreateLink) {
            const cascade = new Cascade(workspace.state, workspace.p2p);
            const maybeBaseEntry = yield cascade.retrieve_entry(header.base_address, {
                strategy: GetStrategy.Contents,
            });
            if (!maybeBaseEntry)
                return {
                    resolved: false,
                    depsHashes: [header.base_address],
                };
            const maybeTargetEntry = yield cascade.retrieve_entry(header.target_address, { strategy: GetStrategy.Contents });
            if (!maybeTargetEntry)
                return {
                    resolved: false,
                    depsHashes: [header.target_address],
                };
            return run_create_link_validation_callback(zomes[0], header, maybeBaseEntry, maybeTargetEntry, workspace);
        }
        else {
            return run_validation_callback_inner(zomes, element, maybeEntryDef, workspace);
        }
    });
}
function dht_ops_to_element(op) {
    const header = op.header;
    let entry = undefined;
    if (header.header.content.entry_hash) {
        entry = getEntry(op);
    }
    return {
        entry,
        signed_header: header,
    };
}
function run_validation_callback_direct(zome, dna, element, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const maybeEntryDef = yield get_associated_entry_def(element, dna, workspace);
        if (maybeEntryDef && maybeEntryDef.depsHashes)
            return {
                resolved: false,
                depsHashes: maybeEntryDef.depsHashes,
            };
        // TODO: implement validation package
        return run_validation_callback_inner([zome], element, maybeEntryDef, workspace);
    });
}
function get_associated_entry_def(element, dna, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const cascade = new Cascade(workspace.state, workspace.p2p);
        const maybeAppEntryType = yield get_app_entry_type(element, cascade);
        if (!maybeAppEntryType)
            return undefined;
        if (maybeAppEntryType.depsHashes)
            return maybeAppEntryType;
        const appEntryType = maybeAppEntryType;
        return dna.zomes[appEntryType.zome_id].entry_defs[appEntryType.id];
    });
}
function get_app_entry_type(element, cascade) {
    return __awaiter(this, void 0, void 0, function* () {
        if (element.signed_header.header.content.type === HeaderType.Delete)
            return get_app_entry_type_from_dep(element, cascade);
        const entryType = element.signed_header.header.content
            .entry_type;
        if (!entryType)
            return undefined;
        if (entryType === 'CapGrant' ||
            entryType === 'CapClaim' ||
            entryType === 'Agent')
            return undefined;
        return entryType.App;
    });
}
function get_app_entry_type_from_dep(element, cascade) {
    return __awaiter(this, void 0, void 0, function* () {
        if (element.signed_header.header.content.type !== HeaderType.Delete)
            return undefined;
        const deletedHeaderHash = element.signed_header.header.content.deletes_address;
        const header = yield cascade.retrieve_header(deletedHeaderHash, {
            strategy: GetStrategy.Contents,
        });
        if (!header)
            return { depsHashes: [deletedHeaderHash] };
        const entryType = header.header.content.entry_type;
        if (!entryType ||
            entryType === 'Agent' ||
            entryType === 'CapClaim' ||
            entryType === 'CapGrant')
            return undefined;
        return entryType.App;
    });
}
function get_zomes_to_invoke(element, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const cascade = new Cascade(workspace.state, workspace.p2p);
        const maybeAppEntryType = yield get_app_entry_type(element, cascade);
        if (maybeAppEntryType && maybeAppEntryType.depsHashes)
            return maybeAppEntryType;
        if (maybeAppEntryType) {
            // It's a newEntryHeader
            return [workspace.dna.zomes[maybeAppEntryType.zome_id]];
        }
        else {
            const header = element.signed_header.header.content;
            if (header.type === HeaderType.CreateLink) {
                return [workspace.dna.zomes[header.zome_id]];
            }
            else if (header.type === HeaderType.DeleteLink) {
                const maybeHeader = yield cascade.retrieve_header(header.link_add_address, { strategy: GetStrategy.Contents });
                if (!maybeHeader)
                    return {
                        depsHashes: [header.link_add_address],
                    };
                return [
                    workspace.dna.zomes[maybeHeader.header.content.zome_id],
                ];
            }
            return workspace.dna.zomes;
        }
    });
}
function run_validation_callback_inner(zomes_to_invoke, element, entry_def, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const fnsToCall = get_element_validate_functions_to_invoke(element, entry_def);
        return invoke_validation_fns(zomes_to_invoke, fnsToCall, { element }, workspace);
    });
}
function invoke_validation_fns(zomes_to_invoke, fnsToCall, payload, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const cascade = new Cascade(workspace.state, workspace.p2p);
        const hostFnWorkspace = {
            cascade,
            state: workspace.state,
            dna: workspace.dna,
            p2p: workspace.p2p,
        };
        for (const zome of zomes_to_invoke) {
            for (const validateFn of fnsToCall) {
                if (zome.validation_functions[validateFn]) {
                    const context = buildValidationFunctionContext(hostFnWorkspace, workspace.dna.zomes.findIndex(z => z === zome));
                    const outcome = yield zome.validation_functions[validateFn](context)(payload);
                    if (!outcome.resolved)
                        return outcome;
                    else if (!outcome.valid)
                        return outcome;
                }
            }
        }
        return { resolved: true, valid: true };
    });
}
function run_agent_validation_callback(workspace, elements) {
    return __awaiter(this, void 0, void 0, function* () {
        const create_agent_element = elements[2];
        const fnsToCall = ['validate_create_agent'];
        const zomes_to_invoke = yield get_zomes_to_invoke(create_agent_element, workspace);
        const membrane_proof = elements[1].signed_header.header
            .content.membrane_proof;
        return invoke_validation_fns(zomes_to_invoke, fnsToCall, {
            element: elements[2],
            membrane_proof,
            agent_pub_key: create_agent_element.signed_header.header.content.author,
        }, workspace);
    });
}
function run_create_link_validation_callback(zome, link_add, base, target, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const validateCreateLink = 'validate_create_link';
        if (zome.validation_functions[validateCreateLink]) {
            const hostFnWorkspace = {
                cascade: new Cascade(workspace.state, workspace.p2p),
                state: workspace.state,
                dna: workspace.dna,
                p2p: workspace.p2p,
            };
            const context = buildValidationFunctionContext(hostFnWorkspace, workspace.dna.zomes.findIndex(z => z === zome));
            const outcome = yield zome.validation_functions[validateCreateLink](context)({ link_add, base, target });
            return outcome;
        }
        return {
            resolved: true,
            valid: true,
        };
    });
}
function run_delete_link_validation_callback(zome, delete_link, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const validateCreateLink = 'validate_delete_link';
        if (zome.validation_functions[validateCreateLink]) {
            const hostFnWorkspace = {
                cascade: new Cascade(workspace.state, workspace.p2p),
                state: workspace.state,
                dna: workspace.dna,
                p2p: workspace.p2p,
            };
            const context = buildValidationFunctionContext(hostFnWorkspace, workspace.dna.zomes.findIndex(z => z === zome));
            const outcome = yield zome.validation_functions[validateCreateLink](context)({ delete_link });
            return outcome;
        }
        return {
            resolved: true,
            valid: true,
        };
    });
}
function get_element_validate_functions_to_invoke(element, maybeEntryDef) {
    const fnsComponents = ['validate'];
    const header = element.signed_header.header.content;
    if (header.type === HeaderType.Create)
        fnsComponents.push('create');
    if (header.type === HeaderType.Update)
        fnsComponents.push('update');
    if (header.type === HeaderType.Delete)
        fnsComponents.push('delete');
    const entry_type = header.entry_type;
    if (entry_type) {
        // if (entry_type === 'Agent') fnsComponents.push('agent');
        if (entry_type.App) {
            fnsComponents.push('entry');
            if (maybeEntryDef)
                fnsComponents.push(maybeEntryDef.id);
        }
    }
    return unpackValidateFnsComponents(fnsComponents);
}
function unpackValidateFnsComponents(fnsComponents) {
    const validateFunctions = [fnsComponents[0]];
    for (let i = 1; i < fnsComponents.length; i++) {
        validateFunctions.push(`${validateFunctions[i - 1]}_${fnsComponents[i]}`);
    }
    return validateFunctions;
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/publish_dht_ops_workflow.rs
const publish_dht_ops = (workspace) => __awaiter(void 0, void 0, void 0, function* () {
    const dhtOps = getNonPublishedDhtOps(workspace.state);
    const dhtOpsByBasis = {};
    for (const dhtOpHash of Object.keys(dhtOps)) {
        const dhtOp = dhtOps[dhtOpHash];
        const basis = getDHTOpBasis(dhtOp);
        if (!dhtOpsByBasis[basis])
            dhtOpsByBasis[basis] = {};
        dhtOpsByBasis[basis][dhtOpHash] = dhtOp;
    }
    const promises = Object.entries(dhtOpsByBasis).map(([basis, dhtOps]) => __awaiter(void 0, void 0, void 0, function* () {
        // Publish the operations
        yield workspace.p2p.publish(basis, dhtOps);
        for (const dhtOpHash of Object.keys(dhtOps)) {
            workspace.state.authoredDHTOps[dhtOpHash].last_publish_time = Date.now();
        }
    }));
    yield Promise.all(promises);
    return {
        result: undefined,
        triggers: [],
    };
});
function publish_dht_ops_task() {
    return {
        type: WorkflowType.PUBLISH_DHT_OPS,
        details: undefined,
        task: worskpace => publish_dht_ops(worskpace),
    };
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/produce_dht_ops_workflow.rs
const produce_dht_ops = (worskpace) => __awaiter(void 0, void 0, void 0, function* () {
    const newHeaderHashes = getNewHeaders(worskpace.state);
    for (const newHeaderHash of newHeaderHashes) {
        const element = getElement(worskpace.state, newHeaderHash);
        const dhtOps = elementToDHTOps(element);
        for (const dhtOp of dhtOps) {
            const dhtOpHash = hash(dhtOp, HashType.DHTOP);
            const dhtOpValue = {
                op: dhtOp,
                last_publish_time: undefined,
                receipt_count: 0,
            };
            worskpace.state.authoredDHTOps[dhtOpHash] = dhtOpValue;
        }
    }
    return {
        result: undefined,
        triggers: [publish_dht_ops_task()],
    };
});
function produce_dht_ops_task() {
    return {
        type: WorkflowType.PRODUCE_DHT_OPS,
        details: undefined,
        task: worskpace => produce_dht_ops(worskpace),
    };
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/sys_validate.rs
/// Verify the signature for this header
function verify_header_signature(sig, header) {
    return __awaiter(this, void 0, void 0, function* () {
        return true; // TODO: actually implement signatures
    });
}
/// Verify the author key was valid at the time
/// of signing with dpki
/// TODO: This is just a stub until we have dpki.
function author_key_is_valid(author) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
function check_prev_header(header) {
    if (header.type === HeaderType.Dna)
        return;
    if (header.header_seq <= 0)
        throw new Error(`Non-Dna Header contains a 0 or less header_seq`);
    if (!header.prev_header)
        throw new Error(`Non-Dna Header doesn't contain a reference to the previous header`);
}
function check_prev_timestamp(header, prev_header) {
    const tsToMillis = (t) => t[0] * 1000000 + t[1];
    if (tsToMillis(header.timestamp) <= tsToMillis(prev_header.timestamp)) ;
}
function check_prev_seq(header, prev_header) {
    const prev_seq = prev_header.header_seq
        ? prev_header.header_seq
        : 0;
    if (!(header.header_seq > 0 &&
        header.header_seq === prev_seq + 1))
        throw new Error(`Immediate following header must have as header_seq the previous one +1`);
}
function check_entry_type(entry_type, entry) {
    if (entry_type === 'Agent' && entry.entry_type === 'Agent')
        return;
    if (entry_type === 'CapClaim' && entry.entry_type === 'CapClaim')
        return;
    if (entry_type === 'CapGrant' && entry.entry_type === 'CapGrant')
        return;
    if (entry_type.App && entry.entry_type === 'App')
        return;
    throw new Error(`Entry types don't match`);
}
function check_app_entry_type(entry_type, simulated_dna) {
    const zome_index = entry_type.zome_id;
    const entry_index = entry_type.id;
    const zome = simulated_dna.zomes[zome_index];
    if (!zome)
        throw new Error(`Trying to validate an entry for a non existent zome`);
    const entry_def = zome.entry_defs[entry_index];
    if (!entry_def)
        throw new Error(`Trying to validate an entry which does not have any entry definition`);
    if (entry_def.visibility !== entry_type.visibility)
        throw new Error(`Trying to validate an entry with visibility not matching its definition`);
    return entry_def;
}
function check_not_private(entry_def) {
    if (entry_def.visibility === 'Private')
        throw new Error(`Trying to validate as public a private entry type`);
}
function check_entry_hash(hash, entry) {
    if (hashEntry(entry) !== hash)
        throw new Error(`Entry hash is invalid`);
}
function check_new_entry_header(header) {
    if (!(header.type === HeaderType.Create || header.type === HeaderType.Update))
        throw new Error(`A header refering a new entry is not of type Create or Update`);
}
const MAX_ENTRY_SIZE = 16 * 1000 * 1000;
function check_entry_size(entry) {
    if (JSON.stringify(entry.content).length > MAX_ENTRY_SIZE)
        throw new Error(`Entry size exceeds the MAX_ENTRY_SIZE`);
}
function check_update_reference(update, original_entry_header) {
    if (JSON.stringify(update.entry_type) !==
        JSON.stringify(original_entry_header.entry_type))
        throw new Error(`An entry must be updated to the same entry type`);
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/sys_validation_workflow.rs
const sys_validation = (worskpace) => __awaiter(void 0, void 0, void 0, function* () {
    const pendingDhtOps = getValidationLimboDhtOps(worskpace.state, [
        ValidationLimboStatus.Pending,
        ValidationLimboStatus.AwaitingSysDeps,
    ]);
    // TODO: actually validate
    for (const dhtOpHash of Object.keys(pendingDhtOps)) {
        const limboValue = pendingDhtOps[dhtOpHash];
        limboValue.status = ValidationLimboStatus.SysValidated;
        putValidationLimboValue(dhtOpHash, limboValue)(worskpace.state);
    }
    return {
        result: undefined,
        triggers: [app_validation_task()],
    };
});
function sys_validation_task() {
    return {
        type: WorkflowType.SYS_VALIDATION,
        details: undefined,
        task: worskpace => sys_validation(worskpace),
    };
}
function sys_validate_element(element, workspace, network) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isNotCounterfeit = yield counterfeit_check(element.signed_header.signature, element.signed_header.header.content);
            if (!isNotCounterfeit)
                throw new Error(`Trying to validate counterfeited element`);
        }
        catch (e) {
            throw new Error(`Trying to validate counterfeited element`);
        }
        let maybeDepsMissing = yield store_element(element.signed_header.header.content, workspace);
        if (maybeDepsMissing)
            return maybeDepsMissing;
        const entry_type = element.signed_header.header.content
            .entry_type;
        if (element.entry &&
            entry_type.App &&
            entry_type.App.visibility === 'Public') {
            maybeDepsMissing = yield store_entry(element.signed_header.header.content, element.entry, workspace);
            if (maybeDepsMissing)
                return maybeDepsMissing;
        }
        // TODO: implement register_* when cache is in place
    });
}
/// Check if the op has valid signature and author.
/// Ops that fail this check should be dropped.
function counterfeit_check(signature, header) {
    return __awaiter(this, void 0, void 0, function* () {
        return ((yield verify_header_signature()) &&
            (yield author_key_is_valid(header.author)));
    });
}
function store_element(header, workspace, network) {
    return __awaiter(this, void 0, void 0, function* () {
        check_prev_header(header);
        const prev_header_hash = header.prev_header;
        if (prev_header_hash) {
            const prev_header = yield new Cascade(workspace.state, workspace.p2p).retrieve_header(prev_header_hash, {
                strategy: GetStrategy.Contents,
            });
            if (!prev_header)
                return {
                    depsHashes: [prev_header_hash],
                };
            check_prev_timestamp(header, prev_header.header.content);
            check_prev_seq(header, prev_header.header.content);
        }
    });
}
function store_entry(header, entry, workspace, network) {
    return __awaiter(this, void 0, void 0, function* () {
        check_entry_type(header.entry_type, entry);
        const appEntryType = header.entry_type.App;
        if (appEntryType) {
            const entry_def = check_app_entry_type(appEntryType, workspace.dna);
            check_not_private(entry_def);
        }
        check_entry_hash(header.entry_hash, entry);
        check_entry_size(entry);
        if (header.type === HeaderType.Update) {
            const signed_header = yield new Cascade(workspace.state, workspace.p2p).retrieve_header(header.original_header_address, {
                strategy: GetStrategy.Contents,
            });
            if (!signed_header) {
                return {
                    depsHashes: [header.original_header_address],
                };
            }
            update_check(header, signed_header.header.content);
        }
    });
}
function update_check(entry_update, original_header) {
    check_new_entry_header(original_header);
    if (!original_header.entry_type)
        throw new Error(`Trying to update a header that didn't create any entry`);
    check_update_reference(entry_update, original_header);
}

/**
 * Calls the zome function of the cell DNA
 * This can only be called in the simulated mode: we can assume that cell.simulatedDna exists
 */
const callZomeFn = (zomeName, fnName, payload, provenance, cap) => (workspace) => __awaiter(void 0, void 0, void 0, function* () {
    if (!valid_cap_grant(workspace.state, zomeName, fnName, provenance, cap))
        throw new Error('Unauthorized Zome Call');
    const currentHeader = getTipOfChain(workspace.state);
    const chain_head_start_len = workspace.state.sourceChain.length;
    const zomeIndex = workspace.dna.zomes.findIndex(zome => zome.name === zomeName);
    if (zomeIndex < 0)
        throw new Error(`There is no zome with the name ${zomeName} in this DNA`);
    const zome = workspace.dna.zomes[zomeIndex];
    if (!zome.zome_functions[fnName])
        throw new Error(`There isn't a function with the name ${fnName} in this zome with the name ${zomeName}`);
    const contextState = cloneDeep(workspace.state);
    const hostFnWorkspace = {
        cascade: new Cascade(workspace.state, workspace.p2p),
        state: contextState,
        dna: workspace.dna,
        p2p: workspace.p2p,
    };
    const zomeFnContext = buildZomeFunctionContext(hostFnWorkspace, zomeIndex);
    const result = yield zome.zome_functions[fnName].call(zomeFnContext)(payload);
    let triggers = [];
    if (getTipOfChain(contextState) !== currentHeader) {
        // Do validation
        let i = chain_head_start_len;
        const elementsToAppValidate = [];
        while (i < contextState.sourceChain.length) {
            const headerHash = contextState.sourceChain[i];
            const signed_header = contextState.CAS[headerHash];
            const entry_hash = signed_header.header.content
                .entry_hash;
            const element = {
                entry: entry_hash ? contextState.CAS[entry_hash] : undefined,
                signed_header,
            };
            const depsMissing = yield sys_validate_element(element, Object.assign(Object.assign({}, workspace), { state: contextState }), workspace.p2p);
            if (depsMissing)
                throw new Error(`Could not validate a new element due to missing dependencies`);
            elementsToAppValidate.push(element);
            i++;
        }
        if (shouldValidateBeforePublishing(workspace.badAgentConfig)) {
            for (const element of elementsToAppValidate) {
                const outcome = yield run_app_validation(zome, element, contextState, workspace);
                if (!outcome.resolved)
                    throw new Error('Error creating a new element: missing dependencies');
                if (!outcome.valid)
                    throw new Error('Error creating a new element: invalid');
            }
        }
        triggers.push(produce_dht_ops_task());
    }
    workspace.state.CAS = contextState.CAS;
    workspace.state.sourceChain = contextState.sourceChain;
    return {
        result: cloneDeep(result),
        triggers,
    };
});
function call_zome_fn_workflow(zome, fnName, payload, provenance) {
    return {
        type: WorkflowType.CALL_ZOME,
        details: {
            fnName,
            payload,
            zome,
        },
        task: worskpace => callZomeFn(zome, fnName, payload, provenance, '')(worskpace),
    };
}
function shouldValidateBeforePublishing(badAgentConfig) {
    if (!badAgentConfig)
        return true;
    return !badAgentConfig.disable_validation_before_publish;
}
function run_app_validation(zome, element, contextState, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const header = element.signed_header.header.content;
        if (header.type === HeaderType.CreateLink) {
            const cascade = new Cascade(contextState, workspace.p2p);
            const baseEntry = yield cascade.retrieve_entry(header.base_address, {
                strategy: GetStrategy.Contents,
            });
            if (!baseEntry) {
                return {
                    resolved: false,
                    depsHashes: [header.base_address],
                };
            }
            const targetEntry = yield cascade.retrieve_entry(header.target_address, {
                strategy: GetStrategy.Contents,
            });
            if (!targetEntry) {
                return {
                    resolved: false,
                    depsHashes: [header.target_address],
                };
            }
            return run_create_link_validation_callback(zome, header, baseEntry, targetEntry, workspace);
        }
        else if (header.type === HeaderType.DeleteLink) {
            return run_delete_link_validation_callback(zome, header, workspace);
        }
        else if (header.type === HeaderType.Create ||
            header.type === HeaderType.Update ||
            header.type === HeaderType.Delete) {
            return run_validation_callback_direct(zome, workspace.dna, element, workspace);
        }
        return {
            valid: true,
            resolved: true,
        };
    });
}

const genesis = (agentId, dnaHash, membrane_proof) => (worskpace) => __awaiter(void 0, void 0, void 0, function* () {
    const dna = buildDna(dnaHash, agentId);
    putElement({ signed_header: buildShh(dna), entry: undefined })(worskpace.state);
    const pkg = buildAgentValidationPkg(worskpace.state, membrane_proof);
    putElement({ signed_header: buildShh(pkg), entry: undefined })(worskpace.state);
    const entry = {
        content: agentId,
        entry_type: 'Agent',
    };
    const create_agent_pub_key_entry = buildCreate(worskpace.state, entry, 'Agent');
    putElement({
        signed_header: buildShh(create_agent_pub_key_entry),
        entry: entry,
    })(worskpace.state);
    if (!(worskpace.badAgentConfig &&
        worskpace.badAgentConfig.disable_validation_before_publish)) {
        const firstElements = getSourceChainElements(worskpace.state, 0, 3);
        const result = yield run_agent_validation_callback(worskpace, firstElements);
        if (!result.resolved)
            throw new Error('Unresolved in agent validate?');
        else if (!result.valid)
            throw new Error('Agent is invalid in this Dna');
    }
    return {
        result: undefined,
        triggers: [produce_dht_ops_task()],
    };
});
function genesis_task(cellId, membrane_proof) {
    return {
        type: WorkflowType.GENESIS,
        details: {
            cellId,
            membrane_proof,
        },
        task: worskpace => genesis(cellId[1], cellId[0], membrane_proof)(worskpace),
    };
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/incoming_dht_ops_workflow.rs
const incoming_dht_ops = (dhtOps, request_validation_receipt, from_agent) => (workspace) => __awaiter(void 0, void 0, void 0, function* () {
    let sysValidate = false;
    for (const dhtOpHash of Object.keys(dhtOps)) {
        if (!hasDhtOpBeenProcessed(workspace.state, dhtOpHash)) {
            const dhtOp = dhtOps[dhtOpHash];
            const basis = getDHTOpBasis(dhtOp);
            const validationLimboValue = {
                basis,
                from_agent,
                last_try: undefined,
                num_tries: 0,
                op: dhtOp,
                status: ValidationLimboStatus.Pending,
                time_added: Date.now(),
                send_receipt: request_validation_receipt,
            };
            putValidationLimboValue(dhtOpHash, validationLimboValue)(workspace.state);
            sysValidate = true;
        }
    }
    return {
        result: undefined,
        triggers: sysValidate ? [sys_validation_task()] : [],
    };
});
function incoming_dht_ops_task(from_agent, request_validation_receipt, ops) {
    return {
        type: WorkflowType.INCOMING_DHT_OPS,
        details: {
            from_agent,
            ops,
        },
        task: worskpace => incoming_dht_ops(ops, request_validation_receipt, from_agent)(worskpace),
    };
}

function triggeredWorkflowFromType(type) {
    switch (type) {
        case WorkflowType.APP_VALIDATION:
            return app_validation_task();
        case WorkflowType.INTEGRATE_DHT_OPS:
            return integrate_dht_ops_task();
        case WorkflowType.PRODUCE_DHT_OPS:
            return produce_dht_ops_task();
        case WorkflowType.PUBLISH_DHT_OPS:
            return publish_dht_ops_task();
        case WorkflowType.SYS_VALIDATION:
            return sys_validation_task();
        case WorkflowType.VALIDATION_RECEIPT:
            return validation_receipt_task();
        default:
            throw new Error('Trying to trigger a workflow that cannot be triggered');
    }
}

class MiddlewareExecutor {
    constructor() {
        this._beforeMiddlewares = [];
        this._successMiddlewares = [];
        this._errorMiddlewares = [];
    }
    execute(task, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const middleware of this._beforeMiddlewares) {
                yield middleware(payload);
            }
            try {
                const result = yield task();
                for (const middleware of this._successMiddlewares) {
                    yield middleware(payload, result);
                }
                return result;
            }
            catch (e) {
                for (const middleware of this._errorMiddlewares) {
                    yield middleware(payload, e);
                }
                throw e;
            }
        });
    }
    before(callback) {
        return this._addListener(callback, this._beforeMiddlewares);
    }
    success(callback) {
        return this._addListener(callback, this._successMiddlewares);
    }
    error(callback) {
        return this._addListener(callback, this._errorMiddlewares);
    }
    _addListener(callback, middlewareList) {
        middlewareList.unshift(callback);
        return {
            unsubscribe: () => {
                const index = middlewareList.findIndex(c => c === callback);
                middlewareList.splice(index, 1);
            },
        };
    }
}

class Cell {
    constructor(_state, conductor) {
        this._state = _state;
        this.conductor = conductor;
        this._triggers = {
            [WorkflowType.INTEGRATE_DHT_OPS]: { running: false, triggered: true },
            [WorkflowType.PRODUCE_DHT_OPS]: { running: false, triggered: true },
            [WorkflowType.PUBLISH_DHT_OPS]: { running: false, triggered: true },
            [WorkflowType.SYS_VALIDATION]: { running: false, triggered: true },
            [WorkflowType.APP_VALIDATION]: { running: false, triggered: true },
            [WorkflowType.VALIDATION_RECEIPT]: { running: false, triggered: true },
        };
        this.workflowExecutor = new MiddlewareExecutor();
        // Let genesis be run before actually joining
    }
    get cellId() {
        return [this._state.dnaHash, this._state.agentPubKey];
    }
    get agentPubKey() {
        return this.cellId[1];
    }
    get dnaHash() {
        return this.cellId[0];
    }
    get p2p() {
        return this.conductor.network.p2pCells[this.cellId[0]][this.cellId[1]];
    }
    getState() {
        return cloneDeep(this._state);
    }
    getSimulatedDna() {
        return this.conductor.registeredDnas[this.dnaHash];
    }
    static create(conductor, cellId, membrane_proof) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCellState = {
                dnaHash: cellId[0],
                agentPubKey: cellId[1],
                CAS: {},
                integrationLimbo: {},
                metadata: {
                    link_meta: [],
                    misc_meta: {},
                    system_meta: {},
                },
                validationLimbo: {},
                integratedDHTOps: {},
                authoredDHTOps: {},
                validationReceipts: {},
                sourceChain: [],
                badAgents: [],
            };
            const cell = new Cell(newCellState, conductor);
            conductor.network.createP2pCell(cell);
            yield cell._runWorkflow(genesis_task(cellId, membrane_proof));
            yield cell.p2p.join(cell);
            return cell;
        });
    }
    /** Workflows */
    callZomeFn(args) {
        return this._runWorkflow(call_zome_fn_workflow(args.zome, args.fnName, args.payload, args.provenance));
    }
    /** Network handlers */
    // https://github.com/holochain/holochain/blob/develop/crates/holochain/src/conductor/cell.rs#L429
    handle_publish(from_agent, request_validation_receipt, ops) {
        return this._runWorkflow(incoming_dht_ops_task(from_agent, request_validation_receipt, ops));
    }
    handle_get(dht_hash, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const authority = new Authority(this._state, this.p2p);
            const hashType = getHashType(dht_hash);
            if (hashType === HashType.ENTRY || hashType === HashType.AGENT) {
                return authority.handle_get_entry(dht_hash, options);
            }
            else if (hashType === HashType.HEADER) {
                return authority.handle_get_element(dht_hash, options);
            }
            return undefined;
        });
    }
    handle_get_links(base_address, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const authority = new Authority(this._state, this.p2p);
            return authority.handle_get_links(base_address, options);
        });
    }
    handle_call_remote(from_agent, zome_name, fn_name, cap, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callZomeFn({
                zome: zome_name,
                cap: cap,
                fnName: fn_name,
                payload,
                provenance: from_agent,
            });
        });
    }
    /** Gossips */
    handle_fetch_op_hashes_for_constraints(dht_arc, since, until) {
        return query_dht_ops(this._state.integratedDHTOps, since, until, dht_arc);
    }
    handle_fetch_op_hash_data(op_hashes) {
        const result = {};
        for (const opHash of op_hashes) {
            const value = this._state.integratedDHTOps[opHash];
            if (value) {
                result[opHash] = value.op;
            }
        }
        return result;
    }
    handle_gossip_ops(op_hashes) {
        const result = {};
        for (const opHash of op_hashes) {
            const value = this._state.integratedDHTOps[opHash];
            if (value) {
                result[opHash] = value.op;
            }
        }
        return result;
    }
    handle_gossip(from_agent, gossip) {
        return __awaiter(this, void 0, void 0, function* () {
            const dhtOpsToProcess = {};
            for (const badAction of gossip.badActions) {
                const dhtOpHash = hash(badAction.op, HashType.DHTOP);
                if (!hasDhtOpBeenProcessed(this._state, dhtOpHash)) {
                    dhtOpsToProcess[dhtOpHash] = badAction.op;
                }
                for (const receipt of badAction.receipts) {
                    putValidationReceipt(dhtOpHash, receipt)(this._state);
                }
            }
            for (const [dhtOpHash, validatedOp] of Object.entries(gossip.validated_dht_ops)) {
                for (const receipt of validatedOp.validation_receipts) {
                    putValidationReceipt(dhtOpHash, receipt)(this._state);
                }
                // TODO: fix for when sharding is implemented
                if (this.p2p.shouldWeHold(getDHTOpBasis(validatedOp.op))) {
                    dhtOpsToProcess[dhtOpHash] = validatedOp.op;
                }
            }
            if (Object.keys(dhtOpsToProcess).length > 0) {
                yield this.handle_publish(from_agent, false, dhtOpsToProcess);
            }
            const previousCount = this._state.badAgents.length;
            const badAgents = getBadAgents(this._state);
            this._state.badAgents = uniq([...this._state.badAgents, ...badAgents]);
            if (this._state.badAgents.length > previousCount) {
                // We have added bad agents: resync the neighbors
                yield this.p2p.syncNeighbors();
            }
        });
    }
    // Check if the agent we are trying to connect with passes the membrane rules for this Dna
    handle_check_agent(firstElements) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.workflowExecutor.execute(() => run_agent_validation_callback(this.buildWorkspace(), firstElements), app_validation_task(true));
            if (!result.resolved)
                throw new Error('Unresolved in agent validate?');
            else if (!result.valid)
                throw new Error('Agent is invalid in this Dna');
        });
    }
    /** Workflow internal execution */
    triggerWorkflow(workflow) {
        this._triggers[workflow.type].triggered = true;
        setTimeout(() => this._runPendingWorkflows());
    }
    _runPendingWorkflows() {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingWorkflows = Object.entries(this._triggers)
                .filter(([type, t]) => t.triggered && !t.running)
                .map(([type, t]) => type);
            const workflowsToRun = pendingWorkflows.map(triggeredWorkflowFromType);
            const promises = Object.values(workflowsToRun).map((w) => __awaiter(this, void 0, void 0, function* () {
                if (!this._triggers[w.type])
                    console.log(w);
                this._triggers[w.type].triggered = false;
                this._triggers[w.type].running = true;
                yield this._runWorkflow(w);
                this._triggers[w.type].running = false;
                this._runPendingWorkflows();
            }));
            yield Promise.all(promises);
        });
    }
    _runWorkflow(workflow) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.workflowExecutor.execute(() => workflow.task(this.buildWorkspace()), workflow);
            result.triggers.forEach(triggeredWorkflow => this.triggerWorkflow(triggeredWorkflow));
            return result.result;
        });
    }
    /** Private helpers */
    buildWorkspace() {
        let badAgentConfig = undefined;
        let dna = this.getSimulatedDna();
        if (this.conductor.badAgent) {
            badAgentConfig = this.conductor.badAgent.config;
            if (this.conductor.badAgent.counterfeitDnas[this.cellId[0]] &&
                this.conductor.badAgent.counterfeitDnas[this.cellId[0]][this.cellId[1]]) {
                dna = this.conductor.badAgent.counterfeitDnas[this.cellId[0]][this.cellId[1]];
            }
        }
        return {
            state: this._state,
            p2p: this.p2p,
            dna,
            badAgentConfig,
        };
    }
}

class Connection {
    constructor(opener, receiver) {
        this.opener = opener;
        this.receiver = receiver;
        this._closed = false;
        if (opener.p2p.badAgents.includes(receiver.agentPubKey) ||
            receiver.p2p.badAgents.includes(opener.agentPubKey)) {
            throw new Error('Connection closed!');
        }
    }
    get closed() {
        return this._closed;
    }
    close() {
        this._closed = false;
    }
    sendRequest(fromAgent, networkRequest) {
        if (this.closed)
            throw new Error('Connection closed!');
        if (this.opener.agentPubKey === fromAgent) {
            return networkRequest(this.receiver);
        }
        else if (this.receiver.agentPubKey === fromAgent) {
            return networkRequest(this.opener);
        }
        throw new Error('Bad request');
    }
    getPeer(myAgentPubKeyB64) {
        if (this.opener.agentPubKey === myAgentPubKeyB64)
            return this.receiver;
        return this.opener;
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms));
const DelayMiddleware = (ms) => () => sleep(ms);

const GOSSIP_INTERVAL_MS = 500;
class SimpleBloomMod {
    constructor(p2pCell) {
        this.p2pCell = p2pCell;
        this.gossip_on = true;
        this.lastBadActions = 0;
        this.loop();
    }
    loop() {
        return __awaiter(this, void 0, void 0, function* () {
            while (true) {
                if (this.gossip_on) {
                    try {
                        yield this.run_one_iteration();
                    }
                    catch (e) {
                        console.warn('Connection closed');
                    }
                }
                yield sleep(GOSSIP_INTERVAL_MS);
            }
        });
    }
    run_one_iteration() {
        return __awaiter(this, void 0, void 0, function* () {
            const localDhtOpsHashes = Object.keys(this.p2pCell.cell._state.integratedDHTOps);
            const localDhtOps = this.p2pCell.cell.handle_fetch_op_hash_data(localDhtOpsHashes);
            const state = this.p2pCell.cell._state;
            const dhtOpData = {};
            for (const dhtOpHash of Object.keys(localDhtOps)) {
                const receipts = getValidationReceipts(dhtOpHash)(state);
                dhtOpData[dhtOpHash] = {
                    op: localDhtOps[dhtOpHash],
                    validation_receipts: receipts,
                };
            }
            const pretendValid = this.p2pCell.cell.conductor.badAgent &&
                this.p2pCell.cell.conductor.badAgent.config
                    .pretend_invalid_elements_are_valid;
            const badActions = pretendValid ? [] : getBadActions(state);
            const gossips = {
                badActions,
                neighbors: [],
                validated_dht_ops: dhtOpData,
            };
            let warrant = badActions.length > 0 && badActions.length !== this.lastBadActions;
            this.lastBadActions = badActions.length;
            if (warrant) {
                const promises = [
                    ...this.p2pCell.neighbors,
                    ...this.p2pCell.farKnownPeers,
                ].map(peer => this.p2pCell.outgoing_gossip(peer, gossips, warrant));
                yield Promise.all(promises);
            }
            else {
                for (const neighbor of this.p2pCell.neighbors) {
                    yield this.p2pCell.outgoing_gossip(neighbor, gossips, warrant);
                }
            }
        });
    }
}

var NetworkRequestType;
(function (NetworkRequestType) {
    NetworkRequestType["CALL_REMOTE"] = "Call Remote";
    NetworkRequestType["PUBLISH_REQUEST"] = "Publish Request";
    NetworkRequestType["GET_REQUEST"] = "Get Request";
    NetworkRequestType["WARRANT"] = "Warrant";
    NetworkRequestType["GOSSIP"] = "Gossip";
    NetworkRequestType["CONNECT"] = "Connect";
})(NetworkRequestType || (NetworkRequestType = {}));

// From: https://github.com/holochain/holochain/blob/develop/crates/holochain_p2p/src/lib.rs
class P2pCell {
    constructor(state, cell, network) {
        this.cell = cell;
        this.network = network;
        this.redundancyFactor = 3;
        this.networkRequestsExecutor = new MiddlewareExecutor();
        this.neighborConnections = {};
        this.farKnownPeers = state.farKnownPeers;
        this.redundancyFactor = state.redundancyFactor;
        this.neighborNumber = state.neighborNumber;
        // TODO: try to connect with already known neighbors
        this.storageArc = {
            center_loc: location(this.cellId[1]),
            half_length: Math.pow(2, 33),
        };
    }
    getState() {
        return {
            badAgents: this.badAgents,
            neighbors: this.neighbors,
            farKnownPeers: this.farKnownPeers,
            redundancyFactor: this.redundancyFactor,
            neighborNumber: this.neighborNumber,
        };
    }
    get cellId() {
        return this.cell.cellId;
    }
    get badAgents() {
        if (this.cell.conductor.badAgent &&
            this.cell.conductor.badAgent.config.pretend_invalid_elements_are_valid)
            return [];
        return this.cell._state.badAgents;
    }
    /** P2p actions */
    join(containerCell) {
        return __awaiter(this, void 0, void 0, function* () {
            this.network.bootstrapService.announceCell(this.cellId, containerCell);
            this._gossipLoop = new SimpleBloomMod(this);
            yield this.syncNeighbors();
        });
    }
    leave() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    publish(dht_hash, ops) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.network.kitsune.rpc_multi(this.cellId[0], this.cellId[1], dht_hash, this.redundancyFactor, this.badAgents, (cell) => this._executeNetworkRequest(cell, NetworkRequestType.PUBLISH_REQUEST, { dhtOps: ops }, (cell) => cell.handle_publish(this.cellId[1], true, ops)));
        });
    }
    get(dht_hash, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const gets = yield this.network.kitsune.rpc_multi(this.cellId[0], this.cellId[1], dht_hash, 1, // TODO: what about this?
            this.badAgents, (cell) => this._executeNetworkRequest(cell, NetworkRequestType.GET_REQUEST, { hash: dht_hash, options }, (cell) => cell.handle_get(dht_hash, options)));
            return gets.find(get => !!get);
        });
    }
    get_links(base_address, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.network.kitsune.rpc_multi(this.cellId[0], this.cellId[1], base_address, 1, // TODO: what about this?
            this.badAgents, (cell) => this._executeNetworkRequest(cell, NetworkRequestType.GET_REQUEST, { hash: base_address, options }, (cell) => cell.handle_get_links(base_address, options)));
        });
    }
    call_remote(agent, zome, fnName, cap, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.network.kitsune.rpc_single(this.cellId[0], this.cellId[1], agent, (cell) => this._executeNetworkRequest(cell, NetworkRequestType.CALL_REMOTE, {}, (cell) => cell.handle_call_remote(this.cellId[1], zome, fnName, cap, payload)));
        });
    }
    /** Neighbor handling */
    get neighbors() {
        return Object.keys(this.neighborConnections);
    }
    connectWith(peer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.neighborConnections[peer.agentPubKey])
                return this.neighborConnections[peer.agentPubKey];
            return new Connection(this.cell, peer);
        });
    }
    check_agent_valid(peer) {
        return __awaiter(this, void 0, void 0, function* () {
            const peerFirst3Elements = getSourceChainElements(peer._state, 0, 3);
            try {
                yield this.cell.handle_check_agent(peerFirst3Elements);
            }
            catch (e) {
                if (!this.cell._state.badAgents.includes(peer.agentPubKey))
                    this.cell._state.badAgents.push(peer.agentPubKey);
                throw new Error('Invalid agent');
            }
        });
    }
    handleOpenNeighborConnection(from, connection) {
        this.neighborConnections[from.agentPubKey] = connection;
    }
    handleCloseNeighborConnection(from) {
        this.neighborConnections[from.agentPubKey] = undefined;
        delete this.neighborConnections[from.agentPubKey];
        this.syncNeighbors();
    }
    openNeighborConnection(withPeer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.neighborConnections[withPeer.agentPubKey]) {
                // Try to connect: can fail due to validation
                // TODO: uncomment
                /*       await this._executeNetworkRequest(
                  withPeer,
                  NetworkRequestType.CONNECT,
                  {},
                  peer =>
                    Promise.all([
                      this.check_agent_valid(withPeer),
                      withPeer.p2p.check_agent_valid(this.cell),
                    ])
                );
           */
                const connection = yield this.connectWith(withPeer);
                this.neighborConnections[withPeer.agentPubKey] = connection;
                withPeer.p2p.handleOpenNeighborConnection(this.cell, connection);
            }
            return this.neighborConnections[withPeer.agentPubKey];
        });
    }
    closeNeighborConnection(withPeer) {
        if (this.neighborConnections[withPeer]) {
            const connection = this.neighborConnections[withPeer];
            connection.close();
            this.neighborConnections[withPeer] = undefined;
            delete this.neighborConnections[withPeer];
            connection
                .getPeer(this.cellId[1])
                .p2p.handleCloseNeighborConnection(this.cell);
        }
    }
    syncNeighbors() {
        return __awaiter(this, void 0, void 0, function* () {
            const dnaHash = this.cellId[0];
            const agentPubKey = this.cellId[1];
            const badAgents = this.badAgents;
            for (const badAgent of badAgents) {
                if (this.neighborConnections[badAgent]) {
                    this.closeNeighborConnection(badAgent);
                }
            }
            this.farKnownPeers = this.network.bootstrapService
                .getFarKnownPeers(dnaHash, agentPubKey, badAgents)
                .map(p => p.agentPubKey);
            const neighbors = this.network.bootstrapService
                .getNeighborhood(dnaHash, agentPubKey, this.neighborNumber, badAgents)
                .filter(cell => cell.agentPubKey != agentPubKey);
            const newNeighbors = neighbors.filter(cell => !this.neighbors.includes(cell.agentPubKey));
            const neighborsToForget = this.neighbors.filter(n => !neighbors.find(c => c.agentPubKey === n));
            neighborsToForget.forEach(n => this.closeNeighborConnection(n));
            const promises = newNeighbors.map((neighbor) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.openNeighborConnection(neighbor);
                }
                catch (e) {
                    // Couldn't open connection
                }
            }));
            yield Promise.all(promises);
            if (Object.keys(this.neighborConnections).length < this.neighborNumber) {
                setTimeout(() => this.syncNeighbors(), 400);
            }
        });
    }
    // TODO: fix when sharding is implemented
    shouldWeHold(dhtOpBasis) {
        const neighbors = this.network.bootstrapService.getNeighborhood(this.cellId[0], dhtOpBasis, this.redundancyFactor + 1, this.badAgents);
        const index = neighbors.findIndex(cell => cell.agentPubKey === this.cellId[1]);
        return index >= 0 && index < this.redundancyFactor;
    }
    /** Gossip */
    outgoing_gossip(to_agent, gossips, warrant = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: remove peer discovery?
            yield this.network.kitsune.rpc_single(this.cellId[0], this.cellId[1], to_agent, (cell) => this._executeNetworkRequest(cell, warrant ? NetworkRequestType.WARRANT : NetworkRequestType.GOSSIP, {}, (cell) => cell.handle_gossip(this.cellId[1], gossips)));
        });
    }
    /** Executors */
    _executeNetworkRequest(toCell, type, details, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const networkRequest = {
                fromAgent: this.cellId[1],
                toAgent: toCell.agentPubKey,
                dnaHash: this.cellId[0],
                type,
                details,
            };
            const connection = yield this.connectWith(toCell);
            const result = yield this.networkRequestsExecutor.execute(() => connection.sendRequest(this.cellId[1], request), networkRequest);
            return result;
        });
    }
}

class KitsuneP2p {
    constructor(network) {
        this.network = network;
        this.discover = new Discover(network);
    }
    rpc_single(dna_hash, from_agent, to_agent, networkRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const peer = yield this.discover.peer_discover(dna_hash, from_agent, to_agent);
            return networkRequest(peer);
        });
    }
    rpc_multi(dna_hash, from_agent, basis, remote_agent_count, filtered_agents, networkRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Discover neighbors
            return this.discover.message_neighborhood(dna_hash, from_agent, basis, remote_agent_count, filtered_agents, networkRequest);
        });
    }
}
// From https://github.com/holochain/holochain/blob/develop/crates/kitsune_p2p/kitsune_p2p/src/spawn/actor/discover.rs
class Discover {
    constructor(network) {
        this.network = network;
    }
    // TODO fix this
    peer_discover(dna_hash, from_agent, to_agent) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.network.bootstrapService.cells[dna_hash][to_agent];
        });
    }
    message_neighborhood(dna_hash, from_agent, basis, remote_agent_count, filtered_agents, networkRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield this.search_for_agents(dna_hash, basis, remote_agent_count, filtered_agents);
            const promises = agents.map(cell => networkRequest(cell));
            return Promise.all(promises);
        });
    }
    search_for_agents(dna_hash, basis, remote_agent_count, filtered_agents) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.network.bootstrapService.getNeighborhood(dna_hash, basis, remote_agent_count, filtered_agents);
        });
    }
}

class Network {
    constructor(state, conductor, bootstrapService) {
        this.conductor = conductor;
        this.bootstrapService = bootstrapService;
        this.p2pCells = {};
        for (const [dnaHash, p2pState] of Object.entries(state.p2pCellsState)) {
            if (!this.p2pCells[dnaHash])
                this.p2pCells[dnaHash];
            for (const [agentPubKey, p2pCellState] of Object.entries(p2pState)) {
                this.p2pCells[dnaHash][agentPubKey] = new P2pCell(p2pCellState, conductor.getCell(dnaHash, agentPubKey), this);
            }
        }
        this.kitsune = new KitsuneP2p(this);
    }
    getState() {
        const p2pCellsState = {};
        for (const [dnaHash, dnaP2pCells] of Object.entries(this.p2pCells)) {
            if (!p2pCellsState[dnaHash])
                p2pCellsState[dnaHash] = {};
            for (const [agentPubKey, p2pCell] of Object.entries(dnaP2pCells)) {
                p2pCellsState[dnaHash][agentPubKey] = p2pCell.getState();
            }
        }
        return {
            p2pCellsState,
        };
    }
    getAllP2pCells() {
        const nestedCells = Object.values(this.p2pCells).map(dnaCells => Object.values(dnaCells));
        return [].concat(...nestedCells);
    }
    createP2pCell(cell) {
        const cellId = cell.cellId;
        const dnaHash = cellId[0];
        const state = {
            neighbors: [],
            farKnownPeers: [],
            redundancyFactor: 3,
            neighborNumber: 5,
            badAgents: [],
        };
        const p2pCell = new P2pCell(state, cell, this);
        if (!this.p2pCells[dnaHash])
            this.p2pCells[dnaHash] = {};
        this.p2pCells[dnaHash][cellId[1]] = p2pCell;
        return p2pCell;
    }
    sendRequest(dna, fromAgent, toAgent, request) {
        const localCell = this.conductor.cells[dna] && this.conductor.cells[dna][toAgent];
        if (localCell)
            return request(localCell);
        return request(this.bootstrapService.cells[dna][toAgent]);
    }
}

class Conductor {
    constructor(state, bootstrapService) {
        this.network = new Network(state.networkState, this, bootstrapService);
        this.registeredDnas = state.registeredDnas;
        this.installedHapps = state.installedHapps;
        this.name = state.name;
        this.cells = {};
        for (const [dnaHash, dnaCellsStates] of Object.entries(state.cellsState)) {
            if (!this.cells[dnaHash])
                this.cells[dnaHash] = {};
            for (const [agentPubKey, cellState] of Object.entries(dnaCellsStates)) {
                this.cells[dnaHash][agentPubKey] = new Cell(cellState, this);
            }
        }
    }
    static create(bootstrapService, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = {
                cellsState: {},
                networkState: {
                    p2pCellsState: {},
                },
                registeredDnas: {},
                installedHapps: {},
                name,
                badAgent: undefined,
            };
            return new Conductor(state, bootstrapService);
        });
    }
    getState() {
        const cellsState = {};
        for (const [dnaHash, dnaCells] of Object.entries(this.cells)) {
            if (!cellsState[dnaHash])
                cellsState[dnaHash];
            for (const [agentPubKey, cell] of Object.entries(dnaCells)) {
                cellsState[dnaHash][agentPubKey] = cell.getState();
            }
        }
        return {
            name: this.name,
            networkState: this.network.getState(),
            cellsState,
            registeredDnas: this.registeredDnas,
            installedHapps: this.installedHapps,
            badAgent: this.badAgent,
        };
    }
    getAllCells() {
        const nestedCells = Object.values(this.cells).map(dnaCells => Object.values(dnaCells));
        return [].concat(...nestedCells);
    }
    getCells(dnaHash) {
        const dnaCells = this.cells[dnaHash];
        return dnaCells ? Object.values(dnaCells) : [];
    }
    getCell(dnaHash, agentPubKey) {
        return this.cells[dnaHash] ? this.cells[dnaHash][agentPubKey] : undefined;
    }
    /** Bad agents */
    setBadAgent(badAgentConfig) {
        if (!this.badAgent)
            this.badAgent = { config: badAgentConfig, counterfeitDnas: {} };
        this.badAgent.config = badAgentConfig;
    }
    setCounterfeitDna(cellId, dna) {
        if (!this.badAgent)
            throw new Error('This is not a bad agent');
        if (!this.badAgent.counterfeitDnas[cellId[0]])
            this.badAgent.counterfeitDnas[cellId[0]] = {};
        this.badAgent.counterfeitDnas[cellId[0]][cellId[1]] = dna;
    }
    /** Admin API */
    /*
    async registerDna(dna_template: SimulatedDna): Promise<Hash> {
      const templateHash = hash(dna_template, HashType.DNA);
  
      this.registeredDnas[templateHash] = dna_template;
      return templateHash;
    } */
    cloneCell(installedAppId, slotNick, uid, properties, membraneProof) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.installedHapps[installedAppId])
                throw new Error(`Given app id doesn't exist`);
            const installedApp = this.installedHapps[installedAppId];
            if (!installedApp.slots[slotNick])
                throw new Error(`The slot nick doesn't exist for the given app id`);
            const slotToClone = installedApp.slots[slotNick];
            const hashOfDnaToClone = slotToClone.base_cell_id[0];
            const dnaToClone = this.registeredDnas[hashOfDnaToClone];
            if (!dnaToClone) {
                throw new Error(`The dna to be cloned is not registered on this conductor`);
            }
            const dna = Object.assign({}, dnaToClone);
            if (uid)
                dna.uid = uid;
            if (properties)
                dna.properties = properties;
            const newDnaHash = hash(dna, HashType.DNA);
            if (newDnaHash === hashOfDnaToClone)
                throw new Error(`Trying to clone a dna would create exactly the same DNA`);
            this.registeredDnas[newDnaHash] = dna;
            const cell = yield this.createCell(dna, installedApp.agent_pub_key, membraneProof);
            this.installedHapps[installedAppId].slots[slotNick].clones.push(cell.cellId);
            return cell;
        });
    }
    installHapp(happ, membrane_proofs // segmented by CellNick
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const rand = `${Math.random().toString()}/${Date.now()}`;
            const agentId = hash(rand, HashType.AGENT);
            this.installedHapps[happ.name] = {
                agent_pub_key: agentId,
                app_id: happ.name,
                slots: {},
            };
            for (const [cellNick, dnaSlot] of Object.entries(happ.slots)) {
                let dnaHash = undefined;
                if (typeof dnaSlot.dna === 'string') {
                    dnaHash = dnaSlot.dna;
                    if (!this.registeredDnas[dnaHash])
                        throw new Error(`Trying to reference a Dna that this conductor doesn't have registered`);
                }
                else if (typeof dnaSlot.dna === 'object') {
                    dnaHash = hash(dnaSlot.dna, HashType.DNA);
                    this.registeredDnas[dnaHash] = dnaSlot.dna;
                }
                else {
                    throw new Error('Bad DNA Slot: you must pass in the hash of the dna or the simulated Dna object');
                }
                this.installedHapps[happ.name].slots[cellNick] = {
                    base_cell_id: [dnaHash, agentId],
                    is_provisioned: !dnaSlot.deferred,
                    clones: [],
                };
                if (!dnaSlot.deferred) {
                    yield this.createCell(this.registeredDnas[dnaHash], agentId, membrane_proofs[cellNick]);
                }
            }
        });
    }
    createCell(dna, agentPubKey, membraneProof) {
        return __awaiter(this, void 0, void 0, function* () {
            const newDnaHash = hash(dna, HashType.DNA);
            const cellId = [newDnaHash, agentPubKey];
            const cell = yield Cell.create(this, cellId, membraneProof);
            if (!this.cells[cell.dnaHash])
                this.cells[cell.dnaHash] = {};
            this.cells[cell.dnaHash][cell.agentPubKey] = cell;
            return cell;
        });
    }
    /** App API */
    callZomeFn(args) {
        const dnaHash = args.cellId[0];
        const agentPubKey = args.cellId[1];
        const cell = this.cells[dnaHash][agentPubKey];
        if (!cell)
            throw new Error(`No cells existst with cellId ${dnaHash}:${agentPubKey}`);
        return cell.callZomeFn({
            zome: args.zome,
            cap: args.cap,
            fnName: args.fnName,
            payload: args.payload,
            provenance: agentPubKey,
        });
    }
}

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create_entry: create_entry,
    buildValidationFunctionContext: buildValidationFunctionContext,
    buildZomeFunctionContext: buildZomeFunctionContext
});

const demoEntriesZome = {
    name: 'demo_entries',
    entry_defs: [
        {
            id: 'demo_entry',
            visibility: 'Public',
        },
    ],
    zome_functions: {
        create_entry: {
            call: ({ create_entry }) => ({ content }) => __awaiter(void 0, void 0, void 0, function* () {
                return create_entry({ content, entry_def_id: 'demo_entry' });
            }),
            arguments: [{ name: 'content', type: 'any' }],
        },
        hash_entry: {
            call: ({ hash_entry }) => ({ entry }) => __awaiter(void 0, void 0, void 0, function* () {
                return hash_entry(entry);
            }),
            arguments: [{ name: 'entry', type: 'any' }],
        },
        get: {
            call: ({ get }) => ({ hash }) => {
                return get(hash, { strategy: GetStrategy.Latest });
            },
            arguments: [{ name: 'hash', type: 'AnyDhtHash' }],
        },
        get_details: {
            call: ({ get_details }) => ({ hash }) => {
                return get_details(hash, { strategy: GetStrategy.Latest });
            },
            arguments: [{ name: 'hash', type: 'AnyDhtHash' }],
        },
        update_entry: {
            call: ({ update_entry }) => ({ original_header_address, new_content, }) => {
                return update_entry(original_header_address, {
                    content: new_content,
                    entry_def_id: 'demo_entry',
                });
            },
            arguments: [
                { name: 'original_header_address', type: 'HeaderHash' },
                { name: 'new_content', type: 'String' },
            ],
        },
        delete_entry: {
            call: ({ delete_entry }) => ({ deletes_address }) => {
                return delete_entry(deletes_address);
            },
            arguments: [{ name: 'deletes_address', type: 'HeaderHash' }],
        },
    },
    validation_functions: {
        validate_update_entry_demo_entry: hdk => ({ element }) => __awaiter(void 0, void 0, void 0, function* () {
            const update = element.signed_header.header.content;
            const updateAuthor = update.author;
            const originalHeader = yield hdk.get(update.original_header_address);
            if (!originalHeader)
                return {
                    resolved: false,
                    depsHashes: [update.original_header_address],
                };
            if (originalHeader.signed_header.header.content.author !== updateAuthor)
                return {
                    valid: false,
                    resolved: true,
                };
            return { valid: true, resolved: true };
        }),
    },
};
const demoLinksZome = {
    name: 'demo_links',
    entry_defs: [],
    zome_functions: {
        create_link: {
            call: ({ create_link }) => ({ base, target, tag }) => {
                return create_link({ base, target, tag });
            },
            arguments: [
                { name: 'base', type: 'EntryHash' },
                { name: 'target', type: 'EntryHash' },
                { name: 'tag', type: 'any' },
            ],
        },
        get_links: {
            call: ({ get_links }) => ({ base }) => {
                return get_links(base);
            },
            arguments: [{ name: 'base', type: 'EntryHash' }],
        },
        delete_link: {
            call: ({ delete_link }) => ({ add_link_header }) => {
                return delete_link(add_link_header);
            },
            arguments: [{ name: 'add_link_header', type: 'HeaderHash' }],
        },
    },
    validation_functions: {},
};
const demoPathsZome = {
    name: 'demo_paths',
    entry_defs: [
        {
            id: 'path',
            visibility: 'Public',
        },
    ],
    zome_functions: {
        ensure_path: {
            call: hdk => ({ path }) => {
                return hdk.path.ensure(path);
            },
            arguments: [{ name: 'path', type: 'String' }],
        },
    },
    validation_functions: {},
};
function demoDna() {
    const zomes = [demoEntriesZome, demoLinksZome, demoPathsZome];
    return {
        properties: {},
        uid: '',
        zomes,
    };
}
function demoHapp() {
    return {
        name: 'demo-happ',
        description: '',
        slots: {
            default: {
                dna: demoDna(),
                deferred: false,
            },
        },
    };
}

class BootstrapService {
    constructor() {
        this.cells = {};
    }
    announceCell(cellId, cell) {
        const dnaHash = cellId[0];
        const agentPubKey = cellId[1];
        if (!this.cells[dnaHash])
            this.cells[dnaHash] = {};
        this.cells[dnaHash][agentPubKey] = cell;
    }
    getNeighborhood(dnaHash, basis_dht_hash, numNeighbors, filteredAgents = []) {
        const cells = Object.keys(this.cells[dnaHash]).filter(cellPubKey => !filteredAgents.includes(cellPubKey));
        const neighborsKeys = getClosestNeighbors(cells, basis_dht_hash, numNeighbors);
        return neighborsKeys.map(pubKey => this.cells[dnaHash][pubKey]);
    }
    getFarKnownPeers(dnaHash, agentPubKey, filteredAgents = []) {
        const cells = Object.keys(this.cells[dnaHash]).filter(peerPubKey => peerPubKey !== agentPubKey && !filteredAgents.includes(peerPubKey));
        const farthestKeys = getFarthestNeighbors(cells, agentPubKey);
        return farthestKeys.map(pubKey => this.cells[dnaHash][pubKey]);
    }
}

const config = {
    dictionaries: [names],
};
function createConductors(conductorsToCreate, currentConductors, happ) {
    return __awaiter(this, void 0, void 0, function* () {
        const bootstrapService = currentConductors.length === 0
            ? new BootstrapService()
            : currentConductors[0].network.bootstrapService;
        const newConductorsPromises = [];
        for (let i = 0; i < conductorsToCreate; i++) {
            const characterName = uniqueNamesGenerator(config);
            const conductor = Conductor.create(bootstrapService, characterName);
            newConductorsPromises.push(conductor);
        }
        const newConductors = yield Promise.all(newConductorsPromises);
        const allConductors = [...currentConductors, ...newConductors];
        yield Promise.all(allConductors.map((c) => __awaiter(this, void 0, void 0, function* () { return c.installHapp(happ, {}); })));
        return allConductors;
    });
}

export { AGENT_PREFIX, Authority, Cascade, Cell, Conductor, DHTOP_PREFIX, DNA_PREFIX, DelayMiddleware, Discover, ENTRY_PREFIX, GetStrategy, HEADER_PREFIX, HashType, index as Hdk, KitsuneP2p, MiddlewareExecutor, Network, NetworkRequestType, P2pCell, ValidationLimboStatus, ValidationStatus, WorkflowType, app_validation, app_validation_task, buildAgentValidationPkg, buildCreate, buildCreateLink, buildDelete, buildDeleteLink, buildDna, buildShh, buildUpdate, callZomeFn, call_zome_fn_workflow, computeDhtStatus, counterfeit_check, createConductors, deleteValidationLimboValue, demoDna, demoEntriesZome, demoHapp, demoLinksZome, demoPathsZome, distance, genesis, genesis_task, getAllAuthoredEntries, getAllAuthoredHeaders, getAllHeldEntries, getAllHeldHeaders, getAppEntryType, getAuthor, getBadActions, getBadAgents, getCellId, getClosestNeighbors, getCreateLinksForEntry, getDHTOpBasis, getDhtShard, getDnaHash, getElement, getEntryDetails, getEntryDhtStatus, getEntryTypeString, getFarthestNeighbors, getHashType, getHeaderAt, getHeaderModifiers, getHeadersForEntry, getIntegratedDhtOpsWithoutReceipt, getLinksForEntry, getLiveLinks, getNewHeaders, getNextHeaderSeq, getNonPublishedDhtOps, getRemovesOnLinkAdd, getSourceChainElement, getSourceChainElements, getTipOfChain, getValidationLimboDhtOps, getValidationReceipts, hasDhtOpBeenProcessed, hash, hashEntry, incoming_dht_ops, incoming_dht_ops_task, integrate_dht_ops, integrate_dht_ops_task, isHoldingDhtOp, isHoldingElement, isHoldingEntry, location, produce_dht_ops, produce_dht_ops_task, publish_dht_ops, publish_dht_ops_task, pullAllIntegrationLimboDhtOps, putDhtOpData, putDhtOpMetadata, putDhtOpToIntegrated, putElement, putIntegrationLimboValue, putSystemMetadata, putValidationLimboValue, putValidationReceipt, query_dht_ops, register_header_on_basis, run_agent_validation_callback, run_create_link_validation_callback, run_delete_link_validation_callback, run_validation_callback_direct, shortest_arc_distance, sleep, store_element, store_entry, sys_validate_element, sys_validation, sys_validation_task, valid_cap_grant, validate_op, workflowPriority, wrap };
//# sourceMappingURL=index.js.map
