const noop = () => {};

export default class Lenis {
  constructor(_options?: object) {}

  on(_event: string, _handler: () => void) {
    return this;
  }

  raf(_time: number) {}

  destroy() {}
}

export { noop };
