import { LitElement, ReactiveController } from 'lit';

export interface GraphElement {
    
}

export class GraphController implements ReactiveController {
  observer: ResizeObserver;

  constructor(protected host: LitElement, protected cy, protected layout) {
    host.addController(this);
  }

  hostConnected() {
    window.addEventListener('scroll', () => {
      this.cy.resize();
      this.host.requestUpdate();
    });

    this.observer = new ResizeObserver(() => {
      setTimeout(() => {
        this.cy.resize();
        if (this.layout) this.layout.run();
        this.host.requestUpdate();
      });
    });
    this.observer.observe(this.host);
  }

  hostUpdated() {
      
  }

  hostDisconnected() {
    this.observer.disconnect();
  }
}
