
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { signal } from '@preact/signals'
import { io } from 'socket.io-client'


/* https://docs.nestjs.com/websockets/adapter#ws-library
HINT
ws library does not support namespaces (communication channels popularised by socket.io).
However, to somehow mimic this feature, you can mount multiple ws servers on different paths
(example: @WebSocketGateway({ path: '/users' })).
*/
// const socket = io('http://localhost:8080/back') // 20240416 fails
// const socket = io('http://localhost:8080', {path: '/back/'}) // 20240416 fails
const socket = signal(io('http://localhost:8080'));
const SocketContext = createContext();

// https://cors-anywhere.herokuapp.com/https://jsonplaceholder.typicode.com/posts
export const SocketContextProvider =
  ({children}) => <SocketContext.Provider value={socket} children={children} />

export const useSocketContext = () => useContext(SocketContext)
