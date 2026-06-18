export const PADDY_DISEASE_LABELS = [
  "bacterial_leaf_blight",
  "bacterial_leaf_streak",
  "bacterial_panicle_blight",
  "blast",
  "brown_spot",
  "dead_heart",
  "downy_mildew",
  "hispa",
  "normal",
  "tungro",
];

const MODEL_URL = "/models/paddy-disease/model.json";
const INPUT_SIZE = 150;
const PIXEL_NORMALIZATION_DIVISOR = 255;
const QUALITY_SAMPLE_SIZE = 96;
const MIN_LEAF_RATIO = 0.018;

let tfPromise;
let modelPromise;

function getTensorFlow() {
  if (!tfPromise) {
    tfPromise = import("@tensorflow/tfjs").then(async (tf) => {
      await tf.ready();
      return tf;
    });
  }

  return tfPromise;
}

export const MODEL_PREPROCESSING = {
  inputShape: [1, INPUT_SIZE, INPUT_SIZE, 3],
  colorOrder: "RGB",
  normalization: "pixel / 255.0",
  resize: `${INPUT_SIZE}x${INPUT_SIZE}`,
};

export async function loadPaddyDiseaseModel(onStage) {
  if (!modelPromise) {
    onStage?.("Memuat TensorFlow.js dan model AI...");
    modelPromise = getTensorFlow().then((tf) => tf.loadGraphModel(MODEL_URL));
  }

  return modelPromise;
}

function resizeCanvas(sourceCanvas) {
  const canvas = document.createElement("canvas");
  canvas.width = INPUT_SIZE;
  canvas.height = INPUT_SIZE;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Browser tidak dapat memproses gambar untuk model AI.");
  }

  context.drawImage(sourceCanvas, 0, 0, INPUT_SIZE, INPUT_SIZE);

  return canvas;
}

function createInputTensor(tf, sourceCanvas) {
  return tf.tidy(() => {
    const resizedCanvas = resizeCanvas(sourceCanvas);

    return tf.browser
      .fromPixels(resizedCanvas, 3)
      .toFloat()
      .div(PIXEL_NORMALIZATION_DIVISOR)
      .expandDims(0);
  });
}

function formatPredictions(scores) {
  return Array.from(scores)
    .map((confidence, index) => ({
      label: PADDY_DISEASE_LABELS[index],
      confidence,
    }))
    .sort((a, b) => b.confidence - a.confidence);
}

export function validateImageQuality(sourceCanvas) {
  if (!sourceCanvas || sourceCanvas.width === 0 || sourceCanvas.height === 0) {
    return {
      passed: false,
      issues: ["Gambar tidak valid untuk diproses model AI."],
      metrics: null,
    };
  }

  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = QUALITY_SAMPLE_SIZE;
  sampleCanvas.height = QUALITY_SAMPLE_SIZE;

  const context = sampleCanvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return {
      passed: false,
      issues: ["Browser tidak dapat membaca kualitas gambar."],
      metrics: null,
    };
  }

  context.drawImage(sourceCanvas, 0, 0, QUALITY_SAMPLE_SIZE, QUALITY_SAMPLE_SIZE);

  const { data } = context.getImageData(0, 0, QUALITY_SAMPLE_SIZE, QUALITY_SAMPLE_SIZE);
  const gray = new Float32Array(QUALITY_SAMPLE_SIZE * QUALITY_SAMPLE_SIZE);
  let brightnessSum = 0;
  let brightnessSquareSum = 0;
  let leafLikePixels = 0;

  for (let i = 0, pixel = 0; i < data.length; i += 4, pixel += 1) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    gray[pixel] = luminance;
    brightnessSum += luminance;
    brightnessSquareSum += luminance * luminance;

    const looksGreen = g > 45 && g > r * 1.05 && g > b * 1.05;
    const looksYellowBrown = r > 55 && g > 45 && b < 130 && g > b * 1.1 && Math.abs(r - g) < 95;

    if (looksGreen || looksYellowBrown) {
      leafLikePixels += 1;
    }
  }

  const pixelCount = QUALITY_SAMPLE_SIZE * QUALITY_SAMPLE_SIZE;
  const brightness = brightnessSum / pixelCount;
  const contrast = Math.sqrt(Math.max(brightnessSquareSum / pixelCount - brightness * brightness, 0));
  const leafRatio = leafLikePixels / pixelCount;
  let laplacianEnergy = 0;
  let edgeSamples = 0;

  for (let y = 1; y < QUALITY_SAMPLE_SIZE - 1; y += 1) {
    for (let x = 1; x < QUALITY_SAMPLE_SIZE - 1; x += 1) {
      const index = y * QUALITY_SAMPLE_SIZE + x;
      const laplacian =
        gray[index] * 4 -
        gray[index - 1] -
        gray[index + 1] -
        gray[index - QUALITY_SAMPLE_SIZE] -
        gray[index + QUALITY_SAMPLE_SIZE];

      laplacianEnergy += laplacian * laplacian;
      edgeSamples += 1;
    }
  }

  const sharpness = laplacianEnergy / edgeSamples;
  const issues = [];

  if (brightness < 35) {
    issues.push("Foto terlihat terlalu gelap. Ambil ulang dengan cahaya lebih cukup.");
  }

  if (brightness > 230) {
    issues.push("Foto terlihat terlalu terang. Hindari pantulan cahaya langsung pada daun.");
  }

  if (contrast < 10) {
    issues.push("Kontras foto terlalu rendah. Dekatkan kamera ke daun dan kurangi latar belakang.");
  }

  if (sharpness < 18) {
    issues.push("Foto tampak buram. Pastikan kamera fokus sebelum menekan tombol scan.");
  }

  if (leafRatio < MIN_LEAF_RATIO) {
    issues.push("Daun padi kurang dominan di area crop. Perbesar area daun yang ingin dianalisis.");
  }

  return {
    passed: issues.length === 0,
    issues,
    metrics: {
      brightness: Number(brightness.toFixed(2)),
      contrast: Number(contrast.toFixed(2)),
      sharpness: Number(sharpness.toFixed(2)),
      leafRatio: Number(leafRatio.toFixed(4)),
    },
  };
}

export async function predictPaddyDisease(sourceCanvas, options = {}) {
  if (!sourceCanvas || sourceCanvas.width === 0 || sourceCanvas.height === 0) {
    throw new Error("Gambar tidak valid untuk diproses model AI.");
  }

  const { onStage } = options;

  onStage?.("Memuat model AI...");
  const tf = await getTensorFlow();
  const model = await loadPaddyDiseaseModel(onStage);

  onStage?.("Menyiapkan crop 150x150 RGB...");
  const inputTensor = createInputTensor(tf, sourceCanvas);
  let rawOutput;
  let outputTensor;

  try {
    if (inputTensor.shape.join(",") !== MODEL_PREPROCESSING.inputShape.join(",")) {
      throw new Error("Shape input model tidak sesuai dengan training notebook.");
    }

    onStage?.("Mencocokkan pola daun dengan 10 kelas...");
    rawOutput = model.predict(inputTensor);
    outputTensor = Array.isArray(rawOutput) ? rawOutput[0] : rawOutput;

    const scores = await outputTensor.data();
    const predictions = formatPredictions(scores);
    const [bestPrediction] = predictions;

    return {
      label: bestPrediction.label,
      confidence: bestPrediction.confidence,
      topPredictions: predictions.slice(0, 3),
    };
  } finally {
    inputTensor.dispose();

    if (Array.isArray(rawOutput)) {
      rawOutput.forEach((tensor) => tensor.dispose());
    } else if (rawOutput) {
      rawOutput.dispose();
    }
  }
}
