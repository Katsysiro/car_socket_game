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

        switch (this.controle_mode) {
            case 'USER':
                $el.classList.add('red')
                break
            case 'NETWORK':
                $el.classList.add('red')
                break
            default:
                break
        }

        const $body = document.createElement('div')
        $body.classList.add('car-body')

        const $roof = document.createElement('div')
        $roof.classList.add('car-roof')

        const $name = document.createElement('div')
        $name.classList.add('car-name')

        $body.appendChild($roof)
        $el.appendChild($body)
        $el.appendChild($name)
        $cars.appendChild($el)

        this.localCar = {
            $el: $el,
            $body: $body,
            $name: $name,

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
            isTurningLeft: false,
            isTurningRight: false,
            name: '! name !'
        }

        this.scene = {
            x: window.innerWidth / 2 - this.localCar.x,
            y: window.innerHeight / 2 - this.localCar.y 
        }

        this.sensor = new Sensor(this)
        this.brain = new NeuralNetwork(
            [this.sensor.rayCount, 6, 4]
        )

        this.polygon = []
        this.damage = false
    }

    render (ctx) {
        if (this.polygon.length > 0) {
            ctx.beginPath()
            ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
            for (let i = 1; i < this.polygon.length; i++) {
                ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
            }
            ctx.fill()
        }

        if (this.damage) {
            this.localCar.$body.style.backgroundColor = '#adadd7'
        }

        const { x, y, angle, power, reverse, angularVelocity, name } = this.localCar

        this.localCar.$el.style.transform = `translate(${x}px, ${y}px)`
        
        this.localCar.$body.style.transform = `rotate(${angle * 180 / Math.PI}deg)`
        this.localCar.$name.textContent = name || '!'

        // следы шин
        if ((power > 0.0025) || reverse) {
            if (((car.maxReverse === reverse) || (car.maxPower === power)) && Math.abs(angularVelocity) < 0.002) {
                return;
            }

            ctx.fillRect(
                x - Math.cos(angle + 3 * Math.PI / 2) * 3 + Math.cos(angle + 2 * Math.PI / 2) * 3,
                y - Math.sin(angle + 3 * Math.PI / 2) * 3 + Math.sin(angle + 2 * Math.PI / 2) * 3,
                1,
                1
            )
            ctx.fillRect(
                x - Math.cos(angle + 3 * Math.PI / 2) * 3 + Math.cos(angle + 4 * Math.PI / 2) * 3,
                y - Math.sin(angle + 3 * Math.PI / 2) * 3 + Math.sin(angle + 4 * Math.PI / 2) * 3,
                1,
                1
            )
        }
    }

    update (roadBorders, traffic) {             
        let controls = {
            up: 0,
            left: 0,
            right: 0,
            down: 0,
        }

        this.sensor.update(roadBorders, traffic)
            
        const offset = this.sensor.readings.map(
            s => s == null ? 0 : 1 - s.offset
        )
        
        const output = NeuralNetwork.feedForward(offset, this.brain)

        switch (this.controle_mode) {
            case 'USER':
                controls = window.getControls()
                break
            case 'NETWORK':
                const output = NeuralNetwork.feedForward(offset, this.brain)

                controls = {
                    up: output[0],
                    left: output[1],
                    right: output[2],
                    down: output[3],
                }
                break

            default:
                break
        }

        // Получение инпута
        let changed

        if (!this.damage) {
            const throttle = Math.round(controls.up * 10) / 10
            const reverse = Math.round(controls.down * 10) / 10

            if (this.localCar.isThrottling !== throttle || this.localCar.isReversing !== reverse) {
                changed = true
                this.localCar.isThrottling = throttle
                this.localCar.isReversing = reverse
            }

            // Расчитает положение тачки
            if (this.localCar.isThrottling) {
                this.localCar.power += this.powerFactor * this.localCar.isThrottling
            }
            else {
                this.localCar.power -= this.powerFactor
            }

            if (this.localCar.isReversing) {
                this.localCar.reverse += this.reverseFactor
            }
            else {
                this.localCar.reverse -= this.reverseFactor
            }

            this.localCar.power = Math.max(0, Math.min(this.maxPower, this.localCar.power))
            this.localCar.reverse = Math.max(0, Math.min(this.maxReverse, this.localCar.reverse))

            const canTurn = this.localCar.power > 0.0025 || this.localCar.reverse

            const turnLeft = canTurn && Math.round(controls.left * 10) / 10
            const turnRight = canTurn && Math.round(controls.right * 10) / 10

            if (this.localCar.isTurningLeft !== turnLeft || this.localCar.isTurningRight !== turnRight) {
                changed = true
                this.localCar.isTurningLeft = turnLeft
                this.localCar.isTurningRight = turnRight
            }

            const direction = this.localCar.power > this.localCar.reverse ? 1 : -1
            
            if (this.localCar.isTurningLeft) {
                this.localCar.angularVelocity -= direction * this.turnSpeed * this.localCar.isTurningLeft
            }

            if (this.localCar.isTurningRight) {
                this.localCar.angularVelocity += direction * this.turnSpeed * this.localCar.isTurningRight
            }

            this.localCar.xVelocity += Math.sin(this.localCar.angle) * (this.localCar.power - this.localCar.reverse)
            this.localCar.yVelocity += Math.cos(this.localCar.angle) * (this.localCar.power - this.localCar.reverse)

            this.localCar.x += this.localCar.xVelocity
            this.localCar.y -= this.localCar.yVelocity

            this.localCar.xVelocity *= this.drag
            this.localCar.yVelocity *= this.drag

            this.localCar.angle += this.localCar.angularVelocity
            this.localCar.angularVelocity *= this.angularDrag
            
            changed = true

            // Если выехали да пределы трассы, перебрасываем на другой край
            if (this.localCar.y > HEIGHT + 7.5) {
                this.localCar.y -= HEIGHT + 15
                changed = true
            } else if (this.localCar.y < -7.5) {
                this.localCar.y += HEIGHT + 15
                changed = true
            }

            if (this.localCar.x > WIDTH + 7.5) {
                this.localCar.x -= WIDTH + 15
                changed = true
            } else if (this.localCar.x < -7.5) {
                this.localCar.x += WIDTH + 15
                changed = true
            }

            this.polygon = this.#createPolygon()
            this.damage = this.#assessDamage(roadBorders, traffic)
            
            let t = this
            /*if (t.damage) {
                setTimeout(() => {
                    t.damage = false
                }, 1000)
            }*/

            switch (this.controle_mode) {
                case 'USER':
                    //if (changed) {
                    sendParams(this.localCar)
                    //}
                    break
                case 'NETWORK':
                    sendParams(this.localCar)
                default:
                    break
            }
        }
    }

    #assessDamage (roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true
            }
        }

        return false
    }

    #createPolygon () {
        const points = []
        const rad = Math.hypot(20, 10) / 2
        const alpha = Math.atan2(20, 10)
        
        points.push({
            x: this.localCar.x - Math.cos(this.localCar.angle - alpha) * rad,
            y: this.localCar.y - Math.sin(this.localCar.angle - alpha) * rad
        })

        points.push({
            x: this.localCar.x - Math.cos(this.localCar.angle + alpha) * rad,
            y: this.localCar.y - Math.sin(this.localCar.angle + alpha) * rad
        })

        points.push({
            x: this.localCar.x - Math.cos(Math.PI + this.localCar.angle - alpha) * rad,
            y: this.localCar.y - Math.sin(Math.PI + this.localCar.angle - alpha) * rad
        })

        points.push({
            x: this.localCar.x - Math.cos(Math.PI + this.localCar.angle + alpha) * rad,
            y: this.localCar.y - Math.sin(Math.PI + this.localCar.angle + alpha) * rad
        })

        return points
    }

}