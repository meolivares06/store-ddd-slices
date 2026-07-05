# products-management Specification

## Purpose

Core product catalog display, creation, and discount application with strict domain validation.

## Requirements

### Requirement: Product Creation Validation

The system MUST enforce standard logical validations when a user creates a new product.

#### Scenario: Valid Product
- GIVEN a user is filling out the product form
- WHEN the Title is at least 3 characters long and the Price is greater than 0
- THEN the form MUST be considered valid and allow submission

#### Scenario: Invalid Product
- GIVEN a user is filling out the product form
- WHEN the Title is empty, has fewer than 3 characters, OR the Price is 0 or negative
- THEN the form MUST show validation errors and block submission

### Requirement: Product Discount Application

The system MUST allow applying a percentage discount to a product entity.

#### Scenario: Applying a Discount
- GIVEN a valid Product Entity with a defined Price
- WHEN the `applyDiscount` method is called with a valid percentage
- THEN the product's internal price MUST be reduced by the percentage amount

### Requirement: Repository Dependency Inversion

The system MUST load products via an abstracted repository interface instead of a direct HTTP client.

#### Scenario: Store Initialization
- GIVEN the `ProductStore` needs to fetch product data
- WHEN it loads products
- THEN it MUST use the injected `PRODUCT_REPOSITORY_TOKEN` to retrieve data

### Requirement: Infrastructure Mapping

The system MUST map external `ApiProduct` DTOs to rich `Product` Entities.

#### Scenario: Mapping External Data
- GIVEN the infrastructure layer receives an `ApiProduct` payload
- WHEN it is processed by the infrastructure mapper
- THEN a valid `Product` Entity initialized with a `Price` Value Object MUST be produced
