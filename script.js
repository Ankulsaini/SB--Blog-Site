const STORAGE_KEY = "steelblog_posts";
const PAGE_SIZE = 4;

const samplePosts = [
  {
    id: "1",
    title: "Steel Price Movement: Weekly Snapshot",
    author: "Market Desk",
    category: "Market Update",
    date: "2026-03-08",
    readTime: 4,
    summary: "A quick look at domestic and import steel price movement across key product segments this week.",
    content: "Domestic HRC prices held firm this week while select long products saw mild correction. Import offers remained range-bound due to freight fluctuations. Procurement teams should track regional variation before issuing fresh tenders."
  },
  {
    id: "2",
    title: "How Buyers Can Reduce Procurement Risk",
    author: "Procurement Team",
    category: "Procurement",
    date: "2026-03-06",
    readTime: 5,
    summary: "Use staggered buying, supplier diversification, and index tracking to reduce risk in volatile cycles.",
    content: "In cyclical commodities, a single-shot purchase can increase exposure. Split procurement lots by timeline, compare landed cost, and maintain alternate mills to keep negotiation flexibility."
  },
  {
    id: "3",
    title: "Logistics Watch: Dispatch Delays and Planning",
    author: "Operations",
    category: "Logistics",
    date: "2026-03-03",
    readTime: 3,
    summary: "Planning dispatch buffers and lane-wise tracking can reduce service disruption during high-demand periods.",
    content: "Weekly lane-level review helps identify bottlenecks early. Align loading schedules with transporter capacity and keep contingency routes to avoid last-minute shipment slippage."
  },
  {
    id: "4",
    title: "Scrap Trends and Their Effect on Steel Pricing",
    author: "Research",
    category: "Raw Materials",
    date: "2026-02-27",
    readTime: 6,
    summary: "Scrap prices continue to influence finished steel offers, especially in selected regions and product lines.",
    content: "Recent international scrap firmness has fed into selective upward pressure on finished material offers. Buyers should monitor conversion spread instead of absolute price alone."
  },
  {
    id: "5",
    title: "Quarterly Demand Outlook: Infra and Manufacturing",
    author: "Editorial",
    category: "Industry Outlook",
    date: "2026-02-20",
    readTime: 4,
    summary: "Infrastructure and manufacturing demand remain key drivers for medium-term steel consumption growth.",
    content: "Project pipeline visibility remains strong in roads and urban works, while manufacturing demand is uneven across segments. Balanced inventory planning is advised for the next quarter."
  }
];

const sanitize = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

function getPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts));
    return [...samplePosts];
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts));
    return [...samplePosts];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
}

function renderHome() {
  const postList = document.getElementById("post-list");
  const featured = document.getElementById("featured-post");
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const sortFilter = document.getElementById("sort-filter");
  const categoryChips = document.getElementById("category-chips");
  const seedBtn = document.getElementById("seed-btn");
  const clearBtn = document.getElementById("clear-filters");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const pageStatus = document.getElementById("page-status");
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterEmail = document.getElementById("newsletter-email");
  const newsletterMessage = document.getElementById("newsletter-message");

  let page = 1;
  let posts = getPosts();

  const updateCategories = () => {
    const categories = ["All", ...new Set(posts.map((post) => post.category))];
    categoryFilter.innerHTML = categories.map((cat) => `<option value="${sanitize(cat)}">${sanitize(cat)}</option>`).join("");
    categoryChips.innerHTML = categories
      .filter((cat) => cat !== "All")
      .map((cat) => `<button class="chip" data-cat="${sanitize(cat)}" type="button">${sanitize(cat)}</button>`)
      .join("");
  };

  const getFiltered = () => {
    const term = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const sort = sortFilter.value;

    let filtered = posts.filter((post) => {
      const inCategory = category === "All" || post.category === category;
      const haystack = `${post.title} ${post.summary} ${post.content} ${post.author}`.toLowerCase();
      return inCategory && haystack.includes(term);
    });

    if (sort === "latest") filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === "oldest") filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === "title") filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));

    return filtered;
  };

  const renderFeatured = (items) => {
    const first = items[0];
    if (!first) {
      featured.innerHTML = `<h2>Featured Story</h2><p class="muted">No post available.</p>`;
      return;
    }
    featured.innerHTML = `
      <p class="meta">Featured • ${sanitize(first.category)}</p>
      <h2>${sanitize(first.title)}</h2>
      <p>${sanitize(first.summary)}</p>
      <p class="meta">By ${sanitize(first.author)} • ${formatDate(first.date)} • ${sanitize(first.readTime)} min read</p>
      <a href="post.html?id=${encodeURIComponent(first.id)}">Read full article →</a>
    `;
  };

  const renderList = () => {
    const filtered = getFiltered();
    renderFeatured(filtered);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    page = Math.min(page, totalPages);

    const start = (page - 1) * PAGE_SIZE;
    const paged = filtered.slice(start, start + PAGE_SIZE);

    if (!paged.length) {
      postList.innerHTML = `<article class="card empty-state"><h3>No matching posts found</h3><p class="muted">Try changing search/filter or restore sample data.</p></article>`;
    } else {
      postList.innerHTML = paged
        .map((post) => `
          <article class="card post-card">
            <p class="meta">${sanitize(post.category)} • ${formatDate(post.date)} • ${sanitize(post.readTime)} min read</p>
            <h3>${sanitize(post.title)}</h3>
            <p>${sanitize(post.summary)}</p>
            <p class="meta">By ${sanitize(post.author)}</p>
            <a class="btn" href="post.html?id=${encodeURIComponent(post.id)}">Read Post</a>
          </article>
        `)
        .join("");
    }

    pageStatus.textContent = `Page ${page} of ${totalPages}`;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
  };

  updateCategories();
  renderList();

  searchInput.addEventListener("input", () => { page = 1; renderList(); });
  categoryFilter.addEventListener("change", () => { page = 1; renderList(); });
  sortFilter.addEventListener("change", () => { page = 1; renderList(); });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "All";
    sortFilter.value = "latest";
    page = 1;
    renderList();
  });

  seedBtn.addEventListener("click", () => {
    savePosts(samplePosts);
    posts = getPosts();
    updateCategories();
    page = 1;
    renderList();
  });

  prevBtn.addEventListener("click", () => { page -= 1; renderList(); });
  nextBtn.addEventListener("click", () => { page += 1; renderList(); });

  categoryChips.addEventListener("click", (event) => {
    const target = event.target.closest("[data-cat]");
    if (!target) return;
    categoryFilter.value = target.dataset.cat;
    page = 1;
    renderList();
  });

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterMessage.className = "form-message";
    if (!newsletterEmail.value.trim() || !newsletterEmail.checkValidity()) {
      newsletterMessage.classList.add("error");
      newsletterMessage.textContent = "Please enter a valid email address.";
      return;
    }
    newsletterMessage.classList.add("success");
    newsletterMessage.textContent = "Subscribed successfully (demo).";
    newsletterForm.reset();
  });
}

function renderPostPage() {
  const wrapper = document.getElementById("post-detail");
  const commentForm = document.getElementById("comment-form");
  const commentList = document.getElementById("comment-list");
  const id = new URLSearchParams(window.location.search).get("id");
  const post = getPosts().find((item) => item.id === id);
  const comments = [];

  if (!post) {
    wrapper.innerHTML = `<h1>Post not found</h1><p class="muted">Requested article does not exist.</p><a class="btn" href="index.html">Back to Home</a>`;
    commentForm.style.display = "none";
    return;
  }

  wrapper.innerHTML = `
    <p class="meta">${sanitize(post.category)} • ${formatDate(post.date)} • ${sanitize(post.readTime)} min read</p>
    <h1>${sanitize(post.title)}</h1>
    <p class="meta">By ${sanitize(post.author)}</p>
    <p><strong>Summary:</strong> ${sanitize(post.summary)}</p>
    <p>${sanitize(post.content).replace(/\n/g, "<br>")}</p>
    <a class="btn subtle-btn" href="index.html">← Back to Home</a>
  `;

  const renderComments = () => {
    if (!comments.length) {
      commentList.innerHTML = `<p class="muted">No comments yet.</p>`;
      return;
    }
    commentList.innerHTML = comments
      .map((comment) => `<article class="comment-item"><strong>${sanitize(comment.name)}</strong><p>${sanitize(comment.comment)}</p></article>`)
      .join("");
  };

  renderComments();

  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(commentForm);
    const name = formData.get("name").toString().trim();
    const comment = formData.get("comment").toString().trim();
    if (!name || !comment) return;
    comments.unshift({ name, comment });
    commentForm.reset();
    renderComments();
  });
}

function setupAdmin() {
  const form = document.getElementById("post-form");
  const message = document.getElementById("form-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.className = "form-message";

    const data = new FormData(form);
    const payload = {
      title: data.get("title").toString().trim(),
      author: data.get("author").toString().trim(),
      category: data.get("category").toString().trim(),
      readTime: Number(data.get("readTime")),
      summary: data.get("summary").toString().trim(),
      content: data.get("content").toString().trim()
    };

    if (!payload.title || !payload.author || !payload.category || payload.readTime < 1 || payload.summary.length < 40 || payload.content.length < 80) {
      message.classList.add("error");
      message.textContent = "Please complete all fields: summary >= 40 chars, content >= 80 chars.";
      return;
    }

    const posts = getPosts();
    posts.unshift({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      ...payload
    });
    savePosts(posts);

    form.reset();
    message.classList.add("success");
    message.textContent = "Post published successfully (local demo storage).";
  });
}

const page = document.body.dataset.page;
if (page === "home") renderHome();
if (page === "post") renderPostPage();
if (page === "admin") setupAdmin();
