# Model training (not started)

Proposal §7.3. Python + TensorFlow/Keras, run on a GPU service (Colab, Kaggle, etc.).

Planned steps:
1. Prepare CCMT (cassava, maize) + iCassava (CBSD class only) + own Nigerian field images; labels from two pathologists (Cohen's kappa).
2. Fine-tune EfficientNet-Lite, MobileNetV2, ShuffleNet at 224x224 (Adam 1e-4, batch 32, <=50 epochs, early stop on val macro-F1, class-weighted loss).
3. Leave-one-site-out across the four LGAs; macro P/R/F1, per-class recall, confusion matrix, ROC-AUC, bootstrap CIs, McNemar.
4. Pick the winner, fit temperature on validation, choose the accept threshold (lowest value giving 90% precision).
5. Export int8-weight TFLite with float32 I/O; copy temperature + threshold into `src/ml/config.ts`.
6. Benchmark median/p95 latency (100 runs) and peak memory on the two test phones.
