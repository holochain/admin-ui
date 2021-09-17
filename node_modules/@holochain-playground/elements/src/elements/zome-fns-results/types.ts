import { CellId } from "@holochain-open-dev/core-types";

export interface ZomeFunctionResult {
    cellId: CellId;
    zome: string;
    fnName: string;
    payload: any;
    result:
      | undefined
      | {
          success: boolean;
          payload: any;
        };
  }
  