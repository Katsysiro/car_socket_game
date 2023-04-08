class Car {

    constructor (WIDTH, HEIGHT, x = WIDTH / 2, y = HEIGHT / 2) {

        // 
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

    }

}