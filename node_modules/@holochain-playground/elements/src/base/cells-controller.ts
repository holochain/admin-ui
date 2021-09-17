import { LitElement, PropertyValues } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { PlaygroundElement } from './playground-element';
import { Dictionary } from '@holochain-open-dev/core-types';
import { Cell, MiddlewareSubscription } from '@holochain-playground/core';
import { ReactiveController } from 'lit';
import { CellObserver } from './cell-observer';

export class CellsController implements ReactiveController {
  protected _subscriptions: Dictionary<Array<MiddlewareSubscription>> = {};
  public observedCells: Array<Cell> = [];

  constructor(protected host: PlaygroundElement & CellObserver) {
    host.addController(this);
  }

  hostUpdated() {
    this.observedCells = this.host.observedCells().filter((cell) => !!cell);
    const newCellsById: Dictionary<Cell> = this.observedCells.reduce(
      (acc, next) => ({ ...acc, [this.getStrCellId(next)]: next }),
      {}
    );
    const newCellsIds = Object.keys(newCellsById);
    const oldCellsIds = Object.keys(this._subscriptions);

    const addedCellsIds = newCellsIds.filter(
      (cellId) => !oldCellsIds.includes(cellId)
    );
    const removedCellsIds = oldCellsIds.filter(
      (cellId) => !newCellsIds.includes(cellId)
    );

    for (const addedCellId of addedCellsIds) {
      const cell = newCellsById[addedCellId];
      const subscriptions = [
        cell.workflowExecutor.success(async () => {
          this.host.requestUpdate();
        }),
      ];
      if (this.host.beforeWorkflow) {
        subscriptions.push(
          cell.workflowExecutor.before((task) =>
            this.host.beforeWorkflow(cell, task)
          )
        );
      }

      if (this.host.workflowSuccess) {
        subscriptions.push(
          cell.workflowExecutor.success((task, result) =>
            this.host.workflowSuccess(cell, task, result)
          )
        );
      }

      if (this.host.workflowError) {
        subscriptions.push(
          cell.workflowExecutor.error((task, error) =>
            this.host.workflowError(cell, task, error)
          )
        );
      }

      if (this.host.beforeNetworkRequest) {
        subscriptions.push(
          cell.p2p.networkRequestsExecutor.before((networkRequest) =>
            this.host.beforeNetworkRequest(networkRequest)
          )
        );
      }
      if (this.host.networkRequestSuccess) {
        subscriptions.push(
          cell.p2p.networkRequestsExecutor.success((networkRequest, result) =>
            this.host.networkRequestSuccess(networkRequest, result)
          )
        );
      }
      if (this.host.networkRequestError) {
        subscriptions.push(
          cell.p2p.networkRequestsExecutor.error((networkRequest, error) =>
            this.host.networkRequestError(networkRequest, error)
          )
        );
      }

      this._subscriptions[addedCellId] = subscriptions;
    }
    removedCellsIds.forEach((cellId) => this.unsubscribeFromCellId(cellId));

    if (
      this.host.onCellsChanged &&
      (addedCellsIds.length > 0 || removedCellsIds.length > 0)
    )
      this.host.onCellsChanged();
  }

  hostDisconnected() {
    for (const cellSubscriptions of Object.values(this._subscriptions)) {
      for (const signalSubscription of cellSubscriptions) {
        signalSubscription.unsubscribe();
      }
    }
  }

  private getStrCellId(cell: Cell): string {
    return `${cell.dnaHash}/${cell.agentPubKey}`;
  }

  private unsubscribeFromCellId(cellId: string) {
    for (const signalSubscription of this._subscriptions[cellId]) {
      signalSubscription.unsubscribe();
    }
    this._subscriptions[cellId] = undefined;
    delete this._subscriptions[cellId];
  }
}
