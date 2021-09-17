import { commonGraphStyles } from '../utils/common-graph-styles';

export const graphStyles = `
${commonGraphStyles}

node {
  font-size: 10px;
  width: 16px;
  label: data(label);
  height: 16px;
}

.entry {
  background-color: grey;
}

.header {
  opacity: 0.6;
}

node > node {
  height: 1px;
}

.selected {
  border-width: 1px;
  border-color: black;
  border-style: solid;
}

.update-edge {
  width: 1;
  line-style: dashed;
}
.updated {
  opacity: 0.5;
}
.deleted {
  opacity: 0.3 !important;
}
`;
