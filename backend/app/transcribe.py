import glob
import json
import os
import sys
import tempfile
import time
import subprocess
import numpy as np

import yt_dlp
from faster_whisper import WhisperModel

_model = None


def _get_model():
    global _model
    if _model is None:
        _model = WhisperModel(
            os.getenv("WHISPER_MODEL", "small"),
            device="cpu",
            compute_type="int8",
        )
    return _model


def _fetch_info_and_captions(url, workdir):
    opts = {
        "skip_download": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["en.*"],
        "subtitlesformat": "json3",
        "outtmpl": f"{workdir}/%(id)s.%(ext)s",
        "quiet": True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        return ydl.extract_info(url, download=True)


def _captions_text(workdir):
    files = glob.glob(f"{workdir}/*.json3")
    if not files:
        return None
    with open(files[0]) as f:
        data = json.load(f)
    parts = []
    for event in data.get("events", []):
        for seg in event.get("segs") or []:
            text = seg.get("utf8", "").strip()
            if text:
                parts.append(text)
    return " ".join(parts) or None


def _whisper_text(url, workdir):
    opts = {
        "format": "bestaudio/best",
        "outtmpl": f"{workdir}/audio.%(ext)s",
        "quiet": True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])
    audio_file = glob.glob(f"{workdir}/audio.*")[0]

    # Decode to 16kHz mono float32 with ffmpeg (bypasses PyAV)
    raw = subprocess.run(
        ["ffmpeg", "-nostdin", "-i", audio_file,
         "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
        capture_output=True, check=True,
    ).stdout
    audio = np.frombuffer(raw, dtype=np.float32)

    segments, _ = _get_model().transcribe(audio, vad_filter=True)
    return " ".join(s.text.strip() for s in segments)


def get_transcript(url, force_whisper=False):
    with tempfile.TemporaryDirectory() as workdir:
        info = _fetch_info_and_captions(url, workdir)
        text = None if force_whisper else _captions_text(workdir)
        source = "captions"
        if not text:
            text = _whisper_text(url, workdir)
            source = "whisper"
        return {
            "title": info.get("title"),
            "description": info.get("description") or "",
            "transcript": text,
            "source": source,
        }


if __name__ == "__main__":
    url = sys.argv[1]
    force = "--whisper" in sys.argv
    start = time.time()
    result = get_transcript(url, force)
    print(f"Title:   {result['title']}")
    print(f"Source:  {result['source']}")
    print(f"Time:    {time.time() - start:.1f}s")
    print(f"Length:  {len(result['transcript'])} chars")
    print("\n--- Transcript (first 800 chars) ---")
    print(result["transcript"][:800])