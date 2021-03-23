import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../models/product';
import {ProductsService} from '../../services/products.service';
import {FileUploadService} from '../../services/file-upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {event} from '@cds/core/internal';
import {environment} from '../../../environments/environment';

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
  baseUrlImage = `${environment.api_image}`;

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
    this.selectedProduct = undefined;
    this.productModalOpen = true;
  }

  /**
   * Permet de supprimer un produit
   * @param product le produit à supprimer
   */
  onDelete(product: Product): void {

  }


  handleFinish(event): void {

    const product = event && event.product ? event.product : null;
    this.file = event && event.file ? event.file : null;

    if (product) {
      if (this.selectedProduct) {
        // Edit product
        product.idProduct = this.selectedProduct.idProduct;
        this.editProductToServer(product);
      } else {
        // Création d'un produit
        this.addProductToServer(product);
      }
    }

    this.productModalOpen = false;
  }

  private uploadImage(event): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Requête envoyé avec succès');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            if (this.progress === 100) {
              resolve(true);
            }
            break;
          case HttpEventType.Response:
            console.log(event.body);
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
            break;
        }
      }
    );
  }

  private addProductToServer(product: any): void {
    this.productsService.addProduct(product).subscribe(
      (data) => {
        if (data.status === 200) {
          // Update du frontEnd
          if (this.file) {
            this.fileService.uploadImage(this.file).subscribe(
              (evenement: HttpEvent<any>) => {
                this.uploadImage(event).then(
                  () => {
                    product.idProduct = data.args.lastInsertId;
                    product.Category = product.category;
                    this.products.push(product);
                  }
                );
              }
            );
          }
        }
      });
  }

  private editProductToServer(product: any): void {
    this.productsService.editProduct(product).subscribe(
      (data) => {
        if (data.status === 200) {
          if (this.file) {
            this.fileService.uploadImage(this.file).subscribe(
              (httpEvent: HttpEvent<any>) => {
                this.uploadImage(event).then(
                  () => {

                    // Update FrontEnd
                    this.updateProduct(product);
                  }
                );
              }
            );

            this.fileService.deleteImage(product.oldImage).subscribe(
              (dataResponse: Response) => {
                console.log(dataResponse);
              }
            );
          } else {

            // Update FrontEnd
            this.updateProduct(product);
          }

        } else {
          console.log(data.message);
        }
      }
    );
  }

  private updateProduct(product: any): void {

    // Update FrontEnd
    const index = this.products.findIndex(p => p.idProduct === product.idProduct);
    product.Category = product.category;
    this.products = [
      ...this.products.slice(0, index),
      product,
      ...this.products.slice(index + 1)
    ];

  }
}
