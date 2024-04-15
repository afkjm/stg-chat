
import { useSignal } from "@preact/signals";


export function Channel() {

  const count = useSignal(0)

  return (
    <>
      <div id='messages' className='grow'>
        {/*<button onClick={() => count.value += 1}>*/}
        {/*  count is {count}*/}
        {/*</button>*/}
        messages
      </div>
      <div id='message-editor' className='justify-self-end min-h-5'>
        message editor
      </div>
    </>
  )
}
