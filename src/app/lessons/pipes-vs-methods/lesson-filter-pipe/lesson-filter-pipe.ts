import { Pipe, PipeTransform } from '@angular/core';
import { filterLessons } from '../filter-lessons';

@Pipe({
  // Templates use the camelCase pipe name after the | operator.
  name: 'lessonFilter',
  // Pipes are pure by default, so `pure: true` would be redundant.
  // A pure pipe reruns only when a primitive input value or object reference changes.
})
export class LessonFilterPipe implements PipeTransform {
  transform(lessons: readonly string[], query: string): readonly string[] {
    // Keep transformation logic free of side effects because Angular may cache this result.
    return filterLessons(lessons, query);
  }
}
