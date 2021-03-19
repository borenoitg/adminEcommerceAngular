import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
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
export class AddOrEditProductModalComponent implements OnInit, OnDestroy {

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

  public get isProductInfosInvalid(): boolean {
    return this.productForm.get('productInfos').invalid;
  }

  public get isIllustrationInvalid(): boolean {
    return this.productForm.get('illustration').invalid;
  }

  ngOnInit(): void {
    this.categorySub = this.categoryService.getCategory().subscribe(
      (response) => {
        this.categories = response.result;
        console.log(this.categories);
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
      category: this.idCategory
    };

    if (this.file) {
      product.image = this.file.name;
    }

    this.finish.emit({product, file: this.file ? this.file : null});
    this.close();
  }

  public detecteFiles($event): void {
    this.file = $event.target.files[0];
  }
}
