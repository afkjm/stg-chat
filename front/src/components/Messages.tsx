
import { useMemo } from 'preact/hooks';

export function Messages() {
  const n = 50;
  const a = useMemo<Array<number>>(() => [...Array(n).keys()].reverse(), []);

  return <div id='messages' className='flex flex-col-reverse grow min-h-0 overflow-auto text-center'>
    {a.map((e, i) => <div key={i}>message {e}</div>)}
  </div>
}
