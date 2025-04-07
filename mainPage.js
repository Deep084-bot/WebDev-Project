async function fetchAndRenderPosts() {
    try {
        const response = await fetch('http://localhost:3000/posts');
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }

        const posts = await response.json();
        const postsContainer = document.getElementById('posts-container');

        // Clear existing posts
        feed.innerHTML = `
            <div class="post-form">
                <textarea id="post-content" placeholder="What's on your mind?" rows="3"></textarea>
                <input type="file" id="image-input" accept="image/*">
                <button class="post-button" onclick="addPost()">Post</button>
            </div>
        `;

        // Render posts dynamically
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h3>${post.username}</h3>
                <p>${post.content}</p>
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post Image">` : ''}
                <div class="post-actions">
                    <button onclick="likePost('${post._id}')">Like (${post.likes})</button>
                    <button onclick="showCommentBox('${post._id}')">Comment</button>
                </div>
                <div class="comments" id="comments-${post._id}">
                    ${post.comments.map(comment => `<p><strong>${comment.username}:</strong> ${comment.comment}</p>`).join('')}
                </div>
                <div class="comment-box" id="comment-box-${post._id}" style="display: none;">
                    <input type="text" id="comment-input-${post._id}" placeholder="Write a comment...">
                    <button onclick="addComment('${post._id}')">Submit</button>
                </div>
            `;
            feed.appendChild(postElement);
        });
    } catch (err) {
        console.error("Error fetching posts:", err);
    }
}

// Add a new post
async function addPost() {
    const content = document.getElementById('post-content').value;
    const imageInput = document.getElementById('image-input').files[0];
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username') || 'Anonymous'); // Use username from local storage
    formData.append('content', content);
    if (imageInput) {
        formData.append('image', imageInput);
    }

    try {
        const response = await fetch('http://localhost:3000/addPost', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error("Failed to add post");
        }
        fetchAndRenderPosts(); // Refresh posts
    } catch (err) {
        console.error("Error adding post:", err);
    }
}

// Like a post
async function likePost(postId) {
    try {
        const response = await fetch('http://localhost:3000/likePost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId })
        });
        if (!response.ok) {
            throw new Error("Failed to like post");
        }
        fetchAndRenderPosts(); // Refresh posts
    } catch (err) {
        console.error("Error liking post:", err);
    }
}

// Show comment box
function showCommentBox(postId) {
    const commentBox = document.getElementById(`comment-box-${postId}`);
    commentBox.style.display = commentBox.style.display === 'none' ? 'block' : 'none';
}

// Add a comment
async function addComment(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const comment = commentInput.value;

    try {
        const response = await fetch('http://localhost:3000/addComment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, username: localStorage.getItem('username') || 'Anonymous', comment })
        });
        if (!response.ok) {
            throw new Error("Failed to add comment");
        }
        fetchAndRenderPosts(); // Refresh posts
    } catch (err) {
        console.error("Error adding comment:", err);
    }
}

// Logout functionality
function logout() {
    // Clear user data from local storage
    localStorage.removeItem('username');
    // Redirect to login page
    window.location.href = '/frontend/pages/login.html';
}

// Call the function on page load
window.onload = fetchAndRenderPosts;