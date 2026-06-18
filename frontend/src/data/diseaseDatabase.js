import diseaseDatabase from "./diseaseDatabase.json";

export { diseaseDatabase };

export function getDiseaseDetails(label) {
  return diseaseDatabase[label] ?? diseaseDatabase.normal;
}
