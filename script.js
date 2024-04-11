const postForm = document.getElementById('postForm');
const postList = document.getElementById('postList');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('search-input');

let posts = [];
let currentPage = 1;
const postsPerPage = 5;

// Load posts from localStorage on page load
window.addEventListener('load', () => {
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = storedPosts;
    renderPosts(posts, currentPage);
    renderPagination();
});

// Save posts to localStorage
function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Render posts on the page
function renderPosts(posts, page) {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    postList.innerHTML = '';
    paginatedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="post-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        const editBtn = postElement.querySelector('.edit-btn');
        const deleteBtn = postElement.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => {
            editPost(post);
        });

        deleteBtn.addEventListener('click', () => {
            deletePost(post.id);
        });

        postList.appendChild(postElement);
    });
}

// Render pagination
function renderPagination() {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(posts.length / postsPerPage);

    if (totalPages > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.innerText = 'Prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            currentPage--;
            renderPosts(posts, currentPage);
            renderPagination();
        });
        pagination.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.innerText = i;
            pageBtn.classList.add('page-btn');
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderPosts(posts, currentPage);
                renderPagination();
            });
            pagination.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.innerText = 'Next';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            currentPage++;
            renderPosts(posts, currentPage);
            renderPagination();
        });
        pagination.appendChild(nextBtn);
    }
}

// Create a new post
postForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const newPost = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        title,
        content,
    };

    posts.push(newPost);
    savePosts();
    postForm.reset();
    renderPosts(posts, currentPage);
    renderPagination();
});

// Edit a post
function editPost(post) {
    const title = prompt('Edit Title', post.title);
    const content = prompt('Edit Content', post.content);

    if (title && content) {
        post.title = title;
        post.content = content;
        savePosts();
        renderPosts(posts, currentPage);
    }
}

// Delete a post
function deletePost(id) {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
        posts = posts.filter(post => post.id !== id);
        savePosts();
        renderPosts(posts, currentPage);
        renderPagination();
    }
}

// Search posts
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPosts = posts.filter(post => {
        const postTitle = post.title.toLowerCase();
        const postContent = post.content.toLowerCase();
        return postTitle.includes(searchTerm) || postContent.includes(searchTerm);
    });
    renderPosts(filteredPosts, currentPage);
    renderPagination();
});

// Toggle light/dark mode
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;
const header = document.querySelector('header');
const sections = document.querySelectorAll('section');

themeSwitch.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    header.classList.toggle('dark-mode');
    sections.forEach(section => section.classList.toggle('dark-mode'));
});
