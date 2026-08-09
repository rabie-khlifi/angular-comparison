import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // CSR sends only the browser application shell for this route.
    path: 'rendering-strategies/csr',
    renderMode: RenderMode.Client,
  },
  {
    // SSR creates fresh HTML on the server for each initial request.
    path: 'rendering-strategies/ssr',
    renderMode: RenderMode.Server,
  },
  {
    // SSG creates this route's HTML once during ng build.
    path: 'rendering-strategies/ssg',
    renderMode: RenderMode.Prerender,
  },
  {
    // Parameterized prerender routes need a finite list of concrete build-time values.
    path: 'routing-parameters/:learnerId',
    renderMode: RenderMode.Prerender,
    // A real application could obtain these IDs from a CMS or backend during the build.
    async getPrerenderParams() {
      return [{ learnerId: '42' }, { learnerId: '84' }];
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
