import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import { useWindowWidth, useWindowHeight } from "./hooks"
import { createPortal } from "react-dom"

export default function App() {
    const windowWidth = useWindowWidth()
    const windowHeight = useWindowHeight()
    const [dice, setDice] = useState(() => generateAllNewDice())
    const [rollCount, setRollCount] = useState(0)
    const [timer, setTimer] = useState(0)
    const [timerActive, setTimerActive] = useState(false)
    const buttonRef = useRef(null)

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)

    // Timer effect
    useEffect(() => {
        let interval = null
        if (timerActive && !gameWon) {
            interval = setInterval(() => setTimer(t => t + 1), 1000)
        } else if (!timerActive || gameWon) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [timerActive, gameWon])

    // Focus button on win
    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
            setTimerActive(false)
        }
    }, [gameWon])

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }
    
    function rollDice() {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
            setRollCount(c => c + 1)
            if (rollCount === 0) setTimerActive(true)
        } else {
            setDice(generateAllNewDice())
            setRollCount(0)
            setTimer(0)
            setTimerActive(false)
        }
    }

    function hold(id) {
        setDice(oldDice => {
            const alreadyHeld = oldDice.some(die => die.isHeld)
            const newDice = oldDice.map(die =>
                die.id === id ?
                    { ...die, isHeld: !die.isHeld } :
                    die
            )
            // Start timer if this is the first die being held
            if (!alreadyHeld && !timerActive && !gameWon) {
                setTimerActive(true)
            }
            return newDice
        })
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <>
            {gameWon && createPortal(
                <Confetti
                    width={windowWidth}
                    height={windowHeight}
                />,
                document.body
            )}
            <main>
                <div aria-live="polite" className="sr-only">
                    {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
                </div>
                <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
                <div className="dice-container">
                    {diceElements}
                </div>
                <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                    {gameWon ? "New Game" : "Roll"}
                </button>
                <div className="game-stats">
                    <span className="roll-count">Rolls: {rollCount}</span>
                    <span className="timer">Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                </div>
            </main>
        </>
    )
}