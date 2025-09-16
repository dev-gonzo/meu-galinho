import { Routes } from '@angular/router';

import { LayoutMainComponent } from '../../layouts/layout-main/layout-main.component';

export const GAME_ROUTES: Routes = [
  {
    path: 'game',
    component: LayoutMainComponent,
    children: [
      {
        path: 'play',
        loadComponent: () =>
          import('./pages/play/game-play.page').then(
            (m) => m.GamePlayPage,
          ),
      },
      {
        path: '',
        redirectTo: 'play',
        pathMatch: 'full'
      }
    ],
  },
];