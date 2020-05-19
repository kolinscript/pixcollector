import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  @Input() viewer;
  @Output() close = new EventEmitter<boolean>();
  @Output() slideTo = new EventEmitter<string>();
  public href: string;

  constructor() { }

  ngOnInit(): void {
    this.href = this.viewer.currentPix.url;
  }

  public slideHandler(direction: 'left' | 'right'): void {
    this.slideTo.emit(direction);
  }

  public closeHandler(): void {
    this.close.emit();
  }

}
