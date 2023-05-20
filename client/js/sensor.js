class Sensor {
    constructor(car){
        this.car = car

        this.rayCount = 52
        this.rayLength = 1000
        this.raySpread = Math.PI * 2

        this.rays = []
        this.readings = []
    }

    update (roadBorders, traffic, localCar) {
        this.#castRays()

        this.readings = []

        for (let i = 0;i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(
                    this.rays[i], 
                    roadBorders, 
                    traffic, localCar
                )
            )
        }
    }

    #getReading(ray, roadBorders, traffic, localCar) {
        let touches = []

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]
            )

            if (touch) {
                touches.push(touch)
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (traffic[i] != localCar) {
                const poly = traffic[i].polygon

                for (let j = 0; j < poly.length; j++) {
                    const value = getIntersection(
                        ray[0],
                        ray[1],
                        poly[j],
                        poly[(j+1)%poly.length]
                    )

                    if (value) {
                        touches.push(value)
                    }
                }
            }
        }

        if (touches.length == 0) {
            return null
        }
        else {
            const offset = touches.map(e => e.offset)
            const minOffest = Math.min(...offset)

            return touches.find(e => e.offset == minOffest)
        }
    }

    #castRays() {
        this.rays = []

        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(this.raySpread/2, -this.raySpread/2, this.rayCount==1?0.5:i/(this.rayCount-1)) + this.car.angle + 1.571

            const start = {x: this.car.x, y: this.car.y}
            const end = {x: this.car.x - Math.cos(rayAngle)*this.rayLength, y: this.car.y - Math.sin(rayAngle)*this.rayLength}

            this.rays.push([start, end])
        }
    }

    render (ctx) {
        ctx.restore()

        for (let i = 0; i < this.rays.length; i++) {
            let end = this.rays[i][1]
            
            if (this.readings[i]) {
                end = this.readings[i]
            }

            ctx.beginPath();
            ctx.lineWidth = 2
            ctx.strokeStyle = 'yellow'
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()

            ctx.beginPath();
            ctx.lineWidth = 2
            ctx.strokeStyle = 'red'
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
        }
    }
}