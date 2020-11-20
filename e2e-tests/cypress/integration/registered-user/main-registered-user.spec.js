import { addOneProductToCart } from '../add-product-to-cart'

//User Stories covered by the Test Scenario 2
//User Story 1: As a Registered User I want to add a product to a Cart so I can see it in my Cart
//User Story 2: As a Registered User I want to add my Credit Card details so that I can pay by this
//              card for selected products
//User Story 3: As a Registered User I want to add my Shipping Address so that my order can be delivered to me.
//User Story 4: As a Registered User I want to have possibility to Proceed with checkout
//              in the Cart so that I can purchase selected product
//User Story 5: As a Registered User I want to check all my orders so that I can track their details 

//Test Scenario 2: Checkout Flow for a Registered User
describe('Checkout Flow for a Registered User', () => {
    //create a Username which will be used in Registered User creation
    const registeredUser = () => {
        const user = 'Fox';
        return user + Math.floor(Date.now() / 100); //used as a solution 
        //to generate unique name for a user for each test run
    }
    const username = registeredUser(); //stored the username in order to have possibility to 
    //login with the same user before each Test Case 

    before(() => { //Before whole Test Scenario create a Registered User
        // Arrange
        // 1. Goto localhost
        cy.visit('http://localhost/index.html')
        // 2. Log in as a Registered User
        cy.contains('Register').click();
        //'Register' modal appears on the screen. But looks like animation of the pop up is so slow,
        // that the word cannot be found.
        cy.wait(500) // Without this comand the test is flaky: from time to time it either not populates the first 
        //field at all or populates only the first letter and goes further.  
        //'wait' is not a good practice to use. In real world app I would check with developers
        // what can be the reason of the slowness.
        cy.contains('div', 'Username').find('input').type(username);
        cy.contains('div', 'First name').find('input').type('Fox');
        cy.contains('div', 'Last name').find('input').type('Wild');
        cy.contains('div', 'Email').find('input').type('nature@gmail.com');//logically this is a bug. 
        //Its possible to create various user names for the same e-mail
        cy.contains('div', 'Password').find('input').type('forest');
        cy.get('#register-modal .btn-primary').click();
        //Assert
        cy.contains('Registration and login successful'); // default assert
        cy.contains('#howdy', 'Fox'); // default assert
    })

    beforeEach(() => { //before each Test Case login as the same above Registered User
        cy.contains('Login').click();
        cy.wait(500)
        cy.get('#username-modal').type(username);
        cy.get('#password-modal').type('forest');
        cy.contains('Log in').click();
        cy.contains('#howdy', 'Fox'); // default assert
        cy.wait(2000)
    })

    //Test Case Name: Add a product to Cart for a Registered user'
    it('Adds a product to a Cart for a registered user', addOneProductToCart);

    // Test Case Name: Check Order Summary
    it('Checks Order Summary', () => {
        cy.visit('http://localhost/basket.html')
        // 1. Check Order Summary block is on the screen
        cy.contains('Order summary');
        // 2. Check 'Shipping and handling' equals to $4.99
        cy.get('th#orderShipping').should('have.text', '$4.99'); //basing on requirements assert that the value is constant
        // 3. Check 'Tax' equals to zero
        cy.get('th#orderTax').should('have.text', '$0.00'); //basing on requirements assert that the value is constant
        // 4. Check 'Order subtotal' equals 'Total' price for 'Shopping Cart'
        cy.get('th#orderSubtotal').invoke('text').then(orderSubtotal => {
            cy.get('th#cartTotal').should('have.text', orderSubtotal);
        })
    })

    // Test Case Name: Add a Payment Card for a Registered User
    it('Adds a Payment Card for a Registered User', () => {
        cy.visit('http://localhost/basket.html')
        // 1. After Adding one product to cart find Payment block
        // 2. Verify it contains on the screen 'No credit card saved for user'
        cy.contains('No credit card saved for user.');
        // 3. Find and Click 'Change' button
        cy.get('[data-target="#card-modal"]').click(); //get an element by its attribute
        // 4. Verify pop-up 'Credit Card' appeared
        cy.contains('Credit Card'); //default assert
        //     N.B. All the below fields values should be tested in a separate Test Scenario 'Credit Card'
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
        // 9. Verify Credit Card is added and on the screen displayed its last four numbers
        cy.contains('4444'); //default assert
    })

    // Test Case Name: Add a Shipping Address for a Registered User
    it('Adds a Shipping Address for a Registered User', () => {
        cy.visit('http://localhost/basket.html')
        // 1. After Adding one product to cart find 'Shipping Address'
        // 2. Verify it contains 'No address saved for user.'
        cy.contains('No address saved for user.');
        // 3. Click 'Change'
        cy.get('[data-target="#address-modal"]').click(); //get an element by its attribute
        // 4. Verify pop-up screen 'House Number' appeared
        cy.contains('House Number'); //default assert
        // N.B. All the below fields values should be tested in a separate Test Scenario 'Credit Card'
        // where all possible positive/negative cases of the input should be checked according to requirement.
        cy.wait(500);
        // 5. Input valid 'House Number'
        cy.contains('div', 'House Number').find('input').type('98');
        // 6. Input valid 'Street Name'
        cy.contains('div', 'Street Name').find('input').type('5thAvenue');
        // 7. Input valid 'City'
        cy.contains('div', 'City').find('input').type('NY');
        // 8. Input valid 'Post Code'
        cy.contains('div', 'Post Code').find('input').type('01-001');
        // 9. Input valid 'Country'
        cy.contains('div', 'Country').find('input').type('USA');
        // 9. Click 'Update'
        cy.get('#form-address .btn-primary').click();
        //Assert
        // 10. Verify that input shipping details appeared at the screen in Shipping Address block
        cy.contains('5thAvenue');
    })

    // Test Case Name: Registered User can proceed to checkout to purchase products from the Cart
    it('Proceeds to checkout to purchase products from the Cart', () => {
        cy.visit('http://localhost/basket.html')
        // 1. After Adding one product to a Cart find and Click 'Proceed to checkout'
        cy.contains('Proceed to checkout').click();
        // Assert 
        // 2.Verify 'My orders' screen appears having url chaged
        cy.url().should('include', '/customer-orders')
        // 3. Verify that Status = Shipped
        cy.contains('.label-success', 'Shipped');
        // 10. Verify that Cart is empty after a purchase: Cart button has a value '0 items in cart'.
        cy.get('#numItemsInCart').should('have.text', '0 items in cart');
    })
    // })

    // Test Case name: Check Orders in Account of a Registered User
    it('Checks Orders in Account of a Registered User', () => {
        //From the customer-order screen save the number of the Order
        cy.get('#tableOrders th').invoke('text').then(orderId => {
            // 1. After a purchase in the Order row  click 'View' button
            cy.get('#tableOrders a').click()
            // //Assert
            // 3. Verify that Order name contains appropriate name 
            cy.get('span#orderNumber').should('have.text', orderId.split(" ").pop());
        })
    })
})