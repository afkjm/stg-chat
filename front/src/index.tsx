
import { render } from 'preact'

import '@/index.css'

import { SocketContextProvider } from '@/contexts/SocketContext.tsx'
import { Channel } from '@/components/Channel/Channel.tsx'


render(
  <SocketContextProvider>
    <Channel />
  </SocketContextProvider>,
  document.getElementById('channel')!
)
