import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  title = "족보와 기출문제로 한방에~! 합격문입니다.";

  constructor(
  ) { }

  ngOnInit() {
  }
}
