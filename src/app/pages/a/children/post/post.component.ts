import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class APostComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: value => {
        console.log(value.keys);
      },
    });
  }

}
