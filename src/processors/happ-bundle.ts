import { AppBundle } from "@holochain/conductor-api";
import { decompressSync } from "fflate";
import { decode } from "@msgpack/msgpack";

// Converts the given *.happ file to an AppBundle object
// Reference: https://github.com/holochain/holochain/blob/develop/crates/mr_bundle/src/encoding.rs
export async function fileToHappBundle(file: File): Promise<AppBundle> {
  const bytes = await file.arrayBuffer();
  const uncompressedBytes = decompressSync(new Uint8Array(bytes));
  const appBundle = decode(uncompressedBytes);

  return appBundle as AppBundle;
}
