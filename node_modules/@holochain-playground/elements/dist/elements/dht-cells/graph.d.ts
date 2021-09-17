export declare const layoutConfig: {
    name: string;
    startAngle: number;
    ready: (e: any) => void;
};
export declare const graphStyles = "\n  node {\n    background-color: lightblue;\n    border-color: black;\n    border-width: 2px;\n    label: data(label);\n    font-size: 20px;\n    width: 50px;\n    height: 50px;\n  }\n  \n  .selected {\n    border-width: 4px;\n    border-color: black;\n    border-style: solid;\n  }\n\n  .highlighted {\n    background-color: yellow;\n  }\n\n  edge {\n    width: 1;\n  }\n\n  .network-request {\n    target-arrow-shape: triangle;\n    label: data(label);\n  }\n\n  .neighbor-edge {\n    line-style: dotted;\n  }\n\n  .far-neighbor-edge {\n    line-style: dotted;\n    opacity: 0.2;\n  }\n\n  .network-request {\n    width: 10px;\n    height: 10px;\n    background-color: grey;\n    border-width: 0px;\n  }\n\n";
