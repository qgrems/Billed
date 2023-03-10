import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage, valid}) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    this.isValid = valid
    console.log(valid)
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }
 
  handleChangeFile = e => {
    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    console.log(file)
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length-1]
    var allowedExtension = ['jpeg', 'jpg', 'png'];
    
    let fileExtension = fileName.split('.').pop().toLowerCase()
    
    for(let i in allowedExtension)
    {
      if(fileExtension === allowedExtension[i])
      {
        this.isValid = true
      }
     
    }
   
      const formData = new FormData()
      console.log(formData)
      const email = JSON.parse(localStorage.getItem("user")).email
      console.log("file:", file, "filePath:", filePath, "fileName:", fileName)
      
        formData.append('file', file)
        formData.append('email', email)
        if(this.isValid === true){
        this.store
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true
          }
        })
        .then(({fileUrl, key}) => {
          console.log(fileUrl)
          this.billId = key
          this.fileUrl = fileUrl
          this.fileName = fileName
        }).catch(error => console.error(error))
      }
      
  }
  handleSubmit = e => {
    e.preventDefault()
    
    if(this.isValid === true)
    {
     // console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
      const email = JSON.parse(localStorage.getItem("user")).email
      const bill = {
        email,
        type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
        name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
        amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
        date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
        vat: e.target.querySelector(`input[data-testid="vat"]`).value,
        pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
        commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
        fileUrl: this.fileUrl,
        fileName: this.fileName,
        status: 'pending'
      }
      this.updateBill(bill)
      this.onNavigate(ROUTES_PATH['Bills'])
    } else
    {
      (alert('only jpg file'))
    }

  }
  // not need to cover this function by tests
  updateBill = (bill) => {
   if(this.isValid === true)
   {
      if (this.store) {
        this.store
        .bills()
        .update({data: JSON.stringify(bill), selector: this.billId})
        .then(() => {
          this.onNavigate(ROUTES_PATH['Bills'])
        })
        .catch(error => console.error(error))
      }
    }
  }
}