import { Injectable } from "@nestjs/common";
import {
  firstValueFrom,
  toArray,
  from,
  map,
  mergeAll,
  take,
  Observable,
} from "rxjs";
import axios from "axios";

@Injectable()
export class RxjsService {
  private readonly GITHUB_URL = "https://api.github.com/search/repositories?q=";
  private readonly GITLAB_URL = "https://gitlab.com/api/v4/projects?search=";

  private getGithub(text: string, count: number): Observable<any> {
    return from(axios.get(`${this.GITHUB_URL}${text}`))
      .pipe(
        map((res: any) => res.data.items),
        mergeAll(),
        take(count),
      );
  }

  private getGitlab(text: string, count: number): Observable<any> {
    return from(axios.get(`${this.GITLAB_URL}${text}`))
      .pipe(
        map((res: any) => res.data),
        mergeAll(),
        take(count),
      );
  }
  
  async searchRepositories(text: string, hub: string): Promise<any> {
    // Здесь можно добавить логику проверки на какой hub делать запрос
    console.log("text = ", text);
    console.log("hub = ", hub);
    let data$: Observable<any>;
    if (hub === "github") {
      data$ = this.getGithub(text, 10).pipe(toArray());
    } else if (hub === "gitlab") {
      data$ = this.getGitlab(text, 10).pipe(toArray());
    }
    return await firstValueFrom(data$);
  }
}
