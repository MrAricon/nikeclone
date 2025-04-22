describe("Login", () => {
    beforeEach(() => {
        // Visit the login page
        cy.visit("/login")
    })

    it("should display the login form", () => {
        cy.contains("Login")
        cy.get('input[formControlName="email"]').should("exist")
        cy.get('input[formControlName="password"]').should("exist")
        cy.get('button[type="submit"]').should("exist")
    })

    it("should validate required fields", () => {
        // Try to submit without filling the form
        cy.get('button[type="submit"]').should("be.disabled")

        // Fill email only
        cy.get('input[formControlName="email"]').type("test@example.com")
        cy.get('button[type="submit"]').should("be.disabled")

        // Fill password only
        cy.get('input[formControlName="email"]').clear()
        cy.get('input[formControlName="password"]').type("password123")
        cy.get('button[type="submit"]').should("be.disabled")
    })

    it("should validate email format", () => {
        // Type invalid email
        cy.get('input[formControlName="email"]').type("invalid-email")
        cy.get('input[formControlName="password"]').type("password123")
        cy.get('button[type="submit"]').should("be.disabled")

        // Type valid email
        cy.get('input[formControlName="email"]').clear().type("test@example.com")
        cy.get('button[type="submit"]').should("not.be.disabled")
    })

    it("should login successfully", () => {
        // Intercept the login API call
        cy.intercept("POST", "**/api.php?login", {
            statusCode: 200,
            body: {
                token: "mock-jwt-token",
            },
        }).as("loginRequest")

        // Fill the form
        cy.get('input[formControlName="email"]').type("test@example.com")
        cy.get('input[formControlName="password"]').type("password123")

        // Submit the form
        cy.get('button[type="submit"]').click()

        // Wait for the API call
        cy.wait("@loginRequest")

        // Check if token is stored in sessionStorage
        cy.window().its("sessionStorage").invoke("getItem", "sessionToken").should("eq", "mock-jwt-token")

        // Should be redirected to home page
        cy.url().should("include", "/")
    })

    it("should handle login failure", () => {
        // Intercept the login API call with an error
        cy.intercept("POST", "**/api.php?login", {
            statusCode: 401,
            body: {
                error: "Invalid credentials",
            },
        }).as("loginRequest")

        // Fill the form
        cy.get('input[formControlName="email"]').type("wrong@example.com")
        cy.get('input[formControlName="password"]').type("wrongpassword")

        // Submit the form
        cy.get('button[type="submit"]').click()

        // Wait for the API call
        cy.wait("@loginRequest")

        // Should stay on login page
        cy.url().should("include", "/login")

        // No token should be stored
        cy.window().its("sessionStorage").invoke("getItem", "sessionToken").should("be.null")
    })
})