    const boardElem = document.getElementById("board");
    const resultElem = document.getElementById("result");
    let board = ["", "", "", "", "", "", "", "", ""];
    let gameOver = false;

    function startGame() {
      board = ["", "", "", "", "", "", "", "", ""];
      gameOver = false;
      resultElem.textContent = "";
      renderBoard();
    }

    function renderBoard() {
      boardElem.innerHTML = "";
      board.forEach((cell, i) => {
        const cellElem = document.createElement("div");
        cellElem.className = "cell";
        cellElem.textContent = cell;
        if (!cell && !gameOver) {
          cellElem.addEventListener("click", () => playerMove(i));
        }
        boardElem.appendChild(cellElem);
      });
    }

    function playerMove(index) {
      if (board[index] || gameOver) return;
      board[index] = "X";
      if (checkWinner(board, "X")) {
        gameOver = true;
        resultElem.textContent = "Ты победил!";
        renderBoard();
        return;
      }
      if (isDraw(board)) {
        gameOver = true;
        resultElem.textContent = "Ничья!";
        renderBoard();
        return;
      }
      botMove();
    }

    function botMove() {
      const best = minimax(board, "O");
      board[best.index] = "O";
      if (checkWinner(board, "O")) {
        gameOver = true;
        resultElem.textContent = "ИИ победил!";
      } else if (isDraw(board)) {
        gameOver = true;
        resultElem.textContent = "Ничья!";
      }
      renderBoard();
    }

    function minimax(newBoard, player) {
      const huPlayer = "X";
      const aiPlayer = "O";
      const availSpots = newBoard.map((val, i) => val === "" ? i : null).filter(v => v !== null);

      if (checkWinner(newBoard, huPlayer)) return { score: -10 };
      if (checkWinner(newBoard, aiPlayer)) return { score: 10 };
      if (availSpots.length === 0) return { score: 0 };

      let moves = [];

      for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer) {
          let result = minimax(newBoard, huPlayer);
          move.score = result.score;
        } else {
          let result = minimax(newBoard, aiPlayer);
          move.score = result.score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
      }

      let bestMove;
      if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }

      return moves[bestMove];
    }

    function checkWinner(b, player) {
      const winCombos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      return winCombos.some(combo => combo.every(i => b[i] === player));
    }

    function isDraw(b) {
      return b.every(cell => cell !== "") && !checkWinner(b, "X") && !checkWinner(b, "O");
    }

    startGame();
