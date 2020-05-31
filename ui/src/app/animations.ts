import { animate, state, style, transition, trigger } from '@angular/animations';

export const SlideUpDown = {
  animationTrigger: trigger('slideUpDown', [
    transition(':enter', [
      style({ top: 0 }),
      animate('0.3s ease-in', style({ top: '*' }))
    ]),
    transition(':leave', [
      animate('0.3s ease-out', style({ top: 0 }))
    ])
  ]),
};

export const SlideRightLeft = {
  animationTrigger: trigger('slideRightLeft', [
    transition(':enter', [
      style({
        transform: 'translate3d(110%, 0, 0)',
        boxShadow: '0 3px 30px rgba(0, 0, 0, 0.3)'
      }),
      animate('400ms ease-in-out')
    ]),
    transition(':leave', [
      animate('400ms ease-in-out', style({
        transform: 'translate3d(110%, 0, 0)',
        boxShadow: '0 3px 30px rgba(0, 0, 0, 0.3)'
      }))
    ])
  ]),
};

export const ShadowInOut = {
  animationTrigger: trigger('shadowInOut', [
    transition(':enter', [
      style({
        opacity: '0'
      }),
      animate('400ms ease-in-out')
    ]),
    transition(':leave', [
      animate('400ms ease-in-out', style({
        opacity: '0',
      }))
    ])
  ]),
};

