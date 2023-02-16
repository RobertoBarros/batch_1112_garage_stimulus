import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["carsList", "form"]

  connect() {
    console.log("hello from garage controller!")
    this.url = `https://wagon-garage-api.herokuapp.com/lecarrao/cars`

    this.listCars('beforeend')

  }

  listCars(position) {
    fetch(this.url)
    .then(response => response.json())
    .then((data) => {
      this.carsListTarget.innerHTML = ''
      data.forEach((car) => {
        const template = this.carTemplate(car)
        this.carsListTarget.insertAdjacentHTML(position, template)
      })
    })
  }

  carTemplate(car) {
    return `
    <div class="car">
      <div class="car-image">
        <img src="http://loremflickr.com/280/280/${car.brand} ${car.model}" />
      </div>
      <div class="car-info">
        <h4>${car.brand} ${car.model}</h4>
        <p><strong>Owner:</strong> ${car.owner}</p>
        <p><strong>Plate:</strong> ${car.plate}</p>
        <button class='btn btn-danger' data-action='click->garage#destroy' data-garage-id-param='${car.id}'>Remove</button>
      </div>
    </div>`
  }

  destroy({params}) {
    const url = `https://wagon-garage-api.herokuapp.com/cars/${params.id}`

    fetch(url, {method: 'DELETE'})
      .then(() => {
        this.listCars('beforeend')
      })
  }


  createCar(event) {

    const newCar = Object.fromEntries(new FormData(this.formTarget))

    event.preventDefault()
    fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCar)
    })
      .then(response => response.json())
      .then((data) => {
        // console.log(data);
        this.listCars('afterbegin')
      })
  }
}
