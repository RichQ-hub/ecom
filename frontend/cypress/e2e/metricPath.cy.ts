const user = {
  email: 'test@gmail.com',
  name: 'test',
  password: '123abcdqwefA'
}

context('path of a user selecting a viewing each metric category', () => {
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
      .type(user.name);
    cy.get('input[name=password]')
      .focus()
      .type(user.password);
    cy.get('input[name=confirm-password]')
      .focus()
      .type(user.password);
    cy.get('button').contains('Sign Up')
      .should('be.enabled');
    cy.get('button').contains('Sign Up')
      .click();
  })

  it('navigate to the Mondi PLC company using filters only and views its esg score page', () => {
    cy.url().should('include', 'localhost:3333/companies');
    cy.get('label').contains('United Kingdom')
      .click();
    cy.get('label').contains('Alcoholic Beverages')
      .click();
    cy.url().should('include', 'http://localhost:3333/companies?page=1&country=United+Kingdom&industry=Alcoholic+Beverages');
    cy.get('h3').contains('Mondi PLC')
      .click();
    cy.url().should('include', 'http://localhost:3333/companies/4295898932/environmental');
    cy.get('a').contains('Governance')
      .click();
    cy.get('a').contains('Environmental')
      .click();
    cy.get('button').contains('Expand To See Graphical View')
      .click()

    // Viewing the esg score page.
    cy.get('a').contains('View ESG Scores')
      .click();
    cy.get('input[name=framework-search-bar]')
      .focus()
      .type('IFRS S1');
    cy.get('[aria-label="Search Button"]')
      .click();
    cy.contains('li').should('have.length', 1);
    cy.get('button').contains('Apply')
      .should('be.disabled');
    cy.get('button').contains('IFRS S1')
      .click();
    cy.get('button').contains('Apply')
      .should('be.enabled');
    cy.get('button').contains('Apply')
      .click();
    
      // Changing Framework.
    cy.get('[aria-label="Change Score Framework"]')
      .should('be.visible');
    cy.get('[aria-label="Change Score Framework"]')
      .click();
    cy.get('dialog').should('be.visible');
    cy.get('input[name=framework-search-bar]')
      .focus()
      .type('IFRS S2');
    cy.get('[aria-label="Search Button"]')
      .click();
    cy.get('dialog').find('li').should('have.length', 1);
    cy.get('button').contains('Apply')
      .should('be.disabled');
    cy.get('button').contains('IFRS S2')
      .click();
    cy.get('button').contains('Apply')
      .should('be.enabled');
    cy.get('button').contains('Apply')
      .click();
    cy.get('dialog').should('not.exist');
  })
})