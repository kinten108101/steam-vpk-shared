import GLib from 'gi://GLib';

export function dbus_params(...args: any[]) {
  const arr: GLib.Variant[] = [];
  args.forEach(x => {
    arr.push(jsval2gvariant(x));
  });
  return GLib.Variant.new_tuple(arr);
}

export function jsval2gvariant(val: any): GLib.Variant {
  const type = typeof val;
  if (type === 'string') {
    return GLib.Variant.new_string(val);
  } else if (type === 'number') {
    return GLib.Variant.new_int64(val);
  } else if (type === 'object') {
    if (Array.isArray(val)) {
      throw new Error(`Convert to Gvariant array is not supported`);
    }
    // vardict
    return dbus_vardict(val);
  } else {
    throw new Error(`Could not convert JS value to GVariant. Received ${val}.`);
  }
}

export function dbus_vardict(dict: { [key: string]: any }): GLib.Variant {
  const entries: GLib.Variant[] = [];
  for (const key in dict) {
    if (dict[key] === undefined || dict[key] === null) continue;
    const gvariant = jsval2gvariant(dict[key]);
    const entry = GLib.Variant.new_dict_entry(GLib.Variant.new_string(key), GLib.Variant.new_variant(gvariant));
    entries.push(entry);
  }
  const vardict = GLib.Variant.new_array(GLib.VariantType.new_dict_entry(GLib.VariantType.new('s'), GLib.VariantType.new('v')), entries);
  return vardict;
}
