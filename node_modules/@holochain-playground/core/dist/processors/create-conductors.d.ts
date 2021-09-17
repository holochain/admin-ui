import { Conductor } from '../core/conductor';
import { SimulatedHappBundle } from '../dnas/simulated-dna';
export declare function createConductors(conductorsToCreate: number, currentConductors: Conductor[], happ: SimulatedHappBundle): Promise<Conductor[]>;
