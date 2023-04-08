const WIDTH = 1500
const HEIGHT = 1500

const canvas = document.querySelector('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT

const ctx = canvas.getContext('2d')
ctx.fillStyle = 'hsla(0, 0%, 25%, 0.25)'

const $scene = document.querySelector('.scene')

var cars = []

const car = new Car(WIDTH, HEIGHT, 100, 100)
cars.push(car)

const render = () => {

    ctx.restore()

    cars.forEach((car) => {
        car.render()
    })

    car.scene.x = window.innerWidth / 2 - car.localCar.x
    car.scene.y = window.innerHeight / 2 - car.localCar.y

    $scene.style.transform = `translate(${car.scene.x}px, ${car.scene.y}px)`

    requestAnimationFrame(render)

} 

render()

setInterval(() => {



}, 1000 / 120)