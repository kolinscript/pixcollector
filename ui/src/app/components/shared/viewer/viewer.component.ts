import {
  Component,
  EventEmitter,
  HostListener, Inject,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output, Renderer2,
  SimpleChanges
} from '@angular/core';
import { PhotoService } from '../../../services/photo.service';
import { DOCUMENT } from '@angular/common';

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
  message: boolean = false;
  messageText: String = '';
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
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {
    this.href = this.viewerPix.url;
    this.activateControlView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('viewerPix' in changes) {
      this.href = this.viewerPix.url;
      this.message = false;
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
    this.message = false;
    this.messageText = '';
    this.photoService.vkLike(this.viewerPix.owner_id, this.viewerPix.id).subscribe((res) => {
      if (res.body.data.error && res.body.data.error.error_msg) {
        this.message = true;
        this.messageText = res.body.data.error.error_msg;
      }
      if (res.body.data.likes) {
        this.message = true;
        this.messageText = 'Success!';
      }
    });
  }

  public stealPix(): void {
    this.message = false;
    this.messageText = '';
    this.photoService.vkSteal(this.viewerPix.owner_id, this.viewerPix.id).subscribe((res) => {
      if (res.body.data.error && res.body.data.error.error_msg) {
        this.message = true;
        this.messageText = res.body.data.error.error_msg;
      }
      if (res.body.data.response) {
        this.message = true;
        this.messageText = 'Success!';
      }
    });
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
