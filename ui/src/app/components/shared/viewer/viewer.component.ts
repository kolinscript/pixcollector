import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output, Renderer2,
  SimpleChanges
} from '@angular/core';
import { PhotoService } from '../../../services/photo.service';

export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft'
}

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnChanges, OnDestroy {
  href: string;
  controlsViewed: boolean = false;
  globalMousemoveListenFunc: Function;
  globalMousemoveStopInterval;
  @Input() viewerPix;
  @Input() selfStock;
  @Output() close = new EventEmitter<boolean>();
  @Output() slideTo = new EventEmitter<string>();
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === KEY_CODE.RIGHT_ARROW) {
      this.slide('right');
    }
    if (event.code === KEY_CODE.LEFT_ARROW) {
      this.slide('left');
    }
  }

  constructor(
    private renderer: Renderer2,
    private photoService: PhotoService,
  ) { }

  ngOnInit(): void {
    this.href = this.viewerPix.url;
    this.activateControlView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes ', changes);
    if ('viewerPix' in changes) {
      this.href = this.viewerPix.url;
    }
  }

  ngOnDestroy() {
   this.deactivateControlView();
  }

  public mouseEnter(): void {
    clearInterval(this.globalMousemoveStopInterval);
  }

  public mouseLeave(): void {
    this.globalMousemoveStopInterval = setInterval(() => {
      this.controlsViewed = false;
    }, 4200);
  }

  public slide(direction: 'left' | 'right'): void {
    this.slideTo.emit(direction);
  }

  public closeViewer(): void {
    this.close.emit();
  }

  public likePix(): void {
    const SCRIPT = document.createElement('script');
    SCRIPT.src = `https://api.vk.com/method/likes.add?owner_id=${this.viewerPix.owner_id}&item_id=${this.viewerPix.id}&type=photo&access_token=${this.viewerPix.vkTokenIF}&v=5.120&callback=callbackLike`;
    SCRIPT.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(SCRIPT);
    window.onload = function() {
      function callbackLike(result) {
        console.log('result', result);
      }
    };
    // this.photoService.vkLike(this.viewerPix.owner_id, this.viewerPix.id, this.viewerPix.vkTokenIF).subscribe((res) => {
    //   console.log(res);
    // });
  }

  public stealPix(): void {
    // this.photoService.vkSave(this.viewerPix.owner_id, this.viewerPix.id, this.viewerPix.vkTokenIF).subscribe((res) => {
    //   console.log(res);
    // });
    const SCRIPT = document.createElement('script');
    SCRIPT.src = `https://api.vk.com/method/photos.copy?owner_id=${this.viewerPix.owner_id}&photo_id=${this.viewerPix.id}&access_token=${this.viewerPix.vkTokenIF}&v=5.120&callback=callbackSteal`;
    SCRIPT.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(SCRIPT);
    window.onload = function() {
      function callbackSteal(result) {
        console.log('result', result);
      }
    };
  }

  private activateControlView() {
    this.globalMousemoveStopInterval = setInterval(() => {
      this.controlsViewed = false;
    }, 4200);
    this.globalMousemoveListenFunc = this.renderer.listen('document', 'mousemove', e => {
      this.controlsViewed = true;
    });
  }

  private deactivateControlView() {
    this.globalMousemoveListenFunc();
    clearInterval(this.globalMousemoveStopInterval);
  }

}
