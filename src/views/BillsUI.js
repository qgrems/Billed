import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"
import { formatDate, formatStatus } from "../app/format.js"
import Actions from './Actions.js'

const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${formatDate(bill.date)}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
  }

const rows = (data) => {
  return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
}

export default ({ data: bills, loading, error }) => {
  if(bills)
  {
    for (let i in bills)
    {
      bills[i].date= new Date(parseInt(bills[i].date.substr(0,4)),parseInt(bills[i].date.substr(5,2))-1,parseInt(bills[i].date.substr(8,2)))
      console.log(bills[i].date)
    }
    // bills= bills.map(bill=>{
      
    //   bill.date=new Date(parseInt(bill.date.substr(0,4)),parseInt(bill.date.substr(5,2))-1,parseInt(bill.date.substr(8,2)))
     
    //   console.log(parseInt(bill.date.substr(0,4)),parseInt(bill.date.substr(5,2))-1,parseInt(bill.date.substr(8,2)))
      
    //   return bill
    // })
    bills.sort((a,b)=> {
      if(a.date==null)
      {
        return (1)
      }
      if(b.date==null)
      {
        return(-1)
      }
      return(b.date -a.date)
      
    } )
  }
 
  const modal = () => (`
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }
  
  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
          ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
  )
}