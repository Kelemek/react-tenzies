import { useRef, useEffect, useState, CSSProperties } from "react"
import type { DieProps, DotPattern } from "./types"

export default function Die(props: DieProps): JSX.Element {
    const styles: CSSProperties = {
        backgroundColor: props.isHeld ? "#59E391" : "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0
    }

    const [rolling, setRolling] = useState<boolean>(false)
    const [animationClass, setAnimationClass] = useState<string>("")
    const prevRollTrigger = useRef<number>(props.rollTrigger || 0)

    useEffect(() => {
        if (prevRollTrigger.current !== props.rollTrigger && !props.isHeld) {
            // Randomly select one of 5 animation classes
            const animations = ["dice-roll-1", "dice-roll-2", "dice-roll-3", "dice-roll-4", "dice-roll-5"]
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)]
            
            setAnimationClass(randomAnimation)
            setRolling(true)
            
            const timeout: number = setTimeout(() => {
                setRolling(false)
                setAnimationClass("")
            }, 600) // Matches animation duration
            
            prevRollTrigger.current = props.rollTrigger || 0
            return () => clearTimeout(timeout)
        }
    }, [props.rollTrigger, props.isHeld])

    const dotPositions: number[] = [8, 20, 32]
    const dotPatterns: DotPattern = {
        1: [[1, 1]],
        2: [[0, 0], [2, 2]],
        3: [[0, 0], [1, 1], [2, 2]],
        4: [[0, 0], [0, 2], [2, 0], [2, 2]],
        5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
        6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
    }

    const dots: JSX.Element[] | undefined = dotPatterns[props.value]?.map(([row, col]: [number, number], i: number) => (
        <circle
            key={i}
            cx={dotPositions[col]}
            cy={dotPositions[row]}
            r="4.5"
            className="dice-dot"
        />
    ))

    return (
        <button
            style={styles}
            onClick={props.hold}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
            className={rolling ? animationClass : ""}
        >
            <svg width="40" height="40" viewBox="0 0 40 40">
                <rect x="0" y="0" width="40" height="40" rx="8" fill="none" />
                {dots}
            </svg>
        </button>
    )
}