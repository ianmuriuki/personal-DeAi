import LLM "mo:llm";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";

// Main DEAI Canister
actor DEAI {
    // Types
    public type UserId = Principal;
    public type ChatId = Nat;
    public type MessageId = Nat;
    public type TaskId = Nat;

    public type Message = {
        id: MessageId;
        timestamp: Int;
        sender: Text; // "user" or "assistant"
        content: Text;
    };

    public type Chat = {
        id: ChatId;
        owner: UserId;
        name: Text;
        created: Int;
        messages: [Message];
    };

    public type ChatSummary = {
        id: ChatId;
        name: Text;
        created: Int;
        messageCount: Nat;
    };

    public type TaskStatus = {
        #pending;
        #inProgress;
        #completed;
        #failed;
    };

    public type Task = {
        id: TaskId;
        owner: UserId;
        description: Text;
        created: Int;
        status: TaskStatus;
        result: ?Text;
    };

    public type LLMRequest = {
        prompt: Text;
        temperature: Float;
        maxTokens: Nat;
    };

    public type LLMResponse = {
        text: Text;
        tokenCount: Nat;
    };

    // State management
    private stable var nextChatId : ChatId = 0;
    private stable var nextMessageId : MessageId = 0;
    private stable var nextTaskId : TaskId = 0;

    private var chats = TrieMap.TrieMap<ChatId, Chat>(Nat.equal, Hash.hash);
    private var userChats = TrieMap.TrieMap<UserId, [ChatId]>(Principal.equal, Principal.hash);
    private var tasks = TrieMap.TrieMap<TaskId, Task>(Nat.equal, Hash.hash);
    private var userTasks = TrieMap.TrieMap<UserId, [TaskId]>(Principal.equal, Principal.hash);

    // Helper functions
    private func _getUserId() : UserId {
        return Principal.fromActor(DEAI);
    };

    private func currentTime() : Int {
        return Time.now();
    };

    private func addToUserChats(userId: UserId, chatId: ChatId) {
        switch (userChats.get(userId)) {
            case (null) {
                userChats.put(userId, [chatId]);
            };
            case (?existingChats) {
                let updatedChats = Array.append<ChatId>(existingChats, [chatId]);
                userChats.put(userId, updatedChats);
            };
        };
    };

    private func addToUserTasks(userId: UserId, taskId: TaskId) {
        switch (userTasks.get(userId)) {
            case (null) {
                userTasks.put(userId, [taskId]);
            };
            case (?existingTasks) {
                let updatedTasks = Array.append<TaskId>(existingTasks, [taskId]);
                userTasks.put(userId, updatedTasks);
            };
        };
    };

    // LLM Integration - This would connect to an actual LLM Canister in production
    private func queryLLM(request: LLMRequest) : async LLMResponse {
        // In a real implementation, this would call the LLM Canister
        // For now, we'll return a mock response
        Debug.print("LLM Query: " # request.prompt);
        
        return {
            text = "This is a simulated response from Llama 3.1 8B. In a production environment, this would be an actual response from the on-chain LLM.";
            tokenCount = 25;
        };
    };

    // Chat Management
    public shared(msg) func createChat(name: Text) : async Result.Result<ChatId, Text> {
        let userId = msg.caller;
        if (Principal.isAnonymous(userId)) {
            return #err("Authentication required");
        };

        let chatId = nextChatId;
        nextChatId += 1;

        let newChat : Chat = {
            id = chatId;
            owner = userId;
            name = name;
            created = currentTime();
            messages = [];
        };

        chats.put(chatId, newChat);
        addToUserChats(userId, chatId);

        #ok(chatId)
    };

    public shared(msg) func getChats() : async Result.Result<[ChatSummary], Text> {
        let userId = msg.caller;
        if (Principal.isAnonymous(userId)) {
            return #err("Authentication required");
        };

        switch (userChats.get(userId)) {
            case (null) {
                #ok([]);
            };
            case (?chatIds) {
                let summaries = Buffer.Buffer<ChatSummary>(chatIds.size());
                
                for (chatId in chatIds.vals()) {
                    switch (chats.get(chatId)) {
                        case (null) {};
                        case (?chat) {
                            summaries.add({
                                id = chat.id;
                                name = chat.name;
                                created = chat.created;
                                messageCount = chat.messages.size();
                            });
                        };
                    };
                };
                
                #ok(Buffer.toArray(summaries))
            };
        }
    };

    public shared(msg) func getChat(chatId: ChatId) : async Result.Result<Chat, Text> {
        let userId = msg.caller;
        if (Principal.isAnonymous(userId)) {
            return #err("Authentication required");
        };

        switch (chats.get(chatId)) {
            case (null) {
                #err("Chat not found");
            };
            case (?chat) {
                if (chat.owner != userId) {
                    #err("Access denied");
                } else {
                    #ok(chat);
                };
            };
        }
    };

    public shared(msg) func sendMessage(chatId: ChatId, content: Text) : async Result.Result<Message, Text> {
        let userId = msg.caller;
        if (Principal.isAnonymous(userId)) {
            return #err("Authentication required");
        };

        switch (chats.get(chatId)) {
            case (null) {
                #err("Chat not found");
            };
            case (?chat) {
                if (chat.owner != userId) {
                    #err("Access denied");
                } else {
                    // Create user message
                    let messageId = nextMessageId;
                    nextMessageId += 1;
                    
                    let userMessage : Message = {
                        id = messageId;
                        timestamp = currentTime();
                        sender = "user";
                        content = content;
                    };
                    
                    // Generate AI response
                    let llmRequest : LLMRequest = {
                        prompt = content;
                        temperature = 0.7;
                        maxTokens = 1000;
                    };
                    
                    let llmResponse = await queryLLM(llmRequest);
                    
                    let aiMessageId = nextMessageId;
                    nextMessageId += 1;
                    
                    let aiMessage : Message = {
                        id = aiMessageId;
                        timestamp = currentTime();
                        sender = "assistant";
                        content = llmResponse.text;
                    };
                    
                    // Update chat with both messages
                    let updatedMessages = Array.append(chat.messages, [userMessage, aiMessage]);
                    
                    let updatedChat : Chat = {
                        id = chat.id;
                        owner = chat.owner;
                        name = chat.name;
                        created = chat.created;
                        messages = updatedMessages;
                    };
                    
                    chats.put(chatId, updatedChat);
                    
                    #ok(userMessage);
                };
            };
        }
    };

    // Task Management
    public shared(msg) func createTask(description: Text) : async Result.Result<TaskId, Text> {
        let userId = msg.caller;
        if (Principal.isAnonymous(userId)) {
            return #err("Authentication required");
        };

        let taskId = nextTaskId;
        nextTaskId += 1;

        let newTask : Task = {
            id = taskId;
            owner = userId;
            description = description;
            created = currentTime();
            status = #pending;
            result = null;
        };

        tasks.put(taskId, newTask);
        addToUserTasks(userId, taskId);

        // Start task processing asynchronously
        ignore processTask(taskId);

        #ok(taskId)
    };

    private func processTask(taskId: TaskId) : async () {
        // Update task status to in-progress
        switch (tasks.get(taskId)) {
            case (null) {
                return;
            };
            case (?task) {
                let updatedTask : Task = {
                    id = task.id;
                    owner = task.owner;
                    description = task.description;
                    created = task.created;
                    status = #inProgress;
                    result = task.result;
                };
                tasks.put(taskId, updatedTask);
                
                try {
                    // Call LLM to process task
                    let llmRequest : LLMRequest = {
                        prompt = "Execute the following task: " # task.description;
                        temperature = 0.5;
                        maxTokens = 2000;
                    };
                    
                    let llmResponse = await queryLLM(llmRequest);
                    
                    // Update task with result
                    let completedTask : Task = {
                        id = task.id;
                        owner = task.owner;
                        description = task.description;
                        created = task.created;
                        status = #completed;
                        result = ?llmResponse.text;
                    };
                    tasks.put(taskId, completedTask);
                } catch (e) {
                    // Handle failure
                    let failedTask : Task = {
                        id = task.id;
                        owner = task.owner;
                        description = task.description;
                        created = task.created;
                        status = #failed;
                        result = ?Error.message(e);
                    };
                    tasks.put(taskId, failedTask);
                };
            };
        };
    };

    public shared(msg) func getTasks() : async Result.Result<[Task], Text> {
        let userId = msg.caller;
        if (Principal.isAnonymous(userId)) {
            return #err("Authentication required");
        };

        switch (userTasks.get(userId)) {
            case (null) {
                #ok([]);
            };
            case (?taskIds) {
                let userTaskList = Buffer.Buffer<Task>(taskIds.size());
                
                for (taskId in taskIds.vals()) {
                    switch (tasks.get(taskId)) {
                        case (null) {};
                        case (?task) {
                            userTaskList.add(task);
                        };
                    };
                };
                
                #ok(Buffer.toArray(userTaskList))
            };
        }
    };

    public shared(msg) func getTask(taskId: TaskId) : async Result.Result<Task, Text> {
        let userId = msg.caller;
        if (Principal.isAnonymous(userId)) {
            return #err("Authentication required");
        };

        switch (tasks.get(taskId)) {
            case (null) {
                #err("Task not found");
            };
            case (?task) {
                if (task.owner != userId) {
                    #err("Access denied");
                } else {
                    #ok(task);
                };
            };
        }
    };

    // User Authentication
    public shared query(msg) func getIdentity() : async Principal {
        return msg.caller;
    };

    // System Information
    public query func getCanisterInfo() : async Text {
        return "DEAI - Decentralized AI Assistant\nChat Count: " # Nat.toText(chats.size()) # "\nTask Count: " # Nat.toText(tasks.size());
    };
}

