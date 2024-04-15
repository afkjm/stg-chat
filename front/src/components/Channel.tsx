
// import { useSignal } from "@preact/signals";
import { Messages } from './Messages.tsx'
import { MessageEditor } from './MessageEditor.tsx'


export function Channel() {

  // const count = useSignal(0)

  return <div className='flex flex-col grow min-h-0'>
      <Messages />
      <MessageEditor />
    </div>
}
