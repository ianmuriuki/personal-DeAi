# 🧠 DEAI - Decentralized AI Assistant

## 📌 Overview

DEAI is a decentralized AI-powered chatbot and task management system running on the **Internet Computer Protocol (ICP)**. It allows users to:

- **Create and manage chats** with an AI assistant.
- **Store and retrieve messages** in persistent storage.
- **Execute AI-assisted tasks** asynchronously.
- **Securely authenticate users** using their **Principal ID**.

---

## 📂 Project Structure

The DEAI canister consists of several core components:

1. **User Authentication** - Manages identity and authorization.
2. **Chat System** - Handles user-created chat sessions.
3. **Task Execution** - Allows users to submit tasks that the AI processes.
4. **LLM Integration** - Connects with a Language Model (mocked in this implementation).
5. **System Information** - Provides metadata about the DEAI canister.

---

## 🏗️ Implementation Details

### 📌 Data Types

| **Type**    | **Description** |
|------------|---------------|
| `UserId`   | A **Principal** representing a unique user. |
| `ChatId`   | A **Nat** representing a unique chat session. |
| `MessageId`| A **Nat** representing a unique message. |
| `TaskId`   | A **Nat** representing a unique task. |
| `Message`  | A record containing message details (ID, timestamp, sender, content). |
| `Chat`     | A record containing chat session details (ID, owner, messages, etc.). |
| `TaskStatus` | Enum representing the status of a task (`pending`, `inProgress`, `completed`, `failed`). |
| `Task`     | A record containing task details (ID, owner, description, status, result). |
| `LLMRequest` | Structure for querying the AI model with a prompt. |
| `LLMResponse` | Structure representing the AI-generated response. |

---

## ⚙️ Function Breakdown

### 🔹 User Authentication

#### `getIdentity() : async Principal`
> Returns the **Principal ID** of the authenticated user.

---

### 🗨️ Chat Management

#### `createChat(name: Text) : async Result<ChatId, Text>`
> **Creates a new chat session** with a given name.

#### `getChats() : async Result<[ChatSummary], Text>`
> **Retrieves a list of chats** owned by the authenticated user.

#### `getChat(chatId: ChatId) : async Result<Chat, Text>`
> **Fetches details** of a specific chat if the user is the owner.

#### `sendMessage(chatId: ChatId, content: Text) : async Result<Message, Text>`
> **Sends a message** in a chat and generates an AI response.

---

### 📌 Task Management

#### `createTask(description: Text) : async Result<TaskId, Text>`
> **Creates a new task** and starts processing it asynchronously.

#### `getTasks() : async Result<[Task], Text>`
> **Retrieves a list of tasks** owned by the user.

#### `getTask(taskId: TaskId) : async Result<Task, Text>`
> **Fetches details** of a specific task if the user is the owner.

#### `processTask(taskId: TaskId) : async ()`
> **Processes a task asynchronously**, updates its status, and stores the AI-generated result.

---

### 🧠 LLM (AI) Integration

#### `queryLLM(request: LLMRequest) : async LLMResponse`
> **Queries an AI Language Model** with the given prompt (Mocked for now).

---

### 🏗️ System Information

#### `getCanisterInfo() : async Text`
> **Returns metadata** about the DEAI canister, including chat and task counts.

---

## 📌 Storage & State Management

The DEAI canister **stores data persistently** using `TrieMap`, a scalable key-value storage.

| **Variable** | **Type** | **Purpose** |
|-------------|---------|-------------|
| `nextChatId` | `Nat` | Auto-incrementing chat ID counter. |
| `nextMessageId` | `Nat` | Auto-incrementing message ID counter. |
| `nextTaskId` | `Nat` | Auto-incrementing task ID counter. |
| `chats` | `TrieMap<ChatId, Chat>` | Stores chat sessions. |
| `userChats` | `TrieMap<UserId, [ChatId]>` | Maps users to their chats. |
| `tasks` | `TrieMap<TaskId, Task>` | Stores tasks. |
| `userTasks` | `TrieMap<UserId, [TaskId]>` | Maps users to their tasks. |

---

## 🚀 Future Enhancements

- ✅ **LLM Canister Integration** - Replace mock AI with an actual LLM canister.
- ✅ **Advanced AI Interactions** - Improve response quality using **fine-tuned prompts**.
- ✅ **Real-time Task Processing** - Implement live status updates for tasks.
- ✅ **Better Error Handling** - Improve error reporting for failed tasks.
- ✅ **User Dashboard** - Provide an intuitive UI to visualize chats and tasks.

---

## 🏁 Conclusion

The **DEAI** backend provides a decentralized, **AI-powered chat and task execution** system on ICP. With robust authentication, persistent storage, and scalable architecture, it offers a foundation for a **future-proof AI assistant**.

> **🔗 Built for the Web3 era, powered by the Internet Computer.**
