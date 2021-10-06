import gamestate from "./gamestate.js"

var rootElement = document.querySelector("#root")
var gameState = new gamestate()

//OBS EXPERIMENTAL WITH LOCALSTORAGE:
const saveGame = () => {
    localStorage.setItem('save', JSON.stringify(gameState.getBuildings()))
    localStorage.setItem('money', gameState.getMoney())
}

const restart = () => {
    localStorage.clear()
    gameState = new gamestate()
    showBuildings()
    setupEvents()
}

const loadFromSave = () => {
    let lastSave = JSON.parse(localStorage.getItem('save'))
    let lastMoney = parseInt(localStorage.getItem('money'))
    gameState = new gamestate(lastSave, lastMoney)
    showBuildings()
    setupEvents()

    // auto when saved
    let autoButtons = document.querySelectorAll('.auto')
    gameState.getBuildings().forEach(building => {
        if(building.isAuto){
            autoButtons.forEach(auto => {
                if(auto.name === building.name){
                    setAuto(auto)
                }
            })
        }
    })
    
}
//END EXPERIMENT

/*
TODO:
- Lagre pengeverdi når man saver
    - Burde lagre mer enn bare bygningene når jeg saver, slik at jeg også kan
    lagre typ total pengeverdi, pluss oppgraderingene ect.
- Styling
    - Pengene synligere
    - mindre elementer til byggene.
- Legge til quadrillion, quintillion ect..


FEATURES WANTED:
- Oppgraderinger globalt eller per type hus. (eks, alt går litt fortere/genererer mer)
- Achievements
    - !ikke så viktig, men etterhvert.


*/

rootElement.innerHTML = `
    <h1>Game</h1>
    <input type="button" id="saveButton" value="SAVE" class="save-button">
    <input type="button" id="resetButton" value="RESET" class="reset-button">
    <div id="money-div">
        ${gameState.getMoney()}
    </div>

    <div id="building-wrapper">
    </div>
`

// eventlistners for save/reset button
document.querySelector('#saveButton').addEventListener('click', () => {
    saveGame()
})

document.querySelector('#resetButton').addEventListener('click', () => {
    restart()
})
// end eventlisteners


const updateMoneyElement = () => {
    
    let moneyDiv = document.querySelector("#money-div")
    document.title= "Clicky: "+ moneyDiv.innerHTML
    moneyDiv.innerHTML = "💵 $"+numberToDisplayFormat(gameState.getMoney())
    updateUpgradeButtons()
    updateAutoButtons()
    updatePriceAndRent()
    updateLevel()
    updateCollectButton()
    updateActiveBuilding()
    updatePriceColor()
}

const showBuildings = () => {
    let buildingWrapper = document.querySelector("#building-wrapper")
    let buildings = gameState.getBuildings()
    let html = ""
    buildings.forEach(building => {
        
        html += `
            <div class="building-div" id=${building.name+"_div"}>
                <h2>${building.name} <span class="level" id=${building.name+"_Level"}></span></h2>
                <img src=${building.img} />
                <p id=${building.name+"_Rent"} class="rent">rent: ${building.rent} </p>
                <p id=${building.name+"_Price"} class="price">price:<span>${Math.round(building.price)} </span></p>

                <input type="button" value="Upgrade" 
                id=${building.name}Upgrade" class="upgrade"
                name=${building.name} disabled>
                <input type="button" value="Collect" id=${building.name+"Collect"} class="collect"
                name=${building.name} >
                <input type="button" value="Auto for: $${numberToDisplayFormat(building.autoPrice)}" id=${building.name+"Auto"} class="auto"
                name=${building.name}>
                <progress id=${building.name+"Progress"} max="100" value="0"> 70% </progress>
            </div>
        `
    })

    buildingWrapper.innerHTML = html
    
}


function numFormatter(num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(3) + 'K';  
    }else if(num >= 1000000 && num < 1000000000){
        return (num/1000000).toFixed(3) + ' Million';  
    }else if (num >= 1000000000&& num < 1000000000000){
        return (num / 1000000000).toFixed(3) + ' Billion'
    }else if (num >= 1000000000000){
        return (num / 1000000000000).toFixed(3) + ' Trillion'
    }else{
        return num; 
    }
}

function numberToDisplayFormat(num) {
    return numFormatter(Math.round(num))
}


const setupEvents = () => {
    let upgradeButtons = document.querySelectorAll(".upgrade")
    let collectButtons = document.querySelectorAll(".collect")
    let autoButtons = document.querySelectorAll('.auto')

    upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            gameState.useMoney(button.name)
            gameState.upgrade(button.name)
        })
    })
    collectButtons.forEach(button => {
        button.addEventListener('click', () => {
            runCollecting(button)
        })
    })
    autoButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.value = "upgraded"
            if(!button.disabled)button.disabled = true
            setAuto(button)
            gameState.setAuto(button.name)
            /* setInterval(() => {
                let collectButton = document.querySelector(`#${button.name+"Collect"}`)
                let result = collectButton.disabled
                collectButton.style.display = "none"
                button.style.display = "none"
                if(!result){
                    runCollecting(collectButton)
                }
            }, 100) */


            
        })
    })

}

const setAuto = button => {
    setInterval(() => {
        let collectButton = document.querySelector(`#${button.name+"Collect"}`)
        let result = collectButton.disabled
        collectButton.style.display = "none"
        button.style.display = "none"
        if(!result){
            runCollecting(collectButton)
        }
    }, 100)
}


const runCollecting = button => {
    if(!gameState.isRunning(button.name)){
        let progressBar = document.querySelector(`#${button.name}Progress`)
        let waitingTime = gameState.getTime(button.name)
        button.disabled = true
        let progressInterval = setInterval(()=>progressBar.value += 1, waitingTime/100)
        setTimeout(()=>{
            button.disabled = false
            clearInterval(progressInterval)
            progressBar.value = 0
        }, waitingTime)
                
        gameState.collectRent(button.name)
    }
}

const updateUpgradeButtons = () => {
    let upgradeButtons = document.querySelectorAll(".upgrade")
    let currentMoney = gameState.getMoney()
    upgradeButtons.forEach(button => {
        if(currentMoney >= gameState.getPrice(button.name)){
            button.disabled = false;
        } else {
            button.disabled = true
        }
    })
}
const updateAutoButtons = () => {
    let autoButtons = document.querySelectorAll(".auto")
    let currentMoney = gameState.getMoney()
    autoButtons.forEach(button => {
        let autoPrice = gameState.getAutoPrice(button.name)
        
        if(currentMoney >= autoPrice){
            button.disabled = false;
        } else {
            button.disabled = true
        }
    })
}

const updatePriceAndRent = () => {
    let rent = document.querySelectorAll('.rent')
    let price = document.querySelectorAll('.price')
    
    rent.forEach(element => element.innerHTML = `Rent: $${
        numberToDisplayFormat(gameState.getRent(element.id.split("_")[0]))}`)
    price.forEach(element => element.innerHTML = `Price: $${numFormatter(Math.round(gameState.getPrice(element.id.split("_")[0])))}`)
}

const updateLevel = () => {
    let levels = document.querySelectorAll('.level')
    levels.forEach(level => {
        let hName = level.id.split("_")[0]
        level.innerHTML = `Level: ${gameState.getLevel(hName)}`
    })
}

const updateCollectButton = () =>{
    let collect = document.querySelectorAll('.collect')
    collect.forEach(button => {
        if(!gameState.isRunning(button.name)){
        let level = gameState.getLevel(button.name)
        if(level===0){
            button.disabled = true
        } else{
            button.disabled = false
        }} 
    })
}

const updateActiveBuilding = () => {
    let buildings = gameState.getBuildings()
    let buildingDivs = document.querySelectorAll(".building-div")
    
    buildings.forEach(building => {
        if(building.level != 0){
            buildingDivs.forEach(div => {
                let name = div.id.split("_")[0]
                if(building.name === name){
                    div.classList.add("active-building")
                }
            })
        }
    })
}

const updatePriceColor = () => {
    let prices = document.querySelectorAll(".price")
    prices.forEach(price => {
        let name = price.id.split("_")[0]
        if(gameState.getPrice(name) > gameState.getMoney()){
            price.style.color = "#f71f03"
        } else{
            price.style.color = "#02b354"
        }
    })
}


showBuildings()
setupEvents()
setInterval(()=>updateMoneyElement(), 10)

// check if save exists
if(localStorage.getItem('save') != null){
    loadFromSave()
}
// why not work!!?!

updateCollectButton()
