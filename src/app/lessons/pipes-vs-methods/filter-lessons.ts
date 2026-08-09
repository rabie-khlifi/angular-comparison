// This plain function contains reusable TypeScript logic without depending on Angular.
// The custom pipe and component method both delegate to it, keeping their output identical.
export function filterLessons(lessons: readonly string[], query: string): readonly string[] {
  const normalizedQuery = query.trim().toLowerCase();

  return lessons.filter((lesson) => lesson.toLowerCase().includes(normalizedQuery));
}
