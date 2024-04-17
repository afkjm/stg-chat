
import { useMemo, useContext } from 'preact/hooks';
import { useChannelContext } from './Channel/ChannelContext.tsx'
import { useComputed, computed } from '@preact/signals'

export function Messages() {

  const channel = useChannelContext()

  return <div id='messages' className='flex flex-col-reverse grow min-h-0 overflow-auto text-center'>
    {[...channel.messages.value].reverse().map((e, i) => <div key={i}>{e}</div>)}
  </div>
}
