
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { io } from 'socket.io-client'


const socket = io('ws://localhost:8080', {
  transports: ['websocket'],
  path: '/back/',
})
const SocketContext = createContext();

export const SocketContextProvider =
  ({children}) => <SocketContext.Provider
    value={socket}
    children={children}
  />

export const useSocketContext = () => useContext(SocketContext)
