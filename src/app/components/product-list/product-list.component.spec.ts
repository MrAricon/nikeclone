import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { RouterTestingModule } from "@angular/router/testing"
import { of } from "rxjs"

import { ProductListComponent } from "./product-list.component"
import { ProductService } from "../../services/product.service"
import { AuthService } from "../../services/auth.service"
import type { Product } from "../../models/product"

describe("ProductListComponent", () => {
  let component: ProductListComponent
  let fixture: ComponentFixture<ProductListComponent>
  let productServiceSpy: jasmine.SpyObj<ProductService>
  let authServiceSpy: jasmine.SpyObj<AuthService>

  const mockProducts: Product[] = [
    {
      id: "1",
      serialNumber: "001",
      name: "Nike Air Max",
      price: 129.99,
      description: "Comfortable running shoes",
      category: "men",
      image_url: "air-max.jpg",
      inStock: true,
      colors: ["black", "white"],
      sizes: ["9", "10", "11"],
    },
    {
      id: "2",
      serialNumber: "002",
      name: "Nike React",
      price: 149.99,
      description: "Responsive cushioning",
      category: "women",
      image_url: "react.jpg",
      inStock: true,
      colors: ["pink", "blue"],
      sizes: ["7", "8", "9"],
    },
  ]

  beforeEach(async () => {
    // Create spies for the services
    productServiceSpy = jasmine.createSpyObj("ProductService", ["getProducts"], {
      products$: of(mockProducts),
    })
    authServiceSpy = jasmine.createSpyObj("AuthService", ["getAuthState", "getRoles"])

    // Configure the spies
    productServiceSpy.getProducts.and.returnValue(of(mockProducts))
    authServiceSpy.getAuthState.and.returnValue(of(true))
    authServiceSpy.getRoles.and.returnValue("1")

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductListComponent)
    component = fixture.componentInstance
  })

  it("should create", () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it("should load products on init", () => {
    fixture.detectChanges()

    // Check if getProducts was called
    expect(productServiceSpy.getProducts).toHaveBeenCalled()

    // Check if products$ is assigned correctly
    component.products$.subscribe((products) => {
      expect(products).toEqual(mockProducts)
      expect(products.length).toBe(2)
    })
  })

  it("should set isAdmin to true when user has admin role", () => {
    authServiceSpy.getRoles.and.returnValue("1")
    fixture.detectChanges()

    expect(component.isAdmin).toBeTrue()
  })

  it("should set isAdmin to false when user does not have admin role", () => {
    authServiceSpy.getRoles.and.returnValue("0")
    fixture.detectChanges()

    expect(component.isAdmin).toBeFalse()
  })

  it("should set isAuthenticated based on auth state", () => {
    // Test authenticated state
    authServiceSpy.getAuthState.and.returnValue(of(true))
    fixture.detectChanges()
    expect(component.isAuthenticated).toBeTrue()

    // Test unauthenticated state
    authServiceSpy.getAuthState.and.returnValue(of(false))
    component.ngOnInit()
    expect(component.isAuthenticated).toBeFalse()
  })
})
