import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.class';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

    private static productslist: Product[] = null;
    private products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        if( ! ProductsService.productslist )
        {
            this.http.get<any>('http://localhost:8080/products').subscribe(data => {
                ProductsService.productslist = data;
                
                this.products$.next(ProductsService.productslist);
            });
        }
        else
        {
            this.products$.next(ProductsService.productslist);
        }

        return this.products$;
    }

    create(prod: Product): Observable<Product[]> {

        this.http.post<Product>('http://localhost:8080/products',prod).subscribe(data => {
            ProductsService.productslist.push(prod);
            this.products$.next(ProductsService.productslist);
        });
        return this.products$;

    }

    update(prod: Product): Observable<Product[]>{

        
        this.http.put<Product>('http://localhost:8080/products/'+prod.id,prod).subscribe(data => {
            ProductsService.productslist.forEach(element => {
                if(element.id == prod.id)
                {
                    element.name = prod.name;
                    element.category = prod.category;
                    element.code = prod.code;
                    element.description = prod.description;
                    element.image = prod.image;
                    element.inventoryStatus = prod.inventoryStatus;
                    element.price = prod.price;
                    element.quantity = prod.quantity;
                    element.rating = prod.rating;
                }
            });
            this.products$.next(ProductsService.productslist);
        });

        return this.products$;
    }


    delete(id: number): Observable<Product[]>{
        this.http.delete<number>('http://localhost:8080/products'+"/"+id).subscribe(data => {
            ProductsService.productslist = ProductsService.productslist.filter(value => { return value.id !== id } );
            this.products$.next(ProductsService.productslist);
        });
        return this.products$;
    }
}