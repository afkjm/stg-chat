
import { Messages } from '@/components/Messages'
import { MessageEditor } from '@/components/MessageEditor'
import { ChannelContextProvider } from '@/components/Channel/ChannelContext'


export const Channel = () =>
  <ChannelContextProvider>
    <div className='flex flex-col grow min-h-0'>
      <Messages />
      <MessageEditor />
    </div>
  </ChannelContextProvider>
