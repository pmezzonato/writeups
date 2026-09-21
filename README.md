# writeups

Public portfolio: retired HTB/THM machines, personal security projects, and technical write-ups.

- `boxes/` — retired-machine writeups only (never active machines — HTB rule)
- `projects/` — original tooling and projects (e.g. the Secure Capstone)
- `blog/` — longer technical posts

## Site

This repository is also published as a static site at
<https://pmezzonato.github.io/writeups/>.

The markdown in `boxes/`, `blog/` and `projects/` is the content source and is
read in place — it stays readable here on GitHub.

```bash
npm install
npm run dev      # local preview
npm run build    # production build into dist/
npm test         # build assertions
```

Frontmatter is validated at build time. Box writeups must be marked
`status: retired`; anything else fails the build.

See **[docs/writing-writeups.md](docs/writing-writeups.md)** for the full guide
to writing and publishing a writeup.
