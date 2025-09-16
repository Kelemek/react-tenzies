import { useRef, useEffect, useState } from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0
    }


    const [rolling, setRolling] = useState(false)
    const prevValue = useRef(props.value)

    useEffect(() => {
        if (prevValue.current !== props.value) {
            setRolling(true)
            const timeout = setTimeout(() => setRolling(false), 400)
            prevValue.current = props.value
            return () => clearTimeout(timeout)
        }
    }, [props.value])

    const dotPositions = [8, 20, 32]
    const dotPatterns = {
        1: [[1, 1]],
        2: [[0, 0], [2, 2]],
        3: [[0, 0], [1, 1], [2, 2]],
        4: [[0, 0], [0, 2], [2, 0], [2, 2]],
        5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
        6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
    }

    const dots = dotPatterns[props.value]?.map(([row, col], i) => (
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
            className={rolling ? "dice-roll" : ""}
        >
            <svg width="40" height="40" viewBox="0 0 40 40">
                <rect x="0" y="0" width="40" height="40" rx="8" fill="none" />
                {dots}
            </svg>
        </button>
    )
}