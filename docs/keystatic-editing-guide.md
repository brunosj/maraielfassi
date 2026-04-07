# Editing the website with Keystatic (simple guide)

This guide is for **editors and content owners**. You do not need to write code. Keystatic is the admin area where you update text, lists, and images that appear on the public site.

---

## How to open the admin

1. Open the website in your browser (for example your live site or a preview URL your team gives you).
2. Go to the **admin address** by adding **`/keystatic`** to the end of the site address.  
   **Example:** if the site is `https://example.com`, open `https://example.com/keystatic`
3. **If the browser asks for a username and password**, use the login your technical contact provided. (If nothing asks, the admin may be open only on a local test machine—that is normal during development.)

You should see the Keystatic dashboard with sections such as **Site**, **Services**, and **Publications**.

---

## Saving your work

- Use **Save** (or the equivalent control) in the admin when you finish an edit.
- A small **“Saved”** message may appear briefly after a successful save.
- On the **live server**, changes usually show on the public pages after you **refresh** the page in the browser (you may need to wait a second after saving).

---

## Site (global information)

**Site** holds details used across the whole website: header, footer, contact line, and the main introduction on the home page.

Typical fields:

| What you see in the admin | What it does on the site |
|---------------------------|---------------------------|
| Name | Your name as shown in the header and titles |
| Tagline | Short line under your name |
| Meta description | Short summary used for search engines and previews |
| Introduction | Longer welcome text on the home page (you can use line breaks) |
| Contact email | Email shown to visitors |
| LinkedIn URL | Link to your LinkedIn profile |
| Languages | List of languages and levels (add a row per language) |

Edit the fields you need, then save.

---

## Services (home page “Core services”)

Each **service** is one expandable block on the home page.

- **Title** — Shown as the clickable heading. There is also a **filename** (or slug) used behind the scenes; your technical contact may set naming rules—use **lowercase words separated by hyphens** if you create a new file name.
- **Order** — Number that controls the order of services on the page (lower numbers appear first).
- **Summary** — Short text visible before the block is expanded.
- **Services include** — Bullet list of what the service covers.
- **Selected experience** — Optional second bullet list.
- **Detailed description** — Main rich text when the block is opened (headings, bold text, lists, links, **images**).

### Adding an image inside a service description

Use the image tool in the rich text editor where your cursor should go. Images are stored for you in the right folder; you usually only need to **upload** or **choose** the file and save.

---

## Publications

Each **publication** is one item on the Publications page, grouped by type (articles, reports, and so on).

- **Title** — The line shown **above** the citation (the readable title of the piece).
- **Filename** — Short, web-safe name for the file (often similar to the title, **lowercase and hyphens**). If you are unsure, ask your technical contact before changing it on existing items.
- **Citation** — Full reference text (multi-line is fine).
- **Category** — Picks which section the item appears in on the Publications page.
- **URL** — Optional link; if you add it, the citation becomes a clickable link.
- **Year** — Optional.
- **Language note** — Optional (for example “German”).
- **Sort order** — Number to sort items **within** the same category (lower numbers tend to appear first; your site may use a specific convention).

Save when done.

---

## If something goes wrong

- **Cannot open `/keystatic`** — Check the address, try again after your team confirms the site is running, or ask for the correct URL and login.
- **Save fails** — Note the message, try again, and contact your technical person with what you were editing.
- **Public site does not update** — Hard-refresh the page (or try another browser). If it still fails, the live server or deployment may need attention from your technical contact.

---

## Technical follow-up (optional)

Saved content is stored as **files** in the website project. Someone with access to the code may **commit** those files to version control so backups and history stay in sync. You do not need to do that yourself unless your team has asked you to.

For how the site is wired technically, see [`keystatic-cms.md`](keystatic-cms.md).
