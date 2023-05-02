import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Game } from '../interfaces/game';

@Injectable({
  providedIn: 'root',

})
export class GameService {

  constructor(
    private http: HttpClient
  ) { }

  searchByName(searchText: string): Observable<Game[]> {
    const alteredText = searchText.replace(/\s/g, '+');
    return this.http.get<Game[]>(`https://api.boardgameatlas.com/api/search?name=${alteredText}&client_id=G9XY2H3Tjh`).pipe(
       // @ts-ignore
        map(response => response['games'])
    )
  };
  getById(gameId: string): Observable<Game> {
    return this.http.get<Game>(`https://api.boardgameatlas.com/api/search?ids=${gameId}&client_id=G9XY2H3Tjh`).pipe(
        // @ts-ignore
        map(response => response['games'])
    );
}
}

// ******* IMPORTANT NOTE: ********
// line 19 should read:
//                  return this.http.get<Game[]>(`https://api.boardgameatlas.com/api/search?name=${alteredText}&client_${environment.boardgameAPI}`)
// but this dosent work. it does not seem to be inserting the ID correctly. problem fixed for now by directly injecting the id.