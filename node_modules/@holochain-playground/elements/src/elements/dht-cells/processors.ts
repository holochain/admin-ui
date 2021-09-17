import { Dictionary } from '@holochain-open-dev/core-types';
import { Cell, location } from '@holochain-playground/core';

export function dhtCellsNodes(cells: Cell[]) {
  const sortedCells = cells.sort(
    (a: Cell, b: Cell) => location(a.agentPubKey) - location(b.agentPubKey)
  );
  const cellNodes = sortedCells.map((cell) => ({
    data: {
      id: cell.agentPubKey,
      label: `${cell.conductor.name}${cell.conductor.badAgent ? '😈' : ''}`,
    },
    classes: ['cell', cell.conductor.badAgent ? 'bad-agent' : ''],
  }));

  return cellNodes;
}

export function neighborsEdges(cells: Cell[]) {
  // Segmented by originAgentPubKey/targetAgentPubKey
  const allNeighbors: Dictionary<Dictionary<boolean>> = {};
  const edges: any[] = [];

  const cellDict: Dictionary<Cell> = cells.reduce(
    (acc, next) => ({ ...acc, [next.agentPubKey]: next }),
    {}
  );

  for (const cell of cells) {
    const cellAgentPubKey = cell.agentPubKey;
    const cellNeighbors = cell.p2p.neighbors;

    for (const cellNeighbor of cellNeighbors) {
      if (
        !(
          allNeighbors[cellNeighbor] &&
          allNeighbors[cellNeighbor][cellAgentPubKey]
        )
      ) {
        edges.push({
          data: {
            id: `${cellAgentPubKey}->${cellNeighbor}`,
            source: cellAgentPubKey,
            target: cellNeighbor,
          },
          classes: ['neighbor-edge'],
        });
      }

      if (!allNeighbors[cellAgentPubKey]) {
        allNeighbors[cellAgentPubKey] = {};
      }

      allNeighbors[cellAgentPubKey][cellNeighbor] = true;
    }

    for (const farNeighbor of cell.p2p.farKnownPeers) {
      if (!doTheyHaveBeef(cellDict[cellAgentPubKey], cellDict[farNeighbor])) {
        edges.push({
          data: {
            id: `${cellAgentPubKey}->${farNeighbor}`,
            source: cellAgentPubKey,
            target: farNeighbor,
          },
          classes: ['far-neighbor-edge'],
        });
      }
    }
  }

  return edges;
}

function doTheyHaveBeef(cellA: Cell, cellB: Cell): boolean {
  return (
    cellA.p2p.badAgents.includes(cellB.agentPubKey) ||
    cellB.p2p.badAgents.includes(cellA.agentPubKey)
  );
}
