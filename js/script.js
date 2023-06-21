class TicTacToe {
  constructor(selector) {
    this.parentElement = document.querySelector(selector)
    this.playerList = ['x', 'o'];
    this.GameBoards = Array(9).fill('') 
    this.currentPlayer = 0;

    this.init()

  }
  
  init() {
    this.buildGameUI()
  }
  
  getPlayerLabel() {
    return this.playerList[this.currentPlayer];
  }

  buildCardPlayer(playerName, playerNumber) {
    return `<div class="player1">
              <h1 class="player-label ${playerName}">${playerName}</h1>
              <p class="player-name">${playerNumber}</p>
              <p class="turn">Giliran mu!</p>
            </div>`
  }

  buildGameUI() {

    // game info
    const topArena = document.createElement('div');
    topArena.className = 'top-arena';

    let playerCards = '';
    this.playerList.forEach((player, i) => {
      playerCards += this.buildCardPlayer(player, "Player " + (i + 1))
    })

    topArena.innerHTML = playerCards;

    // buttonReset
    const gameControl = document.createElement('div');
    gameControl.className = 'reset';

    const btnReset = document.createElement('button');
    btnReset.className = 'btn-reset';
    btnReset.innerText = 'Reset Game';
    btnReset.addEventListener('click', () => this.gameReset());

    gameControl.appendChild(btnReset);
    topArena.appendChild(gameControl);

    // gameplay
    const gamePlayEl = document.createElement('div');
    gamePlayEl.className = 'main-arena';

    for (let i = 0; i < 9; i++) {
      const btn = document.createElement('button');
      btn.className = 'blok';
      btn.addEventListener('click', (e) => this.onCellClik(e, i));
      gamePlayEl.appendChild(btn);
    }

    this.parentElement.append(topArena, gamePlayEl);
    this.gamePlayEl = gamePlayEl;
  }

  onCellClik(e, i) {
    const btn = e.target;
    btn.innerText = this.getPlayerLabel();
    btn.classList.add(btn.innerText)
    btn.disabled = true;
    this.GameBoards[i] = btn.innerText;
    this.checkWinner();

    this.switchPlayer();
  }

  switchPlayer(currentPlayer = undefined) {

    if(currentPlayer != undefined) {
      this.currentPlayer = currentPlayer;
    } else {
      this.currentPlayer = this.currentPlayer == 1 ? 0 : 1
    }


    const player = document.querySelectorAll('.player1');

    player.forEach((box, i) => {
      if(this.currentPlayer == i) {
        box.classList.add('active');
      } else {
        box.classList.remove('active');
      }
    });
  }

  gameReset() {
    this.GameBoards = Array(9).fill('');
    this.switchPlayer(0);

    for (const btn of this.gamePlayEl.children) {
      btn.innerHTML = '';
      btn.classList.remove(...this.playerList);
      btn.disabled = false;
    }
  }

  checkWinner() {
    const winConditions = [
      // Horizontal
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      // Vertical
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      // Diagonal
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if(
          this.getPlayerLabel() == this.GameBoards[a] &&
          this.getPlayerLabel() == this.GameBoards[b] &&
          this.getPlayerLabel() == this.GameBoards[c]
        ) {
          Swal.fire({
            title: 'Good Jobs',
            text: `Selamat Player ${this.currentPlayer+1} kamu memenangkan game ini`,
            showDenyButton: true,
            confirmButtonText: 'Mantap!',
            denyButtonText: `Ulangi dong`,
            icon: 'success',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */

            // Disable others buttons
            for (const btn of this.gamePlayEl.children) {
              btn.disabled = true;
            }

            if (result.isDenied) {
              this.gameReset();
              Swal.fire('Game sudah di reset, Ayo main lagi!', '', 'info')
            }
          })
        }
    }
  }
}