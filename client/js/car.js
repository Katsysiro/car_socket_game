class Car {

    constructor (WIDTH, HEIGHT, controle_mode, x = WIDTH / 2, y = HEIGHT / 2) {
        // Physics
        this.maxPower = 0.075
        this.maxReverse = 0.0375
        this.powerFactor = 0.001
        this.reverseFactor = 0.0005
    
        this.drag = 0.95
        this.angularDrag = 0.95
        this.turnSpeed = 0.002

        this.controle_mode = controle_mode

        // Create and draw car
        const $cars = document.querySelector('.cars')

        var $el = document.createElement('div')
        $el.classList.add('car')
        $el.classList.add('red')

        const $body = document.createElement('div')
        $body.classList.add('car-body')

        const $roof = document.createElement('div')
        $roof.classList.add('car-roof')

        $body.appendChild($roof)
        $el.appendChild($body)
        $cars.appendChild($el)

        this.localCar = {
            $el: $el,
            x: x != undefined ? x : WIDTH / 2,
            y: y != undefined ? y : HEIGHT / 2,

            angle: 0,

            xVelocity: 0,
            yVelocity: 0,
            power: 0,
            reverse: 0,
            angularVelocity: 0,

            isThrottling: false,
            isReversing: false,
            isTurningLeft: false,
            isTurningRight: false,
        }

        this.scene = {
            x: window.innerWidth / 2 - this.localCar.x,
            y: window.innerHeight / 2 - this.localCar.y,
        }

    }

    render () {
        const { x, y } = this.localCar

        this.localCar.$el.style.transform = `translate(${x}px, ${y}px)`
    }

    update () {
        let controls = {
            up: 0,
            left: 0,
            right: 0,
            down: 0,
        }

        switch (this.controle_mode) {
            case 'USER':
                controls = window.getControls()
                break
            default:
                break
        }

        //console.log(controls)

    }

}