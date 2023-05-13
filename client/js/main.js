const WIDTH = 1500
const HEIGHT = 1500

const canvas = document.querySelector('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT

const ctx = canvas.getContext('2d')
ctx.fillStyle = 'hsla(0, 0%, 25%, 0.25)'

const canvasRay = document.querySelector('#ray')
canvasRay.width = WIDTH
canvasRay.height = HEIGHT

const ctxRay = canvasRay.getContext('2d')
ctxRay.fillStyle = 'hsla(0, 0%, 0%, 0)'

const $scene = document.querySelector('.scene')

var cars = []

const car = new Car(WIDTH, HEIGHT, 'NETWORK', WIDTH - 75, HEIGHT / 2)
cars.push(car)

var road = new Road(canvas.width/2, canvas.height/2, 80)

function save(){
    localStorage.setItem("bestBrain", JSON.stringify(car.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

if(localStorage.getItem("bestBrain")){
    //for(let i=0;i<cars.length;i++){
        
    car.brain=JSON.parse(localStorage.getItem("bestBrain"));

    //if(i!=0){
    //    NeuralNetwork.mutate(cars[i].brain,0.1);
    //}
    //}
}

function mutate(){
    if(localStorage.getItem("bestBrain"))
    {
        car.brain=JSON.parse(localStorage.getItem("bestBrain"));
        NeuralNetwork.mutate(car.brain,0.1);
    }
}

const render = () => {

    ctx.restore()
    ctxRay.clearRect(0, 0, WIDTH, HEIGHT)

    cars.forEach((car) => {
        car.render(ctxRay)
        //car.sensor.render(ctxRay)
    })

    car.scene.x = window.innerWidth / 2 - car.localCar.x
    car.scene.y = window.innerHeight / 2 - car.localCar.y

    $scene.style.transform = `translate(${car.scene.x}px, ${car.scene.y}px)`

    road.render(ctx)

    requestAnimationFrame(render)

} 

render()

setInterval(() => {

    cars.forEach((car) => {
        car.update(road.borders, [])
    }) 

}, 1000 / 120)

// Окошко ввода имени
const $name = document.querySelector('.name')

/*$name.querySelector('form').onsubmit = (e) => {
    e.preventDefault();

    car.localCar.name = $name.querySelector('input').value || ''

    $name.parentNode.removeChild($name);
}*/