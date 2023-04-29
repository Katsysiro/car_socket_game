const carsById = {}

const socket = io('http://192.168.224.25:8082', {
    withCredetials: true
})

socket.on('connect', () => {
    cars.forEach(car => {
        sendParams(car.localCar)
    })
})

socket.on('join', () => {
    cars.forEach(car => {
        sendParams(car.localCar)
    })
})

socket.on('params', ({id, params}) => {
    let car = carsById[id]

    if (!car) {
        car = new Car(WIDTH, HEIGHT, 'SOCKET')

        carsById[id] = car
        cars.push(car)
    }

    for (const key in params) {
        if (key != 'el') {
            car.localCar[key] = params[key]
        }
    }
})

socket.on('leave', (id) => {
    const leave_car = carsById[id]

    if (!leave_car) {
        return console.error('Car not found')
    }

    for (let i = 0; i < cars.length; i++) {
        if (cars[i] === leave_car) {
            cars.splice(i, 1)
            break
        }
    }

    if (leave_car.localCar.$el) {
        leave_car.localCar.$el.parentNode.removeChild(leave_car.localCar.$el)
    }

    delete carsById[id]
})

function sendParams (car) {
    const {
        x, y, xVelocity, yVelocity, power, reverse, angle, angularVelocity, 
        isThrottling, isReversing, isTurningLeft, isTurningRight, name
    } = car

    socket.emit('params', {
        x, y, xVelocity, yVelocity, power, reverse, angle, angularVelocity, 
        isThrottling, isReversing, isTurningLeft, isTurningRight, name
    })
}