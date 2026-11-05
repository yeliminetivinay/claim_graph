from __future__ import annotations

from unittest.mock import AsyncMock, patch

from workers.tasks import _ingest_papers_sync


def test_ingest_papers_sync_parses_at_most_one_pdf():
    papers = [
        {
            "doi": f"10.1234/paper-{index}",
            "title": f"Paper {index}",
            "pdf_url": f"https://example.org/{index}.pdf",
        }
        for index in range(3)
    ]

    with (
        patch("workers.tasks._download_pdf", return_value=b"%PDF"),
        patch("app.services.store.ingest_paper", new_callable=AsyncMock) as ingest_paper,
        patch("app.services.store.save_to_mongo", new_callable=AsyncMock) as save_to_mongo,
    ):
        paper_ids = _ingest_papers_sync(papers, "topic-id")

    assert len(paper_ids) == 3
    assert ingest_paper.await_count == 1
    assert save_to_mongo.await_count == 2
