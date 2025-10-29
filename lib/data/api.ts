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
  createdAt: string
}

export interface Team {
  id: number
  name: string
}

export interface Topic {
  id: number
  name: string
}

// TODO: Replace with actual API endpoints

/**
 * Get all conversations for the current user
 */
export async function getConversations(): Promise<Conversation[]> {
  // TODO: Replace with actual API call
  // return fetch('/api/conversations').then(res => res.json())
  return []
}

/**
 * Get a specific conversation with all its messages
 */
export async function getConversation(conversationId: number): Promise<Conversation | null> {
  // TODO: Replace with actual API call
  // return fetch(`/api/conversations/${conversationId}`).then(res => res.json())
  return null
}

/**
 * Create a new conversation
 */
export async function createConversation(title: string): Promise<Conversation> {
  // TODO: Replace with actual API call
  // return fetch('/api/conversations', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ title })
  // }).then(res => res.json())

  return {
    id: Date.now(),
    title,
    messages: [],
    createdAt: new Date().toISOString(),
  }
}

/**
 * Send a message and get AI response
 */
export async function sendMessage(conversationId: number, content: string): Promise<Message> {
  // TODO: Replace with actual API call to your chatbot
  // return fetch('/api/chat', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ conversationId, content })
  // }).then(res => res.json())

  // Mock AI response
  return {
    id: Date.now(),
    content: "Đây là câu trả lời từ AI chatbot. Thay thế bằng API call thật.",
    role: "assistant",
    createdAt: new Date().toISOString(),
  }
}

/**
 * Get available teams
 */
export async function getTeams(): Promise<Team[]> {
  // TODO: Replace with actual API call
  // return fetch('/api/teams').then(res => res.json())
  return [
    { id: 1, name: "Team" },
    { id: 2, name: "Personal" },
    { id: 3, name: "Work" },
  ]
}

/**
 * Get available topics
 */
export async function getTopics(): Promise<Topic[]> {
  // TODO: Replace with actual API call
  // return fetch('/api/topics').then(res => res.json())
  return [
    { id: 1, name: "Topic" },
    { id: 2, name: "SWP" },
    { id: 3, name: "Business Analysis" },
    { id: 4, name: "Project Management" },
  ]
}
