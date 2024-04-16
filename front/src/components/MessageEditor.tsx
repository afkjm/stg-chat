
import { signal } from '@preact/signals';
import { useCallback } from 'preact/hooks';
import { useContext } from 'preact/hooks';
import { useSocketContext } from '../contexts/SocketContext.tsx'

const message = signal('');

export function MessageEditor() {

  const onChange = useCallback(e => { message.value = e.target.value } )
  const socketContext = useSocketContext()

  return <form
    className='justify-self-end min-h-7 text-center bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white p-1'
    onSubmit={e=>{
      e.preventDefault();
      console.log(socketContext.value);
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
