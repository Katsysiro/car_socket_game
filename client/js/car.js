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

            xVelocity: 0,
            yVelocity: 0,
            power: 0,
            reverse: 0,
            angle: 0,
            angularVelocity: 0,
            isThrottling: false,
            isReversing: false,
        }

        this.scene = {
            x: window.innerWidth / 2 - this.localCar.x,
            y: window.innerHeight / 2 - this.localCar.y 
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

        // Получение инпута
        let changed

        const throttle = Math.round(controls.up * 10) / 10

        if (this.localCar.isThrottling !== throttle) {
            changed = true
            this.localCar.isThrottling = throttle
        }

        // Расчитает положение тачки
        if (this.localCar.isThrottling) {
            this.localCar.power += this.powerFactor * this.localCar.isThrottling
        }
        else {
            this.localCar.power -= this.powerFactor
        }

        this.localCar.power = Math.max(0, Math.min(this.maxPower, this.localCar.power))

        this.localCar.xVelocity += Math.sin(this.localCar.angle) * (this.localCar.power - this.localCar.reverse)
        this.localCar.yVelocity += Math.cos(this.localCar.angle) * (this.localCar.power - this.localCar.reverse)

        this.localCar.x += this.localCar.xVelocity
        this.localCar.y += this.localCar.yVelocity

        // Если выехали да пределы трассы, перебрасываем на другой край
        if (this.localCar.y > HEIGHT + 7.5) {
            this.localCar.y -= HEIGHT + 15
            changed = true
        } else if (this.localCar.y < -7.5) {
            this.localCar.y += HEIGHT + 15
            changed = true
        }
    }

}