import { AppBundle } from "@holochain/conductor-api";
import { decompressSync } from "fflate";
import { decode } from "@msgpack/msgpack";

// Converts the given *.happ file to an AppBundle object
export async function fileToHappBundle(file: File): Promise<AppBundle> {
  const bytes = await file.arrayBuffer();
  const uncompressedBytes = decompressSync(new Uint8Array(bytes));
  const appBundle = decode(uncompressedBytes);

  return appBundle as AppBundle;
}
