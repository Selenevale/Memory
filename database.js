// database.js - v3.1 Star Feature Update

const DB_NAME = 'MemoryDB';
const DB_VERSION = 8; // **重要**：版本号提升

let db; // 用于持有数据库连接的全局变量

function initDB() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            const errorMsg = "您的浏览器不支持 IndexedDB，应用无法离线存储数据。";
            console.error(errorMsg);
            reject(errorMsg);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("数据库打开失败:", event.target.error);
            reject("数据库打开失败");
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("数据库连接成功！");
            resolve(db);
        };
 // 【请用这个完整的、最终正确的版本，替换掉你整个 onupgradeneeded 函数】
request.onupgradeneeded = (event) => {
    console.log("数据库结构升级中... (onupgradeneeded triggered for V8)");
    let database = event.target.result;
    const transaction = event.target.transaction;

// --- 【核心新增】创建“角色-头像”关系表 ---
    if (!database.objectStoreNames.contains('role_avatars')) {
        database.createObjectStore('role_avatars', { keyPath: 'role' });
        console.log("'role_avatars' 表已创建！");
    }

    // --- 1. 创建或升级 chats 表 ---
    let chatsStore;
    if (!database.objectStoreNames.contains('chats')) {
        chatsStore = database.createObjectStore('chats', { keyPath: 'id', autoIncrement: true });
        chatsStore.createIndex('eventDate', 'eventDate', { unique: false });
        chatsStore.createIndex('recordDate', 'recordDate', { unique: false });
        chatsStore.createIndex('title', 'title', { unique: false });
        chatsStore.createIndex('remarks', 'remarks', { unique: false });
    } else {
        chatsStore = transaction.objectStore('chats');
    }
// 【请在这里，添加下面这段“清理”代码】
    if (chatsStore.indexNames.contains('avatarId')) {
        chatsStore.deleteIndex('avatarId');
        console.log("从 'chats' 表移除了过时的 'avatarId' 索引。");
    }
    // --- 2. 创建或升级 messages 表 (无变化) ---
    if (!database.objectStoreNames.contains('messages')) {
        const messagesStore = database.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
        messagesStore.createIndex('chatId', 'chatId', { unique: false });
        messagesStore.createIndex('eventTimestamp', 'eventTimestamp', { unique: false });
        messagesStore.createIndex('content', 'content', { unique: false });
    }

    // --- 3. 创建或升级 starred_windows 表 ---
    let starredStore;
    if (!database.objectStoreNames.contains('starred_windows')) {
        starredStore = database.createObjectStore('starred_windows', { keyPath: 'id', autoIncrement: true });
        starredStore.createIndex('eventDate', 'eventDate', { unique: false });
        starredStore.createIndex('recordDate', 'recordDate', { unique: false });
        starredStore.createIndex('title', 'title', { unique: false });
        starredStore.createIndex('remarks', 'remarks', { unique: false });
    } else {
        starredStore = transaction.objectStore('starred_windows');
    }
// 【请在这里，添加下面这段“清理”代码】
    if (starredStore.indexNames.contains('avatarId')) {
        starredStore.deleteIndex('avatarId');
        console.log("从 'starred_windows' 表移除了过时的 'avatarId' 索引。");
    }   
    // --- 4. 创建或升级 starred_messages 表 (无变化) ---
    if (!database.objectStoreNames.contains('starred_messages')) {
        const starredMessagesStore = database.createObjectStore('starred_messages', { keyPath: 'id', autoIncrement: true });
        starredMessagesStore.createIndex('windowId', 'windowId', { unique: false });
        starredMessagesStore.createIndex('eventTimestamp', 'eventTimestamp', { unique: false });
    }
    
    // --- 5. 创建或升级 timelines 表 (无变化) ---
    if (!database.objectStoreNames.contains('timelines')) {
        const timelinesStore = database.createObjectStore('timelines', { keyPath: 'id', autoIncrement: true });
        timelinesStore.createIndex('eventDate', 'eventDate', { unique: false });
        timelinesStore.createIndex('title', 'title', { unique: false });
    }

    // --- 6. 创建或升级 timeline_nodes 表 (无变化) ---
    if (!database.objectStoreNames.contains('timeline_nodes')) {
        const nodesStore = database.createObjectStore('timeline_nodes', { keyPath: 'id', autoIncrement: true });
        nodesStore.createIndex('timelineId', 'timelineId', { unique: false });
        nodesStore.createIndex('parentId', 'parentId', { unique: false });
        nodesStore.createIndex('eventTimestamp', 'eventTimestamp', { unique: false });
    }
    
    // --- 7. 创建或升级 diary_entries 表 (无变化) ---
    if (!database.objectStoreNames.contains('diary_entries')) {
        const diaryStore = database.createObjectStore('diary_entries', { keyPath: 'id', autoIncrement: true });
        diaryStore.createIndex('eventDate', 'eventDate', { unique: false });
        diaryStore.createIndex('title', 'title', { unique: false });
    }

    // --- 8. 创建或升级 tag_categories 表 (无变化) ---
    if (!database.objectStoreNames.contains('tag_categories')) {
        const categoriesStore = database.createObjectStore('tag_categories', { keyPath: 'id', autoIncrement: true });
        categoriesStore.createIndex('name', 'name', { unique: true });
    }

    // --- 9. 创建或升级 tags 表 (无变化) ---
    if (!database.objectStoreNames.contains('tags')) {
        const tagsStore = database.createObjectStore('tags', { keyPath: 'id', autoIncrement: true });
        tagsStore.createIndex('name', 'name', { unique: true });
        tagsStore.createIndex('categoryId', 'categoryId', { unique: false });
    }

    // --- 10. 创建或升级 item_tags 表 (无变化) ---
    if (!database.objectStoreNames.contains('item_tags')) {
        const itemTagsStore = database.createObjectStore('item_tags', { keyPath: ['tagId', 'itemId'] });
        itemTagsStore.createIndex('tagId', 'tagId', { unique: false });
        itemTagsStore.createIndex('itemId', 'itemId', { unique: false });
    }

    // --- 11. 【核心】创建 avatars 表 ---
    if (!database.objectStoreNames.contains('avatars')) {
        database.createObjectStore('avatars', { keyPath: 'id', autoIncrement: true });
    }

    console.log("数据库结构创建/升级完成！");
};
    });
}