describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Copyright © 2025 Mazharul Hossain')
  })
})
