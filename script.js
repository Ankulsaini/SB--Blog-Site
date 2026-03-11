const STORAGE_KEY = "protopress_posts";

const samplePosts = [
  {
    id: "1",
    title: "Welcome to ProtoPress",
    author: "Admin",
    category: "General",
    date: "2026-03-11",
    content:
      "This starter post shows how your homepage and single post views connect. Use the mock admin page to create your own posts."
  },
  {
    id: "2",
    title: "Building with plain HTML, CSS, and JavaScript",
    author: "Alex",
    category: "Development",
    date: "2026-03-11",
    content:
      "You can prototype quickly without frameworks while keeping a WordPress-style structure: list view, detail page, and authoring workflow."
  },
  {
    id: "3",
    title: "Design notes for a clean light theme",
    author: "Jamie",
    category: "Design",
    date: "2026-03-11",
    content:
      "This light theme uses soft grays, white cards, and blue accents for a familiar blog aesthetic with good readability."
  }
];

function getPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts));
    return [...samplePosts];
  }
  return JSON.parse(raw);
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function renderHome() {
  const container = document.getElementById("post-list");
  const seedBtn = document.getElementById("seed-btn");
  const posts = getPosts().slice().reverse();

  container.innerHTML = posts
    .map(
      (post) => `
        <article class="card post-card">
          <h3>${post.title}</h3>
          <p class="meta">By ${post.author} • ${post.category} • ${post.date}</p>
          <p>${post.content.slice(0, 115)}...</p>
          <a class="btn" href="post.html?id=${post.id}">Read post</a>
        </article>
      `
    )
    .join("");

  seedBtn.addEventListener("click", () => {
    savePosts(samplePosts);
    renderHome();
  });
}

function renderPostDetail() {
  const wrapper = document.getElementById("post-detail");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const post = getPosts().find((p) => p.id === id);

  if (!post) {
    wrapper.innerHTML = `<h1>Post not found</h1><p>The requested post does not exist.</p><a class="btn" href="index.html">Back to Home</a>`;
    return;
  }

  wrapper.innerHTML = `
    <h1>${post.title}</h1>
    <p class="meta">By ${post.author} • ${post.category} • ${post.date}</p>
    <p>${post.content}</p>
    <a class="btn" href="index.html">← Back to Home</a>
  `;
}

function setupAdminForm() {
  const form = document.getElementById("post-form");
  const message = document.getElementById("form-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newPost = {
      id: Date.now().toString(),
      title: formData.get("title").toString(),
      author: formData.get("author").toString(),
      category: formData.get("category").toString(),
      content: formData.get("content").toString(),
      date: new Date().toISOString().slice(0, 10)
    };

    const posts = getPosts();
    posts.push(newPost);
    savePosts(posts);

    form.reset();
    message.textContent = "Post published to local prototype storage. Open Home to view it.";
  });
}

const page = document.body.dataset.page;
if (page === "home") {
  renderHome();
}
if (page === "post") {
  renderPostDetail();
}
if (page === "admin") {
  setupAdminForm();
}
