const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// export function calcWinner(squares) {
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return { winner: squares[a], line: lines[i] };
//     }
//   }
//   return null;
// }

// this function calculates the winner of a tic tac toe game of size nxn
// squares being 'X', 'O' or ' '
export function calcWinner(squares, dimension) {
  const rows = new Array(dimension).fill(0);
  const cols = new Array(dimension).fill(0);
  const diag = new Array(2).fill(0);
  let winner = null

  // loop over each cell of the board
  for (let row = 0; row < dimension; row++) {
    for (let col = 0; col < dimension; col++) {

      // get the element via index calculation y * width + x 
      const square = squares[row * dimension + col];

      // increment for player one
      if (square === "x") {
        rows[row]++;
        cols[col]++;
      }
      // decrement for player two
      else if (square === "o") {
        rows[row]--;
        cols[col]--;
      }

      // check diagonal
      // if (row === col) 
      //   diag[0] += square === "x" ? 1 : -1;
      if (row === col) {
        diag[0] += square === "x" ? 1 : square === "o" ? -1 : 0;
      }

      // check anti diagonal
      // if (row === dimension - col - 1) 
      //   diag[1] += square === "x" ? 1 : -1;
      if (row === dimension - col - 1) {
        diag[1] += square === "x" ? 1 : square === "o" ? -1 : 0;
      }
    }
  }

  // check if any of the rows or columns are completed by either player
  for (let i = 0; i < dimension; i++) {
    // row/col contains the value of the dimension
    // if and only if the whole row/col only contains 'X' values
    // and therefore get incremented each time a cell
    // in that row/col gets looked at above
    if (rows[i] === dimension || cols[i] === dimension) {
      // return { winner: "x" };
      // return "x"
      winner = 'x'
      return 'x';
    }
    else if (rows[i] === -dimension || cols[i] === -dimension) {
      // return { winner: "o" };
      // return "o";
      winner = 'o'
      return 'o';
    }
  }

  // same as with the rows/cols but since there are only two diagonals,
  // do this right here
  if (diag[0] === dimension || diag[1] === dimension) {
    // return { winner: "x" };
    // return "x";
    winner = 'x'
    return 'x';
  }
  else if (diag[0] === -dimension || diag[1] === -dimension) {
    // return { winner: "o" };
    // return "o";
    winner = 'o'
    return 'o';
  }
    
    const moves = squares.filter((sq) => sq === "");
    if (winner == null && moves == 0) {
      return 'tie';
    }

  // otherwise no winner is found
  return null;
}

export default function calcBestMove(squares, player, dimension) {
  const getArrDuplicatedCount = (arr) => {
    let count = 0;
    arr.forEach((i) => {
      if (squares[i] === player) {
        count += 1;
      }
    });
    return count;
  };

  const sortedLines = lines.sort((a, b) => {
    let acount = getArrDuplicatedCount(a);
    let bcount = getArrDuplicatedCount(b);
    return bcount - acount;
  });

  for (let i = 0; i < sortedLines.length; i++) {
    let val = sortedLines[i].find((el) => {
      if (squares[el] === "") {
        return el + "";
      }
      return null;
    });

    if (!val) {
      continue;
    }
    return +val;
  }
  return null;
}

export function bestMove(squares, player, dimension) {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  const board = squares
  for (let i = 0; i < dimension**2; i++) {
    // Is the spot available?
    if (board[i] == '') {
      board[i] = player;
      let score = minimax(board, 0, false, dimension, player);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = { i };
      }
  }
  } 
  return move.i
  // board[move.i] = player;
}

let scores1 = {
  x: -10,
  o: 10,
  tie: 0
};
let scores2 = {
  x: 10,
  o: -10,
  tie: 0
};

function minimax(board, depth, isMaximizing, dimension, player) {
  
  let result = calcWinner(board, dimension);
  if (result !== null) {
    // return scores[result];
    if (player == 'o') {
      return scores1[result];
    }
    if (player == 'x') {
      return scores2[result];
    }
  }
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < dimension**2; i++) {
      // Is the spot available?
      if (board[i] == '') {
        board[i] = player;
        let score = minimax(board, depth + 1, false, dimension, player);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < dimension**2; i++) {
      // Is the spot available?
      if (board[i] == '') {
        board[i] = player === 'o' ? 'x' : 'o';
        let score = minimax(board, depth + 1, true, dimension, player);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
