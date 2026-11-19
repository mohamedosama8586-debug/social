import { Component } from '@angular/core';
import { SideleftComponent } from './components/sideleft/sideleft.component';
import { PostsComponent } from './components/posts/posts.component';
import { SiderightComponent } from './components/sideright/sideright.component';

@Component({
  imports: [SideleftComponent, PostsComponent, SiderightComponent],
  selector: 'app-timeline',
  styleUrl: './timeline.component.css',
  templateUrl: './timeline.component.html',
})
export class TimelineComponent {}
