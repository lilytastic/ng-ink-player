import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  RendererFactory2,
} from '@angular/core';
import { loadScript, loadStyle } from '../helpers/url.helpers';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ReaderComponent } from '../reader/reader.component';
import { InkService } from '../services/ink.service';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

export const scriptIDs = {
  TACO_SCRIPT_ID: 'taco-js',
  GOOGLE_MAPS_ID: 'google-maps',
  TACO_STYLE_ID: 'taco-css-v2',
  TACO_STYLE_OLD_ID: 'taco-css',
  TACO_INDEX_STYLE_ID: 'taco-index-css',
  LOTTIE_PLAYER_ID: 'lottie-player-js',
};

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ReaderComponent,
    CommonModule,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
  ],
})
export class AppComponent {

  CDN_ABSOLUTE_URL = 'https://cdn-dev-anaca.azureedge.net/';

  constructor(
    rendererFactory: RendererFactory2,
    public inkService: InkService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const renderer = rendererFactory.createRenderer(null, null);

    loadScript(
      `${this.CDN_ABSOLUTE_URL}/design-system/latest/taco-components/bundled.js`,
      this.document,
      renderer,
      scriptIDs.TACO_SCRIPT_ID
    );

    loadScript(
      `${this.CDN_ABSOLUTE_URL}cdnjs/lottie-player.js`,
      this.document,
      renderer,
      scriptIDs.LOTTIE_PLAYER_ID
    );

    loadStyle(
      `${this.CDN_ABSOLUTE_URL}/design-system/latest/taco-tokens/css/design-tokens-v1.css`,
      this.document,
      renderer,
      scriptIDs.TACO_STYLE_OLD_ID
    );

    loadStyle(
      `${this.CDN_ABSOLUTE_URL}/design-system/latest/taco-tokens/css/design-tokens-v2.css`,
      this.document,
      renderer,
      scriptIDs.TACO_STYLE_ID
    );
  }
}
