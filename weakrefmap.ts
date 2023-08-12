export class WeakRefMap<T, V extends object> extends Map {
  forEach(callbackfn: (value: V | undefined, key: T, map: Map<T, WeakRef<V>>) => void, thisArg?: any): void {
    super.forEach((value: WeakRef<V>, key: T, map: Map<T, WeakRef<V>>) => {
      return callbackfn(value.deref(), key, map);
    }, thisArg);
  }

  get(key: T): V | undefined {
    const ref = super.get(key);
    return ref?.deref();
  }

  set(key: T, value: V): this {
    return super.set(key, new WeakRef(value));
  }

  entries(): IterableIterator<[T, WeakRef<V>]> {
    throw new Error('Method not implemented.');
  }

  keys(): IterableIterator<T> {
    throw new Error('Method not implemented.');
  }

  values(): IterableIterator<WeakRef<V>> {
    throw new Error('Method not implemented.');
  }

  [Symbol.iterator](): IterableIterator<[T, WeakRef<V>]> {
      throw new Error('Method not implemented.');
  }
}
