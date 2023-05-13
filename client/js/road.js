class Road {
    constructor(x, y, width, laneCount = 3) {
        this.x = x
        this.y = y
        this.width = width
        this.laneCount = laneCount

        this.left = x - width/2
        this.right = x + width/2

        const infinity = 1000000
        this.top = -infinity
        this.bottom = infinity

        const topLeft = {x:this.left, y:this.top}
        const bottomLeft = {x:this.left, y:this.bottom}
        const topRight = {x:this.right, y:this.top}
        const bottomRight = {x:this.right, y:this.bottom}

        this.borders = [
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ]

        this.road = [
            [
                [0, this.y],
                [this.x, this.y*2]
            ],
            [
                [this.x, this.y*2],
                [this.x*2, this.y]
            ]
        ]

        var array = []

        var r = 700
        var n = 360 / 5
        
        function degToRad(deg) {
            return deg * (Math.PI / 180);
        }                  
        for (var i = 0; i < n; i++) {

            var t1 = i*(360/n)
            var tr1 = (degToRad(t1-90)) % 360

            var t2 = (i+1)*(360/n)
            var tr2 = (degToRad(t2-90)) % 360

            var fromX = canvas.width  / 2 + r * Math.cos(tr1)
            var fromY = canvas.height / 2 + r * Math.sin(tr1)
            var toX = canvas.width    / 2 + r * Math.cos(tr2)
            var toY = canvas.height   / 2 + r * Math.sin(tr2)

            array.push([
                { x: fromX, y: fromY },
                { x: toX, y: toY }
            ])
        }    
        
        r = 650
        for (var i = 0; i < n; i++) {

            var t1 = i*(360/n)
            var tr1 = (degToRad(t1-90)) % 360

            var t2 = (i+1)*(360/n)
            var tr2 = (degToRad(t2-90)) % 360

            var fromX = canvas.width  / 2 + r * Math.cos(tr1)
            var fromY = canvas.height / 2 + r * Math.sin(tr1)
            var toX = canvas.width    / 2 + r * Math.cos(tr2)
            var toY = canvas.height   / 2 + r * Math.sin(tr2)

            array.push([
                { x: fromX, y: fromY },
                { x: toX, y: toY }
            ])
        } 

        this.borders = array
    }

    render (ctx) {
        ctx.lineWidth = 3
        ctx.strokeStyle = "white"

        for (let i = 1; i <= this.laneCount-1; i++) {
            const x = lerp(this.left, this.right, i/this.laneCount)

            ctx.setLineDash([10, 10])            

            ctx.beginPath()
            ctx.moveTo(x, this.top)
            ctx.lineTo(x, this.bottom)
            ctx.stroke()
        }

        ctx.setLineDash([])
        ctx.strokeStyle = "black"
        this.borders.forEach(border => {
            ctx.beginPath()
            ctx.moveTo(border[0].x, border[0].y)
            ctx.lineTo(border[1].x, border[1].y)
            ctx.stroke()
        })

        // test
        /*ctx.beginPath()
        ctx.moveTo(0, this.y)
        ctx.lineTo(this.x, this.y*2)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0 + this.width, this.y)
        ctx.lineTo(this.x, this.y*2 - this.width)
        ctx.stroke()
        //
        ctx.beginPath()
        ctx.moveTo(this.x, this.y*2)
        ctx.lineTo(this.x*2, this.y)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(this.x, this.y*2 - this.width)
        ctx.lineTo(this.x*2 - this.width, this.y)
        ctx.stroke()
        //
        ctx.beginPath()
        ctx.moveTo(this.x*2, this.y)
        ctx.lineTo(this.x, 0)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x*2 - this.width, this.y)
        ctx.lineTo(this.x, 0 + this.width)
        ctx.stroke()
        //
        ctx.beginPath()
        ctx.moveTo(this.x, 0)
        ctx.lineTo(0, this.y)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x, 0 + this.width)
        ctx.lineTo(0 + this.width, this.y)
        ctx.stroke()

        
        ctx.strokeStyle = "red"
        this.road.forEach(road => {
            ctx.beginPath()
            ctx.moveTo(road[0][0], road[0][1])
            ctx.lineTo(road[1][0], road[1][1])
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(road[0][0] + this.width, road[0][1])
            ctx.lineTo(road[1][0], road[1][1] - this.width)
            ctx.stroke()
        })*/
    }
}