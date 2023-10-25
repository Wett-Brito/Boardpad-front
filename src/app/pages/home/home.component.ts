import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  boardnameInput : string = "";
  constructor(
    private boardService: BoardService,
    private router : Router
    ) { }

  ngOnInit(): void {
  }

  createBoard () : void {
    console.log(this.boardnameInput)
    this.boardService.createBoard(this.boardnameInput).pipe(take(1)).subscribe({
      next : response => {
        this.router.navigate([`/${this.boardnameInput}`]);
      }
    })
  }
}
