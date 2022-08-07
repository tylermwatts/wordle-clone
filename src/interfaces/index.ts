export interface GuessRecord {
	0: string
	1: string
	2: string
	3: string
	4: string
	5: string
}

export interface GameRecord {
	losses: Record<string, GuessRecord>
	wins: Record<string, GuessRecord>
}
