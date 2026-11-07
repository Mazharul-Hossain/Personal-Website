/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Architecture and content ownership: docs/README.md */
import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser'

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowser().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch(err => console.error(err));
