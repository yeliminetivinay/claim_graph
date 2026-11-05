"""
workers/celery_app.py
----------------------
Celery application factory for ClaimGraph.

Broker and result backend are both Redis, configured via env vars.
Import this from anywhere that needs the Celery app instance:

    from workers.celery_app import celery_app
"""

from __future__ import annotations

import os

from celery import Celery

_BROKER:  str = os.getenv("CELERY_BROKER_URL",  "redis://localhost:6379/0")
_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

celery_app = Celery(
    "claimgraph",
    broker=_BROKER,
    backend=_BACKEND,
    include=["workers.tasks"],
)

# Expose the app under the conventional names that Celery CLI and workers look
# for when the app is loaded from a module rather than via a function factory.
app = celery_app
celery = celery_app

celery_app.conf.update(
    # Serialisation
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],

    # Results
    result_expires=3600,        # keep results for 1 h
    result_extended=True,       # store task meta (name, args, …) in backend

    # Reliability
    task_acks_late=True,        # ack only after the task completes
    task_reject_on_worker_lost=True,   # re-queue if worker dies mid-task
    worker_pool="solo",         # local dev fallback: avoid prefork fast-trace crash
    task_track_started=True,    # expose STARTED so topic status polling sees active work
    broker_connection_retry_on_startup=True,

    # Retry defaults (can be overridden per task)
    task_default_retry_delay=5,  # seconds between retries
)

# Keep the safe lazy tracer path for this local environment so tasks execute
# without depending on the prefork fast-trace optimization.
celery_app.use_fast_trace_task = False
