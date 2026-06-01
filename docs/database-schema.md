# Database schema

Recommended Prisma entities: `User`, `Account`, `AnimalProfile`, `Species`, `SearchCase`, `QuestionnaireResponse`, `Prediction`, `SearchZone`, `SearchObservation`, `Sighting`, `Flyer`, and `RecoveryReport`.

`AnimalProfile.speciesId` and versioned `Prediction.modelKey` values keep behavior rules extensible. Store latitude and longitude only where needed, and maintain a separate anonymized analytics pipeline.
