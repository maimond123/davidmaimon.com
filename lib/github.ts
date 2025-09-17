// Server-only GitHub utilities to aggregate commit counts across accounts
import 'server-only';

type ContributionsCollection = {
  totalCommitContributions: number;
  restrictedContributionsCount: number;
};

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

type TokenGroups = { personal: string[]; work: string[]; other: string[] };

function splitList(val?: string | null): string[] {
  return (val || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function getTokenGroupsFromEnv(): TokenGroups {
  const personal = new Set<string>([
    ...splitList(process.env.GITHUB_PERSONAL_TOKENS),
    ...(process.env.GITHUB_PERSONAL_TOKEN ? [process.env.GITHUB_PERSONAL_TOKEN] : []),
  ]);
  const work = new Set<string>([
    ...splitList(process.env.GITHUB_WORK_TOKENS),
    ...(process.env.GITHUB_WORK_TOKEN ? [process.env.GITHUB_WORK_TOKEN] : []),
  ]);
  const other = new Set<string>(splitList(process.env.GITHUB_TOKENS));

  // Ensure uniqueness across groups. If a token appears in multiple groups, prefer
  // the more specific personal/work groups and remove from others.
  Array.from(personal).forEach((t) => {
    work.delete(t);
    other.delete(t);
  });
  Array.from(work).forEach((t) => {
    other.delete(t);
  });

  return {
    personal: Array.from(personal).filter(Boolean),
    work: Array.from(work).filter(Boolean),
    other: Array.from(other).filter(Boolean),
  };
}

function isoDateNDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

async function fetchCommitContributionsForViewer(token: string, fromISO: string, toISO: string): Promise<ContributionsCollection> {
  const query = `\
    query($from: DateTime!, $to: DateTime!) {\
      viewer {\
        contributionsCollection(from: $from, to: $to) {\
          totalCommitContributions\
          restrictedContributionsCount\
        }\
      }\
    }\
  `;

  const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
      'User-Agent': 'desci-terminal/1.0',
    },
    body: JSON.stringify({ query, variables: { from: fromISO, to: toISO } }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as any;
  if (json.errors) {
    const msg = json.errors.map((e: any) => e.message).join('; ');
    throw new Error(`GitHub GraphQL errors: ${msg}`);
  }

  const c: ContributionsCollection | undefined = json?.data?.viewer?.contributionsCollection;
  if (!c) {
    throw new Error('Malformed GitHub response: missing contributionsCollection');
  }
  return c;
}

export async function getCombinedCommitCountLastYear(days = 365): Promise<number> {
  const groups = getTokenGroupsFromEnv();
  const tokens = Array.from(new Set([...(groups.personal || []), ...(groups.work || []), ...(groups.other || [])]));
  if (tokens.length === 0) {
    // If no tokens, return a placeholder instead of throwing, so UI still renders.
    return 0;
  }
  const to = new Date().toISOString();
  const from = isoDateNDaysAgo(days);

  let total = 0;
  for (const token of tokens) {
    try {
      const c = await fetchCommitContributionsForViewer(token, from, to);
      // Sum known commit contributions; if GitHub returns restricted (private) counts that
      // aren't broken down, include them so we don't undercount.
      total += (c.totalCommitContributions ?? 0) + (c.restrictedContributionsCount ?? 0);
    } catch (err) {
      // Continue other tokens; we don't want one bad token to break the UI.
      console.error('[github] commit count error:', err);
    }
  }
  return total;
}

// Generate yearly ranges from a start year to current date. Each range is [Jan 1, Dec 31] in UTC,
// except the final year which ends at current date.
function generateYearRanges(fromYear: number): Array<{ from: string; to: string }> {
  const now = new Date();
  const endYear = now.getUTCFullYear();
  const ranges: Array<{ from: string; to: string }> = [];
  for (let y = fromYear; y <= endYear; y++) {
    const from = new Date(Date.UTC(y, 0, 1, 0, 0, 0));
    const to = y === endYear ? now : new Date(Date.UTC(y, 11, 31, 23, 59, 59));
    ranges.push({ from: from.toISOString(), to: to.toISOString() });
  }
  return ranges;
}

async function sumCommitsForTokensOverRanges(tokens: string[], ranges: Array<{ from: string; to: string }>): Promise<number> {
  let total = 0;
  for (const token of tokens) {
    for (const r of ranges) {
      try {
        const c = await fetchCommitContributionsForViewer(token, r.from, r.to);
        total += (c.totalCommitContributions ?? 0) + (c.restrictedContributionsCount ?? 0);
      } catch (err) {
        console.error('[github] yearly commit range error:', err);
      }
    }
  }
  return total;
}

export async function getAllTimeCommitCountsByGroup(fromYear = 2008): Promise<{ personal: number; work: number; other: number; total: number }> {
  const { personal, work, other } = getTokenGroupsFromEnv();
  const ranges = generateYearRanges(fromYear);
  const [p, w, o] = await Promise.all([
    sumCommitsForTokensOverRanges(personal, ranges),
    sumCommitsForTokensOverRanges(work, ranges),
    sumCommitsForTokensOverRanges(other, ranges),
  ]);
  return { personal: p, work: w, other: o, total: p + w + o };
}

export async function getAllTimeCombinedCommitCount(fromYear = 2008): Promise<number> {
  const { total } = await getAllTimeCommitCountsByGroup(fromYear);
  return total;
}

