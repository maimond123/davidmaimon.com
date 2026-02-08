# David's Terminal

Environment variables for live metrics:

```
# One or more GitHub tokens. You can provide a comma-separated list via GITHUB_TOKENS,
# or separate personal/work tokens via the two variables below. Scopes: `read:user` is enough; 
# for private contribution counts, ensure the token has `read:user` (private contributions are aggregated only).

GITHUB_TOKENS=ghp_xxxPersonal,ghp_xxxWork
# or
GITHUB_PERSONAL_TOKEN=ghp_xxx
GITHUB_WORK_TOKEN=ghp_yyy
```

Notes:
- We aggregate commit contributions over the last 365 days across all tokens provided (personal + work).
- Private contributions are counted via `restrictedContributionsCount` and included in the total.
- If no token is provided, the UI shows 0 for commits.

