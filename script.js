//Avance proyecto final
//             Integrantes
//Angelica Paola Rivera Aragon. Matricula:345541
//Danna Maribel Corral Salcedo Matricula: 358147 
//Laura Cecilia Holguin Campos Matricula: 360743
const csvFileName = 'Diccjuego2023.csv';
const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');
const topWordsList = document.getElementById('topWordsList');
const totalScoreElement = document.getElementById('totalScore');
const hintButton = document.getElementById('hintButton');

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width  = 0;
ctx.canvas.height = 0;

function readCSV() {//leemos el archivo csv
  const fileInput = document.getElementById('csvFileInput');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const csvContent = e.target.result;
      const dataList = parseCSV(csvContent);
      console.log('Contenido del CSV:', dataList);
    };

    reader.readAsText(file);
  } else {
    console.log('Selecciona un archivo CSV primero.'); //seleccionamos el archivocsv
  }
}

function parseCSV(csvContent) {
  const rows = csvContent.split('\n');
  const dataList = [];

  for (const row of rows) {
    const columns = row.split(',');
    dataList.push(columns);
  }

  return dataList;
}


const bodyParts = [
    [4,2,1,1],
    [4,3,1,2],
    [3,5,1,1],
    [5,5,1,1],
    [3,3,1,1],
    [5,3,1,1]
];

let selectedWord;
let usedLetters;
let mistakes;
let hits;

const hintsTable = {
  Lavadora: 'Pista para palabra 1',
  palabra2: 'Pista para palabra 2',
  palabra3: 'Pista para palabra 3',
};

const addLetter = letter => {
  const letterElement = document.createElement('span');
  letterElement.innerHTML = letter.toUpperCase();
  usedLettersElement.appendChild(letterElement);
}

const addBodyPart = bodyPart => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(...bodyPart);
};

const wrongLetter = () => {
  addBodyPart(bodyParts[mistakes]);
  mistakes++;
  totalScore-= 65; //cada que se equivoque el usuario se le restan 65 puntos del puntaje 
  if(mistakes === bodyParts.length) endGame();
}

const endGame = () => {
  document.removeEventListener('keydown', letterEvent);
  startButton.style.display = 'block';
}

const correctLetter = letter => {
  const { children } =  wordContainer;
  for(let i = 0; i < children.length; i++) {
      if(children[i].innerHTML === letter) {
          children[i].classList.toggle('hidden');
          hits++;
      }
  }
  totalScore+= 100; //sumamos 100 puntos cada que adivina la letra
  if(hits === selectedWord.length) endGame();
}

const letterInput = letter => {
  if(selectedWord.includes(letter)) {
      correctLetter(letter);
  } else {
      wrongLetter();
  }
  // actualiza el contador del puntaje de la pantalla cada vez que ingrese una letra
  totalScoreElement.textContent = `Puntaje Total: ${totalScore}`; 
  addLetter(letter);
  usedLetters.push(letter);
};

const letterEvent = event => {
  let newLetter = event.key.toUpperCase();
  if(newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
      letterInput(newLetter);
  };
};

const drawWord = () => {
  selectedWord.forEach(letter => {
      const letterElement = document.createElement('span');
      letterElement.innerHTML = letter.toUpperCase();
      letterElement.classList.add('letter');
      letterElement.classList.add('hidden');
      wordContainer.appendChild(letterElement);
  });
};

const selectRandomWord = () => {
  let word = words[Math.floor((Math.random() * words.length))].toUpperCase();
  selectedWord = word.split('');
};

const drawHangMan = () => {
  ctx.canvas.width  = 120;
  ctx.canvas.height = 160;
  ctx.scale(20, 20);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#151514';
  ctx.fillRect(0, 7, 4, 1);
  ctx.fillRect(1, 0, 1, 8);
  ctx.fillRect(2, 0, 3, 1);
  ctx.fillRect(4, 1, 1, 1);
};

const startGame = () => {
  usedLetters = [];
  mistakes = 0;
  hits = 0;
  totalScore = 0;
  gameOver = false;
  numTopWords = topWordsList.length;
  wordContainer.innerHTML = '';
  totalScoreElement.textContent = `Puntaje Total: ${totalScore}`; 
  usedLettersElement.innerHTML = '';
  startButton.style.display = 'none';
  hintButton.style.display = 'block'; 
  drawHangMan();
  selectRandomWord();
  drawWord();
  document.addEventListener('keydown', letterEvent);
  if (gameOver) {
        playerHasLost = true;
    } else {
        playerHasLost = false;
    }

    if (!playerHasLost) {
        const guessWord = "palabra_adivinada"; 
        const guessScore = 100; 
        maxHeap.insert(guessWord, guessScore);
    }

    topWordsList.innerHTML = ""; 
    for (let i = 0; i < numTopWords; i++) {
        const maxWord = maxHeap.extractMax();
        if (maxWord) {
            const listItem = document.createElement("li");
            listItem.textContent = `${i + 1}. ${maxWord.word} - Puntaje: ${maxWord.score}`;
            topWordsList.appendChild(listItem);
        }
    }
};

startButton.addEventListener('click', startGame);

hintButton.addEventListener('click', () => {
  const currentWord = selectedWord.join('');
  if (hintsTable.hasOwnProperty(currentWord)) {
    const hintElement = document.getElementById('hintElement'); 
    hintElement.textContent = `Pista: ${hintsTable[currentWord]}`;
    hintElement.style.display = 'block';
  } else {
    alert('No hay pista disponible para esta palabra.');
  }
});

class Tablehash{
  
}

class MaxHeap {
  constructor() {
    this.heap = [];
  }

  insert(word, score) {
    this.heap.push({ word, score });
    this.bubbleUp();
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].score > this.heap[parentIndex].score) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  extractMax() {
    if (this.heap.length === 0) {
      return null;
    }
    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.sinkDown();
    return max;
  }

  sinkDown() {
    let index = 0;
    const length = this.heap.length;
    const element = this.heap[0];
    while (true) {
      const leftChildIdx = 2 * index + 1;
      const rightChildIdx = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.heap[leftChildIdx];
        if (leftChild.score > element.score) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.heap[rightChildIdx];
        if ((swap === null && rightChild.score > element.score) ||
            (swap !== null && rightChild.score > leftChild.score)) {
          swap = rightChildIdx;
        }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }
}
}
const maxHeap = new MaxHeap();
