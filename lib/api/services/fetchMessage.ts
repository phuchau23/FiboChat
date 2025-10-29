export interface Message {
  id: number
  content: string
  role: "user" | "assistant"
  createdAt: string
}

export interface Conversation {
  id: number
  title: string
  messages: Message[]
}

export interface Team {
  id: number
  name: string
}

export interface Topic {
  id: number
  name: string
}
