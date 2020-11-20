import { addOneProductToCart } from '../add-product-to-cart'

//Test Scenario 1: Checkout Flow for a Non-registered User
describe('Checkout Flow for a Non-registered User', () => {

    //Test Case Name: Add a product to Cart for non-registered user'
    it('Adds a product to a Cart ', addOneProductToCart);

    // Test Case Name: Test possibility to proceed with Checkout for non-registered user
    it('Proceeds with Checkout for non-registered user', () => {
        // 1. After Adding one product to a Cart Click button 'Proceed to checkout'
        cy.contains('Proceed to checkout').click();
        //Assert
        // 2. Check that error message appears 'Could not place order. Missing shipping or payment information.'  
        cy.contains('Could not place order. Missing shipping or payment information.'); //Default assert
    })

    // Test Case Name: Add a Credit Card for a Non-registered user
    it('Adds a Credit Card for non-registered user', () => {
        // 1. After Adding one product to cart find Payment block
        // 2. Verify it contains on the screen 'No credit card saved for user'
        cy.contains('No credit card saved for user.'); //default assert
        // 3. Find and Click 'Change' button
        cy.get('[data-target="#card-modal"]').click(); //get an element by its attribute
        // 4. Verify pop-up 'Credit Card' appeared
        cy.contains('Credit Card'); //default assert
        //     N.B. All the screen fields values should be tested in a separate Test Scenario 'Credit Card'
        //     where all possible positive/negative cases of the input should be checked according to requirement.
        // 5. Input valid 'Card Number'
        cy.wait(500) //without this wait element with the product name is not appearing
        cy.contains('div', 'Card Number').find('input').type('1111222233334444');
        // 6. Input valid 'Expires'
        cy.contains('div', 'Expires').find('input').type('11/23');
        // 7. Input valid 'CCV'
        cy.contains('div', 'CCV').find('input').type('205');
        // 8. Click 'Update'
        cy.get('#card-modal .text-right .btn-primary').click();
        // 9. Logic says (however requirements would be nice to have) 
        //that if non-registered user cannot add a Credit Card data, some 
        // informative Warning should appear. But there is none. So for the task I will accept the behaviour 
        //as what is happening is expected. 
        // Thus, as Assert check that message 'No credit card saved for user.' is still on the screen.
        cy.contains('No credit card saved for user.');

        // There is no sense to continue with testing the Test Scenario and add Shipping Details test for non-Registered user. 
        // Even if it works, purchase will not happen anyway without Payment details
    })
})

