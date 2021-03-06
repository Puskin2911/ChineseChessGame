import {BOARD_HEIGHT_SIZE, BOARD_WIDTH_SIZE, CELL_SIZE} from "../constants/BoardConstants";
import imagePieceMap from "../imageLoader/ImagePieceLoader";
import gameService from "./GameService";
import Board from "../game/Board";
import effectImageLoader from "../imageLoader/EffectImageLoader";

const drawBlankBoard = (ctx) => {
    // Horizontal
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.moveTo(CELL_SIZE / 2 + 1, CELL_SIZE / 2 + (CELL_SIZE + 1) * i + 1);
        ctx.lineTo(CELL_SIZE * 8.5 + 8 + 1, CELL_SIZE / 2 + (CELL_SIZE + 1) * i + 1);
        ctx.stroke();
    }

    // Vertical
    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.moveTo(CELL_SIZE / 2 + (CELL_SIZE + 1) * i + 1, CELL_SIZE / 2 + 1);
        ctx.lineTo(CELL_SIZE / 2 + (CELL_SIZE + 1) * i + 1, CELL_SIZE * 9.5 + 10);
        ctx.stroke();
    }

    // River Side
    ctx.clearRect(CELL_SIZE / 2 + 2, CELL_SIZE * 4.5 + 6, CELL_SIZE * 8, CELL_SIZE - 1);

    // General house
    ctx.beginPath();
    // Top
    ctx.moveTo(CELL_SIZE / 2 + (CELL_SIZE + 1) * 3 + 1, CELL_SIZE / 2 + 1);
    ctx.lineTo(CELL_SIZE / 2 + (CELL_SIZE + 1) * 5 + 1, CELL_SIZE / 2 + (CELL_SIZE + 1) * 2 + 1);
    ctx.moveTo(CELL_SIZE / 2 + (CELL_SIZE + 1) * 3 + 1, CELL_SIZE / 2 + (CELL_SIZE + 1) * 2 + 1);
    ctx.lineTo(CELL_SIZE / 2 + (CELL_SIZE + 1) * 5 + 1, CELL_SIZE / 2 + 1);
    // Bot
    ctx.moveTo(CELL_SIZE / 2 + (CELL_SIZE + 1) * 3 + 1, CELL_SIZE / 2 + (CELL_SIZE + 1) * 7 + 1);
    ctx.lineTo(CELL_SIZE / 2 + (CELL_SIZE + 1) * 5 + 1, CELL_SIZE / 2 + (CELL_SIZE + 1) * 9 + 1);
    ctx.moveTo(CELL_SIZE / 2 + (CELL_SIZE + 1) * 3 + 1, CELL_SIZE / 2 + (CELL_SIZE + 1) * 9 + 1);
    ctx.lineTo(CELL_SIZE / 2 + (CELL_SIZE + 1) * 5 + 1, CELL_SIZE / 2 + (CELL_SIZE + 1) * 7 + 1);
    ctx.stroke();
};

const drawPieces = (ctx, boardStatus, isRedPlayer) => {
    let resolvedBoardStatus = boardStatus;
    if (!isRedPlayer) {
        resolvedBoardStatus = gameService.resolveBoardStatus(boardStatus, isRedPlayer);
    }

    const piecesOnBoard = resolvedBoardStatus.split("_");
    for (let [key, value] of imagePieceMap) {
        for (const piece of piecesOnBoard) {
            if (key === piece.slice(2)) {
                let x = piece.charAt(0);
                let y = piece.charAt(1);
                ctx.drawImage(value, (CELL_SIZE + 1) * y + 1, (CELL_SIZE + 1) * x + 1, CELL_SIZE, CELL_SIZE);
            }
        }
    }
};

const clearBoard = canvas => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
};

const drawPieceBorder = (ctx, clickingPosition, isRedPlayer) => {
    if (clickingPosition == null) return;
    const centerX = isRedPlayer ? clickingPosition.centerX : Board.ROW - 1 - clickingPosition.centerX;
    const centerY = isRedPlayer ? clickingPosition.centerY : Board.COLUMN - 1 - clickingPosition.centerY;
    const y = centerX * (CELL_SIZE + 1) + 1;
    const x = centerY * (CELL_SIZE + 1) + 1;
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'green';
    // Left Top
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + CELL_SIZE / 4);
    ctx.moveTo(x, y);
    ctx.lineTo(x + CELL_SIZE / 4, y);
    // Right Top
    ctx.moveTo(x + CELL_SIZE, y);
    ctx.lineTo(x + CELL_SIZE * 3 / 4, y);
    ctx.moveTo(x + CELL_SIZE, y);
    ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE / 4);
    // Left Bot
    ctx.moveTo(x, y + CELL_SIZE);
    ctx.lineTo(x, y + CELL_SIZE * 3 / 4);
    ctx.moveTo(x, y + CELL_SIZE);
    ctx.lineTo(x + CELL_SIZE / 4, y + CELL_SIZE);
    // Right Bot
    ctx.moveTo(x + CELL_SIZE, y + CELL_SIZE);
    ctx.lineTo(x + CELL_SIZE * 3 / 4, y + CELL_SIZE);
    ctx.moveTo(x + CELL_SIZE, y + CELL_SIZE);
    ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE * 3 / 4);
    ctx.stroke();
};

const drawAvailableMovePosition = (ctx, availableMovePositions) => {
    for (let i = 0; i < availableMovePositions.length; i++) {
        const position = availableMovePositions[i];
        const x = position.centerX;
        const y = position.centerY;

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'yellow';

        ctx.arc(CELL_SIZE / 2 + (CELL_SIZE + 1) * y + 1, CELL_SIZE / 2 + (CELL_SIZE + 1) * x + 1, 4, 0, Math.PI * 2, true);
        ctx.stroke();
    }
};

const drawFromPiece = (ctx, fromPosition, isRedPlayer) => {
    if (fromPosition == null) return;

    const x = isRedPlayer ? fromPosition.centerX : Board.ROW - 1 - fromPosition.centerX;
    const y = isRedPlayer ? fromPosition.centerY : Board.COLUMN - 1 - fromPosition.centerY;

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';

    ctx.arc(CELL_SIZE / 2 + (CELL_SIZE + 1) * y + 1, CELL_SIZE / 2 + (CELL_SIZE + 1) * x + 1, 10, 0, Math.PI * 2, true);
    ctx.stroke();
}

const drawGeneralChecking = (ctx, position, isRedPlayer) => {
    if (position == null) return;

    let x, y;
    if (isRedPlayer) {
        const xCenter = position.centerX;
        const yCenter = position.centerY;
        x = CELL_SIZE / 2 + (CELL_SIZE + 1) * yCenter - 1;
        y = CELL_SIZE / 2 + CELL_SIZE * xCenter - 1;
    } else {
        const xCenter = Board.ROW - 1 - position.centerX;
        const yCenter = Board.COLUMN - 1 - position.centerY;
        x = CELL_SIZE / 2 + (CELL_SIZE + 1) * yCenter - 1;
        y = CELL_SIZE / 2 + CELL_SIZE * xCenter + 7;
    }

    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";

    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.restore();
}

const drawGeneralCheckingEffect = (ctx) => {
    ctx.drawImage(effectImageLoader.generalChecking, BOARD_WIDTH_SIZE / 4 - 8, BOARD_HEIGHT_SIZE / 4 + 10);
}

const drawWinnerEffect = (ctx) => {
    ctx.drawImage(effectImageLoader.winner, BOARD_WIDTH_SIZE / 3 - 12, BOARD_HEIGHT_SIZE / 3 + 20);
}

const drawLoserEffect = (ctx) => {
    ctx.drawImage(effectImageLoader.loser, BOARD_WIDTH_SIZE / 3 + 16, BOARD_HEIGHT_SIZE / 3 + 22);
}

const drawTimeUpNotification = (ctx, loserUsername) => {
    ctx.save();
    ctx.font = '30px Comic Sans MS';
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeText(loserUsername + ' hết thời gian', 120, 400);
    ctx.restore();
}

const drawSurrenderNotification = (ctx, loserUsername) => {
    ctx.save();
    ctx.font = '30px Comic Sans MS';
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeText(loserUsername + ' đầu hàng', 150, 400);
    ctx.restore();
}

const canvasService = {
    drawBlankBoard,
    drawPieces,
    clearBoard,
    drawPieceBorder,
    drawFromPiece,
    drawAvailableMovePosition,
    drawGeneralChecking,
    drawGeneralCheckingEffect,
    drawWinnerEffect,
    drawLoserEffect,
    drawTimeUpNotification,
    drawSurrenderNotification
};

export default canvasService;