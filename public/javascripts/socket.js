
const leftNav = document.getElementById('left-nav')
const publicChatRemind = document.getElementById('public-chat-remind')
//
const { userId } = leftNav.dataset
const socket = io({query:{userId}})
// 處理通知事務
socket.on('notify user',(senderId)=>{
    publicChatRemind.classList.remove('hidden')
})