
import { signal } from '@preact/signals';
import { useCallback, useEffect } from 'preact/hooks';

import { useSocketContext } from '@/contexts/SocketContext'
import { useChannelContext } from '@/components/Channel/ChannelContext'

import * as fragments from '@/fragments'
import * as interfaces from '@/interfaces'

const input = signal('');
const action = signal<interfaces.Action>(null);

export function MessageEditor() {

  const socket = useSocketContext()
  const channel = useChannelContext()

  const onChange = useCallback(e => { input.value = e.target.value } )
  const appendMessage = useCallback(
    message => channel.messages.value = [...channel.messages.value, <><hr />{message}</>]
  )

  useEffect(()=>{
    if (action.value) socket.emit(action.value.type, action.value.data)
  }, [action.value])

  const onSubmit = useCallback(e => {
    e.preventDefault();
    const raw_input = String(input.value)  // make a copy for later reference
    const tokens: string[] = raw_input.split(/[\s]+/)
    input.value = ''
    if (!tokens || tokens.length == 0) return

    switch(tokens[0]) {
      case '/help': appendMessage(fragments.help_text); break
      case '/nick':
        // client-side nick validation for our purposes here
        if (tokens.length !== 2 || !/^[a-z0-9]+$/.test(tokens[1])) {
          appendMessage(fragments.nick_help)
          break
        }

        // It appears that we have a valid nick, store it in state
        channel.nick.value = tokens[1]
        appendMessage(fragments.set_nick(channel.nick.value))
        break

      case '/join':
        if (!channel.nick.value) {
          appendMessage(<>
            {fragments.join_help_no_nick}
            {fragments.nick_help}
          </>)
          break
        }
        if (tokens.length !== 2 || !/^#[a-z0-9]+$/.test(tokens[1])) {
          appendMessage(fragments.join_help);
          break
        }
        action.value = {
          type: tokens[0],  // /join
          data: {
            'user': channel.nick.value,
            'channel': tokens[1],
          }
        }

        break

      default: appendMessage(fragments.unknown_input); break
    }

  })

  return <form
    className='justify-self-end min-h-7 text-center bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white p-1'
    onSubmit={onSubmit}
  >
    <input
      className='w-full text-center bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
      type='text'
      key='message-editor'
      value={input.value}
      placeholder="/help <lists available commands>"
      onChange={onChange}
    />
  </form>
}
