import { Routes } from '@angular/router';

import { GAME_ROUTES } from './features/game/game.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/game/play',
    pathMatch: 'full'
  },
  ...GAME_ROUTES,
  {
    path: '**',
    redirectTo: '/game/play'
  }
];