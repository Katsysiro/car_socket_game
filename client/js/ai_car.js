class Car extends BaseCar {
    constructor(WIDTH, HEIGHT, traffic = false, x = WIDTH / 2, y = HEIGHT / 2, name) {
        super(WIDTH, HEIGHT, traffic, x, y, name)
        
        if (!traffic) {
            this.useBrain = true

            this.sensor = new Sensor(this)
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            )
        }
    }

    updateCar (car, i, roadBorders, traffic) {
        super.updateCar(car, i, roadBorders, traffic)

        if (this.useBrain && !this.damage) {
            car.sensor.update(roadBorders, traffic)
            
            const offset = car.sensor.readings.map(
                s => s == null ? 0 : 1 - s.offset
            )
            
            const output = NeuralNetwork.feedForward(offset, this.brain)
            
            let changed

            // Controls
            const canTurn = this.localCar.power > 0.0025 || this.localCar.reverse
        
            const controls = {
                up: output[0],
                left: output[1],
                right: output[2],
                down: output[3],
            }
    
            const throttle = Math.round(controls.up * 10) / 10
            const reverse = Math.round(controls.down * 10) / 10
        
            if (this.localCar.isThrottling !== throttle || this.localCar.isReversing !== reverse) {
                changed = true;
                this.localCar.isThrottling = throttle
                this.localCar.isReversing = reverse
            }

            const turnLeft = canTurn && Math.round(controls.left * 10) / 10;
            const turnRight = canTurn && Math.round(controls.right * 10) / 10
        
            if (this.localCar.isTurningLeft !== turnLeft) {
                changed = true;
                this.localCar.isTurningLeft = turnLeft
            }
            if (this.localCar.isTurningRight !== turnRight) {
                changed = true;
                this.localCar.isTurningRight = turnRight
            }

            // Если выехали да пределы трассы, перебрасываем на другой край
            if (this.localCar.x > WIDTH + 7.5) {
                changed = true;
                this.localCar.x -= WIDTH + 15
            } else if (this.localCar.x < -7.5) {
                changed = true;
                this.localCar.x += WIDTH + 15
            }
        
            if (this.localCar.y > HEIGHT + 7.5) {
                changed = true;
                this.localCar.y -= HEIGHT + 15
            } else if (this.localCar.y < -7.5) {
                changed = true;
                this.localCar.y += HEIGHT + 15
            }            

            if (changed) {
                if (typeof sendParams === 'function') {
                    sendParams(this.localCar);
                }
            }  
        }
    }
}