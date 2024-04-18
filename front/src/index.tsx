
import { render } from 'preact'

import '@/index.css'

import { SocketContextProvider } from '@/contexts/SocketContext'
import { Channel } from '@/components/Channel/Channel'


render(
  <SocketContextProvider>
    <Channel />
  </SocketContextProvider>,
  document.getElementById('channel')!
)
