import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { ReactiveFormsModule, FormBuilder } from "@angular/forms"
import { ActivatedRoute, Router, convertToParamMap } from "@angular/router"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { of } from "rxjs"
import { HttpClient } from "@angular/common/http"

import { ProductFormComponent } from "./product-form.component"
import { ProductService } from "../../services/product.service"
import { AuthService } from "../../services/auth.service"
import type { Product } from "../../models/product"

describe("ProductFormComponent", () => {
  let component: ProductFormComponent
  let fixture: ComponentFixture<ProductFormComponent>
  let productServiceSpy: jasmine.SpyObj<ProductService>
  let authServiceSpy: jasmine.SpyObj<AuthService>
  let routerSpy: jasmine.SpyObj<Router>
  let http: HttpClient

  const mockProduct: Product = {
    id: "123",
    serialNumber: "123",
    name: "Test Product",
    price: 99.99,
    description: "Test description",
    category: "men",
    image_url: "test-image.jpg",
    imageUrl: "test-image.jpg",
    inStock: true,
    colors: ["red", "blue"],
    sizes: ["S", "M", "L"],
  }

  beforeEach(async () => {
    // Create spies for the services
    productServiceSpy = jasmine.createSpyObj("ProductService", [
      "getProductById",
      "addProduct",
      "updateProduct",
      "deleteProduct",
      "getProducts",
    ])
    authServiceSpy = jasmine.createSpyObj("AuthService", ["getRoles"])
    routerSpy = jasmine.createSpyObj("Router", ["navigate"])

    // Configure the spies
    productServiceSpy.getProductById.and.returnValue(of(mockProduct))
    productServiceSpy.addProduct.and.returnValue(of(mockProduct))
    productServiceSpy.updateProduct.and.returnValue(of(mockProduct))
    productServiceSpy.deleteProduct.and.returnValue(of(void 0))
    productServiceSpy.getProducts.and.returnValue(of([]))
    authServiceSpy.getRoles.and.returnValue("1")

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: "123" })),
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductFormComponent)
    component = fixture.componentInstance
    http = TestBed.inject(HttpClient)
    component["http"] = http
  })

  it("should create", () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it("should initialize the form with default values", () => {
    fixture.detectChanges()
    expect(component.productForm.valid).toBeFalsy()
    expect(component.productForm.get("name")?.value).toBe("Test Product")
    expect(component.productForm.get("price")?.value).toBe(99.99)
  })

  it("should redirect if user is not admin", () => {
    authServiceSpy.getRoles.and.returnValue("0")
    fixture.detectChanges()
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/home"])
  })

  it("should load product data when editing", () => {
    fixture.detectChanges()
    expect(productServiceSpy.getProductById).toHaveBeenCalledWith("123")
    expect(component.isEditing).toBeTrue()
    expect(component.productForm.get("name")?.value).toBe("Test Product")
  })

  it("should validate required fields", () => {
    fixture.detectChanges()

    // Clear required fields
    component.productForm.patchValue({
      serialNumber: "",
      name: "",
      price: null,
      description: "",
    })

    expect(component.productForm.valid).toBeFalse()
    expect(component.productForm.get("serialNumber")?.valid).toBeFalse()
    expect(component.productForm.get("name")?.valid).toBeFalse()
    expect(component.productForm.get("price")?.valid).toBeFalse()
    expect(component.productForm.get("description")?.valid).toBeFalse()
  })

  it("should call addProduct when submitting a new product", () => {
    // Set up component for adding a new product
    component.isEditing = false
    fixture.detectChanges()

    // Fill the form with valid data
    component.productForm.patchValue({
      serialNumber: "ABC123",
      name: "New Product",
      price: 129.99,
      description: "New product description",
      category: "men",
      colors: "red, blue",
      sizes: "S, M, L",
    })

    component.onSubmit()

    expect(productServiceSpy.addProduct).toHaveBeenCalled()
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/products"])
  })

  it("should call updateProduct when submitting an existing product", () => {
    // Component is already set up for editing
    fixture.detectChanges()

    // Modify some values
    component.productForm.patchValue({
      name: "Updated Product",
      price: 149.99,
    })

    component.onSubmit()

    expect(productServiceSpy.updateProduct).toHaveBeenCalled()
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/products"])
  })

  it("should call deleteProduct when delete button is clicked", () => {
    component.productId = "123"
    fixture.detectChanges()

    component.deleteProduct()

    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith("123")
    expect(productServiceSpy.getProducts).toHaveBeenCalled()
  })

  it("should handle image upload", () => {
    // Mock the HttpClient post method
    spyOn(component["http"], "post").and.returnValue(of("success"))

    const mockFile = new File([""], "test-image.jpg", { type: "image/jpeg" })
    const mockEvent = { target: { files: [mockFile] } }

    component.uploadImage(mockEvent)

    expect(component["http"].post).toHaveBeenCalled()
  })
})
