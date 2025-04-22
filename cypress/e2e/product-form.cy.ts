describe("Product Form", () => {
  beforeEach(() => {
    // Mock la autenticación como administrador
    // 1. Interceptar la llamada de login
    cy.intercept("POST", "**/api.php?login", {
      statusCode: 200,
      body: {
        token: "mock-admin-token"
      }
    }).as("loginRequest");

    // 2. Visitar la página de login primero
    cy.visit("/login");

    // 3. Rellenar el formulario de login
    cy.get('input[formControlName="email"]').type("admin@paucano.ddns.net");
    cy.get('input[formControlName="password"]').type("Solomeoportales1");
    cy.get('button[type="submit"]').click();

    // 4. Esperar a que se complete la solicitud de login
    cy.wait("@loginRequest");

    // 5. Configurar el sessionStorage para simular un usuario administrador
    cy.window().then((win) => {
      // Guardar el token en sessionStorage
      win.sessionStorage.setItem("sessionToken", "mock-admin-token");
      // Establecer el rol como administrador (1)
      win.sessionStorage.setItem("userRoles", "1");
    });

    // 6. Ahora visitar la página del formulario de productos
    cy.visit("/admin");

    // 7. Verificar que estamos en la página correcta
    cy.url().should("include", "/admin");
  });

  it("should display the product form", () => {
    cy.contains("Serial Number");
    cy.contains("Product Name");
    cy.contains("Price");
    cy.contains("Description");
    cy.contains("Category");
    cy.contains("Image");
    cy.contains("In Stock");
    cy.contains("Colors");
    cy.contains("Sizes");
    cy.contains("Add Product");
  });

  it("should validate required fields", () => {
    // Clear the form fields
    cy.get('input[formControlName="serialNumber"]').clear();
    cy.get('input[formControlName="name"]').clear();
    cy.get('input[formControlName="price"]').clear();
    cy.get('textarea[formControlName="description"]').clear();

    // Try to submit the form
    cy.get('button[type="submit"]').should("be.disabled");
  });

  it("should add a new product", () => {
    // Intercept the API call
    cy.intercept("POST", "**/api.php?add_product", {
      statusCode: 200,
      body: {
        id: "new-id",
        name: "Test Product",
        price: 99.99,
      },
    }).as("addProduct");

    // Fill out the form
    cy.get('input[formControlName="serialNumber"]').type("TEST123");
    cy.get('input[formControlName="name"]').type("Test Product");
    cy.get('input[formControlName="price"]').type("99.99");
    cy.get('textarea[formControlName="description"]').type("This is a test product");
    cy.get('select[formControlName="category"]').select("men");
    cy.get('input[formControlName="colors"]').type("red, blue");
    cy.get('input[formControlName="sizes"]').type("S, M, L");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the API call
    cy.wait("@addProduct");

    // Should be redirected to products page
    cy.url().should("include", "/products");
  });

  it("should edit an existing product", () => {
    // Intercept the API calls
    cy.intercept("GET", "**/api.php?products", {
      statusCode: 200,
      body: [
        {
          id: "test-id",
          serialNumber: "TEST123",
          name: "Test Product",
          price: 99.99,
          description: "Test description",
          category: "men",
          image_url: "test-image.jpg",
          inStock: true,
          colors: ["red", "blue"],
          sizes: ["S", "M", "L"],
        },
      ],
    }).as("getProducts");

    cy.intercept("PUT", "**/api.php?update_product", {
      statusCode: 200,
      body: {
        id: "test-id",
        name: "Updated Product",
        price: 129.99,
      },
    }).as("updateProduct");

    // Visit the edit page
    cy.visit("/admin/test-id");

    // Update the form
    cy.get('input[formControlName="name"]').clear().type("Updated Product");
    cy.get('input[formControlName="price"]').clear().type("129.99");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the API call
    cy.wait("@updateProduct");

    // Should be redirected to products page
    cy.url().should("include", "/products");
  });

  it("should delete a product", () => {
    // Intercept the API calls
    cy.intercept("GET", "**/api.php?products", {
      statusCode: 200,
      body: [
        {
          id: "test-id",
          serialNumber: "TEST123",
          name: "Test Product",
          price: 99.99,
          description: "Test description",
          category: "men",
          image_url: "test-image.jpg",
          inStock: true,
          colors: ["red", "blue"],
          sizes: ["S", "M", "L"],
        },
      ],
    }).as("getProducts");

    cy.intercept("DELETE", "**/api.php?delete_product=test-id", {
      statusCode: 200,
    }).as("deleteProduct");

    // Visit the edit page
    cy.visit("/admin/test-id");

    // Click the delete button
    cy.contains("Delete Product").click();

    // Wait for the API call
    cy.wait("@deleteProduct");

    // Should be redirected to products page
    cy.url().should("include", "/products");
  });
});