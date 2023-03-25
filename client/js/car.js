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
            x: x != undefined ? x : WIDTH / 2,
            x: y != undefined ? y : HEIGHT / 2,
        }

    }

    render () {

    }

    update () {

    }

}