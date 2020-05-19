import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  @Input() viewer: object;
  @Output() event = new EventEmitter<boolean>();
  public href: string;

  constructor() { }

  ngOnInit(): void {
    this.href = this.viewer.pixArray[this.viewer.currentPixIndex];
  }

  public close(): void {
    this.event.emit();
  }

}
