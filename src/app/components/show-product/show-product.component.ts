import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../models/product';
import {ProductsService} from '../../services/products.service';
import {FileUploadService} from '../../services/file-upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {

  @Input() products: Product[];
  productModalOpen = false;
  selectedProduct: Product;
  file: File;
  progress = 0;

  constructor(private productsService: ProductsService, private fileService: FileUploadService) {
  }

  ngOnInit(): void {
  }

  /**
   * Permet d'éditer un produit
   * @param product le produit à éditer
   */
  onEdit(product: Product): void {
    this.productModalOpen = true;
    this.selectedProduct = product;
  }

  /**
   * Permet de créer un nouveau produit
   */
  addProduct(): void {
    this.productModalOpen = true;
  }

  /**
   * Permet de supprimer un produit
   * @param product le produit à supprimer
   */
  onDelete(product: Product): void {

  }


  handleFinish(event): void {

    const product = event.product ? event.product : null;
    this.file = event.file ? event.file : null;

    if (product) {
      console.log(product);
      if (this.selectedProduct) {
        // Edit product
      } else {
        this.productsService.addProduct(product).subscribe(
          (data) => {
            if (data.status === 200) {
              // Update du frontEnd
              if (this.file) {
                this.fileService.uploadImage(this.file).subscribe(
                  (evenement: HttpEvent<any>) => {
                    switch (evenement.type) {
                      case HttpEventType.Sent:
                        console.log('Requête envoyé avec succès');
                        break;
                      case HttpEventType.UploadProgress:
                        this.progress = Math.round(evenement.loaded / evenement.total * 100);
                        break;
                      case HttpEventType.Response:
                        console.log(evenement.body);
                        setTimeout(() => {
                          this.progress = 0;
                        }, 1500);
                        break;
                    }
                  }
                );
              }

              product.idProduct = data.args.lastInsertId;
              this.products.push(product);
            }
          }
        );
      }
    }


    this.productModalOpen = false;
  }
}
