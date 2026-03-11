# SteelBlog Proto (WordPress-style HTML/CSS/JS Prototype)

A more feature-rich static blog prototype inspired by industrial blog layouts and built using plain HTML, CSS, and JavaScript.

## Pages

- **Home** (`index.html`): featured post, searchable feed, category chips, sorting, and pagination
- **Single Post** (`post.html`): article detail with mock comments
- **Admin** (`admin.html`): editor-like create post form with validation

## Features

- Industrial-style UI with blue + orange theme
- Featured article section
- Search, category filter, and sort options
- Client-side pagination
- Newsletter subscribe mock
- Mock comments on post page
- LocalStorage persistence for posts

## Run locally

```bash
python3 -m http.server 8000
```

Open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/admin.html`
