import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import { useWindowWidth, useWindowHeight } from "./hooks"
import { createPortal } from "react-dom"
import type { Die as DieType } from "./types"

export default function App(): JSX.Element {
    const windowWidth: number = useWindowWidth()
    const windowHeight: number = useWindowHeight()
    const [dice, setDice] = useState<DieType[]>(() => generateAllNewDice())
    const [rollCount, setRollCount] = useState<number>(0)
    const [timer, setTimer] = useState<number>(0)
    const [timerActive, setTimerActive] = useState<boolean>(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const gameWon: boolean = dice.every((die: DieType) => die.isHeld) &&
        dice.every((die: DieType) => die.value === dice[0].value)

    // Timer effect
    useEffect(() => {
        let interval: number | null = null
        if (timerActive && !gameWon) {
            interval = setInterval(() => setTimer((t: number) => t + 1), 1000)
        } else if (!timerActive || gameWon) {
            if (interval !== null) clearInterval(interval)
        }
        return () => {
            if (interval !== null) clearInterval(interval)
        }
    }, [timerActive, gameWon])

    // Focus button on win
    useEffect(() => {
        if (gameWon && buttonRef.current) {
            buttonRef.current.focus()
            setTimerActive(false)
        }
    }, [gameWon])

    function generateAllNewDice(): DieType[] {
        const dice: DieType[] = [];
        for (let i = 0; i < 10; i++) {
            dice.push({
                value: Math.ceil(Math.random() * 6) as DieType['value'],
                isHeld: false,
                id: nanoid()
            });
        }
        return dice;
    }
    
    function rollDice(): void {
        if (!gameWon) {
            setDice((oldDice: DieType[]) => oldDice.map((die: DieType) =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) as DieType['value'] }
            ))
            setRollCount((c: number) => c + 1)
            if (rollCount === 0) setTimerActive(true)
        } else {
            setDice(generateAllNewDice())
            setRollCount(0)
            setTimer(0)
            setTimerActive(false)
        }
    }

    function hold(id: string): void {
        setDice((oldDice: DieType[]) => {
            const alreadyHeld: boolean = oldDice.some((die: DieType) => die.isHeld)
            const newDice: DieType[] = oldDice.map((die: DieType) =>
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

    const diceElements: JSX.Element[] = dice.map((dieObj: DieType) => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
            rollTrigger={rollCount}
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