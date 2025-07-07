const gameContainer = document.getElementById("game") // Conteneur du plateau de jeu
const message = document.getElementById("message") // Zone pour afficher les messages (victoire, match nul)
const turnDisplay = document.getElementById("turn") // Affiche le joueur dont c’est le tour
const modeSelection = document.getElementById("mode-selection") // Zone de sélection du mode de jeu
const humanVsHumanBtn = document.getElementById("versus")
const humanVsIaBtn = document.getElementById("vsia")
const restartBtn = document.getElementById("restart")

const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
]

let board = ["", "", "", "", "", "", "", "", ""]
let vsIA = null // Mode de jeu : contre IA ou non, pas encore défini
let puissance4 = false
let currentPlayer = "X"
let gameActive = true
turn.style.display= 'none'

function createBoard() {
    board = ["", "", "", "", "", "", "", "", ""]
    gameActive = true
    message.textContent = "" // Vide le message affiché (victoire ou nul)
    message.style.display = 'none'

    const boardDiv = document.createElement("div") // Création d'une div tableau qui contiendra les cases
    boardDiv.className = "board"

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div") // Permet de créer une div pour la case
        cell.className = "cell"
        cell.dataset.index = i // On assigne un index à chaque case

        cell.addEventListener("click", function () { // Ajoute un écouteur d'événement click sur la case
            handleClick(i, cell) // Appelle la fonction handleClick avec l'index et la case cliquée
        })

        boardDiv.appendChild(cell) // Ajoute la case à la div contenant le plateau
    }

    gameContainer.innerHTML = "" // Vide les cases au début
    gameContainer.appendChild(boardDiv) // Ajoute le tableau sur la page

    turnDisplay.innerHTML = `C'est au tour du joueur <span class="player">${currentPlayer}</span>`
    turnDisplay.style.display = 'block'
    turnDisplay.className = "turn"
}

function handleClick(index, cellEl) {
    if (!gameActive || board[index] !== "") { // Ignore le clic si la partie est finie ou si la case est déjà prise
        return
    }

    board[index] = currentPlayer // Met à jour le plateau avec le symbole du joueur actif
    cellEl.textContent = currentPlayer // On affiche "X" ou "O" dans la case
    cellEl.classList.add("taken")

    if (checkWin(currentPlayer)) {
        message.innerHTML = `Le joueur <span class="winner">${currentPlayer}</span> a gagné !`
        turnDisplay.style.display = 'none'
        message.style.display = '' // Affiche le message de victoire
        gameActive = false
        return
    }

    if (!board.includes("")) { // S'il n'y a plus de cases vides, match nul
        message.textContent = "Match nul !"
        message.style.display = '' // Rendre le message visible
        turnDisplay.style.display = 'none'// Cache l'indication de tour
        gameActive = false
        return
    }

    if (currentPlayer === "X") { // Change le joueur actif
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }

    turnDisplay.innerHTML = `C'est au tour du joueur <span class="player">${currentPlayer}</span>`

    if (vsIA && currentPlayer === "O" && gameActive) { // Si mode IA et c’est au tour de "O"
        setTimeout(playAI, 700) // Laisse un délai puis fait jouer l'IA
    }
}

function checkWin(player) {
    for (let i = 0; i < winCombos.length; i++) { // Parcourt toutes les combinaisons gagnantes
        const combo = winCombos[i]
        let hasWon = true // Variable pour savoir si la combinaison est gagnante

        for (let j = 0; j < combo.length; j++) {
            const index = combo[j]
            if (board[index] !== player) { // Si une case ne contient pas le joueur actuel
                hasWon = false // La combinaison n'est pas gagnante
                break
            }
        }
        if (hasWon) { // Si toutes les cases correspondent au joueur
            return true // Le joueur a gagné
        }
    }
    return false
}

function playAI() {
    if (!gameActive) return // Ne fait rien si la partie est terminée

    const emptyCells = [] // Liste des cases vides

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") { // Si la case est vide
            emptyCells.push(i) // Ajoute l'index dans la liste des cases vides
        }
    }

    if (emptyCells.length === 0) { // Si aucune case vide 
        return
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    const chosenCell = emptyCells[randomIndex]

    const boardDiv = document.querySelector(".board")
    const cellEl = boardDiv.children[chosenCell]

    handleClick(chosenCell, cellEl) // Joue le coup de l'IA dans cette case
}

function startGame() {
    modeSelection.style.display = "none" // Cache la sélection du mode
    currentPlayer = "X" // Initialise le joueur actif à "X"
    createBoard()
    if (vsIA && currentPlayer === "O" && gameActive) { // Si on joue contre IA et que c’est au tour de "O"
        setTimeout(playAI, 700)
    }
    restartBtn.style.display = "inline-block"
}

humanVsHumanBtn.addEventListener("click", () => { // Quand on clique sur le bouton humain vs humain
    vsIA = false // Mode sans IA
    startGame()
})

humanVsIaBtn.addEventListener("click", () => { // Quand on clique sur le bouton vs IA
    vsIA = true // Mode avec IA
    startGame()
})

restartBtn.addEventListener("click", () => {
    modeSelection.style.display = "block" // Affiche la sélection à nouveau
    gameContainer.innerHTML = "" // Vide le plateau
    restartBtn.style.display = "none"
    message.style.display = 'none'
    turnDisplay.style.display = 'none'

    currentPlayer = "X" // Réinitialise le joueur actif
    gameActive = true // Réinitialise l'état de la partie
    vsIA = null // Mode indéfini tant que pas choisi
})