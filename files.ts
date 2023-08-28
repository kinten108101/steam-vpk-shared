export function bytes2humanreadable(bytes: number): string {
  const precision = 3;
  const kbs = bytes / 1024;
  if (bytes < 1000) return `${bytes.toPrecision(precision)} B`;

  const mbs = kbs / 1024;
  if (kbs < 1000) return `${kbs.toPrecision(precision)} KB`;

  const gbs = mbs / 1024;
  if (mbs < 1000) return `${mbs.toPrecision(precision)} MB`;

  return `${gbs.toPrecision(precision)} GB`;
}
