
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { signal } from '@preact/signals'

export const ChannelContext = createContext();

const nick = signal('')
const messages = signal([
  'Hello'
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
