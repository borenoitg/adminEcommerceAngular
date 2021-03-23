import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Product} from '../../models/product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoriesService} from '../../services/categories.service';
import {Category} from '../../models/category';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-or-edit-product-modal',
  templateUrl: './add-or-edit-product-modal.component.html',
  styleUrls: ['./add-or-edit-product-modal.component.css']
})
export class AddOrEditProductModalComponent implements OnInit, OnChanges, OnDestroy {

  @Input() product: Product;
  @Output() finish = new EventEmitter();
  productForm: FormGroup;
  categories: Category[];
  categorySub: Subscription;
  idCategory = 1;
  file: File;

  constructor(private formBuilder: FormBuilder, private categoryService: CategoriesService) {
    this.productForm = this.formBuilder.group({
      productInfos: this.formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        stock: ['', Validators.required]
      }),
      illustration: this.formBuilder.group({
        image: ['', Validators.required]
      })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
        if (this.product) {
          this.updateForm(this.product);
        }
    }

  public get isProductInfosInvalid(): boolean {
    return this.productForm.get('productInfos').invalid;
  }

  public get isIllustrationInvalid(): boolean {
    if (this.product){
      // En cas d'édition, et si on ne veux pas assigner directement une image, on ne reste pas bloqué
      return false;
    }
    return this.productForm.get('illustration').invalid;
  }

  ngOnInit(): void {
    this.categorySub = this.categoryService.getCategory().subscribe(
      (response) => {
        this.categories = response.result;
      }
    );

  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

  selectCategory(idCategory: number): void {
    this.idCategory = idCategory;
  }

  public close(): void {
    this.productForm.reset();
    this.idCategory = 1;
  }

  public handleCancel(): void {
    this.close();
    this.finish.emit();
  }

  public handleFinish(): void {
    const product = {
      ...this.productForm.get('productInfos').value,
      ...this.productForm.get('illustration').value,
      category: this.idCategory,
      oldImage: null
    };

    if (this.product) {
      product.oldImage = this.product.oldImage;
    }

    if (this.file) {
      product.image = this.file.name;
    }else {
      product.image = this.product.oldImage;
    }

    this.finish.emit({product, file: this.file ? this.file : null});
    this.close();
  }

  public detecteFiles($event): void {
    this.file = $event.target.files[0];
  }

  public updateForm(product: Product): void {
    this.productForm.patchValue({
      productInfos: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      }
    });

    product.oldImage = product.image;
    this.selectCategory(product.Category);
  }
}
