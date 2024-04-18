
import { signal } from '@preact/signals';
import { useCallback, useContext } from 'preact/hooks';

import { useSocketContext } from '@/contexts/SocketContext.tsx'
import { useChannelContext } from '@/components/Channel/ChannelContext.tsx'


const message = signal('');

export function MessageEditor() {

  const socket = useSocketContext()
  const channel = useChannelContext()

  const onChange = useCallback(e => { message.value = e.target.value } )

  return <form
    className='justify-self-end min-h-7 text-center bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white p-1'
    onSubmit={e=>{
      e.preventDefault();
      channel.messages.value = [...channel.messages.value, message.value]
      message.value = ''
    }}
  >
    <input
      className='w-full text-center bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
      type='text'
      key='message-editor'
      value={message.value}
      placeholder="/help <lists available commands>"
      onChange={onChange}
    />
  </form>
}
