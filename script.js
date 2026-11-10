const likeButton = document.getElementById('like-button');
const dislikeButton = document.getElementById('dislike-button');
const likeCount = document.getElementById('like-count');
const dislikeCount = document.getElementById('dislike-count');
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const submitButton = document.getElementById('submit-button');
const resetButton = document.getElementById('reset-button');
const commentsList = document.getElementById('comments');
const message = document.getElementById('message');

// Keep the lab's cookies within its own website directory.
const cookiePath = window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/') + 1);
const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
let likes = 0;
let dislikes = 0;
let comments = [];

function getCookie(name) {
  const cookie = document.cookie.split('; ').find(item => item.startsWith(name + '='));
  if (!cookie) return null;
  try {
    return decodeURIComponent(cookie.slice(name.length + 1));
  } catch {
    return null;
  }
}

function setCookie(name, value) {
  document.cookie = name + '=' + encodeURIComponent(value) +
    '; Max-Age=2592000; Path=' + cookiePath + '; SameSite=Lax' + secureFlag;
  return getCookie(name) === value;
}

function clearCookie(name) {
  document.cookie = name + '=; Max-Age=0; Path=' + cookiePath + '; SameSite=Lax' + secureFlag;
}

function updateUI() {
  const choice = getCookie('lab6Choice');
  likes = choice === 'like' ? 1 : 0;
  dislikes = choice === 'dislike' ? 1 : 0;
  try {
    const savedComments = JSON.parse(getCookie('lab6Comments') || '[]');
    comments = Array.isArray(savedComments)
      ? savedComments.filter(comment => typeof comment === 'string' && comment.trim() && comment.length <= 200).slice(0, 1)
      : [];
  } catch {
    comments = [];
  }

  likeCount.textContent = likes;
  dislikeCount.textContent = dislikes;
  likeButton.disabled = dislikeButton.disabled = likes + dislikes > 0;
  likeButton.setAttribute('aria-pressed', String(likes > 0));
  dislikeButton.setAttribute('aria-pressed', String(dislikes > 0));
  commentInput.disabled = submitButton.disabled = comments.length > 0;

  commentsList.replaceChildren();
  comments.forEach(comment => {
    const item = document.createElement('li');
    item.textContent = comment;
    commentsList.appendChild(item);
  });
}

function vote(choice) {
  updateUI();
  if (likes + dislikes > 0) return;
  const saved = setCookie('lab6Choice', choice);
  updateUI();
  message.textContent = saved
    ? 'Your vote has been saved. Reset to vote again.'
    : 'Please enable cookies to save your vote.';
}

likeButton.addEventListener('click', () => vote('like'));
dislikeButton.addEventListener('click', () => vote('dislike'));

commentForm.addEventListener('submit', event => {
  event.preventDefault();
  updateUI();
  if (comments.length > 0) return;
  const comment = commentInput.value.trim();
  if (!comment || comment.length > 200) {
    message.textContent = 'Enter a comment between 1 and 200 characters.';
    return;
  }
  const saved = setCookie('lab6Comments', JSON.stringify([comment]));
  if (saved) commentInput.value = '';
  updateUI();
  message.textContent = saved
    ? 'Your comment has been saved. Reset to comment again.'
    : 'Please enable cookies to save your comment.';
});

resetButton.addEventListener('click', () => {
  clearCookie('lab6Choice');
  clearCookie('lab6Comments');
  commentInput.value = '';
  updateUI();
  message.textContent = 'Your vote and comment have been reset.';
});

window.addEventListener('focus', updateUI);
updateUI();
