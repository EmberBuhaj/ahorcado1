//Proyecto Final "Ahorcado"
//             Integrantes
//Angelica Paola Rivera Aragon. Matricula: 345541
//Danna Maribel Corral Salcedo. Matricula: 358147 
//Laura Cecilia Holguin Campos. Matricula: 360743
//Lenguaje de programacion: JavaScript
const csvFileName = 'Diccjuego2023.csv';
const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const endGameButton = document.getElementById('endGameButton');
const usedLettersElement = document.getElementById('usedLetters');
const topWords = document.getElementById('topWords');
const topWordsList = document.getElementById('topWordsList');
const totalScoreElement = document.getElementById('totalScore');
const hintButton = document.getElementById('hintButton');

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = 0;
ctx.canvas.height = 0;

document.getElementById('csvFileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const csvContent = e.target.result;
      const dataList = parseCSV(csvContent);
      if (dataList.length > 0) {
        wordsLoaded = true;
        saveArrayInHashTable(dataList);
      }

    };

    reader.readAsText(file);
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

function saveArrayInHashTable(arrayWords) {
  // Supongamos que hashTable es una instancia de la clase TablaHash

  // Iterar sobre el arrayWords y guardar cada par de valores en la tabla hash
  for (const columns of arrayWords) {
    if (columns.length >= 2) {
      const key = columns[0].toUpperCase();
      const value = columns[1];
      hashTable.insert(key, value);
    }
  }
}


const bodyParts = [
  [4, 2, 1, 1],
  [4, 3, 1, 2],
  [3, 5, 1, 1],
  [5, 5, 1, 1],
  [3, 3, 1, 1],
  [5, 3, 1, 1]
];

let wordsLoaded = false;
let selectedWord;
let usedLetters;
let mistakes;
let hits;
let totalScore = 0;
let numTopWords = 0;

/**const hintsTable = {
  Lavadora: 'Pista para palabra 1',
  palabra2: 'Pista para palabra 2',
  palabra3: 'Pista para palabra 3',
};**/

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
  totalScore -= 65; //cada que se equivoque el usuario se le restan 65 puntos del puntaje 
  if (mistakes === bodyParts.length) loseGame();
}

const loseGame = () => {
  document.removeEventListener('keydown', letterEvent);
  endGameButton.style.display = 'block';
  startButton.style.display = 'block';
  hintButton.style.display = 'none';
  const word = selectedWord.join('');
  hashTable.remove(word);
}

const winGame = () => {
  document.removeEventListener('keydown', letterEvent);
  endGameButton.style.display = 'block';
  startButton.style.display = 'block';
  hintButton.style.display = 'none';
  const word = selectedWord.join('');
  hashTable.remove(word);
  maxHeap.insert(word, totalScore);
  numTopWords++;
}

const correctLetter = letter => {
  const { children } = wordContainer;
  for (let i = 0; i < children.length; i++) {
    if (children[i].innerHTML === letter) {
      children[i].classList.toggle('hidden');
      hits++;
    }
  }
  totalScore += 100; //sumamos 100 puntos cada que adivina la letra
  if (hits === selectedWord.length) winGame();
}

const letterInput = (letter) => {
  if (selectedWord.includes(letter)) {
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
  if (newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
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

function selectRandomWord() {
  let selectedWord = null;

  // Mientras no se haya seleccionado una palabra aleatoria
  while (!selectedWord) {
    // Seleccionar un índice aleatorio en el hash table
    const randomIndex = Math.floor(Math.random() * hashTable.size);

    // Obtener la lista enlazada en el índice aleatorio
    const linkedList = hashTable.table[randomIndex];

    // Si la lista enlazada no está vacía
    if (linkedList.cabeza) {
      // Obtener un nodo aleatorio de la lista enlazada
      let currentNode = linkedList.cabeza;
      const randomPosition = Math.floor(Math.random() * linkedList.size);

      for (let i = 0; i < randomPosition; i++) {
        if (currentNode.siguiente) {
          currentNode = currentNode.siguiente;
        } else {
          break;
        }
      }

      // Establecer la palabra seleccionada
      selectedWord = currentNode.key;
    }
    // Si la lista enlazada está vacía, continuar el bucle para seleccionar otro índice
  }
  return selectedWord.split('');
};

const drawHangMan = () => {
  ctx.canvas.width = 120;
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
  if (wordsLoaded) {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    totalScore = 0;
    gameOver = false;
    wordContainer.innerHTML = '';
    topWordsList.innerHTML = "";
    topWords.style.display = 'none';
    totalScoreElement.textContent = `Puntaje Total: ${totalScore}`;
    usedLettersElement.innerHTML = '';
    startButton.style.display = 'none';
    endGameButton.style.display = 'none';
    hintButton.style.display = 'block';
    drawHangMan();
    selectedWord = selectRandomWord();
    console.log(selectedWord);
    drawWord();
    document.addEventListener('keydown', letterEvent);
    if (gameOver) {
      playerHasLost = true;
    } else {
      playerHasLost = false;
    }
  } else {
    alert("Necesita cargar el archivo de palabras");
  }

};
startButton.addEventListener('click', startGame);

const endGame = () => {
  topWords.style.display = 'block';
  topWordsList.innerHTML = "";
  const length = maxHeap.heap.length;
  for (let i = 0; i < length; i++) {
    const maxWord = maxHeap.extractMax();
    if (maxWord) {
      const listItem = document.createElement("li");
      listItem.textContent = `${i + 1}. ${maxWord.word} - Puntaje: ${maxWord.score}`;
      topWordsList.appendChild(listItem);
    }
  }
}
endGameButton.addEventListener('click', endGame);

hintButton.addEventListener('click', () => {
  const currentWord = selectedWord.join('');
  const hint = hashTable.search(currentWord);

  if (hint) {
    alert("La pista es: " + hint);
  } else {
    alert('No hay pista disponible para esta palabra.');
  }
});

class NodoListaEnlazada {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.siguiente = null;
  }
}

class ListaEnlazada {
  constructor() {
    this.cabeza = null;
    this.size = 0;
  }

  agregarAlFinal(key, value) {
    const nuevoNodo = new NodoListaEnlazada(key, value);
    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
    } else {
      let actual = this.cabeza;
      while (actual.siguiente) {
        actual = actual.siguiente;
      }
      actual.siguiente = nuevoNodo;
      this.size++;
    }
  }

  buscar(key) {
    let actual = this.cabeza;
    while (actual) {
      if (actual.key === key) {
        return actual.value;
      }
      actual = actual.siguiente;
    }
    return null;
  }

  eliminar(key) {
    if (!this.cabeza) {
      return;
    }

    if (this.cabeza.key === key) {
      this.cabeza = this.cabeza.siguiente;
      return;
    }

    let actual = this.cabeza;
    while (actual.siguiente) {
      if (actual.siguiente.key === key) {
        actual.siguiente = actual.siguiente.siguiente;
        this.size--;
        return;
      }
      actual = actual.siguiente;
    }
  }
}

class TablaHash {
  constructor(size) {
    this.size = size;
    this.table = new Array(size).fill(null).map(() => new ListaEnlazada());
  }

  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % this.size;
  }

  insert(key, value) {
    const index = this.hash(key);
    this.table[index].agregarAlFinal(key, value);
  }

  search(key) {
    const index = this.hash(key);
    return this.table[index].buscar(key);
  }

  remove(key) {
    const index = this.hash(key);
    this.table[index].eliminar(key);
    console.log(key, this.table[index]);
  }
}

let hashTable = new TablaHash(9109);

class MaxHeap {
  constructor() {
    this.heap = [];
  }

  insert(word, score) {
    console.log(word);
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
      console.log("A");
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
