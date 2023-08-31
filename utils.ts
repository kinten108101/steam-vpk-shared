import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export const g_param_default = GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT;

export const TYPE_JSOBJECT: GObject.GType = {
  __type__() {
    return undefined;
  },
  name: 'JsObject',
}

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

export function vardict_make_v2(sarr: [string, GLib.Variant | null][]) {
  const arr: GLib.Variant[] = [];
  for (const [key, value] of sarr) {
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

export function param_spec_string<T extends string = string>(
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
  default_value?: T,
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

export function generate_timed_id() {
  return Number((new Date()).getTime().toString().substring(7) + String(Math.round(Math.random() * 100)));
}
