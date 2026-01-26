const fs = require("fs");

function createRandomFile() {
  console.log("Создаем файл с числами...");

  const file = fs.createWriteStream("numbers.txt");
  const totalNumbers = 25000000;

  for (let i = 0; i < totalNumbers; i++) {
    const num = Math.floor(Math.random() * 1000000000);

    if (!file.write(num + " ")) {
      awaitDrain(file);
      break;
    }
    if (i % 1000000 === 0) {
      console.log(`Создано ${i} чисел`);
    }
  }

  file.end();
  console.log("Файл создан");
}

function awaitDrain(stream) {
  return new Promise((resolve) => {
    stream.once("drain", resolve);
  });
}

function splitIntoChunks() {
  console.log("\nРазбиваем файл...");

  const readStream = fs.createReadStream("numbers.txt", {
    encoding: "utf8",
    highWaterMark: 10 * 1024 * 1024,
  });

  let chunkNumber = 0;
  let currentData = "";

  readStream.on("data", (chunk) => {
    currentData += chunk;

    const numbers = currentData.split(" ").filter((n) => n !== "");

    currentData = numbers.pop() || "";

    numbers.sort((a, b) => a - b);

    const chunkFile = fs.createWriteStream(`chunk_${chunkNumber}.txt`);
    chunkFile.write(numbers.join(" ") + " ");
    chunkFile.end();

    chunkNumber++;
  });

  return new Promise((resolve) => {
    readStream.on("end", () => {
      if (currentData) {
        const chunkFile = fs.createWriteStream(`chunk_${chunkNumber}.txt`);
        chunkFile.write(currentData + " ");
        chunkFile.end();
        chunkNumber++;
      }
      resolve(chunkNumber);
    });
  });
}

async function mergeChunks(chunkCount) {
  const files = [];
  const currentNumbers = [];

  for (let i = 0; i < chunkCount; i++) {
    const stream = fs.createReadStream(`chunk_${i}.txt`, {
      encoding: "utf8",
      highWaterMark: 1024 * 1024,
    });

    files.push({
      stream: stream,
      buffer: "",
      index: 0,
      numbers: [],
    });

    currentNumbers.push(null);
  }

  function readNextNumber(fileIndex) {
    const file = files[fileIndex];

    if (file.numbers.length > file.index) {
      currentNumbers[fileIndex] = parseInt(file.numbers[file.index]);
      file.index++;
      return;
    }

    file.stream.once("data", (chunk) => {
      file.buffer += chunk;

      const parts = file.buffer.split(" ");
      file.numbers = parts.slice(0, -1).map((n) => parseInt(n));
      file.buffer = parts[parts.length - 1] || "";
      file.index = 0;

      if (file.numbers.length > 0) {
        currentNumbers[fileIndex] = file.numbers[0];
        file.index = 1;
      } else {
        currentNumbers[fileIndex] = null;
      }
    });
  }

  for (let i = 0; i < chunkCount; i++) {
    readNextNumber(i);
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  const output = fs.createWriteStream("sorted_numbers.txt");
  let mergedCount = 0;

  while (true) {
    let minNumber = null;
    let minIndex = -1;

    for (let i = 0; i < currentNumbers.length; i++) {
      if (currentNumbers[i] !== null) {
        if (minNumber === null || currentNumbers[i] < minNumber) {
          minNumber = currentNumbers[i];
          minIndex = i;
        }
      }
    }

    if (minNumber === null) {
      break;
    }

    output.write(minNumber + " ");
    mergedCount++;

    if (mergedCount % 1000000 === 0) {
      console.log(`Объединено`);
    }

    const file = files[minIndex];

    if (file.index < file.numbers.length) {
      currentNumbers[minIndex] = file.numbers[file.index];
      file.index++;
    } else {
      currentNumbers[minIndex] = null;
      readNextNumber(minIndex);
    }
  }

  output.end();

  for (let i = 0; i < chunkCount; i++) {
    fs.unlinkSync(`chunk_${i}.txt`);
  }

  console.log(`Готово! Объединено ${mergedCount} чисел!`);
}

async function main() {
  console.log("Начинаем сортировку 100 МБ файла...\n");

  try {
    if (!fs.existsSync("numbers.txt")) {
      await createRandomFile();
    }
    const chunkCount = await splitIntoChunks();

    await mergeChunks(chunkCount);

    console.log("\nСортировка завершена!");
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

main();
