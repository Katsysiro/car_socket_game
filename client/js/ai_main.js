const WIDTH = 1500
const HEIGHT = 1500

const canvas = document.querySelector('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT

const ctx = canvas.getContext('2d')
ctx.fillStyle = 'hsla(0, 0%, 25%, 0.25)'

//const visualizerCanvas = document.querySelector('#visualizer')

const generateCars = (N) => {
    var c = []

    for (let i = 0; i < N; i++) {
        c.push(new Car(WIDTH, HEIGHT, false, WIDTH - 80, HEIGHT / 2))
    }

    return c
}

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

// Массив всех тачек
var N = 1
var cars = generateCars(N)

let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

function start() {
    cars.forEach(element => {
        element.destroy()
    })

    cars = generateCars(N)
    bestCar=cars[0];
    if(localStorage.getItem("bestBrain")){
        for(let i=0;i<cars.length;i++){
            cars[i].brain=JSON.parse(
                localStorage.getItem("bestBrain"));
            if(i!=0){
                NeuralNetwork.mutate(cars[i].brain,0.1);
            }
        }
    }
}

//onst car = new Car(WIDTH, HEIGHT, false, WIDTH / 2, HEIGHT / 2)
//cars.push(car)

const traffic = [
    /*new Car(WIDTH, HEIGHT, true, 725, 600, 1),
    new Car(WIDTH, HEIGHT, true, 750, 675, 2),
    new Car(WIDTH, HEIGHT, true, 775, 725, 3),
    
    new Car(WIDTH, HEIGHT, true, 725, 750, 4),
    new Car(WIDTH, HEIGHT, true, 750, 625, 5),
    new Car(WIDTH, HEIGHT, true, 775, 570, 6),
    
    new Car(WIDTH, HEIGHT, true, 725, 500, 7),
    new Car(WIDTH, HEIGHT, true, 750, 450, 8),
    new Car(WIDTH, HEIGHT, true, 775, 400, 9),*/
]

if (typeof Road !== 'undefined') {
    var road = new Road(canvas.width/2, canvas.height/2, 80)
}

if (typeof Track !== 'undefined') {
    var track = new Track(canvas.width/2, canvas.height/2, 80)
}

const $scene = document.querySelector('.scene');

const canvasRay = document.querySelector('#ray')
canvasRay.width = WIDTH
canvasRay.height = HEIGHT

const ctxRay = canvasRay.getContext('2d')
ctxRay.fillStyle = 'hsla(0, 0%, 0%, 0)'

//const visualizerCtx = visualizerCanvas.getContext('2d')

const render = function() {
    //canvas.height = HEIGHT    
    ctx.restore()
    ctxRay.clearRect(0, 0, WIDTH, HEIGHT)

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].renderCar(traffic[i], i, ctx)
    }

    cars.forEach((f_car, index) => {
        f_car.renderCar(f_car, index, ctx)
        if (f_car.sensor != undefined) {
            if(!f_car.damage) {
                //f_car.sensor.render(ctxRay)
            }
        }
    })

    if (typeof Road !== 'undefined') {
        road.render(ctx)
    }

    if (typeof Track !== 'undefined') {
        track.render(ctx)
    } 

    /*bestCar = cars.find(c => c.localCar.y == Math.min(
        ...cars.filter(c => !c.damage).map(c => c.localCar.y)
    ) && !c.damage )*/
    
    //console.log(cars)

    bestCar = cars.find(c => c.distance == Math.max(
        ...cars.filter(c => !c.damage).map(c => c.distance)
    ) && !c.damage )

    //console.log(cars)
    //console.log(bestCar)

    // Двигаем сцену относильно тачки 
    bestCar.scene.x = window.innerWidth / 2 - bestCar.localCar.x
    bestCar.scene.y = window.innerHeight / 2 - bestCar.localCar.y

    $scene.style.transform = `translate(${bestCar.scene.x}px, ${bestCar.scene.y}px)`

    //Visualizer.drawNetwork(visualizerCtx, car.brain);

    requestAnimationFrame(render) 
}

render()

// Обновляем всё и частота обновления
let lastTime
let acc = 0
const step = 1 / 120

setInterval(() => {
    const ms = Date.now()

    if (lastTime) {
        acc += (ms - lastTime) / 1000

        while (acc > step) {
            cars.forEach((f_car, index) => {
                if (typeof Road !== 'undefined') {
                    f_car.updateCar(f_car, index, road.borders, traffic)
                }
                else {
                    f_car.updateCar(f_car, index, [], [])
                }
            })

            for (let i = 0; i < traffic.length; i++) {
                traffic[i].updateCar(traffic[i], i, [], [])
            }

            acc -= step
        }
    }

    lastTime = ms
}, 1000 / 120)

/*if (changed) {
    sendParams(localCar);
}*/

//

//const $disconnect = document.querySelector('.disconnect');

/*$disconnect.onclick = () => {
    socket.disconnect();
    localCar.name = '';

    while (cars.length > 1) {
        const car = cars.pop();
        car.$el.parentNode.removeChild(car.$el);
    }

    $disconnect.parentNode.removeChild($disconnect);
};*/

/*const $clearScreen = document.querySelector('.clearscreen');

$clearScreen.onclick = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctxRay.clearRect(0, 0, WIDTH, HEIGHT)
};*/

setInterval(() => {
    ctx.fillStyle = 'hsla(0, 0%, 95%, 0.2)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.fillStyle = 'hsla(0, 0%, 25%, 0.5)'
    
    /*ctxRay.fillStyle = 'hsla(0, 0%, 95%, 0.2)'
    ctxRay.fillRect(0, 0, WIDTH, HEIGHT)
    ctxRay.fillStyle = 'hsla(0, 0%, 25%, 0.5)'*/
}, 15 * 1000);

// Окошко ввода имени
/*const $name = document.querySelector('.name');

$name.querySelector('form').onsubmit = (e) => {
  e.preventDefault();

  localCar.name = $name.querySelector('input').value || '';

  $name.parentNode.removeChild($name);
};*/