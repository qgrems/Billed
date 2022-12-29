/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { screen, waitFor, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";

import userEvent from '@testing-library/user-event'
import { ROUTES ,ROUTES_PATH} from "../constants/routes.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

//NewBillUI
describe("Given I am connected as an employee", () => {
  describe("When I click on nouvelle note de frais", () => {
    test("Then i am on NewBill page", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      //to-do write expect expression
      expect(ROUTES_PATH.NewBill).toEqual("#employee/bill/new")
    })
  })
})
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then, it should render NewBill page", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect( screen.getByTestId('form-new-bill')).toBeTruthy()
      //to-do write assertion
    })
  })
})
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then, extension (jpg,jpeg...)work", async () => {
      const html = NewBillUI()
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      
      const newBill = new NewBill({document, onNavigate, mockStore, localStorage: window.localStorage})
      const Inputfile= screen.getByTestId("file")
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      Inputfile.addEventListener("change", (e) => handleChangeFile(e))
      userEvent.upload(Inputfile)
      expect(handleChangeFile).toHaveBeenCalled()
      //to-do write assertion
    })
    //test updatebill POST
    test("Then, click on envoyer", async ()=>
    {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      $.fn.modal = jest.fn();
      window.alert = jest.fn();
      const newBill = new NewBill({document, onNavigate, mockStore, localStorage: window.localStorage, valid:true})
      const file = new File([],'justificatif.png', {type:'image/png'}) 
      const inputFile = document.querySelector('[data-testid="file"]');

      const buttonEnvoyer = document.querySelector('[data-testid="form-new-bill"]')
      const fakeEvt = {preventDefault: jest.fn(), target:document.querySelector('[data-testid="form-new-bill"]')}
      //const envoyer = jest.fn(() => newBill.handleSubmit(fakeEvt));
      //buttonEnvoyer.addEventListener("click", envoyer)
      document.querySelector('[data-testid="expense-type"]').value = "IT et électronique"
      document.querySelector('[data-testid="expense-name"]').value = "Vol Paris Londres"
      document.querySelector('[data-testid="datepicker"]').value = "2022-09-30"
      document.querySelector('[data-testid="amount"]').value = "4"
      document.querySelector('[data-testid="vat"]').value = "70"
      document.querySelector('[data-testid="pct"]').value = "70"
      document.querySelector('[data-testid="commentary"]').value = "No comment"
      document.querySelector('[data-testid="file"]').files[0] = file
      
      await fireEvent.submit(buttonEnvoyer)
      expect(window.alert).toHaveBeenCalled();
      await waitFor(() => screen.getByText("Mes notes de frais"))
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    })
    test("Then, click on envoyer with valid = false", async ()=>
    {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      $.fn.modal = jest.fn();
      window.alert = jest.fn();
      const newBill = new NewBill({document, onNavigate, mockStore, localStorage: window.localStorage, valid:false})
      const inputFile = document.querySelector('[data-testid="file"]');
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const buttonEnvoyer = document.querySelector('[data-testid="form-new-bill"]')
      const fakeEvt = {preventDefault: jest.fn(), target:document.querySelector('[data-testid="form-new-bill"]')}
      //const envoyer = jest.fn(() => newBill.handleSubmit(fakeEvt));
      //buttonEnvoyer.addEventListener("click", envoyer)
      document.querySelector('[data-testid="expense-type"]').value = "IT et électronique"
      document.querySelector('[data-testid="expense-name"]').value = "Vol Paris Londres"
      document.querySelector('[data-testid="datepicker"]').value = "2022-09-30"
      document.querySelector('[data-testid="amount"]').value = "4"
      document.querySelector('[data-testid="vat"]').value = "70"
      document.querySelector('[data-testid="pct"]').value = "70"
      document.querySelector('[data-testid="commentary"]').value = "No comment"
      
      await fireEvent.submit(buttonEnvoyer)
      expect(window.alert).toHaveBeenCalled();
      await waitFor(() => screen.getByText("Envoyer une note de frais"))
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    })
  })
})

