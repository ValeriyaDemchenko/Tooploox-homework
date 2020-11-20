//create a function which will add a product to a Cart to re-use it in various Test Scenarios
export const addOneProductToCart = () => {

    // Arrange
    // 1. goto localhost
    cy.visit('http://localhost/index.html')

    // 2. Find all products (having class='product') and Click third product (3rd element <a>) inside of it
    cy.get('.product').eq(2).within(() => {// withing all found products select the 3rd element of a class='product' on a page
        // 3. Select and click 'Add to Cart' button
        cy.get('a').first().click(); // takes only the name of the 3rd element of a class='product' on a page
    })
    cy.wait(500) //without this wait element with the product name is not appearing. 
    //I know this is a bad practice, but I haven't found better solution for now

    cy.get('h1#title').invoke('text').then(productTitle => {  //take the name of the product
        // cy.get('#title').should('not.have.text', '') //in order to substitute 'wait' by googling selected an option to coerce searching of the #title on the screen
        // Action
        cy.contains('Add to cart' /*, { timeout: 10000 }*/).click();
        // Assert
        // 4. Select 'Items in Cart' button: it should have title'1 Item in Cart'. Click.
        cy.get('#numItemsInCart').should('have.text', '1 item(s) in cart').click();
        // 5. Verify that in summary screen there is only 1 chosen item
        cy.get('tr.item').should('have.length', 1);
        // 6. Verify that Name of a product is the name of selected product
        cy.get('tr a').eq(1).should('have.text', productTitle); // the name of the 3rd <a> inside 
        //item row is equal to value stored in productName variable
    })
}