import { Cell, NetworkRequestInfo, Workflow } from '@holochain-playground/core';

export interface CellObserver {
  observedCells(): Cell[];
  onCellsChanged?: () => void;

  beforeWorkflow?: (cell: Cell, task: Workflow<any, any>) => Promise<void>;
  workflowSuccess?: (
    cell: Cell,
    task: Workflow<any, any>,
    result: any
  ) => Promise<void>;
  workflowError?: (
    cell: Cell,
    task: Workflow<any, any>,
    error: any
  ) => Promise<void>;

  beforeNetworkRequest?: (
    networkRequest: NetworkRequestInfo<any, any>
  ) => Promise<void>;
  networkRequestSuccess?: (
    networkRequest: NetworkRequestInfo<any, any>,
    result: any
  ) => Promise<void>;
  networkRequestError?: (
    networkRequest: NetworkRequestInfo<any, any>,
    error: any
  ) => Promise<void>;
}
