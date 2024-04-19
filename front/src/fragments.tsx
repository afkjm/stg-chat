

export const nick_help = <div><code>{"/nick <nick>"}</code> -- Set your nick. (alphanumeric)</div>

export const join_help = <div><code>{"/join #<channel name>"}</code> -- Join a channel, example: /join #hello</div>
export const join_help_no_nick = <div>To join a channel, you must first set a nickname using /nick {'<name>'}</div>

export const say_help_no_channel = <div>To say something, you need to /join a #channel</div>

export const delete_channel_help = <div><code>{'/delete_channel #<channel name>'}</code> -- Delete a #channel</div>

export const help_text = <div>
  <div><b>STG-CHAT v0.0.0</b></div>
  {nick_help}
  {join_help}
  {delete_channel_help}
  <div><code>{"/help"} -- Display this help text.</code></div>
</div>

export const unknown_input = <div>Unknown command. Type <code>{'/help'}</code> for help.</div>

export const set_nick = nick => <div>You have set your nick to: <code>{nick}</code>.</div>

export const n_users_connected = n => <div><b>{n}</b> users are currently connected to this channel.</div>
