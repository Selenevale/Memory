// main.js - v2.1 Star Feature Implemented

document.addEventListener('DOMContentLoaded', () => {
    let isSelectionMode = false;
    let selectedMessageIds = new Set();
    let isChatListSelectionMode = false;
    let selectedChatIds = new Set();
    let previousView = 'home-view';
    let isStarredListSelectionMode = false;
    let selectedStarredIds = new Set();
    let currentDetailMode = 'chat'; // 'chat' 或 'starred'
    let isDiaryListSelectionMode = false;
    let selectedDiaryIds = new Set();
    let activeFilterTagIds = new Set();
    let globalSearchTerm = '';
    let highlightedElements = [];
let currentHighlightIndex = -1;
    let timelineObserver = null;
    let currentScrollContainer = null;
    let currentListMode = 'chats'; // 'chats' or 'starred'
    let croppieInstance = null; 
    let isNodeSelectionMode = false;         // 【新增】
    let selectedNodeIds = new Set();         // 【新增】


    // --- 1. 初始化数据库 ---
    initDB().then(() => {
        console.log("数据库准备就绪，应用可以开始运行。");
        setupNavigation();
        newDiaryBtn.dataset.action = 'addDiary';
        renderMemoryList(); 
        renderTagsSidebar();
    }).catch(error => {
        console.error("应用初始化失败:", error);
        alert("无法加载数据库，应用无法正常工作。");
    });

    // --- 2. 获取所有需要的DOM元素 ---
    const floatingActionsContainer = document.getElementById('floating-actions-container');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const mainContent = document.getElementById('main-content');
    const navLinksContainer = document.getElementById('nav-links');
    const importBtn = document.getElementById('import-btn');
    const exportAllBtn = document.getElementById('export-all-btn');
    const importFileInput = document.getElementById('import-file-input');
    const importModal = document.getElementById('import-modal');
    const closeModalBtn = importModal.querySelector('.close-btn');
    const parseAndSaveTextBtn = document.getElementById('parse-and-save-text-btn');
    const importTextarea = document.getElementById('import-textarea');
    const importTitle = document.getElementById('import-title');
    // --- 记忆列表（聊天、星标）视图元素 ---
const memoryListView = document.getElementById('memory-list-view');
const switchToChatsBtn = document.getElementById('switch-to-chats-btn');
const switchToStarredBtn = document.getElementById('switch-to-starred-btn');
const memoryListSelectBtn = document.getElementById('memory-list-select-btn');
const memoryListSelectionHeader = document.getElementById('memory-list-selection-header');
const cancelMemoryListSelectionBtn = document.getElementById('cancel-memory-list-selection-btn');
const selectAllMemoryListBtn = document.getElementById('select-all-memory-list-btn');
const applyTagsToMemoryListBtn = document.getElementById('apply-tags-to-memory-list-btn');
const deleteSelectedMemoryListBtn = document.getElementById('delete-selected-memory-list-btn');
const exportSelectedMemoryListBtn = document.getElementById('export-selected-memory-list-btn');
const memoryListContainer = document.getElementById('memory-list-container');


    const chatDetailView = document.getElementById('chat-detail-view');
    const backToListBtn = document.getElementById('back-to-list-btn');
    const chatDetailTitle = document.getElementById('chat-detail-title');
    const messagesContainer = document.getElementById('messages-container');
    const selectMessagesBtn = document.getElementById('select-messages-btn');
    const cancelSelectionBtn = document.getElementById('cancel-selection-btn');
    const chatDetailDate = document.getElementById('chat-detail-date');
    const selectAllBtn = document.getElementById('select-all-btn');
    
    const chatMenuBtn = document.getElementById('chat-menu-btn');
    const chatDropdownMenu = document.getElementById('chat-dropdown-menu');
    const remarksModal = document.getElementById('remarks-modal');
    const remarksTextarea = document.getElementById('remarks-textarea');
    const saveRemarksBtn = document.getElementById('save-remarks-btn');
    const closeRemarksModalBtn = remarksModal.querySelector('.close-btn');
    const downloadContainer = document.getElementById('download-link-container');
    const exportModal = document.getElementById('export-modal');
    const exportTextarea = document.getElementById('export-textarea');
    const selectAllExportBtn = document.getElementById('select-all-export-btn');
    const closeExportModalBtn = exportModal.querySelector('.close-btn');
    // --- 时间轴功能 (V4版本) ---
    const timelinesView = document.getElementById('timelines-view');
    const timelinesContentContainer = document.getElementById('timelines-content-container');
    const backToHomeBtnTimeline = document.getElementById('back-to-home-btn-timeline');
    const backToHomeBtnDiary = document.getElementById('back-to-home-btn-diary'); 
    const timelineHeader = document.getElementById('timelines-header');
    const timelineTitleBtn = document.getElementById('timeline-title-btn');
    const timelineSelectBtn = document.getElementById('timeline-select-btn');
    const timelineSelectAllBtn = document.getElementById('timeline-select-all-btn');
    const timelineDeleteBtn = document.getElementById('timeline-delete-btn');
    const timelineExportBtn = document.getElementById('timeline-export-btn');
    const timelineListDropdown = document.getElementById('timeline-list-dropdown');
    // 【新增】获取节点选择模式的元素
    const timelineNodeSelectBtn = document.getElementById('timeline-node-select-btn');
    const selectionNodesHeader = document.getElementById('selection-nodes-header');
    const cancelNodeSelectionBtn = document.getElementById('cancel-node-selection-btn');
    const selectAllNodesBtn = document.getElementById('select-all-nodes-btn');
    const applyTagsToNodesBtn = document.getElementById('apply-tags-to-nodes-btn');
    const deleteSelectedNodesBtn = document.getElementById('delete-selected-nodes-btn');
    const exportSelectedNodesBtn = document.getElementById('export-selected-nodes-btn');

    const timelineNodeMenu = document.getElementById('timeline-node-menu');
    const timelineMainTitle = document.getElementById('timeline-main-title');
    const bulkAddModal = document.getElementById('bulk-add-modal');
    const closeBulkAddModalBtn = bulkAddModal.querySelector('.close-btn');
    const showBulkAddBtn = document.getElementById('show-bulk-add-btn');
    const bulkAddTextarea = document.getElementById('bulk-add-textarea');
    const saveBulkNodesBtn = document.getElementById('save-bulk-nodes-btn');
    // --- 日记功能 (V5版本) ---
    const diaryView = document.getElementById('diary-view');
    const newDiaryBtn = document.getElementById('new-diary-btn');
    const diaryGridContainer = document.getElementById('diary-grid-container');
    const diaryHeader = document.getElementById('diary-header');
    const selectionDiaryHeader = document.getElementById('selection-diary-header');
    const diaryYearBtn = document.getElementById('diary-year-btn');
    const diarySelectBtn = document.getElementById('diary-select-btn');
    const cancelDiarySelectionBtn = document.getElementById('cancel-diary-selection-btn');
    const selectAllDiariesBtn = document.getElementById('select-all-diaries-btn');
    const deleteSelectedDiariesBtn = document.getElementById('delete-selected-diaries-btn');
    const exportSelectedDiariesBtn = document.getElementById('export-selected-diaries-btn');
    const diaryYearDropdown = document.getElementById('diary-year-dropdown');

    const diaryEntryView = document.getElementById('diary-entry-view');
    const backToDiaryListBtn = document.getElementById('back-to-diary-list-btn');
    const diaryEntryDateInput = document.getElementById('diary-entry-date-input');
    const saveDiaryEntryBtn = document.getElementById('save-diary-entry-btn');
    const diaryEntryTextarea = document.getElementById('diary-entry-textarea');

const tagsNavContainer = document.getElementById('tags-nav-container');
const tagCreationModal = document.getElementById('tag-creation-modal');
const newTagNameInput = document.getElementById('new-tag-name-input');
const newTagCategoryInput = document.getElementById('new-tag-category-input');
const categorySuggestions = document.getElementById('category-suggestions');
const saveNewTagBtn = document.getElementById('save-new-tag-btn');
const applyTagModal = document.getElementById('apply-tag-modal');
const applyTagList = document.getElementById('apply-tag-list');
const confirmApplyTagBtn = document.getElementById('confirm-apply-tag-btn');

const timelineApplyTagsBtn = document.getElementById('timeline-apply-tags-btn');
const applyTagsToDiariesBtn = document.getElementById('apply-tags-to-diaries-btn');

const globalSearchInput = document.getElementById('global-search-input');
const searchNavControls = document.getElementById('search-nav-controls');
const searchMatchCount = document.getElementById('search-match-count');
const searchPrevBtn = document.getElementById('search-prev-btn');
const searchNextBtn = document.getElementById('search-next-btn');
const searchCloseBtn = document.getElementById('search-close-btn');

// --- 设置与头像画廊相关元素 ---
    const settingsView = document.getElementById('settings-view');
    const addNewAvatarBtn = document.getElementById('add-new-avatar-btn');
    const avatarGalleryContainer = document.getElementById('avatar-gallery-container');
    
    // --- 头像剪裁弹窗相关元素 ---
    const avatarCropperModal = document.getElementById('avatar-cropper-modal');
    const croppieContainer = document.getElementById('croppie-container');
    const avatarUploadInput = document.getElementById('avatar-upload-input');
    const confirmCropBtn = document.getElementById('confirm-crop-btn');
    const closeCropperBtn = avatarCropperModal.querySelector('.close-btn');
    // --- 3. 绑定所有事件监听器 ---
    toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    const isOpen = sidebar.classList.toggle('open');
    sidebarOverlay.style.opacity = isOpen ? '1' : '0';
    sidebarOverlay.style.pointerEvents = isOpen ? 'auto' : 'none';
});
    // 点击主内容区或遮罩层，都会关闭侧边栏
const closeSidebar = () => {
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        sidebarOverlay.style.opacity = '0';
        sidebarOverlay.style.pointerEvents = 'none';
    }
};
mainContent.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
    importBtn.addEventListener('click', () => importModal.classList.add('visible'));
    closeModalBtn.addEventListener('click', () => importModal.classList.remove('visible'));
    importModal.addEventListener('click', (e) => {
        if (e.target === importModal) importModal.classList.remove('visible');
    });

    parseAndSaveTextBtn.addEventListener('click', async () => {
        const text = importTextarea.value.trim();
        const title = importTitle.value.trim() || `新的聊天 ${new Date().toLocaleDateString()}`;
        if (!text) {
            alert('请粘贴聊天内容！');
            return;
        }
        try {
            const messages = parseChatText(text);
            if (messages.length === 0) {
                alert('无法解析任何消息，请检查格式！\n请确保每条消息都以 "¥" 或 "$" 开头。');
                return;
            }
            const now = new Date();
            const newChat = {
                title: title,
                model: 'unknown',
                remarks: '',
                recordDate: now,
                eventDate: now
            };
            await addChatToDB(newChat, messages);
            alert('聊天记录已成功保存！');
            importTextarea.value = '';
            importTitle.value = '';
            importModal.classList.remove('visible');
            switchView('memory-list-view');
        } catch (error) {
            console.error('保存聊天记录时出错:', error);
            alert('保存失败，请稍后再试。');
        }
    });

// --- 【全新的】记忆列表视图事件监听 ---

// 监听“聊天/星标”切换开关
switchToChatsBtn.addEventListener('click', () => {
    if (currentListMode === 'chats') return;
    currentListMode = 'chats';
    switchToChatsBtn.classList.add('active');
    switchToStarredBtn.classList.remove('active');
    renderMemoryList();
});

switchToStarredBtn.addEventListener('click', () => {
    if (currentListMode === 'starred') return;
    currentListMode = 'starred';
    switchToStarredBtn.classList.add('active');
    switchToChatsBtn.classList.remove('active');
    renderMemoryList();
});

// 监听列表项的点击（负责“进入详情页”或“选中”）
// 【请用这个全新的、带有“探测器”的版本进行替换】
memoryListContainer.addEventListener('click', (e) => {
    console.log('[探测器] 1. 列表点击事件已触发！');
    
    const listItem = e.target.closest('.chat-list-item');
    if (!listItem) {
        console.log('[探测器] 2. 未能找到 listItem，事件结束。');
        return;
    }
    console.log('[探测器] 2. 成功找到 listItem。');

    if (memoryListView.classList.contains('selection-mode-active')) {
        console.log('[探测器] 3. 当前为选择模式，执行 toggleMemoryListItemSelection。');
        toggleMemoryListItemSelection(listItem);
    } else {
        console.log('[探测器] 3. 当前为普通模式，准备进入详情页。');
        
        if (currentListMode === 'chats') {
    console.log('[探测器] 4. 识别为“聊天”模式。');
    const chatId = parseInt(listItem.dataset.chatId);
    if (isNaN(chatId)) return; // <--【新增】检查ID是否有效
    const chatTitle = listItem.querySelector('.title').textContent;
    console.log(`[探测器] 5. 准备打开聊天: ID=${chatId}, 标题=${chatTitle}`);
    openChat(chatId, chatTitle);
        } else {
            console.log('[探测器] 4. 识别为“星标”模式。');
            const starredId = parseInt(listItem.dataset.starredId);
    if (isNaN(starredId)) return; // <--【在这里也加上】
            const starredTitle = listItem.querySelector('.title').textContent;
            console.log(`[探测器] 5. 准备打开星标: ID=${starredId}, 标题=${starredTitle}`);
            openStarredWindow(starredId, starredTitle);
        }
    }
});

// 监听选择模式的各个按钮
memoryListSelectBtn.addEventListener('click', enterMemoryListSelectionMode);
cancelMemoryListSelectionBtn.addEventListener('click', exitMemoryListSelectionMode);
selectAllMemoryListBtn.addEventListener('click', toggleSelectAllMemoryList);

// 【memorylist页面删除事件监听器】
deleteSelectedMemoryListBtn.addEventListener('click', async () => {
    const idsSet = (currentListMode === 'chats') ? selectedChatIds : selectedStarredIds;
    const itemType = (currentListMode === 'chats') ? '聊天' : '星标收藏';

    if (idsSet.size === 0) return alert(`请先选择要删除的${itemType}！`);
    if (!confirm(`您确定要删除这 ${idsSet.size} 个${itemType}吗？此操作不可恢复！`)) return;

    try {
        if (currentListMode === 'chats') {
            await deleteChatsFromDB([...idsSet]);
        } else {
            await deleteStarredWindowsFromDB([...idsSet]);
        }
        alert('删除成功！');
        exitMemoryListSelectionMode();
        renderMemoryList();
    } catch (error) {
        console.error(`删除${itemType}失败:`, error);
        alert(`删除失败: ${error.message}`);
    }
});

// 【momerylist页面添加标签事件监听器】
applyTagsToMemoryListBtn.addEventListener('click', () => {
    const idsSet = (currentListMode === 'chats') ? selectedChatIds : selectedStarredIds;
    if (idsSet.size === 0) return;
    openApplyTagModal(); // 直接调用已有的函数
});

// 【请添加导出按钮函数事件监听器】
exportSelectedMemoryListBtn.addEventListener('click', handleExportSelectedMemoryList);

// --- 聊天返回原位置 ---
backToListBtn.addEventListener('click', () => {
    try {
        let key = '';
        // 使用我们之前确认过的、最可靠的 currentDetailMode 来判断
        if (currentDetailMode === 'chat') {
            const chatId = chatDetailView.dataset.currentChatId;
            if (chatId) key = `scrollPos-${chatId}`;
        } else if (currentDetailMode === 'starred') {
            const starredId = chatDetailView.dataset.currentStarredId;
            if (starredId) key = `scrollPos-starred-${starredId}`;
        }

        if (key) {
            const scrollPosition = messagesContainer.scrollTop;
            localStorage.setItem(key, scrollPosition);
        } 
    } catch (error) {
        console.error("保存滚动位置失败:", error);
    }
    switchView(previousView);
});
    cancelSelectionBtn.addEventListener('click', exitSelectionMode);
    chatDetailTitle.addEventListener('click', handleTitleEdit);

    // 【请用这个全新的、修复了点击选择功能的版本，替换掉整个 messagesContainer 监听代码块】

let messagePressTimer = null;
let isMessageLongPress = false;

// --- 触摸开始：启动长按计时器 ---
// 【请用这个增加了“检查站”的最终正确版，完整替换旧的监听器】
messagesContainer.addEventListener('touchstart', (e) => {
    if (isSelectionMode) return;

    // --- 【核心新增】“检查站” ---
    // 检查这次触摸事件的“最原始目标”是不是一个头像，或者在头像内部
    if (e.target.closest('.list-item-avatar, .detail-header-avatar')) {
        // 如果是，说明这次是冲着头像来的，那我们“编辑气泡”的功能就直接“罢工”
        return; 
    }

    // 只有通过了检查站，才执行原来的“长按编辑气泡”逻辑
    const bubble = e.target.closest('.message-bubble');
    if (!bubble) return; 

    const messageItem = bubble.closest('.message-item');
    if (!messageItem) return;

    isMessageLongPress = false;
    messagePressTimer = setTimeout(() => {
        isMessageLongPress = true;
        enterMessageEditMode(messageItem);
    }, 500);
});

// --- 触摸结束：判断是长按、短按还是选择 ---
messagesContainer.addEventListener('touchend', (e) => {
    clearTimeout(messagePressTimer);

    // 如果是一次已经触发了的长按，就直接结束，不做任何事
    if (isMessageLongPress) {
        return;
    }

    // 如果不是长按（即：这是一次短促的“点击”或“触摸”）
    const messageItem = e.target.closest('.message-item');
    if (!messageItem) return;

    // 检查当前是否在选择模式
    if (isSelectionMode) {
        // 如果是，那么这次点击就应该执行“选中/取消选中”
        toggleMessageSelection(messageItem);
    }
    // 如果不是选择模式，那么这次点击就什么也不做
});

// --- 触摸移动：如果在滑动，则取消长按 ---
messagesContainer.addEventListener('touchmove', () => {
    clearTimeout(messagePressTimer);
});


chatDetailDate.addEventListener('click', async (e) => {
    // 从更大的容器读取，而不是从 e.target (日期框) 读取
    const chatId = parseInt(chatDetailView.dataset.currentChatId); 
        if (!chatId) return;
        const dateString = prompt("请输入新的日期 (格式: YYYY-MM-DD)", new Date().toISOString().split('T')[0]);
        if (dateString) {
            try {
                const newDate = new Date(dateString);
                if (isNaN(newDate.getTime())) {
                    alert("日期格式无效！");
                    return;
                }
                await updateChatDateInDB(chatId, newDate);
                e.target.textContent = newDate.toLocaleDateString();
                renderChatsList();
            } catch (error) {
                console.error("更新日期失败:", error);
                alert("更新日期失败。");
            }
        }
    });

    selectAllBtn.addEventListener('click', toggleSelectAllMessages);
    
selectMessagesBtn.addEventListener('click', enterSelectionMode);

    const deleteSelectedBtn = document.getElementById('delete-selected-btn');
    const starSelectedBtn = document.getElementById('star-selected-btn');
    const exportSelectedBtn = document.getElementById('export-selected-btn');

    deleteSelectedBtn.addEventListener('click', async () => {
        if (selectedMessageIds.size === 0) return alert('请先选择要删除的消息！');
        if (!confirm(`确定要删除选中的 ${selectedMessageIds.size} 条消息吗？`)) return;
        try {
            if (currentDetailMode === 'chat') {
                await deleteMessagesFromDB('messages', [...selectedMessageIds]);
                alert('删除成功！');
                // 【核心修复】从正确的 chatDetailView 中取ID
                const currentChatId = parseInt(chatDetailView.dataset.currentChatId); 
                const currentChatTitle = chatDetailTitle.textContent;
                exitSelectionMode();
                openChat(currentChatId, currentChatTitle);
            } else { // 'starred'
                await deleteMessagesFromDB('starred_messages', [...selectedMessageIds]);
                alert('删除成功！');
                // 【核心修复】从正确的 chatDetailView 中取ID
                const currentStarredId = parseInt(chatDetailView.dataset.currentStarredId); 
                const currentStarredTitle = chatDetailTitle.textContent;
                exitSelectionMode();
                openStarredWindow(currentStarredId, currentStarredTitle);
            }
        } catch (error) {
            console.error('删除消息失败:', error);
            alert(`删除消息失败: ${error.message}`);
        }
    });

    // --- 【核心改动】 ---
    starSelectedBtn.addEventListener('click', async () => {
        if (selectedMessageIds.size === 0) return alert('请先选择要星标的消息！');

        const title = prompt('请输入新星标窗口的标题:', `精选 - ${chatDetailTitle.textContent}`);
        if (!title || !title.trim()) {
            return; // 用户取消或未输入标题
        }

        try {
            await createStarredWindowWithMessages(title, [...selectedMessageIds]);
            alert('星标成功！已在“星标窗口”中创建新的收藏。');
            exitSelectionMode();
        } catch (error) {
            console.error('星标操作失败:', error);
            alert(`创建星标收藏失败: ${error.message}`);
        }
    });

    exportSelectedBtn.addEventListener('click', async () => {
        if (selectedMessageIds.size === 0) return alert('请先选择要导出的消息！');
        const format = prompt("请选择导出格式:\n\n1. JSON\n2. TXT", "1");
        if (!format) return;
        try {
            const table = currentDetailMode === 'chat' ? 'messages' : 'starred_messages';
            const messages = await getMessagesByIds(table, [...selectedMessageIds]);

            if (!messages || messages.length === 0) return alert('未能获取到任何可导出的消息。');

            const dataToExport = [{
                chat: { title: `${chatDetailTitle.textContent} (部分导出)`, eventDate: new Date() },
                messages: messages
            }];

            showExportModal(dataToExport, format);
            exitSelectionMode();

        } catch (error) {
            alert(`导出失败: ${error.message}`);
        }
    });

    closeExportModalBtn.addEventListener('click', () => exportModal.classList.remove('visible'));
    selectAllExportBtn.addEventListener('click', () => {
        exportTextarea.focus();
        exportTextarea.select();
        selectAllExportBtn.textContent = '已全选,请手动复制';
        setTimeout(() => {
            selectAllExportBtn.textContent = '一键全选文本';
        }, 1500);
    });

    // --- 【新】菜单按钮和备注弹窗的事件 ---

    // 点击“三点”按钮，显示/隐藏菜单
    chatMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止点击事件冒泡到document，导致菜单刚打开就关闭
        chatDropdownMenu.classList.toggle('visible');
    });

    // 点击菜单内部的按钮
    chatDropdownMenu.addEventListener('click', (e) => {
        // 阻止事件冒泡，这是为了防止全局监听器意外关闭菜单
        e.stopPropagation();

        // 使用 .closest() 来确保我们总是能找到被点击的按钮
        const button = e.target.closest('button');
        if (!button) return; // 如果点的不是按钮，就什么也不做

        // 从按钮上获取 data-action 属性
        const action = button.dataset.action;

        // 先把菜单关掉
        chatDropdownMenu.classList.remove('visible');

        // 根据 action 执行相应的函数
        if (action === 'select') {
            enterSelectionMode();
        } else if (action === 'remarks') {
            openRemarksModal();
        }
    });
// --- 这是“选择消息”按钮的事件监听 ---
selectMessagesBtn.addEventListener('click', enterSelectionMode);

    // 备注弹窗的关闭和保存
    closeRemarksModalBtn.addEventListener('click', () => remarksModal.classList.remove('visible'));
    remarksModal.addEventListener('click', e => { if (e.target === remarksModal) remarksModal.classList.remove('visible'); });
    saveRemarksBtn.addEventListener('click', handleSaveRemarks);

    // --- 【最终版】时间轴 V4 事件监听 ---
    let activeNodeElement = null; // 追踪当前激活的节点
    let isTimelineListSelectMode = false;
    let selectedTimelineIds = new Set();

    // 返回按钮
    backToHomeBtnTimeline.addEventListener('click', () => switchView('home-view'));

backToHomeBtnDiary.addEventListener('click', () => switchView('home-view'));

    // 点击标题按钮，切换时间轴列表下拉菜单
    timelineTitleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTimelineListDropdown();
    });

    // 点击“选择”按钮，切换时间轴列表的选择模式
    timelineSelectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isTimelineListSelectMode = !isTimelineListSelectMode;
        if(isTimelineListSelectMode) {
            enterTimelineListSelectionMode();
        } else {
            exitTimelineListSelectionMode();
            // 关键：退出选择模式后，也要隐藏下拉菜单
            timelineListDropdown.classList.remove('visible');
        }
    });
// --- 【新增】时间轴节点选择模式的事件监听 ---

// 点击“节点选择”图标，进入模式
timelineNodeSelectBtn.addEventListener('click', () => {
    if (isNodeSelectionMode) {
        exitNodeSelectionMode();
    } else {
        enterNodeSelectionMode();
    }
});

// 点击“取消”
cancelNodeSelectionBtn.addEventListener('click', exitNodeSelectionMode);

// 点击“全选”
selectAllNodesBtn.addEventListener('click', handleSelectAllNodes);

// 点击“添加标签”
applyTagsToNodesBtn.addEventListener('click', () => {
    if (selectedNodeIds.size === 0) return alert('请先选择要添加标签的节点！');
    // 我们将复用已有的函数，稍后对它进行改造
    openApplyTagModal(); 
});

// 点击“删除”
deleteSelectedNodesBtn.addEventListener('click', handleDeleteSelectedNodes);

// 点击“导出”
exportSelectedNodesBtn.addEventListener('click', handleExportSelectedNodes);

// --- 【全新、更简洁的】全局点击事件监听器 ---

document.addEventListener('click', (e) => {
    const target = e.target; 

    // 1. 关闭聊天详情页的“三点”下拉菜单
    // 【核心修复】增加一个条件：确保点击的目标也不在下拉菜单内部
    if (chatDropdownMenu.classList.contains('visible') && 
        !chatMenuBtn.contains(target) && 
        !chatDropdownMenu.contains(target)) {
        chatDropdownMenu.classList.remove('visible');
    }

        // 2. 关闭时间轴抬头区域的“时间轴列表”下拉菜单
        const isClickInHeader = timelineHeader.contains(target);
        const isClickInApplyModal = applyTagModal.contains(target); // <-- 【核心修正】检查点击是否在弹窗内

        if (timelineListDropdown.classList.contains('visible') && !isClickInHeader && !isClickInApplyModal) {
            if(isTimelineListSelectMode){ 
                exitTimelineListSelectionMode(); 
            }
            timelineListDropdown.classList.remove('visible');
        }
    });


    // 【新增】为顶部的 全选、删除、导出 按钮绑定功能
timelineSelectAllBtn.addEventListener('click', async (e) => {
    e.stopPropagation(); 

    // 1. 【核心修复】不再从数据库拿，而是直接从【当前可见的】下拉列表里获取
    const allVisibleItems = timelineListDropdown.querySelectorAll('.timeline-dropdown-row');
    const allVisibleIds = Array.from(allVisibleItems)
        // 从每个列表项的 checkbox 上获取 timeline-id
        .map(item => item.querySelector('.timeline-list-checkbox')?.dataset.timelineId)
        // 过滤掉“新建时间轴”那一行和任何没有ID的无效项
        .filter(Boolean)
        .map(id => parseInt(id));

    // 2. 判断是“全选”还是“取消全选”
    const shouldSelectAll = selectedTimelineIds.size < allVisibleIds.length;

    // 3. 执行操作
    allVisibleIds.forEach(id => {
        if (shouldSelectAll) {
            selectedTimelineIds.add(id);
        } else {
            selectedTimelineIds.delete(id);
        }
    });

    // 4. 更新UI
    timelineSelectAllBtn.textContent = shouldSelectAll ? '取消全选' : '全选';
    // 重新渲染下拉列表以更新复选框状态
    await toggleTimelineListDropdown();
});

    timelineDeleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // 防止菜单关闭
        await handleDeleteSelectedTimelines();
    });

    timelineExportBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // 防止菜单关闭
        await handleExportSelectedTimelines();
    });
    
    // 【新增】快速构建功能的事件监听
    showBulkAddBtn.addEventListener('click', () => {
        bulkAddTextarea.value = ''; // 清空上次输入
        bulkAddModal.classList.add('visible');
    });

    closeBulkAddModalBtn.addEventListener('click', () => bulkAddModal.classList.remove('visible'));
    bulkAddModal.addEventListener('click', (e) => {
        if (e.target === bulkAddModal) bulkAddModal.classList.remove('visible');
    });

    saveBulkNodesBtn.addEventListener('click', handleSaveBulkNodes);

    // --- 【全新】为“编辑大纲”按钮绑定事件 ---
    const editTimelineOutlineBtn = document.getElementById('edit-timeline-outline-btn');
    if (editTimelineOutlineBtn) {
        editTimelineOutlineBtn.addEventListener('click', async () => {
            // 从主视图容器读取ID，这最可靠
            const currentTimelineId = parseInt(timelinesView.dataset.currentTimelineId);
            if (!currentTimelineId) {
                alert("请先选择一个时间轴。");
                return;
            }

            // --- 核心升级：同时获取节点和时间轴本身的信息 ---
            const nodes = await getNodesForTimeline(currentTimelineId);
            const timeline = await getTimelineById(currentTimelineId); // 获取标题需要它

            if (!timeline) {
                alert("找不到当前时间轴的信息。");
                return;
            }

            // --- 步骤1：将节点数据“反向工程”为Markdown文本 ---
            const nodeMap = new Map(nodes.map(node => [node.id, { ...node, children: [] }]));
            const tree = [];
            for (const node of nodeMap.values()) {
                if (node.parentId && nodeMap.has(node.parentId)) {
                    nodeMap.get(node.parentId).children.push(node);
                } else {
                    tree.push(node);
                }
            }

            function buildMarkdown(nodes, level) {
                let md = '';
                for (const node of nodes) {
                    // 使用 repeat 来生成星号，更简洁
                    md += '*'.repeat(level + 1) + ' ' + node.content + '\n';
                    if (node.children.length > 0) {
                        md += buildMarkdown(node.children, level + 1);
                    }
                }
                return md;
            }

            const markdownText = buildMarkdown(tree, 0);

            // --- 步骤2：将生成的标题和文本填充到弹窗并显示 ---
            document.getElementById('bulk-edit-timeline-title').value = timeline.title;
            bulkAddTextarea.value = markdownText;
            bulkAddModal.classList.add('visible');
        });
    }

    // --- 【全新终极版】时间轴内容区交互事件监听 ---
    let pressTimer = null;
    let isLongPress = false;
    let isEditing = false; // 添加一个全局状态，防止同时编辑多个节点

    timelinesContentContainer.addEventListener('touchstart', (e) => {
        if (isEditing) return; // 如果已经在编辑模式，则忽略任何触摸事件

        const nodeItem = e.target.closest('.timeline-node-item');
        if (!nodeItem) return;

        isLongPress = false; // 重置长按标志

        // 开始一个计时器，如果在500毫秒内没有松手，就视为长按
        pressTimer = setTimeout(() => {
            isLongPress = true;
            enterNodeEditMode(nodeItem); // 触发编辑模式
        }, 500); 
    });

    timelinesContentContainer.addEventListener('touchend', (e) => {
        clearTimeout(pressTimer); // 无论如何，松手时都要清除计时器

// 【核心修改】在这里拦截选择模式的点击
    if (isNodeSelectionMode) {
        const nodeItem = e.target.closest('.timeline-node-item');
        if (nodeItem) {
            toggleNodeSelection(nodeItem);
        }
        return; // 拦截后，直接结束函数，不执行后面的逻辑
    }

        if (isEditing || isLongPress) {
            // 如果是长按触发的，或者已经进入编辑模式，则松手时不执行任何操作
            return;
        }

        // 如果不是长按（即：这是一个短按/点击）
        const nodeItem = e.target.closest('.timeline-node-item');
        if (nodeItem) {
            const toggle = nodeItem.querySelector('.node-toggle');
            const targetIsToggle = e.target.closest('.node-toggle');
            const targetIsText = e.target.closest('.node-text');

            // 如果点击的是小三角或者节点文字，都触发折叠
            if (toggle && (targetIsToggle || targetIsText)) {
                toggleNodeCollapse(toggle);
            }
        }
    });

    // 防止在节点上滑动时误触发长按
    timelinesContentContainer.addEventListener('touchmove', () => {
        clearTimeout(pressTimer);
    });

    // --- 日记功能事件监听 ---
// 【请用这个最终的、逻辑分离的版本进行替换】
newDiaryBtn.addEventListener('click', (event) => {
    const currentAction = newDiaryBtn.dataset.action;

    if (currentAction === 'addDiary') {
        // --- 这是同步逻辑，直接执行 ---
        openDiaryEntry();
    } 
    else if (currentAction === 'editTimeline') {
        // --- 这是异步逻辑，我们需要把它包在一个 async 函数里立即执行 ---
        (async () => {
            try {
                const currentTimelineId = parseInt(timelinesView.dataset.currentTimelineId);
                if (!currentTimelineId) {
                    alert("请先选择一个时间轴。");
                    return;
                }

                const nodes = await getNodesForTimeline(currentTimelineId);
                const timeline = await getTimelineById(currentTimelineId);

                if (!timeline) {
                    alert("找不到当前时间轴的信息。");
                    return;
                }

                const nodeMap = new Map(nodes.map(node => [node.id, { ...node, children: [] }]));
                const tree = [];
                for (const node of nodeMap.values()) {
                    if (node.parentId && nodeMap.has(node.parentId)) {
                        nodeMap.get(node.parentId).children.push(node);
                    } else {
                        tree.push(node);
                    }
                }

                function buildMarkdown(nodes, level) {
                    let md = '';
                    for (const node of nodes) {
                        md += '*'.repeat(level + 1) + ' ' + node.content + '\n';
                        if (node.children.length > 0) {
                            md += buildMarkdown(node.children, level + 1);
                        }
                    }
                    return md;
                }

                const markdownText = buildMarkdown(tree, 0);

                document.getElementById('bulk-edit-timeline-title').value = timeline.title;
                bulkAddTextarea.value = markdownText;
                bulkAddModal.classList.add('visible');

            } catch (error) {
                console.error("打开编辑大纲失败:", error);
                alert("无法打开编辑大纲弹窗。");
            }
        })(); // <-- 注意这里的小括号，它表示立即执行这个 async 函数
    }
});
    backToDiaryListBtn.addEventListener('click', () => switchView('diary-view'));
    saveDiaryEntryBtn.addEventListener('click', handleSaveDiary);
    
    // 点击日记卡片进入编辑
    diaryGridContainer.addEventListener('click', e => {
        const card = e.target.closest('.diary-card');
        if (!card) return;

        const diaryId = parseInt(card.dataset.diaryId);
if (isNaN(diaryId)) return; // <--【新增】检查ID是否有效
        if (isDiaryListSelectionMode) {
            // 如果在选择模式下，切换选中状态
            toggleDiarySelection(card);
        } else {
            // 否则，打开日记
            openDiaryEntry(diaryId);
        }
    });
// --- 【新增】日记列表头部与选择模式的事件监听 ---
    diaryYearBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡导致菜单立即关闭
        toggleDiaryYearDropdown();
    });

    diarySelectBtn.addEventListener('click', enterDiarySelectionMode);
    cancelDiarySelectionBtn.addEventListener('click', exitDiarySelectionMode);

    selectAllDiariesBtn.addEventListener('click', handleSelectAllDiaries);
    deleteSelectedDiariesBtn.addEventListener('click', handleDeleteSelectedDiaries);
    exportSelectedDiariesBtn.addEventListener('click', handleExportSelectedDiaries);


// --- “个性化设置”页面的事件监听 ---

// 1. 点击“添加新头像”按钮
addNewAvatarBtn.addEventListener('click', () => {
    avatarUploadInput.click(); // 触发隐藏的文件选择框
});

// 2. 用户选择了图片文件
avatarUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        avatarCropperModal.classList.add('visible');
        if (croppieInstance) {
            croppieInstance.destroy(); // 销毁旧的实例
        }
        croppieInstance = new Croppie(croppieContainer, {
            viewport: { width: 200, height: 200, type: 'circle' }, // 圆形取景框
            boundary: { width: 250, height: 250 },
            enableExif: true
        });
        croppieInstance.bind({
            url: event.target.result,
        });
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // 清空选择，以便下次能选择同一个文件
});

// 3. 点击“确认并保存”剪裁
confirmCropBtn.addEventListener('click', async () => {
    if (!croppieInstance) return;
    try {
        const result = await croppieInstance.result({
            type: 'base64',
            size: 'viewport', // 结果尺寸与视口一致
            format: 'png',
            quality: 0.9 // 90% 的质量
        });
        
        await addAvatarToDB(result);
        avatarCropperModal.classList.remove('visible');
        renderAvatarGallery(); // 成功后，立刻刷新画廊

    } catch (error) {
        console.error("保存头像失败:", error);
        alert('保存头像失败！');
    }
});

// 4. 关闭剪裁弹窗
closeCropperBtn.addEventListener('click', () => {
    avatarCropperModal.classList.remove('visible');
});

// 5. 点击“删除”按钮 (使用事件委托)
avatarGalleryContainer.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete-avatar-btn');
    if (!deleteBtn) return;

    const avatarId = parseInt(deleteBtn.dataset.avatarId);
    if (isNaN(avatarId)) return;

    if (confirm("您确定要从画廊删除这张头像吗？\n（使用此头像的聊天窗口将恢复默认）")) {
        try {
            await deleteAvatarFromDB(avatarId);
            renderAvatarGallery(); // 删除成功后，刷新画廊
        } catch (error) {
            console.error("删除头像失败:", error);
            alert('删除头像失败！');
        }
    }
});
    
// --- 【新增】全局搜索事件监听 ---
globalSearchInput.addEventListener('change', (e) => {
    globalSearchTerm = e.target.value.trim().toLowerCase();
    // 触发当前视图的重新渲染以应用搜索
    const currentView = document.querySelector('.view.active-view');
    if (currentView) switchView(currentView.id);
});

searchCloseBtn.addEventListener('click', () => {
    // 清空搜索并刷新
    globalSearchInput.value = '';
    globalSearchTerm = '';
    const currentView = document.querySelector('.view.active-view');
    if (currentView) switchView(currentView.id);
});


// --- 文件导入功能事件监听 ---
// 【请用这个全新的“调度员”版本替换旧的事件监听器】
importFileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // --- 智能调度逻辑 ---
    if (file.name.toLowerCase().endsWith('.json')) {
        // 如果是 JSON 文件，交给新的 JSON 处理器
        await handleJsonImport(file);
    } else if (file.name.toLowerCase().endsWith('.txt')) {
        // 如果是 TXT 文件，交给旧的 TXT 处理器
        await handleTxtImport(file);
    } else {
        alert('不支持的文件格式。请选择 .json 或 .txt 文件。');
    }

    // 清空文件选择框，以便下次可以选择同一个文件
    event.target.value = ''; 
});

// 全局导出事件监听
exportAllBtn.addEventListener('click', handleGlobalExport);

    // --- 4. 定义所有功能函数 ---

// 【请添加这个全新的工具函数】
async function getAllDataFromStore(storeName) {
    if (!db) return Promise.reject("数据库未连接！");
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onerror = event => reject(event.target.error);
        request.onsuccess = event => resolve(event.target.result);
    });
}

// 【请添加这个全新的全局导出函数】
async function handleGlobalExport() {
    if (!confirm('您要导出应用的全部数据吗？这将生成一个包含所有记忆的备份文件。')) {
        return;
    }

    try {
        console.log("开始全局导出...");

        // 使用 Promise.all 并行读取所有“隔层”的数据，速度更快
        const [
            chats, messages, starred_windows, starred_messages,
            timelines, timeline_nodes, diary_entries,
            tag_categories, tags, item_tags
        ] = await Promise.all([
            getAllDataFromStore('chats'),
            getAllDataFromStore('messages'),
            getAllDataFromStore('starred_windows'),
            getAllDataFromStore('starred_messages'),
            getAllDataFromStore('timelines'),
            getAllDataFromStore('timeline_nodes'),
            getAllDataFromStore('diary_entries'),
            getAllDataFromStore('tag_categories'),
            getAllDataFromStore('tags'),
            getAllDataFromStore('item_tags')
        ]);

        // 按照我们设计的蓝图，把所有数据装进“行李箱”
        const backupData = {
            appName: "Memory",
            fileVersion: "1.0",
            exportDate: new Date().toISOString(),
            data: {
                chats, messages, starred_windows, starred_messages,
                timelines, timeline_nodes, diary_entries,
                tag_categories, tags, item_tags
            }
        };

        // 把“行李箱”对象转换成格式优美的 JSON 文本
        const jsonString = JSON.stringify(backupData, null, 2);

        // 创建一个可供下载的文件
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // 格式化一个好看的文件名，例如：Memory Backup 2025-08-24.json
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `Memory Backup ${dateStr}.json`;

        // 复用我们已有的下载提示框来显示下载链接
        // 这是在 iOS 上最可靠的下载方式
        showDownloadLink(link);

        console.log("全局导出文件已准备就绪！");

    } catch (error) {
        console.error("全局导出失败:", error);
        alert(`导出失败: ${error.message}`);
    }
}

// 【请添加下面这一整段全新的代码】

/**
 * 主函数：处理 JSON 文件的导入
 */
async function handleJsonImport(file) {
    try {
        const fileContent = await file.text();
        const backupData = JSON.parse(fileContent);

        // 简单验证一下文件是否正确
        if (backupData.appName !== 'Memory') {
            throw new Error('这不是一个有效的 Memory 备份文件。');
        }

        const confirmation = prompt(
            '警告：导入备份将清空当前应用内的所有数据，此操作不可恢复！\n\n' +
            `你确定要从文件 "${file.name}" 恢复吗？\n\n` +
            '如果确定，请输入 "恢复" 来继续。'
        );

        if (confirmation !== '恢复') {
            alert('操作已取消。');
            return;
        }

        console.log("开始清空数据库...");
        await clearAllDataFromDB();
        console.log("数据库已清空，开始写入新数据...");
        await populateDbFromJson(backupData.data);
        console.log("数据恢复成功！");

        alert('数据已成功恢复！应用将重新加载。');
        window.location.reload(); // 重新加载应用以显示新数据

    } catch (error) {
        console.error("JSON 导入失败:", error);
        alert(`导入失败: ${error.message}`);
    }
}

/**
 * 小助手1：清空所有表的数据
 */
async function clearAllDataFromDB() {
    if (!db) return Promise.reject("数据库未连接！");
    const storeNames = [
        'chats', 'messages', 'starred_windows', 'starred_messages',
        'timelines', 'timeline_nodes', 'diary_entries',
        'tag_categories', 'tags', 'item_tags'
    ];
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeNames, 'readwrite');
        transaction.onerror = event => reject(event.target.error);

        let clearCount = 0;
        for (const storeName of storeNames) {
            transaction.objectStore(storeName).clear().onsuccess = () => {
                clearCount++;
                if (clearCount === storeNames.length) {
                    resolve(); // 所有表都清空后才算成功
                }
            };
        }
    });
}

/**
 * 小助手2：从 JSON 对象填充数据库
 */
async function populateDbFromJson(data) {
    if (!db) return Promise.reject("数据库未连接！");
    const storeNames = Object.keys(data);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeNames, 'readwrite');
        transaction.onerror = event => reject(event.target.error);
        transaction.oncomplete = () => resolve();

        for (const storeName of storeNames) {
            const store = transaction.objectStore(storeName);
            const items = data[storeName];
            if (items && items.length > 0) {
                items.forEach(item => store.add(item));
            }
        }
    });
}


    // 【请用这个增加了“安全检查”的最终正确版，完整替换旧的 setupNavigation 函数】
function setupNavigation() {
    // 【核心新增】在做任何事之前，先进行安全检查
    if (!navLinksContainer) {
        console.error("致命错误：未能找到导航链接容器 #nav-links！");
        return; // 如果容器不存在，就立刻停止这个函数，防止程序崩溃
    }

    const navItems = [
        { id: 'home-view', text: '首页' },
        { id: 'memory-list-view', text: '记忆' },
        { id: 'timelines-view', text: '时间轴' },
        { id: 'diary-view', text: '日记' },
        { id: 'settings-view', text: '设置' } // <-- 正确地添加了新项目，并移除了尾随逗号以保证最大兼容性
    ];
    
    navLinksContainer.innerHTML = '';
    
    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.dataset.viewId = item.id;
        a.textContent = item.text;
        if (item.id === 'home-view') a.classList.add('active');
        li.appendChild(a);
        navLinksContainer.appendChild(li);
    });

    navLinksContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const viewId = e.target.dataset.viewId;
            switchView(viewId);
            sidebar.classList.remove('open');
            sidebarOverlay.style.opacity = '0';
            sidebarOverlay.style.pointerEvents = 'none';
        }
    });
}

    /**
     * 【旗舰版】清理总管：重置所有视图的选择模式状态和UI
     */
    function resetAllSelectionModes() {
        // 1. 清理“聊天详情页”
        if (isSelectionMode) {
            // exitSelectionMode 不仅会重置变量，还会修复UI
            exitSelectionMode(); 
        }

        // 2. 清理“记忆列表页”
        if (memoryListView.classList.contains('selection-mode-active')) {
            exitMemoryListSelectionMode();
        }

        // 3. 清理“日记页”
        if (isDiaryListSelectionMode) {
            exitDiarySelectionMode();
        }

        // 4. 清理“时间轴页”
        if (isTimelineListSelectMode) {
            exitTimelineListSelectionMode();
        }

        console.log('旗舰版状态清理总管：所有选择模式已彻底重置。');
    }
    
    // --- 【核心改动】 ---
// main.js 中

function switchView(viewId) {
    // 1. 状态清理总管，它需要在【旧视图还存在时】运行，所以放在最前面
    resetAllSelectionModes();

    console.log(`正在尝试切换到视图: ${viewId}`);

    // 2. 【核心修复】先记录下当前激活的视图是哪个
    const currentActive = document.querySelector('.view.active-view');
    
    // 3. 【核心修复】如果确实有一个当前激活的视图，就【只】把它隐藏掉
    if (currentActive) {
        // a. 记录 previousView
        if (currentActive.id !== 'chat-detail-view' && currentActive.id !== 'diary-entry-view') {
             previousView = currentActive.id;
        }
        // b. 只移除它自己的 active-view 类
        currentActive.classList.remove('active-view');
    }
    
    // 4. 把新的视图显示出来
    document.getElementById(viewId).classList.add('active-view');

    // 5. 更新导航链接的高亮状态
    document.querySelectorAll('#nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.dataset.viewId === viewId) {
            a.classList.add('active');
        }
    });

    // 6. 底部按钮的显示/隐藏控制
    importBtn.style.display = (viewId === 'home-view') ? 'block' : 'none';
    exportAllBtn.style.display = (viewId === 'home-view') ? 'block' : 'none';
    newDiaryBtn.style.display = (viewId === 'home-view' || viewId === 'diary-view' || viewId === 'timelines-view') ? 'block' : 'none';

    if (viewId === 'home-view' || viewId === 'diary-view') {
        newDiaryBtn.dataset.action = 'addDiary';
    } else if (viewId === 'timelines-view') {
        newDiaryBtn.dataset.action = 'editTimeline';
    } else {
        delete newDiaryBtn.dataset.action;
    }
    
    // 7. 根据视图ID执行特定的渲染逻辑 (这是你之前代码里可能缺失的部分)
    if (viewId === 'memory-list-view') {
        renderMemoryList();
    } else if (viewId === 'timelines-view') {
        renderTimelines();
    } else if (viewId === 'diary-view') {
        renderDiaryView(); 
    } else if (viewId === 'settings-view') { // <-- 【新增】就是这一段！
        renderAvatarGallery();
    }
}

// 【请添加这个全新的函数】

    async function handleTxtImport(file) {
        try {
            const fileContent = await file.text();
            const lines = fileContent.split('\n');
            const messages = [];

            const title = file.name.replace(/\.txt$/i, '').replace(/_/g, ' ');

            for (const line of lines) {
                let tempLine = line.trim();
                if (tempLine.startsWith('【user】') || tempLine.startsWith('【assistant】')) {

                    const roleMatch = tempLine.match(/【(user|assistant)】/);
                    const timestampMatch = tempLine.match(/\[(.*?)\]/);

                    if (roleMatch && timestampMatch) {
                        const role = roleMatch[1];
                        const timestamp = timestampMatch[1];

                        // 【核心修复】使用两次 replace，精准地移除标签，不再用 substring
                        let content = tempLine.replace(roleMatch[0], ''); // 1. 移除【role】标签
                        content = content.replace(timestampMatch[0], '').trim(); // 2. 移除[timestamp]标签并清理空格

                        messages.push({
                            sender: (role === 'user') ? 'user' : 'ai',
                            content: content,
                            eventTimestamp: new Date(timestamp.replace(/-/g, '/')) 
                        });
                    }
                } else if (messages.length > 0 && tempLine !== '' && !tempLine.startsWith('--- START OF FILE')) {
                    const lastMessage = messages[messages.length - 1];
                    lastMessage.content += '\n' + tempLine;
                }
            }

            if (messages.length === 0) {
                throw new Error('无法从文件中解析出任何有效的聊天记录。请检查文件格式。');
            }

            const now = new Date();
            const firstMessageTime = messages.length > 0 ? messages[0].eventTimestamp : now;

            const newChat = {
                title: title || `新的聊天 ${now.toLocaleString()}`,
                model: 'unknown',
                remarks: '',
                recordDate: now,
                eventDate: firstMessageTime
            };

            await addChatToDB(newChat, messages);

            importModal.classList.remove('visible');
            switchView('memory-list-view');

        } catch (error) {
            alert(`TXT 文件导入失败: ${error.message}`);
            console.error("TXT导入失败:", error);
        }
    }

    function parseChatText(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const messages = [];
        const now = new Date();
        lines.forEach(line => {
            const trimmedLine = line.trim();
            let sender = null;
            let content = '';
            if (trimmedLine.startsWith('¥')) {
                sender = 'user';
                content = trimmedLine.substring(1).trim();
            } else if (trimmedLine.startsWith('$')) {
                sender = 'ai';
                content = trimmedLine.substring(1).trim();
            }
            if (sender && content) {
                messages.push({ sender: sender, content: content, eventTimestamp: now });
            }
        });
        return messages;
    }

    async function addChatToDB(chatData, messagesData) {
        if (!db) return Promise.reject("数据库未连接！");
        const transaction = db.transaction(['chats', 'messages'], 'readwrite');
        const chatsStore = transaction.objectStore('chats');
        const messagesStore = transaction.objectStore('messages');
        return new Promise((resolve, reject) => {
            transaction.onerror = (event) => reject(event.target.error);
            transaction.oncomplete = () => resolve();
            const chatRequest = chatsStore.add(chatData);
            chatRequest.onsuccess = (event) => {
                const chatId = event.target.result;
                messagesData.forEach(msg => {
                    messagesStore.add({ ...msg, chatId: chatId });
                });
            };
        });
    }

    async function getAllChatsFromDB() {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readonly');
            const store = transaction.objectStore('chats');
            const index = store.index('eventDate');
            const request = index.getAll();
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => {
                resolve(event.target.result.reverse());
            };
        });
    }

// --- 【全新的】记忆列表统一控制函数 ---

// 统一的进入选择模式函数
function enterMemoryListSelectionMode() {
    memoryListView.classList.add('selection-mode-active');
    memoryListSelectionHeader.classList.add('visible');
    memoryListSelectBtn.style.display = 'none';
}

// 统一的退出选择模式函数
function exitMemoryListSelectionMode() {
    memoryListView.classList.remove('selection-mode-active');
    memoryListSelectionHeader.classList.remove('visible');
    memoryListSelectBtn.style.display = 'block';

    const idsSet = (currentListMode === 'chats') ? selectedChatIds : selectedStarredIds;
    idsSet.clear();
    
    document.querySelectorAll('#memory-list-container .chat-list-item.selected').forEach(item => {
        item.classList.remove('selected');
    });
    selectAllMemoryListBtn.textContent = '全选';
}

// 统一的“全选/取消全选”函数
function toggleSelectAllMemoryList() {
    const allItems = memoryListContainer.querySelectorAll('.chat-list-item');
    const idsSet = (currentListMode === 'chats') ? selectedChatIds : selectedStarredIds;
    const idKey = (currentListMode === 'chats') ? 'chatId' : 'starredId';
    
    const allSelected = idsSet.size === allItems.length && allItems.length > 0;

    allItems.forEach(item => {
        const id = parseInt(item.dataset[idKey]);
        if (allSelected) {
            idsSet.delete(id);
            item.classList.remove('selected');
        } else {
            if (!idsSet.has(id)) {
                idsSet.add(id);
                item.classList.add('selected');
            }
        }
    });
    selectAllMemoryListBtn.textContent = allSelected ? '全选' : '取消全选';
}

// 统一的“切换单个选中”函数
function toggleMemoryListItemSelection(listItemElement) {
    const idsSet = (currentListMode === 'chats') ? selectedChatIds : selectedStarredIds;
    const idKey = (currentListMode === 'chats') ? 'chatId' : 'starredId';
    const id = parseInt(listItemElement.dataset[idKey]);

    if (idsSet.has(id)) {
        idsSet.delete(id);
        listItemElement.classList.remove('selected');
    } else {
        idsSet.add(id);
        listItemElement.classList.add('selected');
    }
}

    // 【请用这个全新的、功能完整的版本，替换旧的 renderStarredList 函数】
async function renderStarredList(container) {
    try {
        let starredWindows = await new Promise(r => db.transaction('starred_windows').objectStore('starred_windows').index('eventDate').getAll().onsuccess = e => r(e.target.result.reverse()));

        // --- (你所有的筛选逻辑，都保持不变) ---
        if (activeFilterTagIds.size > 0) {
            const filteredIds = await getItemsWithTags([...activeFilterTagIds], 'starred');
            starredWindows = starredWindows.filter(sw => filteredIds.has(sw.id));
        }
        if (globalSearchTerm) {
            const starredIdsToKeep = new Set();
            for (const sw of starredWindows) {
                if (sw.title.toLowerCase().includes(globalSearchTerm)) {
                    starredIdsToKeep.add(sw.id);
                    continue;
                }
                const messages = await getMessagesForStarredWindow(sw.id);
                for (const message of messages) {
                    if (message.content.toLowerCase().includes(globalSearchTerm)) {
                        starredIdsToKeep.add(sw.id);
                        break;
                    }
                }
            }
            starredWindows = starredWindows.filter(sw => starredIdsToKeep.has(sw.id));
        }
        // --- (筛选逻辑结束) ---

        container.innerHTML = '';
        if (starredWindows.length === 0) {
            container.innerHTML = '<li>没有符合条件的星标收藏。</li>';
            return;
        }
        
        const allTagsFromDB = await _fetchAllFromStore('tags');
        const allTagsMap = new Map(allTagsFromDB.map(tag => [tag.id, tag.name]));

        for (const sw of starredWindows) {
            const li = document.createElement('li');
            li.className = 'chat-list-item';
            li.dataset.starredId = sw.id;

            const tagIds = await getTagsForItem(sw.id, 'starred');
            const tagNames = Array.from(tagIds).map(id => allTagsMap.get(id)).filter(Boolean);

            li.innerHTML = `
                <div class="title">${escapeHTML(sw.title)}</div>
                <div class="date">${new Date(sw.eventDate).toLocaleDateString()}</div>
                <div class="tags-display-area">${tagNames.map(name => `<span>${name}</span>`).join(' ')}</div>
            `;
            
            // 【核心新增】为列表项里的头像，绑定“长按”魔法
            const avatarElement = li.querySelector('.list-item-avatar');
            if (avatarElement) {
                let pressTimer = null;
                avatarElement.addEventListener('touchstart', (e) => {
e.stopPropagation(); // 【1号保险】
    e.preventDefault();  // 【2号保险】
                    pressTimer = setTimeout(() => {
                        openAvatarPicker(sw.id, 'starred');
                    }, 500);
                });
                avatarElement.addEventListener('touchend', () => clearTimeout(pressTimer));
                avatarElement.addEventListener('touchmove', () => clearTimeout(pressTimer));
            }
            
            container.appendChild(li);
        }
    } catch (error) {
        console.error("渲染星标列表失败:", error);
        container.innerHTML = '<li>加载星标收藏失败。</li>';
    }
}

// 【请添加这个全新的函数】
async function enterMessageEditMode(messageItem) {
    if (isEditing) return; 
    isEditing = true;

    const messageId = parseInt(messageItem.dataset.messageId);
    const bubble = messageItem.querySelector('.message-bubble');
    if (!bubble) { isEditing = false; return; }

    // 【第一步：智能分离“时间戳”和“内容”】
    const timestampEl = bubble.querySelector('.message-timestamp-inline');
    const timestampHtml = timestampEl ? timestampEl.outerHTML : ''; // 保存时间戳的完整HTML结构
    
    // 从总的文本内容中，“减去”时间戳的文本，剩下的就是纯粹的消息内容
    const fullText = bubble.textContent || '';
    const timestampText = timestampEl ? timestampEl.textContent || '' : '';
    const messageText = fullText.replace(timestampText, '');

    // 【第二步：只把纯粹的“内容”放进编辑框】
    bubble.innerHTML = `<textarea class="message-edit-textarea">${escapeHTML(messageText)}</textarea>`;
    const textarea = bubble.querySelector('textarea');
    
    function autoResizeTextarea() {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
    textarea.addEventListener('input', autoResizeTextarea);
    autoResizeTextarea();
    textarea.focus();
    textarea.select();

    // 【第三步：保存时，智能地把“时间戳”和新的“内容”重新组合】
    textarea.onblur = async () => {
        const newText = textarea.value.trim();
        try {
            if (newText && newText !== messageText) {
                // 更新数据库时，只更新纯粹的内容
                const tableToUpdate = (currentDetailMode === 'chat') ? 'messages' : 'starred_messages';
                await updateMessageInDB(tableToUpdate, messageId, newText);
                // 更新界面时，把时间戳的HTML和新的内容组合起来
                bubble.innerHTML = timestampHtml + escapeHTML(newText);
            } else {
                // 如果没有变化，就恢复原来的完整HTML
                bubble.innerHTML = timestampHtml + escapeHTML(messageText);
            }
        } catch (error) {
            console.error("更新消息失败:", error);
            alert("保存失败！");
            bubble.innerHTML = timestampHtml + escapeHTML(messageText);
        } finally {
            isEditing = false; // 无论成功失败，都解锁编辑状态
        }
    };
}

async function renderMemoryList() {
    memoryListContainer.innerHTML = '<li>加载中...</li>';
    if (currentListMode === 'chats') {
        await renderChatsList(memoryListContainer); // <-- 不再传递 avatarMap
    } else {
        await renderStarredList(memoryListContainer); // <-- 不再传递 avatarMap
    }
}

// 【请添加这个全新的、统一的导出函数】
async function handleExportSelectedMemoryList() {
    const idsSet = (currentListMode === 'chats') ? selectedChatIds : selectedStarredIds;
    const itemType = (currentListMode === 'chats') ? 'chat' : 'starred';

    if (idsSet.size === 0) {
        return alert(`请先选择要导出的项目！`);
    }

    const format = prompt("请选择导出格式:\n\n1. JSON\n2. TXT", "1");
    if (!format) return;

    try {
        const dataToExport = (itemType === 'chat') 
            ? await getDataForExport([...idsSet]) 
            : await getStarredDataForExport([...idsSet]);

        if (!dataToExport || dataToExport.length === 0) {
            return alert('未能获取到任何可导出的数据。');
        }

        showExportModal(dataToExport, format);
        exitMemoryListSelectionMode();

    } catch (error) {
        alert(`导出失败: ${error.message}`);
    }
}

    // 【请用这个全新的、功能完整的版本，替换旧的 renderChatsList 函数】
async function renderChatsList(container) {
    try {
        let chats = await getAllChatsFromDB();
        
        // --- (你所有的筛选逻辑，都保持不变) ---
        if (activeFilterTagIds.size > 0) {
            const filteredChatIds = await getItemsWithTags([...activeFilterTagIds], 'chat');
            chats = chats.filter(chat => filteredChatIds.has(chat.id));
        }
        if (globalSearchTerm) {
            const chatIdsToKeep = new Set();
            for (const chat of chats) {
                if (chat.title.toLowerCase().includes(globalSearchTerm)) {
                    chatIdsToKeep.add(chat.id);
                    continue;
                }
                const messages = await getMessagesForChat(chat.id);
                for (const message of messages) {
                    if (message.content.toLowerCase().includes(globalSearchTerm)) {
                        chatIdsToKeep.add(chat.id);
                        break;
                    }
                }
            }
            chats = chats.filter(chat => chatIdsToKeep.has(chat.id));
        }
        // --- (筛选逻辑结束) ---

        container.innerHTML = '';
        if (chats.length === 0) {
            container.innerHTML = '<li>没有符合条件的聊天记录。</li>';
            return;
        }

        const allTagsFromDB = await _fetchAllFromStore('tags');
        const allTagsMap = new Map(allTagsFromDB.map(tag => [tag.id, tag.name]));

        for (const chat of chats) { 
            const li = document.createElement('li');
            li.className = 'chat-list-item';
            li.dataset.chatId = chat.id;
            
            const tagIds = await getTagsForItem(chat.id, 'chat');
            const tagNames = Array.from(tagIds).map(id => allTagsMap.get(id)).filter(Boolean);

            li.innerHTML = `
                <div class="title">${escapeHTML(chat.title)}</div>
                <div class="date">${new Date(chat.eventDate).toLocaleDateString()}</div>
                ${chat.remarks ? `<div class="remarks-preview">${escapeHTML(chat.remarks)}</div>` : ''}
                <div class="tags-display-area">${tagNames.map(name => `<span>${name}</span>`).join(' ')}</div>
            `;
            
            // 【核心修正】第一步：先把 li “正式挂牌”
            container.appendChild(li);

            // 【核心修正】第二步：现在，再去那个“正式”的 li 里找头像并绑定事件
            const avatarElement = li.querySelector('.list-item-avatar');
            if (avatarElement) {
                let pressTimer = null;
                avatarElement.addEventListener('touchstart', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    pressTimer = setTimeout(() => {
                        openAvatarPicker(chat.id, 'chat');
                    }, 500);
                });
                // 【核心修正】为函数体加上花括号
                avatarElement.addEventListener('touchend', () => {
                    clearTimeout(pressTimer);
                });
                // 【核心修正】为函数体加上花括号
                avatarElement.addEventListener('touchmove', () => {
                    clearTimeout(pressTimer);
                });
            }

            container.appendChild(li);
        }
    } catch (error) {
        console.error("渲染聊天列表失败:", error);
        container.innerHTML = '<li>加载聊天记录失败。</li>';
    }
}

    // 【请用这个最终、绝对正确的版本，完整替换旧的 openChat 函数】
async function openChat(chatId, chatTitle) {
    console.log(`[探测器] openChat 函数已开始执行, ID=${chatId}`);
    currentDetailMode = 'chat';
    starSelectedBtn.style.display = 'block';
    chatMenuBtn.style.display = 'block';
    selectMessagesBtn.style.display = 'none';
    
    try {
// 【核心升级】第一步：先把所有的“角色->头像”和“头像ID->头像数据”都准备好
            const roleAvatars = await getAllRoleAvatars();
            const roleAvatarMap = new Map(roleAvatars.map(ra => [ra.role, ra.avatarId]));
            const allAvatars = await getAllAvatarsFromDB();
            const avatarDataMap = new Map(allAvatars.map(a => [a.id, a.data]));
   chatDetailView.dataset.currentChatId = chatId;
        chatDetailTitle.textContent = chatTitle;
        chatDetailTitle.classList.add('editable');
        const messages = await getMessagesForChat(chatId);
        messagesContainer.innerHTML = '';

        // 【请用这个最终的、结构绝对正确的版本，替换掉你整个 forEach 循环】
            messages.forEach(msg => {
                const messageItem = document.createElement('div');
                messageItem.className = `message-item ${msg.sender}-message`;
                messageItem.dataset.messageId = msg.id;

                const avatar = document.createElement('div');
                avatar.className = 'avatar';
                
                const roleAvatarId = roleAvatarMap.get(msg.sender);
                const avatarData = roleAvatarId ? avatarDataMap.get(roleAvatarId) : null;
                
                if (avatarData) {
                    avatar.innerHTML = `<img src="${avatarData}" alt="${msg.sender} avatar">`;
                }

                // 【正确的结构】事件绑定，应该在 if...else 之后，对 avatar 这个“成品”进行操作
                let pressTimer = null;
                avatar.addEventListener('touchstart', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    pressTimer = setTimeout(() => {
                        openAvatarPicker(msg.sender, 'chat');
                    }, 500);
                });
                avatar.addEventListener('touchend', () => { clearTimeout(pressTimer); });
                avatar.addEventListener('touchmove', () => { clearTimeout(pressTimer); });

                const bubble = document.createElement('div');
                bubble.className = 'message-bubble';

                const fullDateTime = new Date(msg.eventTimestamp);
                const dateTimeString = fullDateTime.toLocaleString([], {
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
                const timestampHtml = `<div class="message-timestamp-inline">${dateTimeString}</div>`;

                bubble.innerHTML = timestampHtml + highlightText(msg.content, globalSearchTerm);

                messageItem.appendChild(avatar);
                messageItem.appendChild(bubble);
                messagesContainer.appendChild(messageItem);
            }); // <-- forEach 循环在这里正确结束

        const currentChat = await getChatById(chatId);
        if (currentChat && currentChat.eventDate) {
            chatDetailDate.textContent = new Date(currentChat.eventDate).toLocaleDateString();
        } else {
            chatDetailDate.textContent = '点击设置日期';
        }
        chatDetailDate.style.display = 'block';

        switchView('chat-detail-view');
        currentScrollContainer = messagesContainer;
        setupSearchNavigation(messagesContainer);
        setTimeout(() => {
            try {
                const key = `scrollPos-${chatId}`;
                const savedScrollPos = localStorage.getItem(key);
                if (savedScrollPos) {
                    messagesContainer.scrollTop = parseInt(savedScrollPos, 10);
                } else {
                    messagesContainer.scrollTop = 0;
                }
            } catch (error) {
                console.error("恢复滚动位置失败:", error);
            }
        }, 10);
    } catch (error) {
        console.error(`打开聊天失败 (ID: ${chatId}):`, error);
        alert('无法加载聊天内容。');
    }
}

    async function getMessagesForChat(chatId) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('messages', 'readonly');
            const store = transaction.objectStore('messages');
            const index = store.index('chatId');
            const request = index.getAll(chatId);
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }

    // ... (enterEditMode, updateMessageInDB, enterSelectionMode, exitSelectionMode, etc. 保持不变) ...
    function enterEditMode(bubbleEl, messageId) {
        const currentText = bubbleEl.textContent;
        bubbleEl.innerHTML = '';
        const textarea = document.createElement('textarea');
        textarea.className = 'edit-textarea';
        textarea.value = currentText;
        textarea.onblur = async () => {
            const newText = textarea.value;
            if (newText.trim() && newText !== currentText) {
                await updateMessageInDB(messageId, newText);
                bubbleEl.textContent = newText;
            } else {
                bubbleEl.textContent = currentText;
            }
        };
        textarea.onkeydown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                textarea.value = currentText; 
                textarea.blur();
            }
        };
        bubbleEl.appendChild(textarea);
        textarea.focus();
        textarea.select();
    }

    // 【请用这个全新的、正确的版本进行替换】
async function updateMessageInDB(tableName, messageId, newContent) {
    if (!db) return Promise.reject("数据库未连接！");
    return new Promise((resolve, reject) => {
        // 核心修正：使用传入的 tableName 变量来开始事务
        const transaction = db.transaction(tableName, 'readwrite'); 
        const store = transaction.objectStore(tableName);
        
        const request = store.get(messageId);
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => {
            const message = event.target.result;
            if (message) {
                message.content = newContent;
                const updateRequest = store.put(message);
                updateRequest.onsuccess = () => resolve();
                updateRequest.onerror = (event) => reject(event.target.error);
            } else {
                reject('找不到该消息');
            }
        };
    });
}

    function enterSelectionMode() {
        isSelectionMode = true;

        // 【核心修复】获取两个头部的DOM元素
        const defaultHeader = document.getElementById('default-chat-header');
        const selectionHeader = document.getElementById('selection-chat-header');

        // 【核心修复】切换头部的显示
        defaultHeader.style.display = 'none';
        selectionHeader.style.display = 'flex';
    }

    function exitSelectionMode() {
        isSelectionMode = false;

        // 【核心修复】获取两个头部的DOM元素
        const defaultHeader = document.getElementById('default-chat-header');
        const selectionHeader = document.getElementById('selection-chat-header');

        // 【核心修复】恢复默认头部的显示
        defaultHeader.style.display = 'flex';
        selectionHeader.style.display = 'none';

        // ---- 以下是你原来的清理逻辑，保持不变 ----
        selectAllBtn.textContent = '全选';
        selectedMessageIds.clear();
        document.querySelectorAll('.message-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
    }

    function toggleMessageSelection(messageElement) {
        const messageId = parseInt(messageElement.dataset.messageId);
        if (selectedMessageIds.has(messageId)) {
            selectedMessageIds.delete(messageId);
            messageElement.classList.remove('selected');
        } else {
            selectedMessageIds.add(messageId);
            messageElement.classList.add('selected');
        }
    }

    async function getChatById(chatId) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readonly');
            const store = transaction.objectStore('chats');
            const request = store.get(chatId);
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => resolve(event.target.result);
        });
    }

    async function updateChatDateInDB(chatId, newDate) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readwrite');
            const store = transaction.objectStore('chats');
            const request = store.get(chatId);
            request.onerror = event => reject(event.target.error);
            request.onsuccess = event => {
                const chat = event.target.result;
                if (chat) {
                    chat.eventDate = newDate;
                    const updateRequest = store.put(chat);
                    updateRequest.onsuccess = () => resolve();
                    updateRequest.onerror = event => reject(event.target.error);
                } else {
                    reject('找不到该聊天');
                }
            };
        });
    }

    function toggleSelectAllMessages() {
        const allMessageItems = messagesContainer.querySelectorAll('.message-item');
        const totalMessages = allMessageItems.length;
        const selectedCount = selectedMessageIds.size;
        if (selectedCount < totalMessages) {
            allMessageItems.forEach(item => {
                const messageId = parseInt(item.dataset.messageId);
                if (!selectedMessageIds.has(messageId)) {
                    selectedMessageIds.add(messageId);
                    item.classList.add('selected');
                }
            });
            selectAllBtn.textContent = '取消全选';
        } else {
            selectedMessageIds.clear();
            allMessageItems.forEach(item => {
                item.classList.remove('selected');
            });
            selectAllBtn.textContent = '全选';
        }
    }

    

    

    

    

    // --- 核心数据库与文件处理辅助函数 ---

    // --- 【新增函数】 ---
    async function createStarredWindowWithMessages(title, messageIds) {
        if (!db) return Promise.reject("数据库未连接！");

        // 1. 先根据ID把所有原始消息捞出来
        const originalMessages = await getMessagesByIds('messages', messageIds);

        // 2. 开始一个覆盖多个表的事务
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['starred_windows', 'starred_messages'], 'readwrite');
            const starredWindowsStore = transaction.objectStore('starred_windows');
            const starredMessagesStore = transaction.objectStore('starred_messages');

            transaction.onerror = (event) => reject(event.target.error);
            transaction.oncomplete = () => resolve();

            // 3. 创建新的星标窗口记录
            const now = new Date();
            const newWindow = {
                title: title,
                remarks: '',
                recordDate: now,
                eventDate: now
            };

            const addWindowRequest = starredWindowsStore.add(newWindow);

            addWindowRequest.onsuccess = (event) => {
                const newWindowId = event.target.result; // 获取新创建的窗口ID

                // 4. 遍历原始消息，创建它们的副本并存入新表
                originalMessages.forEach(msg => {
                    const messageCopy = {
                        windowId: newWindowId, // 关联到新的星标窗口
                        sender: msg.sender,
                        content: msg.content,
                        eventTimestamp: msg.eventTimestamp
                    };
                    // 把副本添加到 starred_messages 表中
                    starredMessagesStore.add(messageCopy);
                });
            };
        });
    }

    // ... (deleteChatsFromDB, getDataForExport, formatDataAsTxt 等函数保持不变) ...
    async function deleteChatsFromDB(chatIds) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['chats', 'messages'], 'readwrite');
            const chatsStore = transaction.objectStore('chats');
            const messagesStore = transaction.objectStore('messages');
            const messagesIndex = messagesStore.index('chatId');
            transaction.oncomplete = () => resolve();
            transaction.onerror = (event) => reject(event.target.error);
            chatIds.forEach(chatId => {
                chatsStore.delete(chatId);
                const cursorRequest = messagesIndex.openKeyCursor(IDBKeyRange.only(chatId));
                cursorRequest.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        messagesStore.delete(cursor.primaryKey);
                        cursor.continue();
                    }
                };
            });
        });
    }

    async function getDataForExport(chatIds) {
        if (!db) return Promise.reject("数据库未连接！");
        const exportData = [];
        for (const chatId of chatIds) {
            const chat = await getChatById(chatId);
            const messages = await getMessagesForChat(chatId);
            if (chat) {
                exportData.push({ chat, messages });
            }
        }
        return exportData;
    }

    function formatDataAsTxt(data) {
        let txt = '';
        data.forEach((item, index) => {
            const { chat, messages } = item;
            txt += `========================================\n`;
            txt += `窗口标题: ${chat.title}\n`;
            txt += `日期: ${new Date(chat.eventDate).toLocaleDateString()}\n`;
            if (chat.remarks) {
                txt += `备注: ${chat.remarks}\n`;
            }
            txt += `----------------------------------------\n\n`;
            messages.forEach(msg => {
                const sender = msg.sender === 'user' ? 'Isla' : 'Zion';
                const time = new Date(msg.eventTimestamp).toLocaleString();
                txt += `[${time}] ${sender}:\n`;
                txt += `${msg.content}\n\n`;
            });
            if (index < data.length - 1) {
                txt += `\n\n\n`;
            }
        });
        return txt;
    }


    // showDownloadLink 函数保持不变
    function showDownloadLink(linkElement) {
        downloadContainer.innerHTML = ''; 
        linkElement.textContent = `您的文件已就绪，点击此处下载: ${linkElement.download}`;
        downloadContainer.appendChild(linkElement);
        downloadContainer.classList.add('visible');
        linkElement.addEventListener('click', () => {
            setTimeout(() => {
                downloadContainer.classList.remove('visible');
                URL.revokeObjectURL(linkElement.href);
            }, 1500);
        });
    }

// 【请用这个最终、绝对正确的版本，完整替换旧的 openStarredWindow 函数】
async function openStarredWindow(windowId, windowTitle) {
    console.log(`[探测器] openStarredWindow 函数已开始执行, ID=${windowId}`);
    currentDetailMode = 'starred';
    starSelectedBtn.style.display = 'none';
    chatMenuBtn.style.display = 'none';
    selectMessagesBtn.style.display = 'block';
    
    try {
// 【核心升级】第一步：先把所有的“角色->头像”和“头像ID->头像数据”都准备好
            const roleAvatars = await getAllRoleAvatars();
            const roleAvatarMap = new Map(roleAvatars.map(ra => [ra.role, ra.avatarId]));
            const allAvatars = await getAllAvatarsFromDB();
            const avatarDataMap = new Map(allAvatars.map(a => [a.id, a.data]));
       chatDetailView.dataset.currentStarredId = windowId;
        chatDetailTitle.textContent = windowTitle;
        chatDetailTitle.classList.add('editable');

        const starredWindow = await getStarredWindowById(windowId);
        if (starredWindow && starredWindow.eventDate) {
            chatDetailDate.textContent = new Date(starredWindow.eventDate).toLocaleDateString();
        } else {
            chatDetailDate.textContent = '点击设置日期';
        }
        chatDetailDate.style.display = 'block';

        const messages = await getMessagesForStarredWindow(windowId);
        messagesContainer.innerHTML = '';
        
        messages.forEach(msg => {
            const messageItem = document.createElement('div');
            messageItem.className = `message-item ${msg.sender}-message`;
            messageItem.dataset.messageId = msg.id;

            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            
            // 【正确的渲染逻辑】
            const roleAvatarId = roleAvatarMap.get(msg.sender);
            const avatarData = roleAvatarId ? avatarDataMap.get(roleAvatarId) : null;
            
            if (avatarData) {
                avatar.innerHTML = `<img src="${avatarData}" alt="${msg.sender} avatar">`;
            }
            // (如果没找到，就保持为空，显示为一个空白圆圈)

            // 【正确的“神经连接”】
            let pressTimer = null;
            avatar.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                e.preventDefault();
                pressTimer = setTimeout(() => {
                    openAvatarPicker(msg.sender, 'starred'); // <-- 传递 'starred'
                }, 500);
            });
            avatar.addEventListener('touchend', () => { clearTimeout(pressTimer); });
            avatar.addEventListener('touchmove', () => { clearTimeout(pressTimer); });

            // 【正确的“气泡”创建逻辑】
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';

            const fullDateTime = new Date(msg.eventTimestamp);
            const dateTimeString = fullDateTime.toLocaleString([], {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            const timestampHtml = `<div class="message-timestamp-inline">${dateTimeString}</div>`;

            bubble.innerHTML = timestampHtml + highlightText(msg.content, globalSearchTerm);

            // 【正确的“组装”】
            messageItem.appendChild(avatar);

            messageItem.appendChild(bubble);
            messagesContainer.appendChild(messageItem);
        }); // <-- forEach 循环在这里正确结束

        switchView('chat-detail-view');
        currentScrollContainer = messagesContainer;
        setupSearchNavigation(messagesContainer);

        setTimeout(() => {
            try {
                const key = `scrollPos-starred-${windowId}`;
                const savedScrollPos = localStorage.getItem(key);
                if (savedScrollPos) {
                    messagesContainer.scrollTop = parseInt(savedScrollPos, 10);
                } else {
                    messagesContainer.scrollTop = 0;
                }
            } catch (error) {
                console.error("恢复星标窗口滚动位置失败:", error);
            }
        }, 10);

    } catch (error) {
        console.error(`打开星标窗口失败 (ID: ${windowId}):`, error);
        alert('无法加载星标内容。');
    }
}

    async function getMessagesForStarredWindow(windowId) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('starred_messages', 'readonly');
            const store = transaction.objectStore('starred_messages');
            const index = store.index('windowId');
            const request = index.getAll(windowId);
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => resolve(event.target.result);
        });
    }
    function showExportModal(data, format, type = 'chat') {
    let outputString = '';
    if (format === '1') {
        outputString = JSON.stringify(data, null, 2);
    } else if (format === '2') {
        // 根据类型调用不同的格式化函数
        if (type === 'diary') {
            outputString = formatDiaryDataAsTxt(data);
        } else if (type === 'timeline') {
            outputString = formatTimelineDataAsTxt(data);
        } else {
            outputString = formatDataAsTxt(data);
        }
    } else {
        return alert('无效的选项！');
    }
    exportTextarea.value = outputString;
    exportModal.classList.add('visible');
}


    async function getStarredWindowById(id) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve) => {
            db.transaction('starred_windows', 'readonly')
              .objectStore('starred_windows')
              .get(id).onsuccess = e => resolve(e.target.result);
        });
    }

    async function getStarredDataForExport(windowIds) {
        if (!db) return Promise.reject("数据库未连接！");
        const exportData = [];
        for (const windowId of windowIds) {
            const chat = await getStarredWindowById(windowId);
            const messages = await getMessagesForStarredWindow(windowId);
            if (chat) {
                exportData.push({ chat, messages });
            }
        }
        return exportData;
    }

    async function deleteStarredWindowsFromDB(windowIds) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['starred_windows', 'starred_messages'], 'readwrite');
            const starredWindowsStore = transaction.objectStore('starred_windows');
            const starredMessagesStore = transaction.objectStore('starred_messages');
            const messagesIndex = starredMessagesStore.index('windowId');

            transaction.oncomplete = () => resolve();
            transaction.onerror = (event) => reject(event.target.error);

            windowIds.forEach(windowId => {
                starredWindowsStore.delete(windowId);
                const cursorRequest = messagesIndex.openKeyCursor(IDBKeyRange.only(windowId));
                cursorRequest.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        starredMessagesStore.delete(cursor.primaryKey);
                        cursor.continue();
                    }
                };
            });
        });
    }

    async function deleteMessagesFromDB(tableName, messageIds) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(tableName, 'readwrite');
            const store = transaction.objectStore(tableName);
            transaction.oncomplete = () => resolve();
            transaction.onerror = (event) => reject(event.target.error);
            messageIds.forEach(id => {
                store.delete(id);
            });
        });
    }

    async function getMessagesByIds(tableName, messageIds) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(tableName, 'readonly');
            const store = transaction.objectStore(tableName);
            const messages = [];
            if (messageIds.length === 0) return resolve(messages);

            const promises = messageIds.map(id => {
                return new Promise((resolveMsg) => {
                    const request = store.get(id);
                    request.onsuccess = (event) => {
                        if (event.target.result) {
                            messages.push(event.target.result);
                        }
                        resolveMsg();
                    };
                    request.onerror = () => resolveMsg(); // 即使单个失败也继续
                });
            });

            Promise.all(promises).then(() => resolve(messages));
        });
    }
    // --- 【新】打开备注弹窗的函数 ---
    async function openRemarksModal() {
    const chatId = parseInt(chatDetailView.dataset.currentChatId);
        if (!chatId) return;

        try {
            const chat = await getChatById(chatId);
            remarksTextarea.value = chat.remarks || '';
            remarksModal.classList.add('visible');
        } catch (error) {
            console.error("加载备注失败:", error);
            alert("无法加载备注信息。");
        }
    }

    // --- 【新】处理保存备注的函数 ---
    async function handleSaveRemarks() {
    const chatId = parseInt(chatDetailView.dataset.currentChatId);
        const newRemarks = remarksTextarea.value.trim();

        // 增加一个对无效ID的防御性检查
        if (!chatId) {
            alert("无法获取当前聊天ID，保存失败。");
            return;
        }

        try {
            await updateChatRemarksInDB(chatId, newRemarks);
            remarksModal.classList.remove('visible');
            // 可选：给一个成功的提示
            // alert('备注已保存！');
        } catch (error) {
            console.error("保存备注失败:", error);
            alert("保存备注失败。");
        }
    }

    // --- 【新】更新数据库中备注的函数 ---
    async function updateChatRemarksInDB(chatId, newRemarks) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chats', 'readwrite');
            const store = transaction.objectStore('chats');
            const request = store.get(chatId);

            request.onerror = event => reject(event.target.error);
            request.onsuccess = event => {
                const chat = event.target.result;
                if (chat) {
                    chat.remarks = newRemarks; // 更新备注字段
                    const updateRequest = store.put(chat);
                    updateRequest.onsuccess = () => resolve();
                    updateRequest.onerror = event => reject(event.target.error);
                } else {
                    reject('找不到该聊天记录');
                }
            };
        });
    }
    // --- 【新】标题编辑功能 ---

    function handleTitleEdit(e) {
        const titleElement = e.target;
        const currentTitle = titleElement.textContent;

        // 防止重复点击创建多个输入框
        if (titleElement.querySelector('input')) return;

        titleElement.innerHTML = ''; // 清空标题

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentTitle;
        input.style.width = '100%';
        input.style.fontSize = '17px';
        input.style.fontWeight = '600';
        input.style.border = 'none';
        input.style.textAlign = 'center';

        // 核心：当输入框失去焦点时，保存并恢复标题显示
        input.onblur = async () => {
            const newTitle = input.value.trim();
            if (newTitle && newTitle !== currentTitle) {
                try {
                    if (currentDetailMode === 'chat') {
        const chatId = parseInt(chatDetailView.dataset.currentChatId);
        await updateChatTitleInDB(chatId, newTitle);
    } else { // 'starred'
        const starredId = parseInt(chatDetailView.dataset.currentStarredId);
        await updateStarredWindowTitleInDB(starredId, newTitle);
    }
    titleElement.textContent = newTitle;
    renderMemoryList(); // <-- 在这里统一刷新列表
} catch (error) {
                    alert('标题更新失败！');
                    titleElement.textContent = currentTitle; // 恢复旧标题
                }
            } else {
                titleElement.textContent = currentTitle; // 恢复旧标题
            }
        };

        // 按下回车键也视为保存
        input.onkeydown = (event) => {
            if (event.key === 'Enter') {
                input.blur();
            }
        };

        titleElement.appendChild(input);
        input.focus();
        input.select();
    }

    async function updateChatTitleInDB(chatId, newTitle) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction('chats', 'readwrite');
            const store = tx.objectStore('chats');
            const request = store.get(chatId);
            request.onsuccess = () => {
                const data = request.result;
                if (data) {
                    data.title = newTitle;
                    store.put(data);
                }
            };
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function updateStarredWindowTitleInDB(windowId, newTitle) {
         return new Promise((resolve, reject) => {
            const tx = db.transaction('starred_windows', 'readwrite');
            const store = tx.objectStore('starred_windows');
            const request = store.get(windowId);
            request.onsuccess = () => {
                const data = request.result;
                if (data) {
                    data.title = newTitle;
                    store.put(data);
                }
            };
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

// --- 【最终版】时间轴 V4 全部功能函数 ---

// --- 核心渲染与交互函数 ---

// 【请用这个全新的、支持节点标签的版本，完整替换旧的 renderTimelines 函数】
async function renderTimelines(timelineId = null, forceExpand = false) {
    if (timelineObserver) {
        timelineObserver.disconnect();
    }
    timelinesContentContainer.innerHTML = ''; 
    timelineObserver = new MutationObserver(() => {
        currentScrollContainer = timelinesContentContainer;
        setupSearchNavigation(timelinesContentContainer);
        timelineObserver.disconnect(); 
    });
    timelineObserver.observe(timelinesContentContainer, { childList: true });

    // --- 筛选逻辑：完全按照你的新蓝图执行 ---
    let allTimelines = await getAllTimelinesFromDB();
    if (activeFilterTagIds.size > 0) {
        const activeTagIds = [...activeFilterTagIds];
        const directlyTaggedTimelineIds = await getItemsWithTags(activeTagIds, 'timeline');
        const parentTimelineIds = await getTimelineIdsContainingTaggedNodes(activeTagIds);
        const allMatchingTimelineIds = new Set([...directlyTaggedTimelineIds, ...parentTimelineIds]);
        allTimelines = allTimelines.filter(timeline => allMatchingTimelineIds.has(timeline.id));
    }

    if (globalSearchTerm) {
        const timelineIdsToKeep = new Set();
        for (const timeline of allTimelines) {
            if (timeline.title.toLowerCase().includes(globalSearchTerm)) {
                timelineIdsToKeep.add(timeline.id); continue;
            }
            const nodes = await getNodesForTimeline(timeline.id);
            for (const node of nodes) {
                if (node.content.toLowerCase().includes(globalSearchTerm)) {
                    timelineIdsToKeep.add(timeline.id); break;
                }
            }
        }
        allTimelines = allTimelines.filter(timeline => timelineIdsToKeep.has(timeline.id));
    }

    // --- 全新的、带有“记忆”功能的ID选择逻辑从这里开始 ---
    let currentTimelineId = timelineId; // 1. 优先使用函数传入的ID

    if (!currentTimelineId) {
        // 2. 如果没有传入ID，就尝试从视图的“记忆”中读取
        const rememberedId = parseInt(timelinesView.dataset.currentTimelineId);
        if (!isNaN(rememberedId)) {
            // 在这里，我们需要确认“记忆中”的ID是否还在当前的筛选结果里
            const isRememberedIdVisible = allTimelines.some(t => t.id === rememberedId);
            if (isRememberedIdVisible) {
                currentTimelineId = rememberedId;
            }
        }
    }

    // 3. 如果经过上面两步还没有ID，才使用列表中的第一个作为默认值
    if (!currentTimelineId && allTimelines.length > 0) {
        currentTimelineId = allTimelines[0].id;
    }
    
    if (!currentTimelineId) {
        timelineTitleBtn.textContent = '时间轴 ▼';
        timelinesContentContainer.innerHTML = '<p>没有符合条件的记录。</p>';
        return; 
    }

    const timeline = await getTimelineById(currentTimelineId);
    if (!timeline) { 
        renderTimelines(); 
        return; 
    }
    
    const nodes = await getNodesForTimeline(currentTimelineId);
    timelineTitleBtn.textContent = `${timeline.title} ▼`;
    timelinesView.dataset.currentTimelineId = currentTimelineId; 

    // 【请用这个经过“流程重组”的最终版本，替换 renderTimelines 的后半部分】

    if (nodes.length === 0) {
        timelinesContentContainer.innerHTML = '<p>这个时间轴还没有节点。</p>';
    } else {
        // --- 流程重组：第一步，立刻构建包含家庭关系的完整“族谱” ---
        const nodeMapWithChildren = new Map(nodes.map(node => [node.id, { ...node, children: [] }]));
        const tree = [];
        for (const node of nodeMapWithChildren.values()) {
            if (node.parentId && nodeMapWithChildren.has(node.parentId)) {
                nodeMapWithChildren.get(node.parentId).children.push(node);
            } else {
                tree.push(node);
            }
        }
        
        const activeTagIds = [...activeFilterTagIds];
        const isTimelineItselfTagged = await doesItemHaveTags(currentTimelineId, 'timeline', activeTagIds);
        
        let visibleNodeIds = new Set(nodes.map(n => n.id));

        // --- 流程重组：第二步，基于完整的“族谱”进行“寻亲” ---
        if (activeFilterTagIds.size > 0 && !isTimelineItselfTagged) {
            const taggedNodeIds = await getTaggedNodeIdsInTimeline(currentTimelineId, activeTagIds);
            
            const ancestorsToShow = new Set();
            const descendantsToShow = new Set();

            function getAllDescendants(nodeId) {
                const node = nodeMapWithChildren.get(nodeId); // 使用带有 children 的 map
                if (!node || node.children.length === 0) return;
                
                for (const child of node.children) {
                    descendantsToShow.add(child.id);
                    getAllDescendants(child.id);
                }
            }

            for (const nodeId of taggedNodeIds) {
                // 查找祖先
                let currentNode = nodeMapWithChildren.get(nodeId);
                while (currentNode && currentNode.parentId) {
                    ancestorsToShow.add(currentNode.parentId);
                    currentNode = nodeMapWithChildren.get(currentNode.parentId);
                }
                // 查找后代
                getAllDescendants(nodeId);
            }
            visibleNodeIds = new Set([...taggedNodeIds, ...ancestorsToShow, ...descendantsToShow]);
        }
        
        const allTagsMap = new Map((await _fetchAllFromStore('tags')).map(tag => [tag.id, tag.name]));

        // --- 流程重组：第三步，基于最终的 visibleNodeIds 进行渲染 ---
        async function buildTreeDOM(nodes, level) {
            if (!nodes || nodes.length === 0) return null;
            const ul = document.createElement('ul');
            ul.className = 'timeline-node-list';
            if (forceExpand || (activeFilterTagIds.size > 0 && !isTimelineItselfTagged)) {
                ul.classList.remove('collapsed');
            }

            for (const node of nodes) {
                if (!visibleNodeIds.has(node.id)) continue;

                const li = document.createElement('li');
                li.className = `timeline-node-item level-${level}`;
                li.dataset.nodeId = node.id;
                
                if (selectedNodeIds.has(node.id)) {
                    li.classList.add('selected');
                }

                const hasChildren = node.children.length > 0;
                
                // 【核心】第一步：我们只定义一个，在“特殊模式”下才为 true 的“展开开关”
                const shouldExpand = forceExpand || activeFilterTagIds.size > 0;

                // 【核心】第二步：现在，我们来定义两个独立的、互不干扰的“状态”

                // “小三角”的状态：只有当一个节点是【第三级】，并且我们【不处于】展开模式时，它才应该是折叠的
                const isToggleCollapsed = (level === 3 && !shouldExpand);
                
                // “文字”的状态：和上面完全一样
                const isTextTruncated = (level === 3 && !shouldExpand);

                // 【核心】第三步：我们把这两个独立的状态，应用到各自的 HTML 上
                const toggleHtml = (hasChildren || level === 3) ? `<span class="node-toggle ${isToggleCollapsed ? 'collapsed' : ''}">▶</span>` : '<span class="node-toggle invisible"></span>';
                const textClasses = isTextTruncated ? 'node-text truncated' : 'node-text';

                const highlightedContent = highlightText(node.content, globalSearchTerm);
                const nodeTagIds = await getTagsForItem(node.id, 'timeline_node');
                const nodeTagNames = [...nodeTagIds].map(id => allTagsMap.get(id)).filter(Boolean);
                const tagsHtml = `<div class="node-tags-display">${nodeTagNames.map(name => `<span>${name}</span>`).join('')}</div>`;

                li.innerHTML = `
                    ${toggleHtml}
                    <div class="node-content-wrapper">
                        <span class="${textClasses}">${highlightedContent}</span>
                        ${tagsHtml}
                    </div>
                `;

                const childTree = await buildTreeDOM(node.children, level + 1);
                if (childTree) {
                    // 【核心修正】我们在这里，使用我们新的、正确的“小三角”开关
                    if (isToggleCollapsed) { 
                        childTree.classList.add('collapsed');
                    }
                    li.appendChild(childTree);
                }

                // 【核心】把 li 添加到 ul 的动作，必须在 for 循环的内部
                ul.appendChild(li);

            } // <-- for 循环在这里正确地结束

            // 【核心】return ul 的动作，必须在 for 循环的外部
            return ul;
        }

        const finalTree = await buildTreeDOM(tree, 1);
        if (finalTree && finalTree.hasChildNodes()) {
            timelinesContentContainer.appendChild(finalTree);
        } else {
            timelinesContentContainer.innerHTML = '<p>此时间轴下没有符合筛选条件的节点。</p>';
        }
    }
}
    
function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

    // 【请用这个最终修正版替换旧的 toggleNodeCollapse 函数】
    function toggleNodeCollapse(toggleElement) {
        const nodeItem = toggleElement.closest('.timeline-node-item');
        if (!nodeItem) return;

        // 步骤1：切换三角自身的折叠状态类 (▶ vs ▼)
        toggleElement.classList.toggle('collapsed');

        // 步骤2：找到该节点下的子节点列表
        const childList = nodeItem.querySelector('.timeline-node-list');

        // 步骤3：切换子列表的显示/隐藏类
        if (childList) {
            // 【核心修正】我们不再操作 style.display！
            // 而是只切换一个CSS类名，让CSS去决定如何显示或隐藏。
            childList.classList.toggle('collapsed');
        }

        // 步骤4 (针对三级节点)：切换长文本的折叠样式类
        if (nodeItem.classList.contains('level-3')) {
            const nodeText = nodeItem.querySelector('.node-text');
            if (nodeText) {
                nodeText.classList.toggle('truncated');
            }
        }
    }

// --- 顶部抬头与列表管理函数 ---

async function toggleTimelineListDropdown() {
    if (timelineListDropdown.classList.contains('visible') && !isTimelineListSelectMode) {
        timelineListDropdown.classList.remove('visible');
        return;
    }

    let allTimelines = await getAllTimelinesFromDB();
    // --- 全新的、与 renderTimelines 同步的筛选逻辑 ---
    if (activeFilterTagIds.size > 0) {
        const activeTagIds = [...activeFilterTagIds];
        const directlyTaggedTimelineIds = await getItemsWithTags(activeTagIds, 'timeline');
        const parentTimelineIds = await getTimelineIdsContainingTaggedNodes(activeTagIds);
        const allMatchingTimelineIds = new Set([...directlyTaggedTimelineIds, ...parentTimelineIds]);
        allTimelines = allTimelines.filter(timeline => allMatchingTimelineIds.has(timeline.id));
    }

// 【请在这里粘贴新的“关键词搜索”代码块】
    if (globalSearchTerm) {
        const timelineIdsToKeep = new Set();
        // 这是一个异步循环，所以用 for...of
        for (const timeline of allTimelines) {
            // 首先，检查标题
            if (timeline.title.toLowerCase().includes(globalSearchTerm)) {
                timelineIdsToKeep.add(timeline.id);
                continue; // 标题匹配成功，无需再检查节点
            }
            // 如果标题不匹配，则检查其下的所有节点内容
            const nodes = await getNodesForTimeline(timeline.id);
            for (const node of nodes) {
                if (node.content.toLowerCase().includes(globalSearchTerm)) {
                    timelineIdsToKeep.add(timeline.id);
                    break; // 只要有一个节点匹配，就立即跳出内层循环
                }
            }
        }
        allTimelines = allTimelines.filter(timeline => timelineIdsToKeep.has(timeline.id));
    }

    timelineListDropdown.innerHTML = '';
    // 预先获取所有标签的“id -> name”映射，提高效率
const allTagsFromDB = await new Promise(resolve => db.transaction('tags').objectStore('tags').getAll().onsuccess = e => resolve(e.target.result));
const allTagsMap = new Map(allTagsFromDB.map(tag => [tag.id, tag.name]));

    const newBtn = document.createElement('div');
newBtn.className = 'timeline-dropdown-row';
    newBtn.textContent = '+ 新建时间轴';
    newBtn.onclick = async (e) => {
        e.stopPropagation();
        timelineListDropdown.classList.remove('visible');
        const title = prompt("请输入新时间轴的标题：");
        if (title && title.trim()) {
            const newId = await addTimelineToDB({ title: title.trim(), recordDate: new Date(), eventDate: new Date() });
            exitTimelineListSelectionMode(); // 新建后退出选择模式
            await renderTimelines(newId);
        }
    };
    timelineListDropdown.appendChild(newBtn);

    // --- 请用下面这个新代码块进行替换 ---
for (const timeline of allTimelines) {
    const itemBtn = document.createElement('div');
itemBtn.className = 'timeline-dropdown-row';
    const timelineId = timeline.id;

    // 获取当前时间轴的标签
    const tagIds = await getTagsForItem(timelineId, 'timeline');
    const tagNames = Array.from(tagIds).map(id => allTagsMap.get(id)).filter(Boolean);

    // 构建新的HTML结构，左侧是标题，右侧是标签
    let contentHtml = `
        <div class="timeline-item-main">
            ${isTimelineListSelectMode 
                ? `<div class="timeline-list-checkbox ${selectedTimelineIds.has(timelineId) ? 'selected' : ''}" data-timeline-id="${timelineId}"></div>` 
                : ''}
            <span class="timeline-title-text">${escapeHTML(timeline.title)}</span>
        </div>
        <div class="timeline-item-tags">
            ${tagNames.map(name => `<span>${name}</span>`).join('')}
        </div>
    `;

    itemBtn.innerHTML = contentHtml;

    // 下面的点击事件逻辑，和你原来的版本是完全一样的
    itemBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const checkbox = e.target.closest('.timeline-list-checkbox');

        if (isTimelineListSelectMode && checkbox) {
            const id = parseInt(checkbox.dataset.timelineId);
            if (selectedTimelineIds.has(id)) {
                selectedTimelineIds.delete(id);
                checkbox.classList.remove('selected');
            } else {
                selectedTimelineIds.add(id);
                checkbox.classList.add('selected');
            }
        } else if (!isTimelineListSelectMode) {
            timelineListDropdown.classList.remove('visible');
            renderTimelines(timelineId);
        }
    });
    timelineListDropdown.appendChild(itemBtn);
}
  timelineListDropdown.classList.add('visible');
}

// 【请使用这个完整替换版】
function enterTimelineListSelectionMode() {
    isTimelineListSelectMode = true; 
    timelinesView.classList.add('timeline-selection-mode'); // <-- 【核心修正】添加识别类
    timelineSelectBtn.style.display = 'none'; 
    timelineSelectAllBtn.style.display = 'inline-block';
    timelineApplyTagsBtn.style.display = 'inline-block';
    timelineDeleteBtn.style.display = 'inline-block';
    timelineExportBtn.style.display = 'inline-block';
    toggleTimelineListDropdown();
}

// 【请使用这个完整替换版】
function exitTimelineListSelectionMode() {
    isTimelineListSelectMode = false;
    timelinesView.classList.remove('timeline-selection-mode'); // <-- 【核心修正】移除识别类
    selectedTimelineIds.clear();
    timelineSelectBtn.style.display = 'inline-block'; 
    timelineSelectAllBtn.style.display = 'none';
    timelineApplyTagsBtn.style.display = 'none';
    timelineDeleteBtn.style.display = 'none';
    timelineExportBtn.style.display = 'none';
    if (timelineListDropdown.classList.contains('visible')) {
         toggleTimelineListDropdown();
    }
}

    // 【请使用这个全新的、带有安全网的版本进行替换】
async function enterNodeEditMode(nodeItem) {
    if (isEditing) return;
    isEditing = true;

    const nodeId = parseInt(nodeItem.dataset.nodeId);
if (isNaN(nodeId)) { // <--【新增】这里稍微复杂一点，因为要重置状态
    isEditing = false;
    return;
}
    const contentWrapper = nodeItem.querySelector('.node-content-wrapper');
    const originalContentHTML = contentWrapper.innerHTML; // 保存原始的HTML，以便取消

    try {
        const node = await getNodeById(nodeId);
        if (!node) {
            throw new Error("找不到要编辑的节点。");
        }

        contentWrapper.innerHTML = `
            <textarea class="node-edit-textarea">${escapeHTML(node.content)}</textarea>
            <div class="node-edit-actions">
                <button class="save-node-btn">✓ 保存</button>
                <button class="delete-node-btn">✗ 删除</button>
                <button class="cancel-edit-btn">取消</button>
            </div>
        `;

        const textarea = contentWrapper.querySelector('.node-edit-textarea');

        function autoResizeTextarea() {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
        textarea.addEventListener('input', autoResizeTextarea);
        autoResizeTextarea();
        textarea.focus();
        textarea.select();

        // 保存按钮的事件
        contentWrapper.querySelector('.save-node-btn').addEventListener('click', async () => {
            const newContent = textarea.value.trim();
            try {
                if (newContent && newContent !== node.content) {
                    await updateNodeInDB(nodeId, { content: newContent });
                }
                // 成功后，重置状态并刷新视图
                isEditing = false; 
                renderTimelines(parseInt(timelinesView.dataset.currentTimelineId));
            } catch (error) {
                alert('保存失败: ' + error.message);
                // 即使失败，也要重置状态
                isEditing = false; 
                contentWrapper.innerHTML = originalContentHTML; // 恢复原始内容
            }
        });

        // 删除按钮的事件
        contentWrapper.querySelector('.delete-node-btn').addEventListener('click', async () => {
            if (confirm(`确定要删除此节点及其所有子节点吗？\n\n内容: ${node.content}`)) {
                try {
                    await deleteNodeFromDB(nodeId);
                    // 成功后，重置状态并刷新视图
                    isEditing = false;
                    renderTimelines(parseInt(timelinesView.dataset.currentTimelineId));
                } catch (error) {
                    alert('删除失败: ' + error.message);
                     // 即使失败，也要重置状态
                    isEditing = false;
                    contentWrapper.innerHTML = originalContentHTML; // 恢复原始内容
                }
            }
        });

        // 取消按钮的事件
        contentWrapper.querySelector('.cancel-edit-btn').addEventListener('click', () => {
            contentWrapper.innerHTML = originalContentHTML;
            isEditing = false; // 取消时，也要重置状态
        });

    } catch (error) {
        // 这是最外层的安全网，如果在获取节点时就失败了
        alert("进入编辑模式失败: " + error.message);
        contentWrapper.innerHTML = originalContentHTML; // 恢复原始内容
        isEditing = false; // 确保状态被重置
    }
}

// --- 数据库交互函数 (时间轴相关) ---

// 【兼容性修复版】
async function getAllTimelinesFromDB() {
    if (!db) return Promise.reject("DB not connected");
    return _fetchAllFromStore('timelines');
}

async function getTimelineById(id) {
    if (!db) return Promise.reject("DB not connected");
    return new Promise((resolve) => {
        db.transaction('timelines', 'readonly')
          .objectStore('timelines')
          .get(id).onsuccess = e => resolve(e.target.result);
    });
}

async function addTimelineToDB(timelineData) {
    if (!db) return Promise.reject("DB not connected");
    return new Promise((resolve) => {
        const request = db.transaction('timelines', 'readwrite')
                        .objectStore('timelines')
                        .add(timelineData);
        request.onsuccess = e => resolve(e.target.result);
    });
}

async function getNodesForTimeline(timelineId) {
    if (!db) return Promise.reject("DB not connected");
    return new Promise((resolve) => {
        const request = db.transaction('timeline_nodes', 'readonly')
                        .objectStore('timeline_nodes')
                        .index('timelineId')
                        .getAll(timelineId);
        request.onsuccess = e => resolve(e.target.result);
    });
}

async function getNodeById(nodeId) {
    if (!db) return Promise.reject("DB not connected");
    return new Promise((resolve) => {
         db.transaction('timeline_nodes', 'readonly')
           .objectStore('timeline_nodes')
           .get(nodeId).onsuccess = e => resolve(e.target.result);
    });
}

async function addNodeToDB(nodeData) {
    if (!db) return Promise.reject("DB not connected");
    return new Promise((resolve) => {
        const request = db.transaction('timeline_nodes', 'readwrite')
                        .objectStore('timeline_nodes')
                        .add(nodeData);
        request.onsuccess = e => resolve(e.target.result);
    });
}

async function updateNodeInDB(nodeId, updatedData) {
    if (!db) return Promise.reject("DB not connected");
    return new Promise((resolve, reject) => {
        const tx = db.transaction('timeline_nodes', 'readwrite');
        const store = tx.objectStore('timeline_nodes');
        const request = store.get(nodeId);
        request.onsuccess = () => {
            const data = request.result;
            if (data) {
                Object.assign(data, updatedData);
                store.put(data);
            }
        };
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function deleteNodeFromDB(nodeId) {
    if (!db) return Promise.reject("DB not connected");
    const tx = db.transaction('timeline_nodes', 'readwrite');
    const store = tx.objectStore('timeline_nodes');
    const index = store.index('parentId');

    async function recursiveDelete(id) {
        store.delete(id);
        const children = await new Promise(resolve => {
            const req = index.getAll(id);
            req.onsuccess = e => resolve(e.target.result);
            req.onerror = e => {
                console.error("查找子节点失败:", e.target.error);
                resolve([]); // 即使失败也返回空数组以继续
            };
        });
        for (const child of children) {
            await recursiveDelete(child.id);
        }
    }

    await recursiveDelete(nodeId);

    return new Promise(resolve => {
       tx.oncomplete = () => resolve();
    });
}
    // --- 【新增】时间轴列表选择模式的核心处理函数 ---

    async function handleDeleteSelectedTimelines() {
        if (selectedTimelineIds.size === 0) {
            return alert("请先选择要删除的时间轴！");
        }
        if (!confirm(`您确定要删除选中的 ${selectedTimelineIds.size} 个时间轴吗？\n警告：这将同时删除这些时间轴下的所有节点，此操作不可恢复！`)) {
            return;
        }

        try {
            await deleteTimelinesFromDB([...selectedTimelineIds]);
            alert("删除成功！");
        } catch (error) {
            console.error("删除时间轴失败:", error);
            alert(`删除失败: ${error.message}`);
        } finally {
            // 不论成功失败，都退出选择模式并刷新视图
            exitTimelineListSelectionMode();
            timelineListDropdown.classList.remove('visible');
            await renderTimelines(); // 重新渲染，加载剩余的第一个时间轴
        }
    }

    async function handleExportSelectedTimelines() {
    if (selectedTimelineIds.size === 0) return alert('请先选择要导出的时间轴！');

    const format = prompt("请选择导出格式:\n\n1. JSON (用于备份)\n2. TXT (人类可读)", "1");
    if (!format || !['1', '2'].includes(format)) return;

    try {
        // 【核心】把“补充图纸”交给我们的工人
        const dataToExport = await getTimelineDataForExport([...selectedTimelineIds]);

        if (!dataToExport || dataToExport.length === 0) return alert('未能获取到任何可导出的数据。');

            let outputString = '';
            if (format === '1') {
                outputString = JSON.stringify(dataToExport, null, 2);
            } else {
                outputString = formatTimelineDataAsTxt(dataToExport);
            }

            exportTextarea.value = outputString;
            exportModal.classList.add('visible'); // 复用已有的导出弹窗

            exitTimelineListSelectionMode();
            timelineListDropdown.classList.remove('visible');
        } catch (error) {
            alert(`导出失败: ${error.message}`);
        }
    }

    // --- 【新增】为导出功能服务的数据库和格式化函数 ---

// 【请只用这个版本，替换你的 getTimelineDataForExport 函数】
async function getTimelineDataForExport(timelineIds) {
    const exportData = [];
    const activeTagIds = [...activeFilterTagIds];

    for (const id of timelineIds) {
        const timeline = await getTimelineById(id);
        let nodes = await getNodesForTimeline(id);

        if (activeTagIds.length > 0) {
            const timelineTags = await getTagsForItem(id, 'timeline');
            const isTimelineItselfTagged = activeTagIds.some(tagId => timelineTags.has(tagId));

            if (!isTimelineItselfTagged) {
                const finalNodes = [];
                for (const node of nodes) {
                    const nodeTags = await getTagsForItem(node.id, 'timeline_node');
                    const hasAllTags = activeTagIds.every(tagId => nodeTags.has(tagId));
                    if (hasAllTags) {
                        finalNodes.push(node);
                    }
                }
                nodes = finalNodes;
            }
        }
        
        if (timeline) {
            exportData.push({ timeline, nodes });
        }
    }
    return exportData;
}

    function formatTimelineDataAsTxt(data) {
        let txt = '';
        data.forEach((item, index) => {
            const { timeline, nodes } = item;
            txt += `========================================\n`;
            txt += `时间轴标题: ${timeline.title}\n`;
            txt += `日期: ${new Date(timeline.eventDate).toLocaleDateString()}\n`;
            txt += `----------------------------------------\n\n`;

            // 构建树形结构用于格式化输出
            const nodeMap = new Map(nodes.map(node => [node.id, { ...node, children: [] }]));
            const tree = [];
            for (const node of nodeMap.values()) {
                if (node.parentId && nodeMap.has(node.parentId)) {
                    nodeMap.get(node.parentId).children.push(node);
                } else {
                    tree.push(node);
                }
            }

            function buildTxt(nodes, indent) {
                let result = '';
                for (const node of nodes) {
                    result += `${'  '.repeat(indent)}- ${node.content}\n`;
                    result += buildTxt(node.children, indent + 1);
                }
                return result;
            }

            txt += buildTxt(tree, 0);

            if (index < data.length - 1) {
                txt += `\n\n\n`;
            }
        });
        return txt;
    }

    // --- 【新增】删除多个时间轴及其节点的数据库函数 ---

    async function deleteTimelinesFromDB(timelineIds) {
        if (!db) return Promise.reject("数据库未连接！");
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['timelines', 'timeline_nodes'], 'readwrite');
            const timelinesStore = tx.objectStore('timelines');
            const nodesStore = tx.objectStore('timeline_nodes');
            const nodesIndex = nodesStore.index('timelineId');

            tx.onerror = event => reject(event.target.error);
            tx.oncomplete = () => resolve();

            timelineIds.forEach(id => {
                // 1. 删除时间轴本身
                timelinesStore.delete(id);

                // 2. 删除该时间轴下的所有节点
                const cursorRequest = nodesIndex.openKeyCursor(IDBKeyRange.only(id));
                cursorRequest.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        nodesStore.delete(cursor.primaryKey);
                        cursor.continue();
                    }
                };
            });
        });
    }
    
    // --- 【升级版】时间轴大纲核心保存函数 ---
            async function handleSaveBulkNodes() {
                // 步骤1：同时获取新标题和新内容
                const newTitle = document.getElementById('bulk-edit-timeline-title').value.trim();
                const text = bulkAddTextarea.value.trim();
                const currentTimelineId = parseInt(timelinesView.dataset.currentTimelineId);

                // 步骤2：进行严格的输入验证
                if (!currentTimelineId) {
                    alert("未找到当前时间轴，无法保存。");
                    return; // 结束函数
                }

                if (!newTitle) {
                    alert("时间轴标题不能为空！");
                    return; // 结束函数
                }

                // 步骤3：在安全的 try...catch 块中执行数据库操作
                try {
                    // 第1步：更新时间轴的标题
                    await updateTimelineTitleInDB(currentTimelineId, newTitle);

                    // 第2步：替换时间轴的节点
                    await replaceTimelineNodesInDB(currentTimelineId, text);

                    // 步骤4：操作成功后，更新UI
                    bulkAddModal.classList.remove('visible');
                    await renderTimelines(currentTimelineId); // 重新渲染，你会看到新的标题和内容

                } catch (error) {
                    console.error("更新时间轴失败:", error);
                    alert("保存失败，请检查您的格式或稍后再试。您的原始数据是安全的。");
                }
            }
    // 新的数据库函数，用于高效地批量添加节点
    // 【请使用这个修正后的版本】
    async function addNodesInBulkToDB(nodes, parents) {
        if (!db) return Promise.reject("数据库未连接！");

        return new Promise((resolve, reject) => {
            const tx = db.transaction('timeline_nodes', 'readwrite');
            const store = tx.objectStore('timeline_nodes');
            tx.onerror = event => reject(event.target.error);
            tx.oncomplete = () => resolve();

            function addNextNode(index) {
                if (index >= nodes.length) return;

                const nodeData = nodes[index];
                const currentLevel = nodeData.level; // <-- 【修正1】先用局部变量存起来

                nodeData.parentId = parents[currentLevel - 1];
                delete nodeData.level; // <-- 现在可以安全地删除了

                const request = store.add(nodeData);
                request.onsuccess = (event) => {
                    const newId = event.target.result;
                    parents[currentLevel] = newId; // <-- 【修正2】使用局部变量来更新
                    addNextNode(index + 1);
                };
            }

            addNextNode(0);
        });
    }

    // --- 【全新】安全的数据库“先删后加”事务函数 ---
    async function replaceTimelineNodesInDB(timelineId, newText) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction('timeline_nodes', 'readwrite');
            const store = tx.objectStore('timeline_nodes');
            const index = store.index('timelineId');

            // 事务出错时，自动回滚，保证数据安全
            tx.onerror = event => reject(event.target.error);
            // 事务成功完成时，通知调用者
            tx.oncomplete = () => resolve();

            // --- 步骤1: 删除属于该时间轴的所有旧节点 ---
            const deleteRequest = index.openKeyCursor(IDBKeyRange.only(timelineId));
            deleteRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    store.delete(cursor.primaryKey);
                    cursor.continue();
                } else {
                    // 当所有旧节点都删除完毕后，开始添加新节点
                    addAllNewNodes();
                }
            };

            // --- 步骤2: 解析文本并添加新节点 ---
            function addAllNewNodes() {
                const lines = newText.split('\n').filter(line => line.trim() !== '');
                const parents = [null, null, null, null]; // 支持更多层级

                function addNextNode(lineIndex) {
                    if (lineIndex >= lines.length) {
                        // 所有行都处理完毕，事务会自动提交
                        return;
                    }

                    const line = lines[lineIndex];
                    const trimmedLine = line.trim();
                    let level = 0;

                    // 计算星号数量来确定层级
                    while(trimmedLine[level] === '*') {
                        level++;
                    }

                    const content = trimmedLine.substring(level).trim();

                    if (level > 0 && content) {
                        const parentId = parents[level - 1];
                        const newNode = {
                            timelineId: timelineId,
                            parentId: parentId,
                            content: content,
                            eventTimestamp: new Date()
                        };

                        const addRequest = store.add(newNode);
                        addRequest.onsuccess = (event) => {
                            const newId = event.target.result;
                            parents[level] = newId;
                            // 成功添加一个后，继续添加下一个
                            addNextNode(lineIndex + 1);
                        };
                    } else {
                        // 如果某一行格式不对，跳过，继续处理下一行
                        addNextNode(lineIndex + 1);
                    }
                }

                addNextNode(0); // 从第一行开始处理
            }
        });
    }
            // 在 main.js 的数据库函数区域末尾添加
            async function updateTimelineTitleInDB(timelineId, newTitle) {
                return new Promise((resolve, reject) => {
                    const tx = db.transaction('timelines', 'readwrite');
                    const store = tx.objectStore('timelines');
                    const request = store.get(timelineId);
                    request.onsuccess = () => {
                        const data = request.result;
                        if (data) {
                            data.title = newTitle;
                            const updateRequest = store.put(data);
                            updateRequest.onerror = () => reject(updateRequest.error);
                        } else {
                            reject('找不到该时间轴');
                        }
                    };
                    request.onerror = () => reject(request.error);
                    tx.oncomplete = () => resolve();
                    tx.onerror = () => reject(tx.error);
                });
            }

// ===================================================================
// --- 【V5版】日记功能全部函数 ---
// ===================================================================

// --- 数据库交互函数 (日记相关) ---

async function getAllDiariesFromDB() {
    if (!db) return Promise.reject("数据库未连接！");
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('diary_entries', 'readonly');
        const store = transaction.objectStore('diary_entries');
        const index = store.index('eventDate'); 
        const request = index.getAll();
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => {
            // 默认按日期升序排列，正好是你想要的，所以不再需要 reverse()
            resolve(event.target.result); 
        };
    });
}

async function getDiaryById(id) {
    if (!db) return Promise.reject("数据库未连接！");
    return new Promise((resolve) => {
        db.transaction('diary_entries', 'readonly')
          .objectStore('diary_entries')
          .get(id).onsuccess = e => resolve(e.target.result);
    });
}

async function saveDiaryToDB(diaryData) {
    if (!db) return Promise.reject("数据库未连接！");
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('diary_entries', 'readwrite');
        const store = transaction.objectStore('diary_entries');
        // put 方法可以自动处理新增（如果id不存在）和更新（如果id存在）
        const request = store.put(diaryData);
        request.onerror = event => reject(event.target.error);
        request.onsuccess = event => resolve(event.target.result);
    });
}

// --- 核心渲染与交互函数 ---

// 【请使用这个最终修正版】
async function renderDiaryView(yearToShow = null) {
    try {
        let diaries = await getAllDiariesFromDB(); // <--- 1. 先获取所有日记

        // 【核心修改】在这里加入筛选逻辑
        if (activeFilterTagIds.size > 0) {
            const filteredIds = await getItemsWithTags([...activeFilterTagIds], 'diary');
            diaries = diaries.filter(d => filteredIds.has(d.id));
        }

if (globalSearchTerm) {
    diaries = diaries.filter(diary => 
        diary.title.toLowerCase().includes(globalSearchTerm) || 
        diary.content.toLowerCase().includes(globalSearchTerm)
    );
}
        diaryGridContainer.innerHTML = ''; 

        if (diaries.length === 0) {
            diaryGridContainer.innerHTML = '<p>还没有日记，点击右下角“+”号开始第一篇吧！</p>';
            diaryYearBtn.textContent = '日记 ▼';
            return;
        }

        // --- 升级：像其他列表一样，预先获取所有标签的“id -> name”映射 ---
        const allTagsMap = new Map((await _fetchAllFromStore('tags')).map(tag => [tag.id, tag.name]));

        const currentYear = yearToShow || new Date(diaries[diaries.length - 1].eventDate).getUTCFullYear();
        diaryYearBtn.textContent = `${currentYear} ▼`;

        let filteredDiaries = diaries.filter(d => new Date(d.eventDate).getUTCFullYear() === currentYear);
        // 【核心修正】让日记从新到旧排列，更符合习惯
        filteredDiaries.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)); 

        let lastMonth = null;

        if (filteredDiaries.length === 0) {
             diaryGridContainer.innerHTML = `<p>${currentYear}年还没有日记。</p>`;
             return;
        }

        // --- 升级：使用 for...of 循环以支持 await ---
        for (const diary of filteredDiaries) {
            const diaryDate = new Date(diary.eventDate);
            const month = diaryDate.getUTCMonth() + 1; 
            const day = diaryDate.getUTCDate();

            if (month !== lastMonth) {
                const divider = document.createElement('div');
                divider.className = 'month-divider';
                
                const monthText = document.createElement('span');
                monthText.className = 'month-text';
                monthText.textContent = `${month}月`;
                divider.appendChild(monthText);
                diaryGridContainer.appendChild(divider);
                lastMonth = month;
            }

            const card = document.createElement('div');
            card.className = 'diary-card';
            card.dataset.diaryId = diary.id;
            
            // --- 升级：获取并准备要显示的标签名称 ---
            const tagIds = await getTagsForItem(diary.id, 'diary');
            const tagNames = [...tagIds].map(id => allTagsMap.get(id)).filter(Boolean);
            const tagsHtml = `<div class="diary-tags-display">
                ${tagNames.map(name => `<span>${name}</span>`).join('')}
            </div>`;

            // --- 升级：构建包含预览、日期和标签的完整卡片内容 ---
            card.innerHTML = `
                <div class="diary-card-preview">${escapeHTML(diary.title || diary.content.split('\n')[0] || '...')}</div>
                <div class="diary-card-date">${day}</div>
                ${tagsHtml} 
            `;
            
            diaryGridContainer.appendChild(card);
        }

    } catch (error) { // <-- 【核心修正】这里的花括号已经补上了！
        console.error("渲染日记视图失败:", error);
        diaryGridContainer.innerHTML = '<p>加载日记失败，请刷新页面重试。</p>';
    }
}

// 打开日记（新建或编辑）
async function openDiaryEntry(diaryId = null) {
if (diaryId) {
// 编辑模式
const diary = await getDiaryById(diaryId);
if (diary) {
diaryEntryView.dataset.currentDiaryId = diary.id;
// 将存储的日期格式化为 'YYYY-MM-DD' 以便输入框识别
diaryEntryDateInput.value = new Date(diary.eventDate).toISOString().split('T')[0];
diaryEntryTextarea.value = diary.content;
}
} else {
// 新建模式
diaryEntryView.dataset.currentDiaryId = ''; // 清空ID
// 为输入框设置今天的日期作为默认值
diaryEntryDateInput.value = new Date().toISOString().split('T')[0];
diaryEntryTextarea.value = ''; // 清空文本框
}
switchView('diary-entry-view');
diaryEntryTextarea.focus();
}

// 保存日记
// 【请使用这个完整替换版】
async function handleSaveDiary() {
    const content = diaryEntryTextarea.value.trim();
    const dateString = diaryEntryDateInput.value;

    if (!dateString) {
        alert('请选择一个日期！');
        return;
    }
    if (!content) {
        alert('日记内容不能为空！');
        return;
    }

    const selectedDate = new Date(dateString + 'T00:00:00Z');
    const currentId = diaryEntryView.dataset.currentDiaryId ? parseInt(diaryEntryView.dataset.currentDiaryId) : null;
    
    try {
        let diaryData;
        // 无论新建还是更新，都从内容中提取最新的标题
        const newTitle = content.split('\n')[0].substring(0, 50);

        if (currentId) {
            const existingDiary = await getDiaryById(currentId);
            // 核心修正：同时更新 content, title, 和 eventDate
            diaryData = { ...existingDiary, content: content, title: newTitle, eventDate: selectedDate };
        } else {
            diaryData = {
                title: newTitle,
                content: content,
                eventDate: selectedDate,
                recordDate: new Date()
            };
        }
        
        await saveDiaryToDB(diaryData);
        switchView('diary-view');

    } catch (error) {
        console.error("保存日记失败:", error);
        alert('保存失败，请稍后再试。');
    }
}

// ===================================================================
// --- 【V5.1版】日记功能 - 头部与选择模式完整函数 ---
// ===================================================================

// --- 1. 年份下拉菜单核心函数 ---
async function toggleDiaryYearDropdown() {
    // 如果菜单已显示，则关闭它
    if (diaryYearDropdown.classList.contains('visible')) {
        diaryYearDropdown.classList.remove('visible');
        return;
    }

    const diaries = await getAllDiariesFromDB();
    if (diaries.length === 0) return;

    // 提取所有不重复的年份并降序排列
    const years = [...new Set(diaries.map(d => new Date(d.eventDate).getUTCFullYear()))];
    years.sort((a, b) => b - a); // 降序，最新的年份在最上面

    diaryYearDropdown.innerHTML = ''; // 清空旧内容

    years.forEach(year => {
        const item = document.createElement('button');
        item.className = 'year-item';
        item.innerHTML = `
            <span class="year-text">${year}</span>
            <span class="year-export-btn" data-year="${year}">导出</span>
        `;
        diaryYearDropdown.appendChild(item);
    });

    // 使用事件委托来处理所有点击
    diaryYearDropdown.onclick = (e) => {
        e.stopPropagation();
        const target = e.target;

        if (target.classList.contains('year-export-btn')) {
            // 点击了“导出”按钮
            const yearToExport = target.dataset.year;
            handleExportYear(parseInt(yearToExport));
        } else {
            // 点击了年份本身
            const yearTextElement = target.closest('.year-item').querySelector('.year-text');
            if (yearTextElement) {
                const yearToView = yearTextElement.textContent;
                renderDiaryView(parseInt(yearToView));
            }
        }
        diaryYearDropdown.classList.remove('visible'); // 操作后关闭菜单
    };

    diaryYearDropdown.classList.add('visible');
}


// --- 2. 选择模式的进入与退出 ---
function enterDiarySelectionMode() {
    isDiaryListSelectionMode = true;
    diaryView.classList.add('selection-mode-active');
    diaryHeader.style.display = 'none'; // 隐藏默认抬头
    selectionDiaryHeader.style.display = 'flex'; // 显示选择抬头
}

function exitDiarySelectionMode() {
    isDiaryListSelectionMode = false;
    diaryView.classList.remove('selection-mode-active');
    diaryHeader.style.display = 'flex';
    selectionDiaryHeader.style.display = 'none';
    
    // 清除所有选中状态
    selectedDiaryIds.clear();
    document.querySelectorAll('.diary-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    selectAllDiariesBtn.textContent = '全选'; // 重置按钮文字
}

function toggleDiarySelection(cardElement) {
    const diaryId = parseInt(cardElement.dataset.diaryId);
    if (selectedDiaryIds.has(diaryId)) {
        selectedDiaryIds.delete(diaryId);
        cardElement.classList.remove('selected');
    } else {
        selectedDiaryIds.add(diaryId);
        cardElement.classList.add('selected');
    }
}


// --- 3. 选择模式下的操作函数 ---
// main.js 中
function handleSelectAllDiaries() {
    // 1. 【核心修复】不再从数据库拿，而是直接从【当前可见的】日记网格里获取
    const allVisibleCards = diaryGridContainer.querySelectorAll('.diary-card');
    const allVisibleIds = Array.from(allVisibleCards).map(card => parseInt(card.dataset.diaryId));

    // 2. 判断是“全选”还是“取消全选”
    const shouldSelectAll = selectedDiaryIds.size < allVisibleIds.length;

    // 3. 执行操作
    allVisibleCards.forEach(card => {
        const diaryId = parseInt(card.dataset.diaryId);
        if (shouldSelectAll) {
            selectedDiaryIds.add(diaryId);
            card.classList.add('selected'); // 别忘了更新UI
        } else {
            selectedDiaryIds.delete(diaryId);
            card.classList.remove('selected'); // 别忘了更新UI
        }
    });
    
    // 4. 更新按钮文字
    selectAllDiariesBtn.textContent = shouldSelectAll ? '取消全选' : '全选';
}

async function handleDeleteSelectedDiaries() {
    if (selectedDiaryIds.size === 0) return alert('请先选择要删除的日记。');
    if (!confirm(`您确定要删除选中的 ${selectedDiaryIds.size} 篇日记吗？此操作不可恢复！`)) {
        return;
    }
    try {
        await deleteDiariesFromDB([...selectedDiaryIds]);
        alert('删除成功！');
        const currentYear = parseInt(diaryYearBtn.textContent);
        exitDiarySelectionMode();
        renderDiaryView(currentYear); // 刷新当前年份的视图
    } catch (error) {
        alert(`删除失败: ${error.message}`);
    }
}

async function handleExportSelectedDiaries() {
    if (selectedDiaryIds.size === 0) return alert('请先选择要导出的日记。');
    
    const format = prompt("请选择导出格式:\n\n1. JSON (用于备份)\n2. TXT (人类可读)", "1");
    if (!format) return;

    try {
        const diariesToExport = await getDiariesByIds([...selectedDiaryIds]);
        const dataToExport = diariesToExport.map(diary => ({ diary })); // 包装成统一格式
        showExportModal(dataToExport, format, 'diary');
        exitDiarySelectionMode();
    } catch (error) {
        alert(`导出失败: ${error.message}`);
    }
}

async function handleExportYear(year) {
    if (!confirm(`您要导出 ${year} 年的全部日记吗？`)) return;

    const format = prompt("请选择导出格式:\n\n1. JSON (备份)\n2. TXT (可读)", "1");
    if (!format) return;
    
    try {
        const allDiaries = await getAllDiariesFromDB();
        const yearDiaries = allDiaries.filter(d => new Date(d.eventDate).getUTCFullYear() === year);
        if (yearDiaries.length === 0) return alert(`${year}年没有日记可导出。`);

        const dataToExport = yearDiaries.map(diary => ({ diary }));
        showExportModal(dataToExport, format, 'diary');
    } catch (error) {
        alert(`导出失败: ${error.message}`);
    }
}


// --- 4. 辅助函数 (数据库与格式化) ---
async function deleteDiariesFromDB(ids) {
    if (!db) return Promise.reject("数据库未连接！");
    return new Promise((resolve, reject) => {
        const tx = db.transaction('diary_entries', 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = event => reject(event.target.error);
        const store = tx.objectStore('diary_entries');
        ids.forEach(id => store.delete(id));
    });
}

async function getDiariesByIds(ids) {
    if (!db) return Promise.reject("数据库未连接！");
    const promises = ids.map(id => getDiaryById(id));
    return Promise.all(promises);
}

function formatDiaryDataAsTxt(data) {
    let txt = '';
    data.forEach((item, index) => {
        const { diary } = item;
        txt += `========================================\n`;
        txt += `日期: ${new Date(diary.eventDate).toLocaleDateString('zh-CN')}\n`;
        txt += `----------------------------------------\n\n`;
        txt += `${diary.content}\n\n`;
        if (index < data.length - 1) {
            txt += `\n\n`;
        }
    });
    return txt;
}

// 【全新的“设置头像ID”函数，数据库交互】
// 工人A：设置某个角色的头像
async function setRoleAvatar(role, avatarId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('role_avatars', 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
        // put 方法会自动处理新增和更新
        tx.objectStore('role_avatars').put({ role: role, avatarId: avatarId });
    });
}

// 工人B：获取所有角色的头像设置
async function getAllRoleAvatars() {
    return _fetchAllFromStore('role_avatars');
}

// ===================================================================
// --- 【V6版】标签功能全部函数 ---
// ===================================================================

// --- 1. 数据库交互函数 (标签) ---
// (此处省略了已有的数据库函数，只添加新的)

async function addCategoryToDB(name) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('tag_categories', 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
        const store = tx.objectStore('tag_categories');
        store.add({ name: name });
    });
}

async function getCategoryByName(name) {
    return new Promise(resolve => {
        const store = db.transaction('tag_categories', 'readonly').objectStore('tag_categories');
        const index = store.index('name');
        index.get(name).onsuccess = e => resolve(e.target.result);
    });
}

// 【兼容性修复版】
async function getAllCategoriesFromDB() {
    return _fetchAllFromStore('tag_categories');
}

async function addTagToDB(name, categoryId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('tags', 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
        const store = tx.objectStore('tags');
        store.add({ name: name, categoryId: categoryId });
    });
}

// 【兼容性修复版】
async function getTagsByCategoryId(categoryId) {
    return new Promise(resolve => {
        const store = db.transaction('tags', 'readonly').objectStore('tags');
        const index = store.index('categoryId');
        const results = [];
        const cursorRequest = index.openCursor(IDBKeyRange.only(categoryId));
        cursorRequest.onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };
    });
}

// 【删除空巢标签分类的数据库函数】
async function deleteCategoryFromDB(categoryId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('tag_categories', 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
        tx.objectStore('tag_categories').delete(categoryId);
    });
}
// 【标签编辑、删除的数据库函数】
async function updateTagInDB(tagId, updatedData) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('tags', 'readwrite');
        const store = tx.objectStore('tags');
        const request = store.get(tagId);
        request.onsuccess = () => {
            const data = request.result;
            if (data) {
                Object.assign(data, updatedData);
                const updateRequest = store.put(data);
                updateRequest.onsuccess = () => resolve();
                updateRequest.onerror = () => reject(updateRequest.error);
            } else {
                reject('找不到该标签');
            }
        };
        request.onerror = () => reject(request.error);
    });
}

// 【请用这个带有“空巢检查”的升级版，替换旧的 deleteTagFromDB 函数】
async function deleteTagFromDB(tagId) {
    // 0. 在删除前，先记住这个标签属于哪个分类
    const tagToDelete = await new Promise(resolve => db.transaction('tags').objectStore('tags').get(tagId).onsuccess = e => resolve(e.target.result));
    const categoryId = tagToDelete ? tagToDelete.categoryId : null;

    // 1. 删除标签本身和所有关联记录 (这部分和原来一样)
    await new Promise((resolve, reject) => {
        const tx = db.transaction(['tags', 'item_tags'], 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
        tx.objectStore('tags').delete(tagId);
        const itemTagsStore = tx.objectStore('item_tags');
        const index = itemTagsStore.index('tagId');
        const request = index.openKeyCursor(IDBKeyRange.only(tagId));
        request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                itemTagsStore.delete(cursor.primaryKey);
                cursor.continue();
            }
        };
    });

    // 2. 【核心新增】执行“空巢检查”
    if (categoryId) {
        const remainingTags = await getTagsByCategoryId(categoryId);
        if (remainingTags.length === 0) {
            // 如果这个分类下已经没有标签了，就删除这个分类
            await deleteCategoryFromDB(categoryId);
        }
    }
}

// 【请用这个全新的、会主动报错的版本进行替换】
async function addItemTag(itemId, tagId, itemType) {
    return new Promise((resolve, reject) => { // <-- 把 reject 也加进来
        const tx = db.transaction('item_tags', 'readwrite');
        
        tx.oncomplete = () => {
            // --- 核心修改：在事务成功后，立刻进行“反向验证” ---
            const validationStore = db.transaction('item_tags', 'readonly').objectStore('item_tags');
            const fullItemId = `${itemType}-${itemId}`;
            const request = validationStore.get([tagId, fullItemId]);

            request.onsuccess = () => {
                if (request.result) {
                    console.log(`[标签写入成功验证] Key: ${fullItemId} - Tag: ${tagId}`);
                    resolve(); // 只有确认写进去了，才算真正成功
                } else {
                    // 如果写完之后立刻就读不出来，说明写入操作被静默回滚了！
                    console.error(`[标签写入失败] Key: ${fullItemId} - Tag: ${tagId}。写入操作被静默回滚！`);
                    reject(new Error('数据库写入失败，操作被静默回滚。')); 
                }
            };
            request.onerror = (e) => reject(e.target.error);
        };

        tx.onerror = e => reject(e.target.error);

        // --- 写入操作本身保持不变 ---
        const store = tx.objectStore('item_tags');
        const fullItemId = `${itemType}-${itemId}`;
        console.log(`[标签写入] 正在尝试添加 Key: ${fullItemId} - Tag: ${tagId}`);
        store.put({ tagId: tagId, itemId: fullItemId });
    });
}

async function removeItemTag(itemId, tagId, itemType) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('item_tags', 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
        const store = tx.objectStore('item_tags');
        const fullItemId = `${itemType}-${itemId}`;
        // 数据库会根据这个组合键，精确地找到并删除那一条记录
        store.delete([tagId, fullItemId]);
    });
}

async function getItemsWithTags(tagIds, itemType) {
    return new Promise(resolve => {
        const store = db.transaction('item_tags', 'readonly').objectStore('item_tags');
        const index = store.index('tagId');
        let candidateSets = [];

        tagIds.forEach((tagId, i) => {
            let itemsForThisTag = new Set();
            const request = index.openCursor(IDBKeyRange.only(tagId));
            request.onsuccess = e => {
                const cursor = e.target.result;
                if (cursor) {
                    const [type, id] = cursor.value.itemId.split('-');
                    if (type === itemType) {
                        itemsForThisTag.add(parseInt(id));
                    }
                    cursor.continue();
                } else {
                    candidateSets.push(itemsForThisTag);
                    if (candidateSets.length === tagIds.length) {
                        // 找到所有集合的交集
                        const intersection = candidateSets.reduce((a, b) => new Set([...a].filter(x => b.has(x))));
                        resolve(intersection);
                    }
                }
            };
        });
    });
}
// 【请使用这个完整替换版，修复数据库报错】
async function getTagsForItem(itemId, itemType) {
    const fullItemId = `${itemType}-${itemId}`;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('item_tags', 'readonly');
        const store = transaction.objectStore('item_tags');
        
        // 检查 'itemId' 索引是否存在
        if (store.indexNames.contains('itemId')) {
            // 如果索引存在，使用最高效的方式查询
            const index = store.index('itemId');
            const request = index.getAll(fullItemId);
            request.onsuccess = e => {
                const tagIds = new Set(e.target.result.map(item => item.tagId));
                resolve(tagIds);
            };
            request.onerror = e => reject(e.target.error);
        } else {
            // 如果索引不存在（作为一种安全备用方案），遍历整个表来查找
            console.warn("警告：'itemId' 索引不存在，查询效率较低。请检查数据库版本。");
            const allTags = new Set();
            const cursorRequest = store.openCursor();
            cursorRequest.onsuccess = e => {
                const cursor = e.target.result;
                if (cursor) {
                    if (cursor.value.itemId === fullItemId) {
                        allTags.add(cursor.value.tagId);
                    }
                    cursor.continue();
                } else {
                    resolve(allTags);
                }
            };
            cursorRequest.onerror = e => reject(e.target.error);
        }
    });
}

// 【三个全新的“头像画廊”数据库函数】

// 工人A：获取画廊里的所有头像
async function getAllAvatarsFromDB() {
    return _fetchAllFromStore('avatars'); // 复用我们可靠的兼容性函数
}

// 工人B：向画廊添加一个新头像
async function addAvatarToDB(avatarData) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('avatars', 'readwrite');
        tx.oncomplete = (e) => resolve(e.target.result);
        tx.onerror = e => reject(e.target.error);
        tx.objectStore('avatars').add({ data: avatarData });
    });
}

// 工人C：从画廊删除一个头像
async function deleteAvatarFromDB(avatarId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('avatars', 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
        tx.objectStore('avatars').delete(avatarId);
    });
}
// --- 2. 侧边栏渲染与交互 ---

// 【请使用这个完整替换版】
async function renderTagsSidebar() {
    const categories = await getAllCategoriesFromDB();
    const isTagsSectionCollapsed = JSON.parse(sessionStorage.getItem('isTagsSectionCollapsed') || 'true'); // 默认折叠
    const unfoldedCategories = new Set(JSON.parse(sessionStorage.getItem('unfoldedCategories') || '[]'));

    let html = `
        <div class="tags-header">
        标签 <span class="toggle-icon ${isTagsSectionCollapsed ? 'collapsed' : ''}"></span>
    </div>
        <ul class="tag-category-list ${isTagsSectionCollapsed ? 'collapsed' : ''}">
            <li class="tag-list-item" id="add-new-tag-btn">+ 新增</li>
            <li class="tag-list-item" id="clear-all-tags-btn">⊘ 取消选中</li>
    `;

    for (const category of categories) {
        const isCollapsed = !unfoldedCategories.has(category.id);
        const tags = await getTagsByCategoryId(category.id);
        html += `
            <li class="tag-category-item" data-category-id="${category.id}">
                <div class="tag-category-header">
        ${category.name} <span class="toggle-icon ${isCollapsed ? 'collapsed' : ''}"></span>
    </div>
                <ul class="tag-list ${isCollapsed ? 'collapsed' : ''}">
        `;
        tags.forEach(tag => {
            const isActive = activeFilterTagIds.has(tag.id) ? 'active' : '';
            // 【核心升级】1. 统一添加 .tag-item 类；2. 把 tag.id 也放到 data-tag-id 中
            html += `<li class="tag-list-item tag-item ${isActive}" data-tag-id="${tag.id}">${escapeHTML(tag.name)}</li>`;
        });
        html += `</ul></li>`;
    }
    html += `</ul>`;
    tagsNavContainer.innerHTML = html;
}

// --- 【新增】为侧边栏标签添加“长按编辑”功能 ---
let tagPressTimer = null;
let isTagLongPress = false;

tagsNavContainer.addEventListener('touchstart', (e) => {
    if (isTagEditing) return;

    // 【核心】只对我们有 .tag-item 身份证的标签生效
    const tagItem = e.target.closest('.tag-item');
    if (!tagItem) return;

    isTagLongPress = false;
    tagPressTimer = setTimeout(() => {
        isTagLongPress = true;
        enterTagEditMode(tagItem);
    }, 500); // 长按超过 0.5 秒触发
});

tagsNavContainer.addEventListener('touchend', () => {
    clearTimeout(tagPressTimer);
});

tagsNavContainer.addEventListener('touchmove', () => {
    clearTimeout(tagPressTimer); // 如果手指滑动了，就取消长按
});

// 【请使用这个最终修正版，修复折叠问题】
tagsNavContainer.addEventListener('click', async (e) => {
    const target = e.target;
    const mainHeader = target.closest('.tags-header');
    const categoryHeader = target.closest('.tag-category-header');
    const tagListItem = target.closest('.tag-list-item');

    // 逻辑0: 点击了主“标签”标题
    if (mainHeader) {
        const icon = mainHeader.querySelector('.toggle-icon');
        const list = mainHeader.nextElementSibling;
        if (icon && list) {
            const isNowCollapsed = list.classList.toggle('collapsed');
            icon.classList.toggle('collapsed', isNowCollapsed);
            sessionStorage.setItem('isTagsSectionCollapsed', isNowCollapsed);
        }
        return;
    }

    // 逻辑1: 如果点击的是分类标题区域
    if (categoryHeader) {
        const categoryItem = categoryHeader.closest('.tag-category-item');
        const categoryId = parseInt(categoryItem.dataset.categoryId);
        const icon = categoryHeader.querySelector('.toggle-icon');
        const list = categoryHeader.nextElementSibling;

        if (icon && list) {
            const isNowCollapsed = list.classList.toggle('collapsed');
            icon.classList.toggle('collapsed', isNowCollapsed);
            
            let unfolded = new Set(JSON.parse(sessionStorage.getItem('unfoldedCategories') || '[]'));
            if (isNowCollapsed) {
                unfolded.delete(categoryId);
            } else {
                unfolded.add(categoryId);
            }
            sessionStorage.setItem('unfoldedCategories', JSON.stringify([...unfolded]));
        }
        return; 
    }

    // 逻辑2: 如果点击的是一个可操作的列表项
    if (tagListItem) {
        if (tagListItem.id === 'add-new-tag-btn') {
            openTagCreationModal();
        } 
        else if (tagListItem.id === 'clear-all-tags-btn') {
            activeFilterTagIds.clear();
            await renderTagsSidebar(); // 这里需要重绘，因为要取消所有高亮
            const currentView = document.querySelector('.view.active-view');
            if (currentView) switchView(currentView.id);
        }
        else { // 点击了具体的某个标签
            const tagId = parseInt(tagListItem.dataset.tagId);
            if (!tagId) return;

            if (activeFilterTagIds.has(tagId)) {
                activeFilterTagIds.delete(tagId);
            } else {
                activeFilterTagIds.add(tagId);
            }

            // 【核心修正】不再重绘整个侧边栏，只切换当前点击项的样式
            tagListItem.classList.toggle('active');
            
            // 触发主视图刷新以应用筛选
            const currentView = document.querySelector('.view.active-view');
            if (currentView) switchView(currentView.id);
        }
    }
});


// --- 3. 弹窗逻辑 ---

async function openTagCreationModal() {
    newTagNameInput.value = '';
    newTagCategoryInput.value = '';
    const categories = await getAllCategoriesFromDB();
    categorySuggestions.innerHTML = categories.map(c => `<option value="${c.name}">`).join('');
    tagCreationModal.classList.add('visible');
}

saveNewTagBtn.addEventListener('click', async () => {
    const tagName = newTagNameInput.value.trim();
    const categoryName = newTagCategoryInput.value.trim();
    if (!tagName || !categoryName) return alert('标签和分类名称都不能为空！');

    try {
        let category = await getCategoryByName(categoryName);
        if (!category) {
            await addCategoryToDB(categoryName);
            category = await getCategoryByName(categoryName);
        }
        await addTagToDB(tagName, category.id);
        tagCreationModal.classList.remove('visible');
        renderTagsSidebar(); // 刷新侧边栏
    } catch (error) {
        alert('保存失败，可能是标签或分类已存在。');
    }
});

// 【新增】一个通用的打开“应用标签”弹窗的函数
// 【请使用这个完整替换版】
async function openApplyTagModal() {
    // 找出当前激活的视图和选中的ID
    const view = document.querySelector('.view.selection-mode-active, .view.timeline-selection-mode, .view.node-selection-mode');
    if (!view) return;
    
    let selectedIds = [];
    let itemType = '';

    // --- 核心修改：增加对 memory-list-view 的判断 ---
    if (view.id === 'memory-list-view') {
        if (currentListMode === 'chats') {
            selectedIds = [...selectedChatIds];
            itemType = 'chat';
        } else {
            selectedIds = [...selectedStarredIds];
            itemType = 'starred';
        }
    } else if (view.id === 'timelines-view') {
        // 【修改】判断当前是时间轴选择模式，还是节点选择模式
        if (isNodeSelectionMode) {
            selectedIds = [...selectedNodeIds];
            itemType = 'timeline_node'; // <-- 使用新的类型
        } else {
            selectedIds = [...selectedTimelineIds];
            itemType = 'timeline';
        }
    } else if (view.id === 'diary-view') {
        selectedIds = [...selectedDiaryIds];
        itemType = 'diary';
    }

    // 获取第一个选中项的已有标签，用于在弹窗中预先勾选
    const existingTagIds = selectedIds.length > 0 ? await getTagsForItem(selectedIds[0], itemType) : new Set();

    // 获取所有分类和标签来构建弹窗内容
    const categories = await getAllCategoriesFromDB();
    let html = '';
    for (const category of categories) {
        const tags = await getTagsByCategoryId(category.id);
        if (tags.length > 0) {
            html += `<div><strong>${category.name}</strong></div>`;
            tags.forEach(tag => {
                const isChecked = existingTagIds.has(tag.id) ? 'checked' : '';
                html += `
                    <div class="apply-tag-item">
                        <input type="checkbox" id="apply-tag-${tag.id}" value="${tag.id}" ${isChecked}>
                        <label for="apply-tag-${tag.id}">${tag.name}</label>
                    </div>
                `;
            });
        }
    }
    applyTagList.innerHTML = html;
    applyTagModal.classList.add('visible');
}

// 为所有“添加标签”按钮绑定事件

// 【请使用这个修正版】
timelineApplyTagsBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // <-- 【核心修正】阻止事件泄露！
    if (selectedTimelineIds.size === 0) return alert('请先选择时间轴！');
    openApplyTagModal();
});
applyTagsToDiariesBtn.addEventListener('click', () => {
    if (selectedDiaryIds.size === 0) return alert('请先选择日记！');
    openApplyTagModal();
});


// 【请用这个全新的、带有详细日志的版本进行替换】
confirmApplyTagBtn.addEventListener('click', async () => {
    const view = document.querySelector('.view.selection-mode-active, .view.timeline-selection-mode, .view.node-selection-mode');
    if (!view) {
        applyTagModal.classList.remove('visible');
        return;
    }
    const viewId = view.id;
    console.log(`[标签应用流程] 1. 检测到当前视图: ${viewId}`);

    const selectedTagCheckboxes = applyTagList.querySelectorAll('input[type="checkbox"]:checked');
    const finalTagIds = new Set(Array.from(selectedTagCheckboxes).map(cb => parseInt(cb.value)));
    console.log(`[标签应用流程] 2. 用户最终选择的 Tag IDs:`, [...finalTagIds]);

    try {
        let itemType = '';
        let itemIds = [];
        
        // --- 这是我们需要重点监控的逻辑判断部分 ---
        if (view.id === 'memory-list-view') {
            if (currentListMode === 'chats') {
                itemIds = [...selectedChatIds];
                itemType = 'chat';
            } else {
                itemIds = [...selectedStarredIds];
                itemType = 'starred'; // <--- 我们在这里先做一个“大胆”的修正！
            }
        } else if (view.id === 'timelines-view') {
             // 【修改】
        if (isNodeSelectionMode) {
            itemIds = [...selectedNodeIds];
            itemType = 'timeline_node';
        } else {
            itemIds = [...selectedTimelineIds];
            itemType = 'timeline';
        }
        } else if (view.id === 'diary-view') {
            itemIds = [...selectedDiaryIds];
            itemType = 'diary';
        }
        console.log(`[标签应用流程] 3. 识别出的 itemType: "${itemType}", Item IDs:`, itemIds);


        if (itemType && itemIds.length > 0) {
            for (const itemId of itemIds) {
                console.log(`[标签应用流程] --- 开始处理 Item ID: ${itemId} ---`);
                const initialTagIds = await getTagsForItem(itemId, itemType);
                console.log(`[标签应用流程] 4. 该项目原有的 Tag IDs:`, [...initialTagIds]);

                // a. 需要新增的标签
                for (const tagId of finalTagIds) {
                    if (!initialTagIds.has(tagId)) {
                        console.log(`[标签应用流程] 5a. 准备新增 Tag ID: ${tagId}`);
                        await addItemTag(itemId, tagId, itemType);
                    }
                }
                // b. 需要删除的标签
                for (const tagId of initialTagIds) {
                    if (!finalTagIds.has(tagId)) {
                        console.log(`[标签应用流程] 5b. 准备删除 Tag ID: ${tagId}`);
                        await removeItemTag(itemId, tagId, itemType);
                    }
                }
            }
        }
        alert('标签更新成功！');
    } catch (error) {
        console.error("[标签应用流程] 发生错误:", error);
        alert('更新标签失败。');
    } finally {
        applyTagModal.classList.remove('visible');
        // 第一步：先让演员上场，在灯光下完成表演 (刷新视图)
    // 这一步会调用 renderDiaryView 或 renderMemoryList
    switchView(viewId); 
    
    // 第二步：表演结束后，再统一关灯清场 (退出所有选择模式)
    // 这一步会移除 .selection-mode-active 等类
    if (memoryListView.classList.contains('selection-mode-active')) exitMemoryListSelectionMode();
    if (isTimelineListSelectMode) exitTimelineListSelectMode();
    if (isNodeSelectionMode) exitNodeSelectionMode();
    if (isDiaryListSelectionMode) exitDiaryListSelectionMode();
}
});

// 关闭弹窗的通用逻辑
tagCreationModal.querySelector('.close-btn').addEventListener('click', () => tagCreationModal.classList.remove('visible'));
applyTagModal.querySelector('.close-btn').addEventListener('click', () => applyTagModal.classList.remove('visible'));

// ===================================================================
// --- 【V7版】内容高亮与定位核心函数 ---
// ===================================================================

/**
 * 1. 文本高亮的核心函数
 *    - 安全地转义HTML，防止XSS攻击
 *    - 找到所有匹配的关键词（不区分大小写）
 *    - 用 <span class="highlight"></span> 把它们包起来
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text, term) {
    if (!term) return escapeHTML(text);
    const escapedTerm = escapeRegExp(term);
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    return escapeHTML(text).replace(regex, `<span class="highlight">$1</span>`);
}


/**
 * 2. 更新导航控件的状态和滚动位置
 */
// 【请替换旧的 updateSearchNav 函数】
function updateSearchNav(shouldScroll = true) {
    if (highlightedElements.length === 0) {
        searchNavControls.style.display = 'none';
        return;
    }

    searchMatchCount.textContent = `${currentHighlightIndex + 1} / ${highlightedElements.length}`;

    highlightedElements.forEach((el, index) => {
        el.classList.toggle('active-highlight', index === currentHighlightIndex);
    });

    if (shouldScroll && currentScrollContainer) { // <--- 核心改动2：检查容器是否存在
        const activeEl = highlightedElements[currentHighlightIndex];
        if (activeEl) {
            // <--- 核心改动3：在指定的容器内滚动
            // 计算元素相对于滚动容器顶部的距离
            const topPos = activeEl.offsetTop - currentScrollContainer.offsetTop;
            
            // 命令指定的容器滚动到计算出的位置
            currentScrollContainer.scrollTo({
                top: topPos - (currentScrollContainer.clientHeight / 2) + (activeEl.clientHeight / 2),
                behavior: 'smooth'
            });
        }
    }
}


/**
 * 3. 初始化导航功能
 *    - 在打开一个详情页后，调用此函数
 */
// 【请替换旧的 setupSearchNavigation 函数】
function setupSearchNavigation(containerElement) {

    if (!globalSearchTerm) {
        searchNavControls.style.display = 'none';
        return;
    }

    highlightedElements = containerElement.querySelectorAll('.highlight');
    currentHighlightIndex = -1;

    if (highlightedElements.length > 0) {
        currentHighlightIndex = 0;
        searchNavControls.style.display = 'flex';
        updateSearchNav(true); // 更新并滚动到第一个
    } else {
        searchNavControls.style.display = 'none';
    }
}

// --- 为导航按钮绑定事件 ---
searchNextBtn.addEventListener('click', () => {
    if (highlightedElements.length === 0) return;
    currentHighlightIndex = (currentHighlightIndex + 1) % highlightedElements.length;
    updateSearchNav();
});

searchPrevBtn.addEventListener('click', () => {
    if (highlightedElements.length === 0) return;
    currentHighlightIndex = (currentHighlightIndex - 1 + highlightedElements.length) % highlightedElements.length;
    updateSearchNav();
});

// main.js

// ==============================
// --- 【兼容性修复】使用游标替代 getAll 的核心函数 ---
// ===========================
function _fetchAllFromStore(storeName) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not connected.");
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const results = [];
        const cursorRequest = store.openCursor();
        cursorRequest.onerror = event => reject(event.target.error);
        cursorRequest.onsuccess = event => {
            const cursor = event.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };
    });
}
// ===================
// --- 【新增】时间轴节点选择模式的全部核心函数 ---
// ==================================

function enterNodeSelectionMode() {
    const currentTimelineId = parseInt(timelinesView.dataset.currentTimelineId);
    if (!currentTimelineId) {
        alert("请先选择一个时间轴才能选择节点。");
        return;
    }
    isNodeSelectionMode = true;
    timelineNodeSelectBtn.classList.add('active-icon');
    timelineSelectBtn.style.display = 'none';
    
    // 【核心修正】直接命令副抬头本人添加 'visible' 类
    selectionNodesHeader.classList.add('visible');

timelinesView.classList.add('node-selection-mode');
// 【新增】在进入模式时，重置按钮的文字为“全选”
    selectAllNodesBtn.textContent = '全选';
renderTimelines(currentTimelineId, true);
}

function exitNodeSelectionMode() {
    isNodeSelectionMode = false;
    selectedNodeIds.clear();
    timelineNodeSelectBtn.classList.remove('active-icon');
    timelineSelectBtn.style.display = 'inline-block';
    
    // 【核心修正】直接命令副抬头本人移除 'visible' 类
    selectionNodesHeader.classList.remove('visible');
    
timelinesView.classList.remove('node-selection-mode');
    
document.querySelectorAll('.timeline-node-item.selected').forEach(item => {
        item.classList.remove('selected');
    });
}

function toggleNodeSelection(nodeItem) {
    const nodeId = parseInt(nodeItem.dataset.nodeId);
    if (selectedNodeIds.has(nodeId)) {
        selectedNodeIds.delete(nodeId);
        nodeItem.classList.remove('selected');
    } else {
        selectedNodeIds.add(nodeId);
        nodeItem.classList.add('selected');
    }
}

// 【请用这个逻辑更严谨的版本，替换旧的 handleSelectAllNodes 函数】
function handleSelectAllNodes() {
    // 1. 找出所有当前“有资格”被选中的节点（即未被筛选掉的）
    const eligibleNodes = timelinesContentContainer.querySelectorAll('.timeline-node-item:not(.filtered-out)');
    const eligibleNodeIds = new Set(Array.from(eligibleNodes).map(el => parseInt(el.dataset.nodeId)));

    // 2. 判断是该全选还是该取消
    const shouldSelectAll = selectedNodeIds.size < eligibleNodeIds.size;
    
    eligibleNodes.forEach(nodeItem => {
        const nodeId = parseInt(nodeItem.dataset.nodeId);
        if (shouldSelectAll) {
            // 执行全选
            if (!selectedNodeIds.has(nodeId)) {
                 selectedNodeIds.add(nodeId);
                 nodeItem.classList.add('selected');
            }
        } else {
            // 执行取消全选
            if (selectedNodeIds.has(nodeId)) {
                selectedNodeIds.delete(nodeId);
                nodeItem.classList.remove('selected');
            }
        }
    });

    // 3. 更新按钮状态
    selectAllNodesBtn.textContent = shouldSelectAll ? '取消全选' : '全选';
}

async function handleDeleteSelectedNodes() {
    if (selectedNodeIds.size === 0) return alert('请先选择要删除的节点。');
    if (!confirm(`您确定要删除这 ${selectedNodeIds.size} 个节点及其所有子节点吗？此操作不可恢复！`)) return;

    try {
        // 使用 Promise.all 并行删除，速度更快
        await Promise.all([...selectedNodeIds].map(id => deleteNodeFromDB(id)));
        alert('删除成功！');
// 【核心新增】删除成功后，立刻手动刷新一次当前的时间轴！
        const currentTimelineId = parseInt(timelinesView.dataset.currentTimelineId);
        if (currentTimelineId) {
            renderTimelines(currentTimelineId);
        }
    } catch (error) {
        console.error('删除节点失败:', error);
        alert('删除失败: ' + error.message);
    } finally {
        exitNodeSelectionMode();
    }
}

// 【请用这个全新的“豪华版”导出函数，完整替换旧版本】
async function handleExportSelectedNodes() {
    if (selectedNodeIds.size === 0) return alert('请先选择要导出的节点！');
    
    const format = prompt("请选择导出格式:\n\n1. JSON (保留层级结构)\n2. TXT (带缩进的可读文本)", "2");
    if (!format || !['1', '2'].includes(format)) return;

    try {
        const allNodesInTimeline = await getNodesForTimeline(parseInt(timelinesView.dataset.currentTimelineId));
        const nodeMap = new Map(allNodesInTimeline.map(node => [node.id, { ...node, children: [] }]));
        
        // 构建完整的树结构
        for (const node of nodeMap.values()) {
            if (node.parentId && nodeMap.has(node.parentId)) {
                nodeMap.get(node.parentId).children.push(node);
            }
        }

        // 筛选出仅包含选中节点及其后代的子树
        function filterTree(nodes, selectedIds) {
            const filtered = [];
            for (const node of nodes) {
                if (selectedIds.has(node.id)) {
                    // 如果节点本身被选中，则保留它和它所有的后代
                    filtered.push(node);
                } else if (node.children.length > 0) {
                    // 如果节点没被选中，检查它的后代有没有被选中的
                    const filteredChildren = filterTree(node.children, selectedIds);
                    if (filteredChildren.length > 0) {
                        // 如果有，则保留这个父节点，但只链接到被筛选过的子节点
                        filtered.push({ ...node, children: filteredChildren });
                    }
                }
            }
            return filtered;
        }
        
        const rootNodes = Array.from(nodeMap.values()).filter(n => !n.parentId);
        const exportedTree = filterTree(rootNodes, selectedNodeIds);
        
        let outputString = '';
        const timelineTitle = timelineTitleBtn.textContent.replace('▼','').trim();

        if (format === '1') { // JSON 格式
            outputString = JSON.stringify({
                title: `${timelineTitle} (节点导出)`,
                nodes: exportedTree
            }, null, 2);
        } else { // TXT 格式
            let txt = `时间轴节点导出 - ${timelineTitle}\n`;
            txt += `========================================\n\n`;
            
            function buildTxt(nodes, indent) {
                let result = '';
                for (const node of nodes) {
                    result += `${'  '.repeat(indent)}- ${node.content}\n`;
                    result += buildTxt(node.children, indent + 1);
                }
                return result;
            }
            txt += buildTxt(exportedTree, 0);
            outputString = txt;
        }
        
        exportTextarea.value = outputString;
        exportModal.classList.add('visible');
        exitNodeSelectionMode();

    } catch (error) {
        console.error("导出节点失败:", error);
        alert(`导出失败: ${error.message}`);
    }
}


// --- 【V-Final】支持节点标签筛选的数据库辅助函数 ---

// 侦察兵 A: 找出所有包含带标签节点的“时间轴ID”
async function getTimelineIdsContainingTaggedNodes(tagIds) {
    if (!db || tagIds.length === 0) return new Set();
    const tagIdSet = new Set(tagIds);

    const allItemTags = await _fetchAllFromStore('item_tags');
    const matchingNodeIds = new Set();
    for (const itemTag of allItemTags) {
        if (itemTag.itemId.startsWith('timeline_node-') && tagIdSet.has(itemTag.tagId)) {
            const nodeId = parseInt(itemTag.itemId.split('-')[1]);
            if (!isNaN(nodeId)) {
                matchingNodeIds.add(nodeId);
            }
        }
    }

    if (matchingNodeIds.size === 0) return new Set();

    const allNodes = await _fetchAllFromStore('timeline_nodes');
    const finalTimelineIds = new Set();
    for (const node of allNodes) {
        if (matchingNodeIds.has(node.id)) {
            finalTimelineIds.add(node.timelineId);
        }
    }
    return finalTimelineIds;
}

// 侦察兵 B: 检查某个东西（时间轴或节点）是否被打了特定标签
async function doesItemHaveTags(itemId, itemType, tagIds) {
    const existingTags = await getTagsForItem(itemId, itemType);
    if (existingTags.size === 0) return false;
    // 只要有一个标签匹配即可
    for (const tagId of tagIds) {
        if (existingTags.has(tagId)) return true;
    }
    return false;
}

// 侦察兵 C: 找出某个时间轴里，所有带特定标签的“节点ID”
async function getTaggedNodeIdsInTimeline(timelineId, tagIds) {
    const nodes = await getNodesForTimeline(timelineId);
    const taggedNodeIds = new Set();
    for (const node of nodes) {
        if (await doesItemHaveTags(node.id, 'timeline_node', tagIds)) {
            taggedNodeIds.add(node.id);
        }
    }
    return taggedNodeIds;
}

// =======================
// --- 【新增】标签原地编辑与删除核心功能 ---
// =============================

let isTagEditing = false; // 全局锁，防止同时编辑多个标签

function enterTagEditMode(tagElement) {
    if (isTagEditing) return;
    isTagEditing = true;

    const tagId = parseInt(tagElement.dataset.tagId);
    const originalContent = tagElement.textContent;
    
    // 用一个带输入框和按钮的 HTML 结构，替换掉原来的标签内容
    tagElement.innerHTML = `
        <input type="text" class="tag-edit-input" value="${escapeHTML(originalContent)}">
        <button class="save-tag-btn">✓</button>
        <button class="cancel-tag-btn">×</button>
    `;

    const input = tagElement.querySelector('.tag-edit-input');
    input.focus();
    input.select();

    // --- 绑定事件 ---
    const saveBtn = tagElement.querySelector('.save-tag-btn');
    const cancelBtn = tagElement.querySelector('.cancel-tag-btn');

    const finishEditing = async (shouldSave) => {
        const newName = input.value.trim();
        
        // 【请用这个增加了“全局刷新”的版本进行替换】
if (shouldSave && newName && newName !== originalContent) {
    // 保存逻辑
    try {
        await updateTagInDB(tagId, { name: newName });
        tagElement.textContent = newName;

        // 【核心新增】通知当前视图进行一次刷新
        const currentView = document.querySelector('.view.active-view');
        if (currentView) {
            switchView(currentView.id);
        }

    } catch (error) {
                alert('保存失败，可能是标签名已存在。');
                tagElement.textContent = originalContent; // 恢复
            }
        } else if (shouldSave && !newName) {
            // 删除逻辑
            if (confirm(`您确定要删除 “${originalContent}” 这个标签吗？\n删除后，所有项目中引用的此标签都将消失。`)) {
                try {
                    await deleteTagFromDB(tagId);
                    // 【核心修正】用完整的侧边栏重绘，来替代简单的移除元素
                    renderTagsSidebar();
                } catch (error) {
                    alert('删除失败，请稍后再试。');
                    tagElement.textContent = originalContent; // 恢复
                }
            } else {
                 tagElement.textContent = originalContent; // 用户取消删除，恢复
            }
        } else {
            // 取消编辑或内容未变
            tagElement.textContent = originalContent;
        }
        isTagEditing = false; // 解锁
    };
    
    saveBtn.addEventListener('click', () => finishEditing(true));
    cancelBtn.addEventListener('click', () => finishEditing(false));
    input.addEventListener('blur', () => finishEditing(true)); // 失去焦点时也尝试保存
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEditing(true);
        if (e.key === 'Escape') finishEditing(false);
    });
}


// --- 【新增】头像画廊核心渲染函数 ---
async function renderAvatarGallery() {
    try {
        const avatars = await getAllAvatarsFromDB();
        avatarGalleryContainer.innerHTML = ''; // 清空旧内容

        if (avatars.length === 0) {
            avatarGalleryContainer.innerHTML = '<p style="grid-column: 1 / -1;">画廊还是空的，点击右上角的“+”号添加第一张头像吧！</p>';
            return;
        }

        avatars.forEach(avatar => {
            const item = document.createElement('div');
            item.className = 'avatar-item';
            item.innerHTML = `
                <img src="${avatar.data}" alt="Avatar">
                <button class="delete-avatar-btn" data-avatar-id="${avatar.id}">&times;</button>
            `;
            avatarGalleryContainer.appendChild(item);
        });
    } catch (error) {
        console.error("渲染头像画廊失败:", error);
        avatarGalleryContainer.innerHTML = '<p>加载头像失败，请刷新重试。</p>';
    }
}


// --- 【核心“魔法”函数】打开头像选择器 ---
// 【请用这个全新的、逻辑更清晰的升级版，替换旧的 openAvatarPicker 函数】
async function openAvatarPicker(role, itemType) { // <--【核心】现在它能接收 itemType 了
    const avatarPickerList = document.getElementById('avatar-picker-list');
    const avatarPickerModal = document.getElementById('avatar-picker-modal');
    const closeBtn = avatarPickerModal.querySelector('.close-btn');

    try {
        const avatars = await getAllAvatarsFromDB();
        avatarPickerList.innerHTML = '';
        
        const handleAvatarSelection = async (avatarId) => {
            try {
                await setRoleAvatar(role, avatarId);
                avatarPickerModal.classList.remove('visible');
                
                // 【核心】设置成功后，需要重新渲染当前打开的聊天窗口
                if (itemType === 'chat') {
                    const currentChatId = parseInt(chatDetailView.dataset.currentChatId);
                    if (currentChatId) openChat(currentChatId, chatDetailTitle.textContent);
                } else if (itemType === 'starred') {
                    const currentStarredId = parseInt(chatDetailView.dataset.currentStarredId);
                    if (currentStarredId) openStarredWindow(currentStarredId, chatDetailTitle.textContent);
                }
            } catch (error) {
                console.error("设置角色头像失败:", error);
                alert('设置角色头像失败！');
            }
        };

        avatars.forEach(avatar => {
            const item = document.createElement('div');
            item.className = 'avatar-picker-item';
            item.innerHTML = `<img src="${avatar.data}" alt="Avatar">`;
            item.onclick = () => handleAvatarSelection(avatar.id);
            avatarPickerList.appendChild(item);
        });
        
        closeBtn.onclick = () => avatarPickerModal.classList.remove('visible');
        avatarPickerModal.classList.add('visible');
    } catch (error) {
        console.error('无法加载头像列表:', error);
        alert('无法加载头像列表！');
    }
}

}); // <-- 这是文件的最后一行

// --- 【新增】PWA Service Worker 注册逻辑 ---
// 这段代码，必须放在 DOMContentLoaded 的外面
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}