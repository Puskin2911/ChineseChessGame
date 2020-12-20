package com.doubleat.ccgame.dto.response;

import com.doubleat.ccgame.dto.common.UserDto;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

import java.util.Set;

@Data
@Builder
public class RoomDto {
    @NonNull
    private Integer id;
    private Set<UserDto> players;
    private Set<UserDto> viewers;
}
