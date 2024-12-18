import { Component, Inject, NO_ERRORS_SCHEMA, RendererFactory2 } from '@angular/core';
import { Story } from 'inkjs';
import * as json from '../assets/story.ink.json';
import { Choice } from 'inkjs/engine/Choice';
import { loadScript, loadStyle } from '../helpers/url.helpers';
import { DOCUMENT } from '@angular/common';
import { animate, group, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';

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
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [ NO_ERRORS_SCHEMA ],
  animations: [
    trigger('background', [
      transition('* => *', [
        style({ background: '*' }),
        animate('0.5s ease-in-out', style({ background: '*' }))
      ])
    ]),
    trigger('choices', [
      transition('* => *', [
        query(':enter', [
          style({ height: 0, opacity: 0 }),
          animate('0.5s 1s ease-in-out', style({ height: '*', opacity: 1 }))  
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition('* => *', [
        query(':enter', [
          style({ height: 0, opacity: 0 }),
          animate('0.5s ease-in-out', style({ height: '*', opacity: 1 }))
        ], { optional: true }),
      ])
    ])
  ]
})
export class AppComponent {
  title = 'ng-ink-player';
  story = new Story(json);

  currentText: string[] = [];
  currentChoices: Choice[] = [];
  currentMode: string = '';
  CDN_ABSOLUTE_URL = 'https://cdn-dev-anaca.azureedge.net/';

  currentBackground = '';
  numColumns = 1;
  delay = 500;

  isPlaying = false;
  isComplete = false;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
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

    this.Continue();
  }

  Continue() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    if (this.story.canContinue) {
      this.isComplete = false;
      const text = this.story.Continue() ?? '';
      if (text.startsWith('>>>')) {
        const command = text.substring(3).trim();
        const tokens = command.split(' ');
        console.log(tokens);
        switch (tokens[0].replaceAll(':', '')) {
          case 'mode':
            this.currentMode = tokens[1];
            console.log(tokens[1]);
            break;
          case 'background':
            this.currentBackground = tokens[1];
        }
        this.isPlaying = false;
        this.Continue();
        return;
      } else {
        this.currentText.push(text);
        setTimeout(() => {
          this.isPlaying = false;
          this.Continue();
        }, this.delay);
      }
    } else {
      setTimeout(() => {
        this.isComplete = true;
      }, this.delay);
    }
    this.currentChoices = this.story.currentChoices;
    this.isPlaying = false;
  }

  SelectChoice(choice: Choice) {
    this.currentText = [];
    this.currentBackground = '';
    this.story.ChooseChoiceIndex(choice.index);
    this.Continue();
  }
}
