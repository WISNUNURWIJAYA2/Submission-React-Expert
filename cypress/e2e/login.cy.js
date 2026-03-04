// cypress/e2e/login.cy.js
describe('Login Feature', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/'); // Pastikan server app berjalan
  });

  it('should display login page correctly', () => {
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('button[type="submit"]').contains('Masuk').should('be.visible');
  });

  it('should show alert when login fails', () => {
    cy.get('input[placeholder="Email"]').type('salah@gmail.com');
    cy.get('input[placeholder="Password"]').type('salahpassword');
    cy.get('button[type="submit"]').click();
    
    // API Dicoding akan mengembalikan error 400/401 dan memicu window.alert
    cy.on('window:alert', (text) => {
      expect(text).to.contains('email or password is wrong');
    });
  });
});