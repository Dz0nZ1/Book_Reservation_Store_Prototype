import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CurrentBookCart, CurrentBookCartService } from './current-book-cart.service';
import { User, UserService } from 'src/app/auth/user.service';
import { BookCart, PreviousBookCartService } from '../previous-book-cart/previous-book-cart.service';

@Component({
  selector: 'app-current-book-cart',
  templateUrl: './current-book-cart.component.html',
  styleUrls: ['./current-book-cart.component.css']
})
export class CurrentBookCartComponent {

  displayedColumns = ['id', 'currentCartBooks', 'totalPrice'];
  currentCartSource = new MatTableDataSource<CurrentBookCart>();

  constructor (private currentCartService: CurrentBookCartService,private userService : UserService, private previousCartService: PreviousBookCartService ) {}

  //Ime korisnika
   getFirstName() : string{
    return this.userService.getFirstName();
  }

  ngOnInit() {
    this.currentCartSource.data = this.currentCartService.getCart();
  }

  transferData() {
    // Uzimamo trenutnu korpu
    const currentCart = this.currentCartService.getCart();
    // Uzimamo novo dodatu korpu, nećemo predefinisani koja se već nalazi u korpi
    const currentBooks = currentCart[0].currentCartBooks;
  
    const newCart: BookCart = {
      id: this.previousCartService.cart.length + 1,
      previousCartBooks: currentBooks,
      totalPrice: 0 // Opciono: Možete izračunati ukupnu cenu za novu korpu
    };
  
    // Dodaje ovaj previous u novi cart
    this.previousCartService.cart.push(newCart);
    // Računamo novu ukupnu cenu
    this.previousCartService.calculateTotalPrice();
  
    // Brišemo knjige iz trenutne korpe nakon prenosa podataka
    currentCart[0].currentCartBooks = [];
    this.currentCartService.calculateTotalPrice();
  
    // Obriši korpu na kraju
    this.currentCartService.cart = [];
  }

  deleteBooks() {
    // Uzimamo trenutnu korpu
    const currentCart = this.currentCartService.getCart();
    // Uzimamo novo dodate knjige iz trenutne korpe
    const newBooks = currentCart[0].currentCartBooks;

    // Filteriramo knjige u trenutnoj korpi, izbacujemo one koje nisu nove
    currentCart[0].currentCartBooks = currentCart[0].currentCartBooks.filter(
      (book) => !newBooks.some((newBook) => newBook.id === book.id)
    );

    // Ponovo računamo ukupnu cenu
    currentCart[0].currentCartBooks = [];
    this.currentCartService.calculateTotalPrice();
  }
}
