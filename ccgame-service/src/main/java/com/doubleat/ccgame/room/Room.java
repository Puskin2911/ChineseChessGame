package com.doubleat.ccgame.room;

import com.doubleat.ccgame.dto.common.UserDto;
import com.doubleat.ccgame.game.PlayingGame;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@RequiredArgsConstructor
public class Room {
    @NonNull
    private int id;

    private Set<UserDto> players = new HashSet<>(2);

    private Set<UserDto> viewers = new HashSet<>();

    private PlayingGame playingGame;

    public boolean isGameOver() {
        if (playingGame == null)
            return true;
        return playingGame.isOver();
    }

    public boolean isRedWin() {
        return playingGame.isRedWin();
    }

}
