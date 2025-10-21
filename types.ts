// Types for the Tenzies game

export interface Die {
    value: number;
    isHeld: boolean;
    id: string;
}

export interface DieProps {
    value: number;
    isHeld: boolean;
    hold: () => void;
    rollTrigger?: number;
}

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export interface DotPattern {
    [key: number]: [number, number][];
}