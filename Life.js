const grid = document.getElementById("wrapper")

rows=400
columns=rows

grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`

let started = false
let paused = true
let alive = []
let adjacent = []

let delay = 1000

for (let i = 0; i<rows; i += 1){
    for (let j = 0; j<columns; j += 1){
        let box = document.createElement('div')
        box.id = `(${i+1}, ${j+1})`
        box.setAttribute('row', `${i+1}`)
        box.setAttribute('column', `${j+1}`)
        box.onclick = () => {
            if (started === false){
                if (box.style.backgroundColor === 'red'){
                    box.style.backgroundColor = 'grey'
                    index = alive.indexOf(box.id)
                    alive.splice(index, 1)
                }
                else{
                    box.style.backgroundColor = 'red'
                    alive.push(box.id)
                }
            }
        }
        grid.appendChild(box)
    }
}

let genCount = document.getElementById('GenCount')

const turnButton = document.getElementById('turnButton')
turnButton.onclick = () => {turn()}

let generation = 0

async function turn(){
    started = true
    if (paused){
        setAdjacent()
        takeTurn()
        generation += 1
        genCount.innerHTML = `Generation: ${generation}|Population:${alive.length}`
    }
    else{
        while (!paused){
            setAdjacent()
            takeTurn()
            generation += 1
            genCount.innerHTML = `Generation: ${generation}|Population:${alive.length}`
            await new Promise(r => setTimeout(r, delay));
        }
    }
}


function setAdjacent(){
    adjacent=[]
        for (let i = 0; i<alive.length; i+=1){
            let nums = alive[i].match(/-?\d+/g)
            let row = Number(nums[0])
            let column = Number(nums[1])
                    for (let a = -1; a<2; a+=1){
                        for (let b=-1;b<2;b+=1){
                            if (a === 0 & b === 0){}
                            else{
                                rowA = row + a 
                                columnA = column + b
                                if (alive.includes(`(${rowA}, ${columnA})`) === false){
                                    adjacent.push(`(${rowA}, ${columnA})`)
                                }
                            }

                        }
                    }
        }
}

function takeTurn(){
    let oldAlive = [...alive]
    for (let i = 0; i<oldAlive.length; i+=1){
        let nums = oldAlive[i].match(/-?\d+/g)
        let row = Number(nums[0])
        let column = Number(nums[1])
                let aliveNeighbors = 0
                for (let a = -1; a<2; a+=1){
                    for (let b=-1;b<2;b+=1){
                        if (a === 0 & b === 0){}
                        else{
                            rowA = row + a 
                            columnA = column + b
                            if (oldAlive.includes(`(${rowA}, ${columnA})`)){
                                aliveNeighbors += 1  
                            }
                        }
                    }
                }
                if (aliveNeighbors < 2 | aliveNeighbors > 3){
                    index = alive.indexOf(oldAlive[i])
                    alive.splice(index, 1)
                    if (row<rows+1 & 0<row){
                        if (column<columns+1 & 0<column){
                            let box = document.getElementById(oldAlive[i])
                            box.style.backgroundColor = 'grey'
                        }
                    }
                }
    }

    for (let i = 0; i<adjacent.length; i+= 1){
        let liveNeighbors = adjacent.filter((value) => (value===adjacent[i])).length
        if (liveNeighbors === 3 ){
            if (alive.includes(adjacent[i]) === false){
                alive.push(adjacent[i])
                let nums = adjacent[i].match(/-?\d+/g)
                let row = Number(nums[0])
                let column = Number(nums[1])
                if (row<rows+1 && 0<row){
                    if (column<columns+1 && 0<column){
                        let box = document.getElementById(adjacent[i])
                        box.style.backgroundColor = 'red'
                    }
                }
            }
        }
    }
    
}

const restart = document.getElementById('restartButton')
restart.onclick = () => {restartGame()}

function restartGame(){
    started = false
    paused = true
    for (let i = 0; i<alive.length; i = i+1){
        let nums = alive[i].match(/-?\d+/g)
        let row = Number(nums[0])
        let column = Number(nums[1])
        if (row<rows+1 & 0<row){
            if (column<columns+1 & 0<column){
                box=document.getElementById(alive[i])
                box.style.backgroundColor = 'grey'
            }
        }
    }
    alive = []
    adjacent = []
    genCount.innerHTML = `Generation: 0`
    generation = 0

}

const pause = document.getElementById('pauseButton')
pause.onclick = () => {paused?paused=false:paused=true}


const short = document.getElementById('ShortWait')
short.onclick = () => {delay=100}

const med = document.getElementById('MedWait')
med.onclick = () => {delay=500}

const long = document.getElementById('LongWait')
long.onclick = () => {delay=1000}


const GosperGunConfig = ['(6, 2)','(7, 2)','(7, 3)','(6, 3)','(6, 12)','(7, 12)','(8, 12)','(9, 13)',
                        '(10, 14)','(10, 15)','(5, 13)','(4, 14)','(4, 15)','(7, 16)','(5, 17)',
                        '(9, 17)','(6, 18)','(7, 18)','(8, 18)','(7, 19)','(6, 22)','(6, 23)','(5, 23)',
                        '(5, 22)','(4, 22)','(4, 23)','(3, 24)','(3, 26)','(2, 26)','(7, 24)','(7, 26)',
                        '(8, 26)','(4, 36)','(4, 37)','(5, 37)','(5, 36)']

function generateGosperGun(){
    if (!started){
        for (let i = 0; i<GosperGunConfig.length; i++){
            box=document.getElementById(GosperGunConfig[i])
            box.style.backgroundColor = 'red'
            if (!alive.includes(box.id)){
                alive.push(box.id)
            }
        }
    }
}

const gosperGun = document.getElementById('gosperGun')
gosperGun.onclick = () => {generateGosperGun()}



// Only create arrays of positions after 
//Play clicks start. Fewer Computations. 
