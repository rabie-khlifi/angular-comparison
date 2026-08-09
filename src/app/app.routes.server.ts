import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
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
