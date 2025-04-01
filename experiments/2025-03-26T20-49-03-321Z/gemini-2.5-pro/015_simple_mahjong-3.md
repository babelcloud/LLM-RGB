# 015_simple_mahjong

## Prompt

You are a Mahjong game AI. I will explain to you the game rules of Simple Mahjong and show you some examples.
=== Simple Mahjong Rules ===
1. Simple Mahjong is a board game with four participants.
2. Simple Mahjong has three types of tiles, named "Dots", "Bamboo", "Character". There is no relationship between different types of tiles.
3. Each type of tile has nine different tiles from 1 to 9 and each tile has four copies(total 108 tiles).
   - Bamboos: B1 B2 ... B9, each with four identical tiles
   - Characters: C1 C2 ... C9, each with four identical tiles
   - Dots: D1 D2 ... D9, each with four identical tiles
4. The same type of tile can has three kinds of combinations:
    - Pair: TWO identical tiles, for example, D1D1, B2B2
    - Bump: THREE identical tiles, for example, D7D7D7, C3C3C3
    - Straight: THREE consecutive tiles of the same type, for example, D1-D2-D3, C7-C8-C9
5. At the beginning of the game, each player has 13 random tiles in hand.
6. The rest of the tiles face down on the table, which we call the tile wall.
7. Players play the game clockwise.
8. During your turn, you draw a new tile from the tile wall, bringing your hand to a total of 14 tiles. If these 14 tiles match a winning pattern, then you win. If not, you should choose a tile to discard in order to increase the possibility of your remaining tiles forming a winning pattern.
9. Winning pattern: 
    - Straights-win: the 14 tiles are in FOUR straights and ONE pair, for example, D1-D2-D3 C2-C3-C4 D5-D6-D7 D6-D7-D8 C9C9
    - Bumps-win: the 14 tiles are in FOUR bumps and ONE pair,for example, B1B1B1 B2B2B2 C1C1C1 C6C6C6 D9D9
    - Mixed-win: the 14 tiles are mixed with bumps, straights and ONE pair, for example, B1B1B1 C1C2C3 C6-C7-C8 D4-D5-D6 D7D7

=== End Rules ===
=== Examples ===
GAME INFO:
Tiles Discarded in Previous Rounds: C1 D4 D3 B3
Observe: Drew B6
Current Tiles: C2C2C2 C3C3 D9D9D9 B2 B7 B8 D6 D8 B6(just drew)

DECISION:
Thought: The tiles could potentially form a Mixed-win. I should keep the 'B6' as it could form a straight B6 B7 B8. D6 and D8 should be kept as well, considering the possibility of forming a straight sequence of D6-D7-D8. However, 'B2' is isolated and should be discarded.
Target Winning Pattern: Mixed-win
Winning Tile(s): D7 
Action: Discard B2
---
GAME INFO:
Tiles Discarded in Previous Rounds: B1 B1 B2 B2 B5 B6 B9 C2 C6 D5 D5 D8 D8 D9
Observe: Drew C3
Current Tiles: B1-B2-B3 B6B6B6 B7B7B7 C1C1 C2 C3C3(just drew)

DECISION:
Thought: My current hand of tiles is nearing a Mixed-win, with two bumps and one straight. If I discard C2, I'll have two pairs, C1C1 and C3C3. These could potentially form a bump, either C1C1C1 or C3C3C3, leading to a win. If I discard C1 or C3, I'll have a straight sequence C1-C2-C3 and an isolated C1 or C3. I would then need to wait for another C1 or C3 to form a pair for a win. Waiting for a C1 or C3 bump has a higher probability, so I should discard C2.
Target Winning Pattern: Mixed-win
Winning Tile(s): C1 C3
Action: Discard C2
---
GAME INFO:
Tiles Discarded in Previous Rounds: B1 B1 B1 B2 B3 B5 B9 C2 C3 C3 D1 D1 D1 D1 D4 D4 D4
Observe: Drew D2
Current Tiles: B3B3B3 B6B6B6 B8B8B8 C3C3 D2 D3 D2(just drew)

DECISION:
Thought: My hand of tiles is nearing a Bumps-win. If I discard D3, I'll have two choices, C3 or D2, to form a winning pattern. However, if I discard D2, I'll have D1 or D4 as potential cards to form a straight sequence, D1 D2 D3 or D2 D3 D4, leading to a Mixed-win. Considering the discarded tiles, D1 and D4 have been discarded more often than C3 or D2. This reduces the likelihood of drawing D1 or D4 from the tile wall. Therefore, I should aim for a Bumps-win pattern and discard D3.
Target Winning Pattern: Bumps-win
Winning Tile(s): D2
Action: Discard D3
---
GAME INFO:
Tiles Discarded in Previous Rounds: B1B1 B2 C7 C8 D5
Observe: Drew D5
Current Tiles: B3-B4-B5 B4-B5-B6 C7-C8-C9 B9B9 D2 D3 D5(just drew)

DECISION:
Thought: The tiles are close to a Straights-win pattern. There are three straights already and potentially D2 D3 can form another straight D1-D2-D3 or D2-D3-D4. Although the newly drew D5 can potentially form a straight with D3, D3 D4 D5. But waiting for D4 has lower chance than waiting for D1 or D4. Thus I should keep current tiles and discard the newly drew D5.
Target Winning Pattern: Straights-win
Winning Tile(s): D1 D4
Action: Discard D5
---
GAME INFO:
Tiles Discarded in Previous Rounds: B6 B7 B8 C7 C9 D2 D2 D5 D5 D5 D8
Observe: Drew D4
Current Tiles: B3B3B3 B9B9B9 C7C7C7 D4D4 D5 D6 D4(just drew)

DECISION:
Thought：The tiles are Mixed-Win pattern.The newly drew D4 can form a Straights D4-D5-D6
Target Winning Pattern: Mixed-win
Winning Tile(s): D4(just drew)
Action：None
=== End Examples ===

GAME INFO:
Tiles Discarded in Previous Rounds: B1 B3 C1 C1 D8 D9
Observe: Drew B8
Current Tiles: C5C5C5 C8C8C8 C7-C8-C9 D1-D2-D3 C1 B8(just drew)

DECISION:

## Response

DECISION:
Thought: My hand has four completed sets: two bumps (C5C5C5, C8C8C8) and two straights (C7-C8-C9, D1-D2-D3). To win, I need a pair. The remaining tiles are C1 and the newly drawn B8. I must discard one of them. Looking at the discarded tiles, two C1 tiles have already been discarded, meaning only one C1 remains available. No B8 tiles have been discarded, meaning three B8 tiles are still potentially available. Therefore, keeping B8 and discarding C1 gives me a much better chance of drawing the matching tile (B8) to form the winning pair.
Target Winning Pattern: Mixed-win
Winning Tile(s): B8
Action: Discard C1

