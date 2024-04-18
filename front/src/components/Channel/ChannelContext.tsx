
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { signal } from '@preact/signals'

import * as fragments from '@/fragments'

export const ChannelContext = createContext();

const nick = signal('asdf')
const messages = signal([
  fragments.help_text,
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
