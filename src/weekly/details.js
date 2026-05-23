/*
  Requirement: Populate the weekly detail page and handle the discussion forum.
*/

// --- Global Data Store ---
let currentWeekId = null;
let currentComments = [];

// --- Element Selections ---
const weekTitle = document.getElementById('week-title');
const weekStartDate = document.getElementById('week-start-date');
const weekDescription = document.getElementById('week-description');
const weekLinksList = document.getElementById('week-links-list');

const commentList = document.getElementById('comment-list');
const commentForm = document.getElementById('comment-form');
const newCommentInput = document.getElementById('new-comment');

// --- Functions ---

function getWeekIdFromURL() {

  const params = new URLSearchParams(window.location.search);

  return params.get('id');

}

function renderWeekDetails(week) {

  weekTitle.textContent = week.title;

  weekStartDate.textContent = `Starts on: ${week.start_date}`;

  weekDescription.textContent = week.description;

  weekLinksList.innerHTML = '';

  week.links.forEach((url) => {

    const li = document.createElement('li');

    const a = document.createElement('a');

    a.href = url;
    a.textContent = url;
    a.target = '_blank';

    li.appendChild(a);

    weekLinksList.appendChild(li);

  });

}

function createCommentArticle(comment) {

  const article = document.createElement('article');

  const text = document.createElement('p');
  text.textContent = comment.text;

  const footer = document.createElement('footer');
  footer.textContent = `Posted by: ${comment.author}`;

  article.appendChild(text);
  article.appendChild(footer);

  return article;

}

function renderComments() {

  commentList.innerHTML = '';

  currentComments.forEach((comment) => {

    const article = createCommentArticle(comment);

    commentList.appendChild(article);

  });

}

async function handleAddComment(event) {

  event.preventDefault();

  const commentText = newCommentInput.value.trim();

  if (!commentText) {
    return;
  }

  try {

    const response = await fetch('./api/index.php?action=comment', {

      method: 'POST',

      headers: {
        'Content-Type':
