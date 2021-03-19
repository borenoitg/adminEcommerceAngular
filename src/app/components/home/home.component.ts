import { Component, OnInit } from '@angular/core';
import {ProductsService} from '../../services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products;
  productSub;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.productSub = this.productsService.getProducts().subscribe(
      (response) => {
        this.products = response.result;
      },
      (error) => {
        console.log(error);
      }
    );
  }


}
