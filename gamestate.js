
class gamestate {
    globalUpgrades = {
        globalMultiplier : 2,
        globalSpeedMultiplier : 0
    }

    buildings = [
        {
            level:1,
            name: "Motorhome",
            img: "https://grandolervresort.com/wp-content/uploads/2019/04/camper.gif",
            price: 10,
            rent: 1,
            factor: 1.5,
            time: 1000,
            autoPrice: 120,
            isRunning: false,
            isAuto: false
        },
        {
            level:0,
            name: "Condo",
            img:"https://cdn.pixabay.com/photo/2017/10/30/20/52/condominium-2903520_1280.png",
            price: 5,
            rent: 5,
            factor: 1.3,
            time: 3000,
            autoPrice: 500,
            isRunning: false,
            isAuto: false
        }
        ,
        {
            level:0,
            name: "Mansion",
            img: "https://freesvg.org/img/mansion.png",
            price: 1300,
            rent: 1500,
            factor: 1.4,
            time: 3500,
            autoPrice: 10000,
            isRunning: false,
            isAuto: false
        }
        ,
        {
            level:0,
            name: "PirateShip",
            img: "https://cdn.picpng.com/sailing_ship/sailing-ship-pirate-ship-ship-42420.png",
            price: 8000,
            rent: 15000,
            factor: 1.5,
            time: 3800,
            autoPrice: 1000000,
            isRunning: false,
            isAuto: false
        },
        {
            level:0,
            name: "Rocket",
            img: "http://media-s3-us-east-1.ceros.com/james-hu/images/2020/06/15/a985beeba1eccaba9a64a51ce26c01de/spaceshuttle.gif",
            price: 20000,
            rent: 150000,
            factor: 1.5,
            time: 5000,
            autoPrice: 10000000,
            isRunning: false,
            isAuto: false
        },
        {
            level:0,
            name: "Spaceship",
            img: "https://snipstock.com/assets/cdn/png/393ba30ec52e98598d27280d4530f844.png",
            price: 200000,
            rent: 1500000,
            factor: 1.5,
            time: 9000,
            autoPrice: 100000000,
            isRunning: false,
            isAuto: false
        }
    ]

    constructor(buildings, money) {
        if(!(buildings === undefined)){
            this.buildings = buildings
            // reset running buildings
            this.buildings.forEach(building => {
                building.isRunning = false
            })
            
            this.money = money;
        } 
    }

    money = 0

    upgrade = houseName => {
        let houseToUpgrade = this.buildings.filter(house => house.name === houseName)[0]
        houseToUpgrade.price *= (houseToUpgrade.factor+0.2)
        houseToUpgrade.rent *= houseToUpgrade.factor
        houseToUpgrade.time *= 0.98
        houseToUpgrade.level ++
    }
    getPrice = houseName => {
        let result = this.buildings.filter(house => house.name === houseName)[0]
        return result.price
    }

    getMoney = () => this.money
    increaseMoney= amount => this.money += amount
    getBuildings = () => this.buildings
    getRent = houseName => {
        let result = this.buildings.filter(house => house.name === houseName)[0]
        return result.rent * this.globalUpgrades.globalMultiplier
    }
    getTime = houseName => {
        let result = this.buildings.filter(house => house.name === houseName)[0]
        return result.time
    }

    getHouse = houseName => {
        let result = this.buildings.filter(house => house.name === houseName)[0]
        return result
    }

    isRunning = houseName => {
        return this.getHouse(houseName).isRunning
    }

    collectRent = houseName => {
        if(this.isRunning(houseName)){
            console.log("house already running")
            return
        }
        this.getHouse(houseName).isRunning = true
        setTimeout(()=>{
            this.getHouse(houseName).isRunning = false
            this.increaseMoney(this.getRent(houseName))
        }, this.getTime(houseName))
        
    }

    useMoney = houseName => {
        let price = this.getPrice(houseName)
        this.money -= price
    }

    getAutoPrice = houseName => {
        let result = this.buildings.filter(house => house.name === houseName)[0]
        return result.autoPrice
    }

    getLevel = houseName => {
        let result = this.buildings.filter(house => house.name === houseName)[0]
        return result.level
    }

    setBuildings = buildings => {
        this.buildings = buildings
    }
    setAuto = houseName => {
        this.getHouse(houseName).isAuto = true
    }
    isAuto = houseName => {
        return this.getHouse(houseName).isAuto
    }
}



export default gamestate
