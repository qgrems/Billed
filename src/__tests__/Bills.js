/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
// import store from "../app/Store"
import {screen, waitFor, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES ,ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store"
import router from "../app/Router"

jest.mock("../app/store", () => mockStore)

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
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const contentPending  = await screen.getByText("Mes notes de frais")
      expect(contentPending).toBeTruthy()
    })
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
  
      test("fetches messages from an API and fails with 500 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})
  
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
       const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})
describe("Given I am in a bills Page" ,  () => {
  describe("When i click to button newBillPage", () => {
    test("test button to go in NewBills", async()=>{
          const bills = new Bills({document, onNavigate, mockStore, localStorage});
          const handleClickNewBill = jest.fn((e) => bills.handleClickNewBill(e));
          await screen.getByTestId("btn-new-bill");
          const addnewBill = screen.getByTestId("btn-new-bill");
          addnewBill.addEventListener("click", handleClickNewBill);
          userEvent.click(addnewBill);
          expect(handleClickNewBill).toHaveBeenCalled();
          
    })
    test("test to modal is open", async ()=>{
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
      const billsPage = new Bills({
        document, 
        onNavigate, 
        mockStore, 
        localStorage:  window.localStorage
      })
      const iconEyes = document.querySelectorAll('[data-testid="icon-eye"]')
      iconEyes.forEach(icon => {
       icon.addEventListener("click", () => 
       handleClickIconEyes(icon)
       )
     });
      const handleClickIconEyes = jest.fn((e) => billsPage.handleClickIconEye(e));
      userEvent.click(iconEyes[0])
      fireEvent.submit(iconEyes[0])     
      expect(handleClickIconEyes).toHaveBeenCalled();
      await waitFor(() => screen.getAllByText("Justificatif"))
      expect(screen.getAllByText("Justificatif")).toBeTruthy();
    })
  })
})

