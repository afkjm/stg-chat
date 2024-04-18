

export const nick_help = <div><code>{"/nick <nick>"}</code> -- Set a nickname (handle) for yourself. (alphanumeric, mandatory)</div>

export const join_help = <div><code>{"/join #<channel name>"}</code> -- Join a channel (`#` prefix mandatory)</div>
export const join_help_no_nick = <div>To join a channel, you must first set a nickname (handle) for yourself.</div>

export const help_text = <div>
  <div><b>STG-CHAT v0.0.0</b></div>
  {nick_help}
  {join_help}
  <div><code>{"/help"} -- Display this help text</code></div>
</div>

export const unknown_input = <div>Unknown command. Type <code>{'/help'}</code> for help.</div>

export const set_nick = nick => <div>You have set your nick (handle) to: <code>{nick}</code></div>
