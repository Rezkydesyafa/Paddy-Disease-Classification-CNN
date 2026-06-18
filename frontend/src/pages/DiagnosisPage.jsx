import { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { getDiseaseDetails } from "../data/diseaseDatabase";
import {
  MODEL_PREPROCESSING,
  predictPaddyDisease,
  validateImageQuality,
} from "../services/paddyDiseaseModel";
import "./DiagnosisPage.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const CONFIDENCE_THRESHOLD = 0.6;
const HISTORY_KEY = "padi-ai-diagnosis-history";
const HISTORY_LIMIT = 8;
const LOADING_STEPS = [
  "Memuat TensorFlow.js dan model AI...",
  "Memuat model AI...",
  "Menyiapkan crop 150x150 RGB...",
  "Mencocokkan pola daun dengan 10 kelas...",
];

const PHOTO_GUIDE_ITEMS = [
  { icon: "ph-fill ph-leaf", title: "Daun dekat", description: "Foto daun yang dicurigai, jangan terlalu jauh dari kamera." },
  { icon: "ph-fill ph-target", title: "Fokus tajam", description: "Pastikan bercak atau gejala tidak blur sebelum discan." },
  { icon: "ph-fill ph-sun", title: "Cahaya cukup", description: "Gunakan cahaya alami, hindari foto terlalu gelap atau silau." },
  { icon: "ph-fill ph-crop", title: "Crop rapi", description: "Kurangi background sawah agar daun lebih dominan." },
];

const LOW_CONFIDENCE_DETAILS = {
  displayName: "Hasil belum cukup yakin",
  localName: "Coba unggah foto daun yang lebih jelas",
  scientificName: "Confidence AI di bawah 60%",
  category: "uncertain",
  categoryLabel: "Perlu Foto Ulang",
  riskLevel: { label: "Belum Yakin", className: "risk-unknown", icon: "ph-fill ph-question" },
  description:
    "AI belum cukup yakin untuk menentukan penyakit atau hama dari foto ini. Coba unggah ulang foto daun padi yang lebih dekat, fokus, pencahayaannya cukup, dan area crop berisi daun yang jelas.",
  quickActions: [
    { icon: "ph-fill ph-camera", title: "Foto ulang", description: "Ambil foto dari jarak dekat dengan daun memenuhi sebagian besar frame." },
    { icon: "ph-fill ph-target", title: "Perbaiki fokus", description: "Ketuk area daun di kamera agar bercak atau gejala terlihat tajam." },
    { icon: "ph-fill ph-crop", title: "Crop area gejala", description: "Saat crop, pilih area daun yang paling jelas menunjukkan gejala." },
  ],
  sevenDayCare: [
    { icon: "ph-fill ph-eyes", title: "Pantau ulang", description: "Amati apakah gejala bertambah luas dalam 2 sampai 3 hari." },
    { icon: "ph-fill ph-notebook", title: "Catat kondisi", description: "Simpan tanggal, lokasi petakan, umur tanaman, dan cuaca terakhir." },
  ],
  prevention: [
    { icon: "ph-fill ph-seedling", title: "Perawatan rutin", description: "Jaga pemupukan berimbang, sanitasi lahan, dan tata air sesuai fase tanaman." },
    { icon: "ph-fill ph-users-three", title: "Validasi lapangan", description: "Konsultasikan dengan PPL atau petugas lapang jika gejala meluas." },
  ],
  notes:
    "Hasil rendah confidence tidak boleh dijadikan dasar aplikasi pestisida. Gunakan foto yang lebih baik atau validasi langsung di lahan.",
  fieldDisclaimer:
    "Hasil AI adalah pendukung keputusan. Validasi kondisi lapangan tetap disarankan sebelum mengambil tindakan pengendalian.",
  referenceImages: [],
};

function formatConfidence(confidence) {
  return `${(confidence * 100).toFixed(1)}%`;
}

function formatHistoryDate(value) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function readDiagnosisHistory() {
  try {
    const savedHistory = window.localStorage.getItem(HISTORY_KEY);
    const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];

    return Array.isArray(parsedHistory) ? parsedHistory : [];
  } catch {
    return [];
  }
}

function saveDiagnosisHistory(entry) {
  try {
    const currentHistory = readDiagnosisHistory();
    const nextHistory = [
      entry,
      ...currentHistory.filter((item) => item.id !== entry.id),
    ].slice(0, HISTORY_LIMIT);

    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    return nextHistory;
  } catch {
    return readDiagnosisHistory();
  }
}

function createThumbnailDataUrl(sourceCanvas) {
  const canvas = document.createElement("canvas");
  const maxSize = 260;
  const ratio = Math.min(maxSize / sourceCanvas.width, maxSize / sourceCanvas.height, 1);

  canvas.width = Math.max(1, Math.round(sourceCanvas.width * ratio));
  canvas.height = Math.max(1, Math.round(sourceCanvas.height * ratio));

  const context = canvas.getContext("2d");

  if (!context) {
    return "";
  }

  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

function createHistoryEntry({ prediction, details, imageSrc, isLowConfidence }) {
  return {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${prediction.label}`,
    createdAt: new Date().toISOString(),
    label: prediction.label,
    displayName: isLowConfidence ? LOW_CONFIDENCE_DETAILS.displayName : details.displayName,
    categoryLabel: isLowConfidence ? LOW_CONFIDENCE_DETAILS.categoryLabel : details.categoryLabel,
    confidence: prediction.confidence,
    imageSrc,
  };
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines = 999) {
  const words = String(text).split(/\s+/);
  let line = "";
  let lineCount = 0;

  for (let index = 0; index < words.length; index += 1) {
    const testLine = line ? `${line} ${words[index]}` : words[index];
    const width = context.measureText(testLine).width;

    if (width > maxWidth && line) {
      context.fillText(line, x, y);
      line = words[index];
      y += lineHeight;
      lineCount += 1;

      if (lineCount >= maxLines) {
        return y;
      }
    } else {
      line = testLine;
    }
  }

  if (line && lineCount < maxLines) {
    context.fillText(line, x, y);
    y += lineHeight;
  }

  return y;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Gambar hasil diagnosis gagal dimuat untuk export."));
    image.src = src;
  });
}

async function exportDiagnosisImage({ resultSrc, prediction, details, rawDetails, isLowConfidence }) {
  const scanImage = await loadImage(resultSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Browser tidak dapat membuat gambar laporan.");
  }

  canvas.width = 1200;
  canvas.height = 1500;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#0a6b50";
  context.font = "700 44px 'Plus Jakarta Sans', Arial, sans-serif";
  context.fillText("Padi AI - Hasil Diagnosis", 80, 90);

  context.fillStyle = "#718096";
  context.font = "24px 'Plus Jakarta Sans', Arial, sans-serif";
  context.fillText(formatHistoryDate(new Date().toISOString()), 80, 130);

  context.fillStyle = "#f0f5f3";
  context.roundRect(80, 180, 420, 320, 24);
  context.fill();
  context.save();
  context.beginPath();
  context.roundRect(80, 180, 420, 320, 24);
  context.clip();
  context.drawImage(scanImage, 80, 180, 420, 320);
  context.restore();

  context.fillStyle = "#1a202c";
  context.font = "700 42px 'Plus Jakarta Sans', Arial, sans-serif";
  drawWrappedText(context, details.displayName, 550, 220, 560, 52, 2);

  context.fillStyle = "#0a6b50";
  context.font = "700 26px 'Plus Jakarta Sans', Arial, sans-serif";
  context.fillText(`${formatConfidence(prediction.confidence)} confidence AI`, 550, 340);

  context.fillStyle = "#718096";
  context.font = "24px 'Plus Jakarta Sans', Arial, sans-serif";
  context.fillText(isLowConfidence ? details.categoryLabel : `${rawDetails.categoryLabel} - ${rawDetails.localName}`, 550, 385);

  context.fillStyle = "#1a202c";
  context.font = "28px 'Plus Jakarta Sans', Arial, sans-serif";
  let y = drawWrappedText(context, details.description, 80, 580, 1040, 38, 5);

  y += 34;
  context.fillStyle = "#0a6b50";
  context.font = "700 30px 'Plus Jakarta Sans', Arial, sans-serif";
  context.fillText("Tindakan cepat", 80, y);
  y += 44;

  context.fillStyle = "#1a202c";
  context.font = "24px 'Plus Jakarta Sans', Arial, sans-serif";
  details.quickActions.slice(0, 3).forEach((item, index) => {
    context.fillText(`${index + 1}. ${item.title}`, 80, y);
    y = drawWrappedText(context, item.description, 120, y + 34, 980, 34, 2) + 18;
  });

  y += 16;
  context.fillStyle = "#d97706";
  context.font = "700 26px 'Plus Jakarta Sans', Arial, sans-serif";
  context.fillText("Disclaimer agronomi", 80, y);
  y += 38;
  context.fillStyle = "#4a5568";
  context.font = "22px 'Plus Jakarta Sans', Arial, sans-serif";
  drawWrappedText(context, details.fieldDisclaimer, 80, y, 1040, 32, 4);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

  if (!blob) {
    throw new Error("Laporan gagal dibuat.");
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `padi-ai-diagnosis-${Date.now()}.png`;
  link.click();
  URL.revokeObjectURL(url);
}

function createCanvasFromImageSource(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Browser tidak dapat memproses gambar."));
        return;
      }

      context.drawImage(image, 0, 0);
      resolve(canvas);
    };
    image.onerror = () => {
      reject(new Error("Gambar gagal dimuat untuk analisis."));
    };
    image.src = src;
  });
}

async function getAnalysisCanvas(cropper, previewSrc) {
  if (cropper) {
    const canvas = cropper.getCroppedCanvas({
      maxWidth: 1024,
      maxHeight: 1024,
      fillColor: "#ffffff",
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (canvas && canvas.width > 0 && canvas.height > 0) {
      return canvas;
    }
  }

  if (!previewSrc) {
    throw new Error("Tidak ada gambar untuk dianalisis.");
  }

  return createCanvasFromImageSource(previewSrc);
}

function RecommendationList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={`${item.title}-${item.description}`}>
          <i className={item.icon}></i>
          <div>
            <strong>{item.title}:</strong> {item.description}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function DiagnosisPage() {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState("upload");
  const [error, setError] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [resultSrc, setResultSrc] = useState("");
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [activeTab, setActiveTab] = useState("tab-cepat");
  const [loadingStep, setLoadingStep] = useState(LOADING_STEPS[0]);
  const [qualityReport, setQualityReport] = useState(null);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);
  const previewImageRef = useRef(null);
  const cropperRef = useRef(null);

  const rawDiseaseDetails = diagnosisResult ? getDiseaseDetails(diagnosisResult.label) : null;
  const isLowConfidence = diagnosisResult
    ? diagnosisResult.confidence < CONFIDENCE_THRESHOLD
    : false;
  const diseaseDetails = diagnosisResult
    ? (isLowConfidence ? LOW_CONFIDENCE_DETAILS : rawDiseaseDetails)
    : null;

  useEffect(() => {
    setHistory(readDiagnosisHistory());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (view !== "preview" || !previewSrc || !previewImageRef.current) {
      return;
    }

    if (cropperRef.current) {
      cropperRef.current.destroy();
    }

    cropperRef.current = new Cropper(previewImageRef.current, {
      viewMode: 2,
      dragMode: "move",
      aspectRatio: NaN,
      autoCropArea: 0.8,
      restore: false,
      guides: true,
      center: true,
      highlight: false,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
      responsive: true,
      background: false,
      ready() {
        const cropper = cropperRef.current;
        const imageViewport = previewImageRef.current?.closest(".image-viewport");

        if (!cropper || !imageViewport) {
          return;
        }

        const viewportRect = imageViewport.getBoundingClientRect();
        const imageData = cropper.getImageData();
        const scale = Math.min(
          viewportRect.width / imageData.naturalWidth,
          viewportRect.height / imageData.naturalHeight,
        );
        const width = imageData.naturalWidth * scale;
        const height = imageData.naturalHeight * scale;
        const left = (viewportRect.width - width) / 2;
        const top = (viewportRect.height - height) / 2;

        cropper.setCanvasData({ left, top, width, height });
        cropper.setCropBoxData({
          left: left + width * 0.1,
          top: top + height * 0.1,
          width: width * 0.8,
          height: height * 0.8,
        });
      },
    });

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [previewSrc, view]);

  useEffect(() => {
    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
    };
  }, []);

  const showView = (nextView) => {
    setView(nextView);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showError = (message) => {
    setError(message);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (event) => {
    const [file] = event.target.files;

    if (!file) {
      return;
    }

    if (!VALID_TYPES.includes(file.type)) {
      showError("Format file tidak valid. Harap gunakan format .JPG atau .PNG");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showError("Ukuran gambar melebihi 5 MB. Harap kompres gambar Anda.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewSrc(String(reader.result));
      setDiagnosisResult(null);
      setQualityReport(null);
      setLoadingStep(LOADING_STEPS[0]);
      showView("preview");
    };

    reader.readAsDataURL(file);
  };

  const startAnalysis = async () => {
    setDiagnosisResult(null);
    setActiveTab("tab-cepat");
    setQualityReport(null);
    setLoadingStep(LOADING_STEPS[0]);

    let analysisCanvas;

    try {
      analysisCanvas = await getAnalysisCanvas(cropperRef.current, previewSrc);
    } catch {
      showError("Gambar belum bisa diproses. Silakan unggah ulang foto padi yang lebih jelas.");
      return;
    }

    const nextQualityReport = validateImageQuality(analysisCanvas);
    setQualityReport(nextQualityReport);

    if (!nextQualityReport.passed) {
      showError(`Kualitas foto belum cukup untuk AI: ${nextQualityReport.issues.join(" ")}`);
      return;
    }

    const resultDataUrl = analysisCanvas.toDataURL("image/jpeg", 0.92);
    setResultSrc(resultDataUrl);
    showView("loading");

    try {
      const prediction = await predictPaddyDisease(analysisCanvas, {
        onStage: setLoadingStep,
      });
      const predictionDetails = getDiseaseDetails(prediction.label);
      const predictionLowConfidence = prediction.confidence < CONFIDENCE_THRESHOLD;
      const historyEntry = createHistoryEntry({
        prediction,
        details: predictionDetails,
        imageSrc: createThumbnailDataUrl(analysisCanvas),
        isLowConfidence: predictionLowConfidence,
      });

      setDiagnosisResult(prediction);
      setHistory(saveDiagnosisHistory(historyEntry));
      showView("result");
    } catch (predictionError) {
      console.error(predictionError);
      setDiagnosisResult(null);
      setView("preview");
      showError("Model AI gagal memproses gambar. Pastikan file model tersedia lalu coba scan ulang.");
    }
  };

  const resetWorkspace = () => {
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviewSrc("");
    setResultSrc("");
    setDiagnosisResult(null);
    setActiveTab("tab-cepat");
    setQualityReport(null);
    setLoadingStep(LOADING_STEPS[0]);
    showView("upload");
  };

  const saveResult = () => {
    window.alert("Hasil diagnosis sudah tersimpan di riwayat perangkat ini.");
  };

  const exportResult = async () => {
    if (!diagnosisResult || !diseaseDetails || !rawDiseaseDetails || !resultSrc) {
      return;
    }

    try {
      await exportDiagnosisImage({
        resultSrc,
        prediction: diagnosisResult,
        details: diseaseDetails,
        rawDetails: rawDiseaseDetails,
        isLowConfidence,
      });
    } catch (exportError) {
      console.error(exportError);
      window.alert("Export gambar gagal dibuat. Silakan coba lagi.");
    }
  };

  return (
    <div className="diagnosis-page">
      <Header />

      <main className="main-content">
        <div id="error-message" className="msg-box" style={{ display: error ? "flex" : "none" }}>
          <i className="ph-fill ph-warning-circle" style={{ fontSize: "1.25rem" }}></i>
          <span id="error-text">{error || "Format file tidak didukung."}</span>
        </div>

        <div id="upload-view" className={`view-section ${view === "upload" ? "active" : ""}`}>
          <div className="page-title" id="main-title">
            <h1>Identify precisely. <br />Act immediately.</h1>
            <p>Sistem kami membandingkan pola bercak pada daun Anda dengan ribuan dataset penyakit padi. Pastikan daun terlihat jelas dan memiliki pencahayaan yang cukup untuk hasil optimal.</p>
          </div>

          <div className="upload-grid">
            <div className="upload-text">
              <div className="badge-small">CNN Technology</div>
              <ul style={{ listStyle: "none", color: "var(--text-gray)", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "8px", margin: "1rem 0 1.5rem 0" }}>
                <li><i className="ph ph-check-circle" style={{ color: "var(--primary-green)" }}></i> Mendukung JPG & PNG</li>
                <li><i className="ph ph-check-circle" style={{ color: "var(--primary-green)" }}></i> Maksimal ukuran file 5MB</li>
              </ul>

              <div className="photo-guide">
                {PHOTO_GUIDE_ITEMS.map((item) => (
                  <div className="photo-guide-item" key={item.title}>
                    <div className="guide-icon-wrapper">
                      <i className={item.icon}></i>
                    </div>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" id="file-input" accept="image/jpeg, image/png, image/jpg" hidden onChange={handleFileChange} />
              <div className="dropzone-icon"><i className="ph-fill ph-camera-plus"></i></div>
              <h3>Drag & Drop your photo here</h3>
              <p>or click to browse from your device</p>
              <button className="btn-outline" style={{ marginTop: "10px" }} type="button">Select File</button>
            </div>
          </div>
        </div>

        <div id="preview-view" className={`view-section ${view === "preview" ? "active" : ""}`}>
          <div className="preview-pane">
            <h2 style={{ marginBottom: "0.5rem" }}>Adjust the scanning area</h2>
            <p style={{ color: "var(--text-gray)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Tarik sudut kotak untuk memfokuskan pindaian pada area daun yang terinfeksi penyakit.</p>

            <div className="image-viewport">
              {previewSrc && (
                <img ref={previewImageRef} id="image-preview" src={previewSrc} alt="Preview" className="viewport-img" />
              )}
            </div>

            {qualityReport && !qualityReport.passed && (
              <div className="quality-warning">
                <i className="ph-fill ph-warning-circle"></i>
                <span>{qualityReport.issues[0]}</span>
              </div>
            )}

            <div className="crop-helper">
              <i className="ph-fill ph-info"></i>
              Crop area daun yang jelas. Input AI akan di-resize ke {MODEL_PREPROCESSING.resize}, warna RGB, dan normalisasi 0-1 sesuai notebook training.
            </div>

            <div className="action-buttons">
              <button className="btn-outline" onClick={resetWorkspace} type="button"><i className="ph ph-arrow-counter-clockwise"></i> Retake Photo</button>
              <button className="btn-primary" onClick={startAnalysis} type="button">
                Scan Area <span className="arrow-circle"><i className="ph ph-arrow-right"></i></span>
              </button>
            </div>
          </div>
        </div>

        <div id="loading-view" className={`view-section ${view === "loading" ? "active" : ""}`}>
          <div className="preview-pane" style={{ padding: "4rem 0" }}>
            <div className="spinner"></div>
            <h2 style={{ marginBottom: "0.5rem", color: "var(--primary-green)" }}>Analyzing with AI model...</h2>
            <p style={{ color: "var(--text-gray)" }}>{loadingStep}</p>
            <div className="loading-steps">
              {LOADING_STEPS.map((step) => (
                <span className={loadingStep === step ? "active" : ""} key={step}>
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div id="result-view" className={`view-section ${view === "result" ? "active" : ""}`}>
          {diagnosisResult && diseaseDetails && (
            <>
              <div className="result-actions-bar">
                <button className="btn-outline" onClick={resetWorkspace} type="button"><i className="ph ph-arrow-left"></i> Back to Diagnosis</button>
                <div className="result-actions-group">
                  <button className="btn-save" onClick={saveResult} type="button">
                    <i className="ph-fill ph-bookmark-simple"></i> Simpan ke Riwayat
                  </button>
                  <button className="btn-save" onClick={exportResult} type="button">
                    <i className="ph-fill ph-download-simple"></i> Export PNG
                  </button>
                </div>
              </div>

              <div className="result-grid">
                <div className="result-sidebar">
                  <img id="image-result" src={resultSrc} alt="Result Scan" />

                  <h3 className="section-header-small"><i className="ph-fill ph-chart-bar"></i> Top 3 AI Prediction</h3>
                  <div className="prediction-list">
                    {diagnosisResult.topPredictions.map((prediction) => {
                      const predictionDetails = getDiseaseDetails(prediction.label);

                      return (
                        <div className="prediction-chip" key={prediction.label}>
                          <div className="prediction-chip-header">
                            <span>
                              <small>{predictionDetails.categoryLabel}</small>
                              {predictionDetails.displayName}
                            </span>
                            <strong>{formatConfidence(prediction.confidence)}</strong>
                          </div>
                          <div className="prediction-progress-bar">
                            <div className="prediction-progress-fill" style={{ width: `${prediction.confidence * 100}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!isLowConfidence && diseaseDetails.referenceImages.length > 0 && (
                    <>
                      <h3 className="section-header-small"><i className="ph-fill ph-images"></i> Similar Reference</h3>
                      <div className="gallery-row">
                        {diseaseDetails.referenceImages.map((imageUrl, index) => (
                          <img src={imageUrl} className="gallery-thumb" alt={`${diseaseDetails.displayName} ref ${index + 1}`} key={imageUrl} />
                        ))}
                      </div>
                    </>
                  )}

                  <h3 className="section-header-small history-title"><i className="ph-fill ph-clock-counter-clockwise"></i> Riwayat Diagnosis</h3>
                  <div className="history-list">
                    {history.length === 0 && (
                      <div className="history-empty">Belum ada riwayat diagnosis.</div>
                    )}
                    {history.slice(0, 3).map((item) => (
                      <div className="history-item" key={item.id}>
                        {item.imageSrc && <img src={item.imageSrc} alt={item.displayName} />}
                        <div>
                          <strong>{item.displayName}</strong>
                          <span>{item.categoryLabel} - {formatConfidence(item.confidence)}</span>
                          <small>{formatHistoryDate(item.createdAt)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="disease-header">
                    <h2>
                      {diseaseDetails.displayName}
                      <span className={`badge-risk ${diseaseDetails.riskLevel.className}`}>
                        <i className={diseaseDetails.riskLevel.icon}></i> {diseaseDetails.riskLevel.label}
                      </span>
                      <span className={`category-pill ${diseaseDetails.category}`}>
                        {diseaseDetails.categoryLabel}
                      </span>
                    </h2>
                    <p style={{ color: "var(--text-gray)", fontSize: "1.1rem", marginBottom: "10px" }}>
                      {diseaseDetails.localName} ({diseaseDetails.scientificName})
                    </p>

                    <div className={`accuracy-pill ${isLowConfidence ? "low-confidence" : ""}`}>
                      <i className="ph-fill ph-shield-check"></i> {formatConfidence(diagnosisResult.confidence)} Kepercayaan AI
                    </div>
                  </div>

                  {isLowConfidence && (
                    <div className="uncertain-panel">
                      <i className="ph-fill ph-warning-circle"></i>
                      <div>
                        <strong>Hasil belum cukup yakin.</strong>
                        <span>Prediksi terdekat AI adalah {rawDiseaseDetails.displayName}, tetapi confidence masih di bawah 60%.</span>
                      </div>
                    </div>
                  )}

                  <div className="info-panel">
                    {diseaseDetails.description}
                    <br />
                    {!isLowConfidence && <a href={`#/encyclopedia/${diagnosisResult.label}`} className="text-link">Lihat detail {diseaseDetails.categoryLabel.toLowerCase()}</a>}
                  </div>

                  <h3 className="section-header-small"><i className="ph-fill ph-first-aid-kit"></i> Rekomendasi Perawatan</h3>

                  <div className="tabs-container">
                    <div className="segmented-control">
                      <button className={`tab-btn ${activeTab === "tab-cepat" ? "active" : ""}`} onClick={() => setActiveTab("tab-cepat")} type="button">Tindakan Cepat</button>
                      <button className={`tab-btn ${activeTab === "tab-7hari" ? "active" : ""}`} onClick={() => setActiveTab("tab-7hari")} type="button">Perawatan 7 Hari</button>
                      <button className={`tab-btn ${activeTab === "tab-cegah" ? "active" : ""}`} onClick={() => setActiveTab("tab-cegah")} type="button">Pencegahan Musim Depan</button>
                      <button className={`tab-btn ${activeTab === "tab-catatan" ? "active" : ""}`} onClick={() => setActiveTab("tab-catatan")} type="button">Catatan</button>
                    </div>

                    <div className="tab-content">
                      <div id="tab-cepat" className={`tab-panel ${activeTab === "tab-cepat" ? "active" : ""}`}>
                        <RecommendationList items={diseaseDetails.quickActions} />
                      </div>

                      <div id="tab-7hari" className={`tab-panel ${activeTab === "tab-7hari" ? "active" : ""}`}>
                        <RecommendationList items={diseaseDetails.sevenDayCare} />
                      </div>

                      <div id="tab-cegah" className={`tab-panel ${activeTab === "tab-cegah" ? "active" : ""}`}>
                        <RecommendationList items={diseaseDetails.prevention} />
                      </div>

                      <div id="tab-catatan" className={`tab-panel ${activeTab === "tab-catatan" ? "active" : ""}`}>
                        <div className="care-note">
                          <strong>Catatan lapangan:</strong> {diseaseDetails.notes}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="disclaimer-panel">
                    <i className="ph-fill ph-shield-warning"></i>
                    <div>
                      <strong>Disclaimer agronomi:</strong>
                      <span>{diseaseDetails.fieldDisclaimer}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
