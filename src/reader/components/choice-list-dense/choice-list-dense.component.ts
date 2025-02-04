import { animate, group, style, transition, trigger } from '@angular/animations';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChoiceListComponent } from '../choice-list/choice-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choice-list-dense',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './choice-list-dense.component.html',
  styleUrl: './choice-list-dense.component.scss',
  animations: [
    trigger('list', [
      transition('0 => *', [
        group([
          group([
            style({ height: 0 }),
            animate('0.5s ease-in-out', style({ height: '*' }))
          ]),
          group([
            style({ opacity: 0 }),
            animate('1s 0.5s ease-in-out', style({ opacity: 1  }))
          ]),
        ])
      ])
    ]),
  ]
})
export class ChoiceListDenseComponent extends ChoiceListComponent {

}
