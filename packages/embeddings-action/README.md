# Embeddings Action ⚠️ EXPERIMENTAL ⚠️

This project is purely experimental. It is a GitHub Action that generates embeddings and stores them in Pinccone for documentation. This can later be used to semantically search the docs to see if content should be updated for a new set of changes.

This project needs a lot more work. Next steps would be:

- [ ] Chunk documents into smaller pieces
- [ ] Store chunks with line numbers + filenames
- [ ] Move Pinecone inserts and similarity seach to API

## Usage

1. Uncomment `.github/workflows/test.yml`
2. Run locally using Act:

```bash
act --container-architecture linux/amd64 --secret-file .env.act
```
