export const ROUTES = {
  overview: '/',
  defects: '/defects',
  newDefect: '/defects/new',
  evidence: '/evidence',
  team: '/team',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

// Rendered with CSS `capitalize` in the top header.
const HEADER_TITLES: Record<AppRoute, string> = {
  [ROUTES.overview]: 'overview',
  [ROUTES.defects]: 'defects',
  [ROUTES.newDefect]: 'New Defect Workflow',
  [ROUTES.evidence]: 'evidence',
  [ROUTES.team]: 'team',
};

function isAppRoute(pathname: string): pathname is AppRoute {
  return pathname in HEADER_TITLES;
}

export function getHeaderTitle(pathname: string): string {
  return isAppRoute(pathname) ? HEADER_TITLES[pathname] : HEADER_TITLES[ROUTES.overview];
}
