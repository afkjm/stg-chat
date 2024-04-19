
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
    message => channel.messages.value = [...channel.messages.value, <>{message}</>],
    []
  )
  const formatMessage = useCallback((author, message) => <>{author}: {message}</>,[])

  useEffect(()=>{
    if (action.value) socket.emit(
      action.value.type,
      action.value.data,
      response => {
        if (response.response == 'success') {
          channel.channel.value = response.data.channel
          const messages = response.data.messages.map(
            (m, i) => <>{i > 0 ? formatMessage(m[0], m[1]) : m[1]}</>
          )
          // add one more message indicating how many users are actively connected
          messages.push(fragments.n_users_connected(response.data.n_users))
          channel.messages.value = messages
        }
      }
    )
  }, [action.value])

  useEffect(async ()=>{
    await socket.on('message', data => {
      appendMessage(formatMessage(data.author, data.message))
    })
  },[])

  const onSubmit = useCallback(e => {
    e.preventDefault();
    const raw_input = String(input.value).trim()  // make a copy for later reference
    const tokens: string[] = raw_input.split(/[\s]+/)
    input.value = ''
    if (!tokens || tokens.length == 0) return

    switch(tokens[0]) {
      case '/help':
        appendMessage(fragments.help_text)
        break

      case '/nick':
        // client-side nick validation for our purposes here
        if (tokens.length !== 2 || !/^[a-zA-Z0-9]+$/.test(tokens[1])) {
          appendMessage(fragments.nick_help)
          break
        }

        // It appears that we have a valid nick, store it in state
        channel.nick.value = tokens[1]
        appendMessage(fragments.set_nick(channel.nick.value))
        break

      case '/join':
        // validate our nick
        if (!channel.nick.value) {
          appendMessage(<>
            {fragments.join_help_no_nick}
            {fragments.nick_help}
          </>)
          break
        }
        // validate our channel
        if (tokens.length !== 2 || !/^#[a-zA-Z0-9]+$/.test(tokens[1])) {
          appendMessage(fragments.join_help);
          break
        }
        channel.channel.value = `${tokens[1]}`

        action.value = {
          type: tokens[0],  // /join
          data: {
            user: channel.nick.value,
            channel: tokens[1],
          }
        }

        break

      case '/delete_channel':
        // validate our channel
        if (tokens.length !== 2 || !/^#[a-zA-Z0-9]+$/.test(tokens[1])) {
          appendMessage(fragments.delete_channel_help);
          break
        }

        action.value = {
          type: '/delete_channel',
          data: {
            channel: tokens[1],
          }
        }

        break

      default:  // Handle `/say`
        // you need to have some text to say something
        if (!raw_input) break

        // you need a nick to say something
        if (!channel.nick.value) {
          appendMessage(<>
            {fragments.join_help_no_nick}
            {fragments.nick_help}
          </>)
          break
        }

        if (!channel.channel.value) {
          appendMessage(fragments.say_help_no_channel)
          break
        }

        action.value = {
          type: '/say',
          data: {
            author: channel.nick.value,
            message: raw_input,
          }
        }

        break
    }

  })

  return <form
    className='justify-self-end text-center bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white mb-1'
    onSubmit={onSubmit}
  >
    <input
      className='w-full text-center bg-slate-200 dark:bg-slate-500 text-slate-700 dark:text-white'
      type='text'
      key='message-editor'
      value={input.value}
      placeholder="Type /help for help"
      onChange={onChange}
    />
  </form>
}
