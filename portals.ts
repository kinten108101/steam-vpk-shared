import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';

import { dbus_params } from './dbus-utils.js';

Gio._promisify(Gio.DBus.session, 'call', 'call_finish');

export function OpenURIPortal() {
  async function OpenURI(
  { parent_window,
    uri,
  }:
  { parent_window?: Gtk.Window;
    uri: string;
  }) {
    parent_window;
    // @ts-ignore
    const reply: GLib.Variant = await Gio.DBus.session.call(
      'org.freedesktop.portal.Desktop',
      '/org/freedesktop/portal/desktop',
      'org.freedesktop.portal.OpenURI',
      'OpenURI',
      dbus_params(
        '', // parent window handler (id), tba
        uri,
      ),
      GLib.VariantType.new('(o)'),
      Gio.DBusCallFlags.NONE,
      1000,
      null);
  }

  return {
    OpenURI,
  }
}

export function ListenPortalResponses(
{ connection,
}:
{ connection: Gio.DBusConnection;
}) {
  const name = get_formatted_unique_name(connection);
  let using_response: number | undefined;

  function start() {
    if (using_response !== undefined) {
      console.warn(`Already listening to xdg-desktop-portal responses (handler ${using_response})`);
      return methods;
    }
    using_response = Gio.DBus.session.signal_subscribe(
      'org.freedesktop.portal.Desktop',
      'org.freedesktop.portal.Request',
      'Response',
      `/org/freedesktop/portal/desktop/request/${name}/t`, null, Gio.DBusSignalFlags.NONE,
      (_connection, _sender, _path, _iface, _signal, params) => {
        console.log(params.recursiveUnpack());
      });
    return methods;
  }

  function end() {
    if (using_response === undefined) {
      console.warn('Not listening for xdg-desktop-portal responses.');
      return methods;
    }
    Gio.DBus.session.signal_unsubscribe(using_response);
    return methods;
  }

  const methods = {
    start,
    end,
  }
}

export function SettingsProxy() {
  async function read(namespace: string, key: string) {
    // @ts-ignore
    const reply: GLib.Variant = await Gio.DBus.session.call(
      'org.freedesktop.portal.Desktop',
      '/org/freedesktop/portal/desktop',
      'org.freedesktop.portal.Settings',
      'RequestBackground',
      dbus_params(
        namespace,
        key
      ),
      GLib.VariantType.new('(v)'),
      Gio.DBusCallFlags.NONE,
      1000,
      null);

    return reply.recursiveUnpack() as any;
  }

  function read_all() {
    throw new Error('Method not implemented');
    return proxy;
  }

  function subscribe_settings_changed(cb: (namespace: string, key: string) => void): number {
    return Gio.DBus.session.signal_subscribe(
      'org.freedesktop.portal.Desktop',
      'org.freedesktop.portal.Settings',
      'SettingsChanged',
      '/org/freedesktop/portal/desktop',
      null,
      Gio.DBusSignalFlags.NONE,
      (_connection, _sender, _path, _iface, _signal, params: GLib.Variant) => {
        const vals = params.recursiveUnpack() as any[];
        cb(vals[0], vals[1]);
      });
  }

  const proxy = {
    read,
    read_all,
    subscribe_settings_changed,
  };
  return proxy;
}

export function get_formatted_unique_name(connection: Gio.DBusConnection): string {
  const name = connection.get_unique_name();
  if (name === null) throw new Error;
  const name_in_path = name.replace('.', '_').replace(':', '');
  return name_in_path;
}

export function BackgroundPortal() {
  function request_background(handler: string = '', config: { reason?: string } = {}) {
    // @ts-ignore
    Gio.DBus.session.call(
      'org.freedesktop.portal.Desktop',
      '/org/freedesktop/portal/desktop',
      'org.freedesktop.portal.Background',
      'RequestBackground',
      dbus_params(
        handler,
        config,
      ),
      GLib.VariantType.new('(o)'), Gio.DBusCallFlags.NONE, 1000, null);

    return proxy;
  }

  function set_status(status_message: string) {
    const param_status = GLib.Variant.new_tuple([
      GLib.Variant.new_array(GLib.VariantType.new_dict_entry(GLib.VariantType.new('s'), GLib.VariantType.new('v')), [
        GLib.Variant.new_dict_entry(GLib.Variant.new_string('message'), GLib.Variant.new_variant(GLib.Variant.new_string(status_message))),
      ]),
    ]);

    // @ts-ignore
    Gio.DBus.session.call(
      'org.freedesktop.portal.Desktop',
      '/org/freedesktop/portal/desktop',
      'org.freedesktop.portal.Background',
      'SetStatus', param_status, null, Gio.DBusCallFlags.NONE, 1000, null);

    return proxy;
  }

  const proxy = {
    request_background,
    set_status,
  }

  return proxy;
}
