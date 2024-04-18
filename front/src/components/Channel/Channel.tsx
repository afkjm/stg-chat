
import { Messages } from '@/components/Messages.tsx'
import { MessageEditor } from '@/components/MessageEditor.tsx'
import { ChannelContextProvider } from '@/components/Channel/ChannelContext.tsx'


export const Channel = () =>
  <ChannelContextProvider>
    <div className='flex flex-col grow min-h-0'>
      <Messages />
      <MessageEditor />
    </div>
  </ChannelContextProvider>
