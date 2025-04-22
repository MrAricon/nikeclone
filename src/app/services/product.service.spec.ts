import { TestBed } from "@angular/core/testing"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { HttpHeaders } from "@angular/common/http"

import { ProductService } from "./product.service"
import { AuthService } from "./auth.service"
import type { Product } from "../models/product"

describe("ProductService", () => {
  let service: ProductService
  let httpMock: HttpTestingController
  let authServiceSpy: jasmine.SpyObj<AuthService>

  const apiUrl = "http://paucano.ddns.net/nikecloneapi/api.php"
  const mockToken = "mock-jwt-token"

  const mockProduct: Product = {
    id: "123",
    serialNumber: "123",
    name: "Test Product",
    price: 99.99,
    description: "Test description",
    category: "men",
    image_url: "test-image.jpg",
    inStock: true,
    colors: ["red", "blue"],
    sizes: ["S", "M", "L"],
  }

  const mockProducts: Product[] = [mockProduct]

  beforeEach(() => {
    // Create a spy for the AuthService
    authServiceSpy = jasmine.createSpyObj("AuthService", ["getToken"])
    authServiceSpy.getToken.and.returnValue(mockToken)

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService, { provide: AuthService, useValue: authServiceSpy }],
    })

    service = TestBed.inject(ProductService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it("should be created", () => {
    expect(service).toBeTruthy()
  })

  it("should get products", () => {
    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts)
    })

    const req = httpMock.expectOne(`${apiUrl}?products`)
    expect(req.request.method).toBe("GET")
    expect(req.request.headers.get("Authorization")).toBe(`Bearer ${mockToken}`)
    req.flush(mockProducts)
  })

  it("should get product by id", () => {
    // First, we need to set up the products in the BehaviorSubject
    service["_products"].next(mockProducts)

    service.getProductById("123").subscribe((product) => {
      expect(product).toEqual(mockProduct)
    })
  })

  it("should add a product", () => {
    service.addProduct(mockProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct)
    })

    const req = httpMock.expectOne(`${apiUrl}?add_product`)
    expect(req.request.method).toBe("POST")
    expect(req.request.headers.get("Authorization")).toBe(`Bearer ${mockToken}`)
    expect(req.request.body).toEqual(mockProduct)
    req.flush(mockProduct)
  })

  it("should update a product", () => {
    const updatedProduct = { ...mockProduct, name: "Updated Product" }

    service.updateProduct(updatedProduct).subscribe((product) => {
      expect(product).toEqual(updatedProduct)
    })

    const req = httpMock.expectOne(`${apiUrl}?update_product`)
    expect(req.request.method).toBe("PUT")
    expect(req.request.headers.get("Authorization")).toBe(`Bearer ${mockToken}`)
    expect(req.request.body).toEqual(updatedProduct)
    req.flush(updatedProduct)

    // Should also call getProducts to refresh the list
    const getReq = httpMock.expectOne(`${apiUrl}?products`)
    expect(getReq.request.method).toBe("GET")
    getReq.flush(mockProducts)
  })

  it("should delete a product", () => {
    // First, set up the products in the BehaviorSubject
    service["_products"].next(mockProducts)

    service.deleteProduct("123").subscribe(() => {
      // After deletion, the products array should be empty
      service.products$.subscribe((products) => {
        expect(products.length).toBe(0)
      })
    })

    const req = httpMock.expectOne(`${apiUrl}?delete_product=123`)
    expect(req.request.method).toBe("DELETE")
    expect(req.request.headers.get("Authorization")).toBe(`Bearer ${mockToken}`)
    req.flush(null)
  })

  it("should use auth token in headers", () => {
    // This is already tested in the other tests, but we can add a specific test for it
    const headers = (service as any).getHeaders()
    expect(headers instanceof HttpHeaders).toBe(true)
    expect(headers.get("Authorization")).toBe(`Bearer ${mockToken}`)
  })
})
