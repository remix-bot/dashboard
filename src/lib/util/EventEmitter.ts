export class EventEmitter extends EventTarget {
  constructor() {
    super();
  }
  emit(event: string, data?: any) {
    this.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
  /**
   *
   * @param event
   * @param listener
   * @returns call the close() function in the returned object to unsubscribe the listener
   */
  on(event: string, listener: Function) {
    const l = (e: Event) => {
      if (!(e instanceof CustomEvent)) return listener(e);
      listener(e.detail);
    };
    this.addEventListener(event, l);
    return {
      close: () => {
        this.removeEventListener(event, l)
      }
    };
  }
  once(event: string, listener: Function) {
    const l = (e: Event) => {
      listener((!(e instanceof CustomEvent) ? e : e.detail));
      this.removeEventListener(event, l);
    }
    this.addEventListener(event, l);
  }
}
