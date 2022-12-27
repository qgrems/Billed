/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { screen, waitFor, getByRole, getByTestId, getByLabelText, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import userEvent from '@testing-library/user-event'
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills"


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
      const newBill = new NewBill({document, onNavigate, store:mockStore, localStorage: window.localStorage})
      const Inputfile= screen.getByTestId("file")
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      Inputfile.addEventListener("change", (e) => handleChangeFile(e))
      userEvent.upload(Inputfile)
      expect(handleChangeFile).toHaveBeenCalled()
      //to-do write assertion
    })
    //test updatebill
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
      const newBill = new NewBill({document, onNavigate, store:mockStore, localStorage: window.localStorage, valid:true})
      const buttonEnvoyer = document.querySelector('[data-testid="form-new-bill"]')
      const envoyer = jest.fn((e) => newBill.handleSubmit(e));
      buttonEnvoyer.addEventListener("click", envoyer)
      userEvent.click(buttonEnvoyer)
      fireEvent.submit(buttonEnvoyer)
      expect(envoyer).toHaveBeenCalled();
      await waitFor(() => screen.getByText("Mes notes de frais"))
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    })
    
  })
})
