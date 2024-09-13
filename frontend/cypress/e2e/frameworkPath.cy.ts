const user1 = {
  email: 'test@gmail.com',
  name: 'test',
  password: '123abcdqwefA'
}

context('path of a user creating, editing and forking a framework', () => {
  before('sign up a new user', () => {
    cy.visit('localhost:3333/');
    cy.get('button')
      .contains('Sign Up')
      .click();
    cy.url().should('include', 'localhost:3333/signup');
    cy.get('input[type=email]')
      .focus()
      .type('123');
    cy.contains('Please enter a valid email address').should('be.visible');
    cy.get('input[type=email]')
      .focus()
      .clear()
      .type(`${Date.now()}@gmail.com`); // Randomises email on every test.
    cy.get('input[type=text]')
      .focus()
      .type(user1.name);
    cy.get('input[name=password]')
      .focus()
      .type(user1.password);
    cy.get('input[name=confirm-password]')
      .focus()
      .type(user1.password);
    cy.get('button').contains('Sign Up')
      .should('be.enabled');
    cy.get('button').contains('Sign Up')
      .click();
  })

  it('views, creates, updates, forks and deletes a framework', () => {
    cy.get('a').contains('FRAMEWORKS')
      .click();
    cy.url().should('include', 'localhost:3333/frameworks');
    cy.get('button').contains('Create New Framework +')
      .click();
    
    // Create new framework.
    cy.url().should('include', 'localhost:3333/frameworks/create');
    cy.get('input[type=text]')
      .focus()
      .type('Framework Test')
    cy.get('button').contains('Save')
      .should('be.disabled');
    cy.get('div').contains('Social')
      .click();
    cy.get('input[type=number]')
      .focus()
      .type('100');
    cy.get('button').contains('Add Metric +')
      .click();
    cy.get('dialog').should('be.visible');
    cy.get('button').contains('Apply')
      .should('be.disabled');
    cy.get('button').contains('WOMENMANAGERS')
      .click();
    cy.get('button').contains('Apply')
      .should('be.enabled');
    cy.get('button').contains('Apply')
      .click();
    cy.get('dialog').should('not.exist');
    cy.get('span').contains('WOMENMANAGERS')
      .should('be.visible');
    cy.get('[aria-label="metric-WOMENMANAGERS"]').find('input[type=number]')
      .type('100');
    cy.get('button').contains('Save')
      .should('be.enabled');
    cy.get('button').contains('Save')
      .click();
    
    // New framework should appear.
    cy.url().should('include', 'localhost:3333/frameworks');
    cy.get('h2').contains('Framework Test')
      .should('be.visible');
    
    // Edit the new framework.
    cy.get('[aria-label="framework-Framework Test"]')
      .find('button[aria-label="Edit Framework"]')
      .click();
    cy.get('input[type=text]')
      .focus()
      .wait(1000)
      .should('have.value', 'Framework Test')
      .trigger('keydown', { key: ' ' })
      .type(' Edited');
    cy.get('button').contains('Save')
      .click();

    // Edited framework should appear.
    cy.url().should('include', 'localhost:3333/frameworks');
    cy.get('h2').contains('Framework Test Edited')
      .should('be.visible');

    // Fork the edited framework.
    cy.get('[aria-label="framework-Framework Test Edited"]')
      .find('button[aria-label="Fork Framework"]')
      .click();
    cy.get('input[type=text]')
      .focus()
      .wait(1000)
      .should('have.value', 'Framework Test Edited')
      .trigger('keydown', { key: ' ' })
      .type(' Forked');
    cy.get('button').contains('Save')
      .click();
    
    // Edited framework should appear.
    cy.url().should('include', 'localhost:3333/frameworks');
    cy.get('h2').contains('Framework Test Edited Forked')
      .should('be.visible');
    
    // Delete Edited and Forked Framework.
    cy.get('[aria-label="framework-Framework Test Edited Forked"]')
      .wait(1000)
      .find('button[aria-label="Delete Framework"]')
      .click();
    cy.get('[aria-label="framework-Framework Test Edited"]')
      .wait(1000)
      .find('button[aria-label="Delete Framework"]')
      .click();

    // Deleted framework should not appear.

    cy.get('h2').contains('Framework Test Edited')
      .should('not.exist');
    cy.get('h2').contains('Framework Test Edited Forked')
      .should('not.exist');
  })
})