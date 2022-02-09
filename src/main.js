import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getFirestore, collection, setDoc, doc, onSnapshot, query } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAE4Ss2viP76evjxH03daDDlSgzSInVGFM",
  authDomain: "webb-235f0.firebaseapp.com",
  databaseURL: "https://webb-235f0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "webb-235f0",
  storageBucket: "webb-235f0.appspot.com",
  messagingSenderId: "535953968153",
  appId: "1:535953968153:web:cc2a1d98c12c154f5a6e88"
};

// Initialize Firebase
initializeApp(firebaseConfig);
//Initialize Firestore
const db = getFirestore()
//Html elemets
let name = document.getElementById('name')
let nameFrom = document.getElementById('name_form')
let sessionId = Math.floor(Math.random() * 1001)
let chatForm = document.getElementById('form')
let textBox = document.getElementById('text')
let messages = document.querySelector('ul')
let scroll = document.scrollingElement || document.body
let nameValue = ''
chatForm.addEventListener('submit', handleSubmit)

//realtime database-listener
const q = query(collection(db, 'charts'))
onSnapshot(q, (snap)=>{
snap.docChanges().forEach((change)=>{
  if(change.type == 'added' && change.doc.data().date > Date.now() - 60*60*1000){
    handleChildAdded(change.doc.data())
  }
})
})
//adding name to chat
nameFrom.addEventListener('submit', (e)=>{
  e.preventDefault() 
  if(!name.value) return
  nameValue = name.value
  nameFrom.hidden = true
})
// handle chat
async function handleSubmit(e) {
  e.preventDefault()
  if (nameValue == '') {
    return showWarning()
  }

  const data = {
    date: Date.now(),
    userId: sessionId,
    name: nameValue,
    message: textBox.value
  }
  textBox.value = ''
  const newChatsRef = doc(collection(db, "charts"));
  await setDoc(newChatsRef, data).then((data)=>{
    console.log(data)
  })
}
// loops out on html
function handleChildAdded(data) {
  const messageData = data
  const li = document.createElement('li')

  li.innerHTML = emoji[messageData.userId] + '  ' + messageData.name + '<br>' + messageData.message

  if (messageData.userId !== sessionId) {
    li.classList.add('other')
  }

  messages.appendChild(li)
  scroll.scrollTop = scroll.scrollHeight
}
function showWarning(){
  const war = document.createElement('h1')
  war.innerHTML = 'Please add name'
  war.classList.add('warning')
  document.body.appendChild(war)
  setTimeout(()=>{
    document.body.removeChild(war)
  },3000)
}