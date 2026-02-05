import { User } from "./user-auth"

export interface Message {
  id?: number | string
  conversation?: Conversation
  content: string
  type: string
  receiver?: User|User[]
  sender?: User
  document?: any
  isRead?:any
  reactions?:[]
  createdAt?: string
  updatedAt?: string
}

export interface Conversation {
  id?: number | string
  title?:string
  lastMessage?:Message
  messages?:Message[]
  users?:User[]
  createdAt?: string
  updatedAt?: string
}
