# Disaster Classification - AI/ML

AI component for the DER-01 Citizen-Reported Disaster Damage Mapping system.

## Hazard Classification

The model classifies submitted images into:

- Fire
- Flood
- Structural Damage

Model:
- EfficientNet-B0
- Input size: 224x224
- Hazard test accuracy: 98.67%

## Severity Estimation

The system also estimates disaster severity:

- Low
- Moderate
- High

Severity test accuracy: 72.41%.

Severity estimation is a prototype-level prediction and is less reliable than the hazard classification.

## API

The ML service exposes:

POST `/predict`

Input:

- `image` - image file using multipart/form-data

Example response:

```json
{
  "success": true,
  "hazard": "Fire",
  "confidence": 0.9812,
  "severity": "High",
  "severity_confidence": 0.7431
}
