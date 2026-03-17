# 🚀 Contributing Guidelines

**Welcome to the team!**  
This document is your **single source of truth** for how we ship high-quality code together.  
We’ve had painful merges, surprise breaks on `main`, and reviews that never happened — so we’re fixing it **once and for all**.

These rules are **non-negotiable**. Following them keeps our velocity high, our codebase clean, and our stress levels low.  
Let’s build something we’re all proud of.

---

## 1. Repository Branches (The Only Allowed Flow)

We use a simplified **Gitflow-style** workflow with **two long-lived branches**:

| Branch | Purpose | Can you push directly? | Protected? |
|--------|---------|-----------------------|------------|
| `main` | Production-ready code (final release) | **Never** | Yes (until project complete) |
| `dev` | Integration & staging branch | Only via approved PR | Yes |

**Rule #1 – Until the project is officially shipped:**  
**Merging anything directly to `main` is strictly prohibited.**  
All work flows through `dev`.

---

## 2. Branch Naming – Do It Right or Don’t Do It

Every new task gets its **own** short-lived branch.

### Correct format

```
features/{team}/{feature-name}
```

### Examples

- `features/mobile/user-authentication`
- `features/web/dashboard-redesign`
- `features/backend/payment-integration`
- `fix/mobile/login-crash`
- `hotfix/backend/critical-security-patch`

### Wrong examples (will be rejected)

- `my-feature`
- `login`
- `main-fix`
- `feature/mobileLogin`

### How to create it

```bash
git checkout dev
git pull origin dev

git checkout -b features/mobile/user-authentication
```

---

## 3. Commit Messages – Semantic & Crystal Clear

We use **Conventional Commits**

### Format

```
<type>(<scope>): <subject>

<body>
```

### Allowed types

- `feat` – new feature
- `fix` – bug fix
- `chore` – maintenance
- `docs` – documentation
- `refactor`
- `test`
- `style`
- `perf`

### Examples

```bash
feat(mobile): add biometric login
fix(backend): prevent race condition in user service
chore(web): update dependencies
```

### Rules

- Subject line ≤ 72 characters
- Use present tense ("add", not "added")
- Include ticket number if available: `feat(mobile): add biometric login (#42)`
- Never use `WIP`, `temp`, or emoji in commits

---

## 4. Pull Request Workflow – This Is Where Most Problems Happen

### Step-by-step (mandatory)

1. Finish your work on your feature branch
2. `git pull origin dev` again (rebase if you prefer clean history)
3. Push your branch
4. **Create a Pull Request to `dev`** (never to `main`)

### Title format

```
feat(mobile): add biometric login
```

### Required actions

- Fill the PR template completely
- Request review from your team leader

Leader mapping:

- Mobile → `@mobile-lead`
- Web → `@web-lead`
- Backend → `@backend-lead`

Add label:

```
team:mobile
team:web
team:backend
```

Add this to the bottom of the PR description:

```
## Branch cleanup
- [x] Delete branch after merge
- [ ] Keep branch (explain why)
```

---

## Required PR Template

```markdown
## What & Why
(One sentence + bullet points)

## Changes
- [ ] Added/Changed/Removed ...

## How to Test
1. Step one
2. Step two

## Screenshots / Videos
(attach for mobile & web)

## Related Issue
Closes #42

## Branch cleanup
- [x] Delete branch after merge
```


---

## 5. Code Review Rules – No More Ghosting

- **Author cannot merge their own PR**.
- **At least 1 approval required** — preferably from your team leader.
- Reviewers should respond within **24 business hours**.
- If requested as reviewer → approve or request changes.
- Use **Request changes** only when something is actually incorrect.

---

## 6. Merging Rules

Only the **team leader** or **repo admin** can merge.

Before merging ensure:

- All checks are green
- At least one approval
- PR title and description are clear

After merge:

- Branch will be deleted automatically if the checkbox was selected.

---

## 7. Daily Workflow Reminder

```bash
# Every morning / before starting work
git checkout dev
git pull origin dev

# When starting new task
git checkout -b features/mobile/awesome-new-thing

# When done
git pull origin dev
git push -u origin HEAD

# Then create a PR and request review
```


## 9. Questions or Problems

1. Check this document first.
2. Ask in `reprctive group` in the telegram group.
3. Tag your team lead if urgent.
