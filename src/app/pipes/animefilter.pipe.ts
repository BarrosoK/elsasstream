import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'animefilter'
})
export class AnimefilterPipe implements PipeTransform {

  transform(animes: any, term?: any): any {
    if ( term === undefined) { return animes; }
    return animes.filter(function(activity) {
      return activity.name.toLowerCase().includes(term.toLowerCase());
    });
  }

}
