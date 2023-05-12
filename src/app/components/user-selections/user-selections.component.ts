import { OnDestroy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListType } from 'src/app/enums/list-type'
import { Game } from 'src/app/interfaces/game'
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as _ from 'lodash';
import { takeUntil, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-user-selections',
  templateUrl: './user-selections.component.html',
  styleUrls: ['./user-selections.component.scss']
})
export class UserSelectionsComponent implements OnInit {
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
}
  unsubscribe = new Subject<void>();

  listType?: ListType;
  listTypeTitle?: string;
  ownedGames?: Game[];
  wishListGames?: Game[];

  constructor(
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
    ) {}

    ngOnInit(): void {
      this.listType = this.route.snapshot.routeConfig?.path === 'owned' ? ListType.OWNEDLIST : ListType.WISHLIST;
      this.listTypeTitle = this.listType === ListType.OWNEDLIST ? 'Owned Games' : 'Wishlist Games';

      if (this.listType === ListType.OWNEDLIST) {
        this.localStorageService.getGameList(ListType.OWNEDLIST);
        this.localStorageService.ownedGames.pipe(
            takeUntil(this.unsubscribe),
            tap(games => {
                console.log('subscription data');
                this.ownedGames = _.mapKeys(games, 'id')
            })
        ).subscribe();
    } else {
        this.localStorageService.getGameList(ListType.WISHLIST);
        this.localStorageService.wishListGames.pipe(
            takeUntil(this.unsubscribe),
            tap(games => this.wishListGames = _.mapKeys(games, 'id'))
        ).subscribe();
    }

      if (this.listType === ListType.OWNEDLIST) {
        this.localStorageService.getGameList(ListType.OWNEDLIST);
        this.localStorageService.ownedGames.pipe(
            tap((games: Game[] | undefined) => {
                console.log('subscription data');
                this.ownedGames = games;
            })
        ).subscribe();
    } else {
        this.localStorageService.getGameList(ListType.WISHLIST);
        this.localStorageService.wishListGames.pipe(
            tap((games: Game[] | undefined) => this.wishListGames = games)
        ).subscribe();
    }
    
    }
}