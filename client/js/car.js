class Car extends BaseCar {
    constructor(WIDTH, HEIGHT, control_mode, traffic = false, x = WIDTH / 2, y = HEIGHT / 2, name) {
        super(WIDTH, HEIGHT, traffic, x, y, name)
        
        if (!traffic) {
            setInterval(() => {
                let changed;
                
                if (control_mode != 'SOCKET') {
                    const canTurn = this.localCar.power > 0.0025 || this.localCar.reverse;
                    
                    var controls = this.localCar.name != null
                        ? window.getControls()
                        : {
                            up: 0,
                            left: 0,
                            right: 0,
                            down: 0,
                            //shoot: 0
                        };

                    const throttle = Math.round(controls.up * 10) / 10;
                    const reverse = Math.round(controls.down * 10) / 10;
                    //const isShooting = controls.shoot;
                
                    /*if (isShooting !== localCar.isShooting) {
                        changed = true;
                        localCar.isShooting = isShooting;
                    }*/
                
                    //console.log(this.localCar.isThrottling, throttle)
                
                    if (this.localCar.isThrottling !== throttle || this.localCar.isReversing !== reverse) {
                        changed = true;
                        this.localCar.isThrottling = throttle;
                        this.localCar.isReversing = reverse;
                    }
                    const turnLeft = canTurn && Math.round(controls.left * 10) / 10;
                    const turnRight = canTurn && Math.round(controls.right * 10) / 10;
                
                    if (this.localCar.isTurningLeft !== turnLeft) {
                        changed = true;
                        this.localCar.isTurningLeft = turnLeft;
                    }
                    if (this.localCar.isTurningRight !== turnRight) {
                        changed = true;
                        this.localCar.isTurningRight = turnRight;
                    }
                
                    // Если выехали да пределы трассы, перебрасываем на другой край
                    if (this.localCar.x > WIDTH + 7.5) {
                        this.localCar.x -= WIDTH + 15;
                        changed = true;
                    } else if (this.localCar.x < -7.5) {
                        this.localCar.x += WIDTH + 15;
                        changed = true;
                    }
                
                    if (this.localCar.y > HEIGHT + 7.5) {
                        this.localCar.y -= HEIGHT + 15;
                        changed = true;
                    } else if (this.localCar.y < -7.5) {
                        this.localCar.y += HEIGHT + 15;
                        changed = true;
                    }
                
                    this.changed = changed;

                    if (changed) {
                        if (typeof sendParams === 'function') {
                            sendParams(this.localCar);
                        }
                    }        
                }
            }, 1000 / 120);
        }
    }
}
