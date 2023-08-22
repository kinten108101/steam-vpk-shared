import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Soup from 'gi://Soup';

export const g_param_default = GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT;

Gio._promisify(Gio.File.prototype, 'query_info_async', 'query_info_finish');
Gio._promisify(Gio.FileOutputStream.prototype, 'query_info_async', 'query_info_finish');
Gio._promisify(Gio.File.prototype, 'trash_async', 'trash_finish');

Gio._promisify(Soup.Session.prototype,
  'send_async',
  'send_finish');

Gio._promisify(Gio.File.prototype,
  'replace_async',
  'replace_finish');

Gio._promisify(Gio.InputStream.prototype,
  'read_all_async',
  'read_all_finish');

Gio._promisify(Gio.OutputStream.prototype,
  'write_async',
  'write_finish');

Gio._promisify(Gio.OutputStream.prototype,
  'write_bytes_async',
  'write_bytes_finish');

Gio._promisify(Soup.Session.prototype,
  'send_and_splice_async',
  'send_and_splice_finish');

Gio._promisify(Gio.OutputStream.prototype,
  'flush_async',
  'flush_finish');

Gio._promisify(Gio.InputStream.prototype,
  'close_async',
  'close_finish');

Gio._promisify(Gio.OutputStream.prototype,
  'close_async',
  'close_finish');

Gio._promisify(Gio.InputStream.prototype,
  'read_bytes_async',
  'read_bytes_finish');

Gio._promisify(Gio.InputStream.prototype,
  'read_all_async',
  'read_all_finish');

Gio._promisify(Gio.OutputStream.prototype,
  'splice_async',
  'splice_finish');

Gio._promisify(Gio.File.prototype,
  'move_async',
  'move_finish');

export function vardict_make(struct: { [key:string]: GLib.Variant | null }) {
  const arr: GLib.Variant[] = [];
  for (const key in struct) {
    const value = struct[key];
    if (value === undefined) continue;
    if (value === null) continue;
    arr.push(
      GLib.Variant.new_dict_entry(
        GLib.Variant.new_string(key),
        GLib.Variant.new_variant(value)
      )
    );
  }
  const variant = GLib.Variant.new_array(
    GLib.VariantType.new_dict_entry(GLib.VariantType.new('s'), GLib.VariantType.new('v')),
    arr
  );
  return variant;
}

export function g_variant_unpack_tuple<T extends Array<any>>(variant: GLib.Variant | null, types: typeofValues[]) {
  if (!(variant instanceof GLib.Variant)) throw new Error(`Expect a GVariant, got ${variant}`);
  const val = variant.deepUnpack();
  if (!Array.isArray(val)) {
    throw new TypeError(`Expect an array for GVariant tuple content, got ${typeof val}`);
  }
  val.forEach((x, i) => {
    if (typeof x !== types[i]) throw new Error(`Expect type ${types[i]} for the ${i}th tuple element, got ${typeof x}`);
  })
  return val as T;
}

export function g_variant_unpack_dict<T extends Object>(variant: GLib.Variant | null, structure: { [key: string]: typeofValues }) {
  if (!(variant instanceof GLib.Variant)) throw new TypeError(`Expect a GVariant, got ${variant}`);
  const val = variant.deepUnpack();
  if (typeof val !== 'object') {
    throw new TypeError();
  }
  if (val === null) {
    throw new TypeError();
  }
  const dict = val as { [key: string]: any };
  Object.keys(structure).forEach(key => {
    const val = dict[key];
    if (val === undefined) {
      throw new TypeError(`Key \"${key}\" does not exist in GVariant Dictionary`);
    }
    if (typeof val !== structure[key]) {
      throw new TypeError(`Expect type ${structure[key]} for value of key \"${key}\", got ${typeof val}`);
    }
  });
  return val as T;
}

type typeofValues = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';

export function g_variant_unpack<T>(variant: GLib.Variant | null, type: typeofValues) {
  if (!(variant instanceof GLib.Variant)) throw new Error(`Expect a GVariant, got ${variant}`);
  const val = variant.unpack();
  if (typeof val !== type) throw new Error(`Expect a ${type}, got ${val}`);
  return val as T;
}

export const GtkTemplate = Symbol();
export const GtkChildren = Symbol();
export const GtkInternalChildren = Symbol();
export const GtkCssName = Symbol();

/**
 * @param info GObject Class manifest. Mostly borrowed from {@link GObject.registerClass}, with some important changes:
 *
 * - Class registrations are verbalized as debug logs;
 * - Default GTypeName is Stvpk[class name] instead of Gjs_[class name].
 */
export function registerClass
<Props extends { [key: string]: GObject.ParamSpec },
 Interfaces extends { $gtype: GObject.GType }[],
 Sigs extends {
        [key: string]: {
            param_types?: readonly GObject.GType[];
            [key: string]: any;
        };
    }>
(
  info: GObject.MetaInfo<Props, Interfaces, Sigs> = {},
  klass:
    {
      new(...args: any[]): any,
      [GtkTemplate]?: string,
      [GtkChildren]?: string[],
      [GtkInternalChildren]?: string[],
      [GtkCssName]?: string,
    }
) {
  const GTypeName = `Stvpk${klass.name}`;
  console.debug(`Registering ${GTypeName}`);
  const gklass = GObject.registerClass({
    GTypeName,
    Template: klass[GtkTemplate],
    Children: klass[GtkChildren],
    InternalChildren: klass[GtkInternalChildren],
    CssName: klass[GtkCssName],
    ...info,
  }, klass);
  return gklass;
}

export function param_spec_boolean(
{ name,
  nick,
  blurb,
  flags,
  default_value,
}:
{ name: string,
  nick?: string,
  blurb?: string,
  flags?: GObject.ParamFlags,
  default_value?: boolean,
}) {
  return GObject.param_spec_boolean(name, nick || null, blurb || null, default_value || false, flags || g_param_default);
}

export function param_spec_string(
{ name,
  nick,
  blurb,
  flags,
  default_value,
}:
{ name: string,
  nick?: string,
  blurb?: string,
  flags?: GObject.ParamFlags,
  default_value?: string,
}) {
  return GObject.param_spec_string(name, nick || name, blurb || name, default_value || null, flags || g_param_default);
}

export function param_spec_variant(
{
  name,
  blurb,
  nick,
  type,
  default_value,
  flags,
}
:{ name: string,
   blurb?: string,
   nick?: string,
   type: GLib.VariantType,
   default_value?: GLib.Variant,
   flags?: GObject.ParamFlags,
}) {
  return GObject.param_spec_variant(name, blurb || name, nick || name, type, default_value || null, flags || g_param_default);
}

export function param_spec_object(
{
  name,
  nick,
  blurb,
  flags,
  objectType,
}:
{
  name: string;
  nick?: string;
  blurb?: string;
  flags?: GObject.ParamFlags;
  objectType?: GObject.GType;
}) {
  return GObject.ParamSpec.object(name, nick || name, blurb || name, flags || g_param_default, objectType || GObject.Object.$gtype);
}


/**
 * @deprecated This is very slow.
 */
export function array_insert<T>(source: Array<T>, item: T, index: number) {
  for (let i = source.length; i > index; i--) {
    source[i] = source[i-1] as T;
  }
  source[index] = item;
}

export function promise_wrap(cb: (...args: any[]) => Promise<void>, ...args: any[]) {
  return cb(args).catch(error => { log_error(error) });
}

/**
 * A wrapper over logError made for TypeScript. It actually accepts all object types as parameter.
 */
export function log_error(error: unknown, msg?: string) {
  if (error instanceof Error) {
    console.error(error, msg);
    return;
  } else if (error instanceof GLib.Error) {
    logError(error, msg);
    return;
  }
  console.error(error, msg);
}

export function g_listbox_move(listbox: Gtk.ListBox, row: Gtk.ListBoxRow, target_idx: number) {
  listbox.remove(row);
  listbox.insert(row, target_idx);
}

export function g_model_foreach<T extends GObject.Object>(model: Gio.ListModel, execute: (item: T, i: number) => void) {
  let i = 0;
  let item_iter = model.get_item(i);
  while (item_iter !== null) {
    execute(item_iter as T, i);
    i++;
    item_iter = model.get_item(i);
  }
}

export function isNumberString(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) < 48 || str.charCodeAt(i) > 57) return false;
  }
  return true;
}
