class BaseCar {
    constructor(WIDTH, HEIGHT, traffic = false, x = WIDTH / 2, y = HEIGHT / 2, name) {
        // Physics
        this.maxPower = 0.075
        this.maxReverse = 0.0375
        this.powerFactor = 0.001
        this.reverseFactor = 0.0005
    
        this.drag = 0.95
        this.angularDrag = 0.95
        this.turnSpeed = 0.002

        this.distance = 0
        this.last_x = x
        this.last_y = y

        //const $cars = document.querySelector('.cars');
        //const $map = document.querySelector('.map');
        //const $bullets = document.querySelector('.bullets');
    
        //const $points = document.querySelector('.points');
        

        const $cars = document.querySelector('.cars')

        var $el = document.createElement('div')
        $el.classList.add('car')
        const $body = document.createElement('div')
        $body.classList.add('car-body')
        const $roof = document.createElement('div')
        $roof.classList.add('car-roof')
        const $name = document.createElement('div')
        $name.classList.add('car-name')

        if (traffic) {
            this.maxPower = 0.055
        }
        else {
            $el.classList.add('red')            
        }

        $body.appendChild($roof)
        $el.appendChild($body)
        $el.appendChild($name)
        $cars.appendChild($el)

        this.$body = $body
        this.$name = $name

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
            isThrottling: traffic ? true : false,
            isReversing: false,
            //isShooting: false,
            //points: 0,
            name: name != undefined ? name : 'test',
            changed: false,        
            damage: false
        };
        
        if (!this.$body) {
            this.$body = this.localCar.$el.querySelector('.car-body')
        }
    
        if (!this.$name) {
            this.$name = this.localCar.$el.querySelector('.car-name')
        }
  
        this.scene = {
            x: window.innerWidth / 2 - this.localCar.x,
            y: window.innerHeight / 2 - this.localCar.y
        };
    
        //this.cars = [this.localCar];
        //const carsById = {};
          
        // Управление тачкой 
        if (!traffic) {
        }
        else {
            setInterval(() => {
                // Если выехали да пределы трассы, перебрасываем на другой край
                if (this.localCar.x > WIDTH + 7.5) {
                    this.localCar.x -= WIDTH + 15;
                } else if (this.localCar.x < -7.5) {
                    this.localCar.x += WIDTH + 15;
                }
            
                if (this.localCar.y > HEIGHT + 7.5) {
                    this.localCar.y -= HEIGHT + 15;
                } else if (this.localCar.y < -7.5) {
                    this.localCar.y += HEIGHT + 15;
                }
            }, 1000 / 120)
        }

        this.polygon = []
    }
  
    updateCar (car, i, roadBorders, traffic) {
        if (!this.damage) {
            if (car.localCar.isThrottling) {
                car.localCar.power += car.powerFactor * car.localCar.isThrottling
            } else {
                car.localCar.power -= car.powerFactor
            }
        
            if (car.localCar.isReversing) {
                car.localCar.reverse += car.reverseFactor
            } else {
                car.localCar.reverse -= car.reverseFactor
            }
        
            car.localCar.power = Math.max(0, Math.min(car.maxPower, car.localCar.power))
            car.localCar.reverse = Math.max(0, Math.min(car.maxReverse, car.localCar.reverse))
        
            const direction = car.localCar.power > car.localCar.reverse ? 1 : -1
        
            if (car.localCar.isTurningLeft) {
                car.localCar.angularVelocity -= direction * car.turnSpeed * car.localCar.isTurningLeft
            }
            if (car.localCar.isTurningRight) {
                car.localCar.angularVelocity += direction * car.turnSpeed * car.localCar.isTurningRight
            }
        
            car.localCar.xVelocity += Math.sin(car.localCar.angle) * (car.localCar.power - car.localCar.reverse)
            car.localCar.yVelocity += Math.cos(car.localCar.angle) * (car.localCar.power - car.localCar.reverse)
        
            car.localCar.x += car.localCar.xVelocity
            car.localCar.y -= car.localCar.yVelocity

            car.localCar.xVelocity *= car.drag
            car.localCar.yVelocity *= car.drag
            car.localCar.angle += car.localCar.angularVelocity
            car.localCar.angularVelocity *= car.angularDrag

            car.distance += Math.sqrt( Math.pow( car.localCar.x - car.last_x, 2) + Math.pow( car.localCar.y - car.last_y, 2) )

            car.last_y = car.localCar.y
            car.last_x = car.localCar.x

            this.polygon = this.#createPolygon()
            this.damage = this.#assessDamage(roadBorders, traffic)
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
  
    renderCar (car, index, ctx) {
        // border
        /*if (this.polygon.length > 0) {
            ctx.beginPath()
            ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
            for (let i = 1; i < this.polygon.length; i++) {
                ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
            }
            ctx.fill()
        }*/

        // Move car  
        const { x, y, angle, power, reverse, angularVelocity } = car.localCar
        
        if (this.damage) {
            car.$body.style.backgroundColor = '#adadd7'
        }
        else {
            //car.$body.style.backgroundColor = '#0400ff'
        }

        car.localCar.$el.style.transform = `translate(${x}px, ${y}px)`
        car.$body.style.transform = `rotate(${angle * 180 / Math.PI}deg)`
        car.$name.textContent = car.localCar.name || ''
    
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

    destroy() {
        if (this.localCar.$el) {
            this.localCar.$el.parentNode.removeChild(this.localCar.$el);
        }
    }
  }
  