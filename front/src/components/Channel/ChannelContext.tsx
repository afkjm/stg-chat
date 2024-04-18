
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { signal } from '@preact/signals'

export const ChannelContext = createContext();

const nick = signal('')
const messages = signal([
  <>
    <b>STG-CHAT v0.0.0</b><br />
    <code>{'/nick <nick>'}</code> -- Set a nickname (mandatory)<br />
    <code>{'/join <channel name>'}</code> -- Join a channel (mandatory)<br />
  </>
])

export function  ChannelContextProvider({children}) {

  return <ChannelContext.Provider
    value={{
      nick,
      messages,
    }}
    children={children}
  />
}

export const useChannelContext = () => useContext(ChannelContext)
