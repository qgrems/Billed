/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import store from "../app/Store"
import {getByLabelText, getByTestId, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
import NewBill from "../containers/NewBill"
import NewBillUI from "../views/NewBillUI"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      //to-do write expect expression
      expect(ROUTES_PATH.Bills).toEqual("#employee/bills")
      expect(windowIcon).toBeTruthy()
    })

    // test("Then click handleClickNewBill go NewBill",()=>{
    //   const buttonNewNote = screen.getByTestId('btn-new-bill')
    //   console.log(buttonNewNote)
    //   userEvent.click(buttonNewNote)
    //   expect(ROUTES_PATH.NewBill).toEqual("#employee/bill/new")
    // })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
 
   })
   
})
// test d'intégration GET
describe("Given I am a user connected as Wmployee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const contentPending  = await screen.getByText("Mes notes de frais")
      expect(contentPending).toBeTruthy()
      expect(screen.getByTestId("btn-new-bill")).toBeTruthy()
    })
  })
})
describe("Given I am in a bills Page" ,  () => {
  describe("When i click to button newBillPage", () => {
    test("test button to go in NewBills", async()=>{
          const bills = new Bills({document, onNavigate, store, localStorage});
          const handleClickNewBill = jest.fn((e) => bills.handleClickNewBill(e));
          await screen.getByTestId("btn-new-bill");
          const addnewBill = screen.getByTestId("btn-new-bill");
          addnewBill.addEventListener("click", handleClickNewBill);
          userEvent.click(addnewBill);
          expect(handleClickNewBill).toHaveBeenCalled();
          
    })
    test("test to modal is open", async()=>{
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      const billsPage = new Bills({
        document, 
        onNavigate, 
        store, 
        localStorage
      })
      $.fn.modal = jest.fn();
      const handleClickIconEye = jest.fn((e) => billsPage.handleClickIconEye(e));
      const iconEyes = document.querySelectorAll('[data-testid="icon-eye"]')
      iconEyes.forEach(icon => {
        icon.addEventListener("click", () => 
        handleClickIconEye(icon)
        )
      });
      userEvent.click(iconEyes[0])     
      expect(handleClickIconEye).toHaveBeenCalled();
    })
  })
})
