import { DepsMissing } from '../workflows/sys_validation';
export declare type ValidationOutcome = {
    resolved: true;
    valid: boolean;
} | ({
    resolved: false;
} & DepsMissing);
