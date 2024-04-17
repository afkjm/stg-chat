
import { Messages } from '../Messages.tsx'
import { MessageEditor } from '../MessageEditor.tsx'
import { ChannelContextProvider } from './ChannelContext.tsx'


export const Channel = () =>
  <ChannelContextProvider>
    <div className='flex flex-col grow min-h-0'>
      <Messages />
      <MessageEditor />
    </div>
  </ChannelContextProvider>
