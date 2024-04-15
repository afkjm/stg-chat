
import { useSignal } from "@preact/signals";


export function App() {

  const count = useSignal(0)

  return (
    <>
      <div>
        <button onClick={() => count.value += 1}>
          count is {count}
        </button>
      </div>
    </>
  )
}
