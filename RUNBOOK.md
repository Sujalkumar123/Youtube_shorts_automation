# Untold Stories studio: the daily run

Each scheduled run makes ONE new Hindi mythology Short for the YouTube channel **Untold Stories** and follows this file
top to bottom. Work in `~/work/<slug>/`. The look is "cinematic cut paper" (see `examples/ganga`). The channel watermark
is drawn by `engine/src/main.js` (`drawBrand`), on every frame.

## 0. Setup (fresh workspace, every run)
- The repo is cloned at `~/untold-stories-studio`. The skill's scripts are in `engine/skill-scripts/`.
- `bash engine/skill-scripts/setup.sh` until the Python env + Kokoro voice are OK (Whisper may fail: that is fine, the
  word timing falls back to the exact line times). Chrome, ffmpeg and Node 22 must be present.
- Read `logs/topics.json` (every topic already made, with its palette and scene types) and `logs/notes.md` (lessons).

## 1. Pick today's topic (trending, untold, not repeated)
Search the web (several searches, India-focused, current week):
- Hindu festivals and auspicious days in the next 7 days (Panchang / drikpanchang), and what's being searched for them.
- Trending Indian-mythology topics on YouTube Shorts / Google Trends India this week (devotional, Mahabharata,
  Ramayana, Shiva, Krishna, Hanuman, Devi, temples, Puranic stories).
Pick ONE story that is (a) tied to something trending or a festival this week, (b) a lesser-known "untold" angle, not a
topic or story already in `logs/topics.json`, (c) documented in reliable sources: Valmiki Ramayana, Mahabharata,
Puranas (wisdomlib.org, sacred-texts.com), Britannica, temple/government sites. Keep the sources.
Never mock or distort a deity; no violence shown (tell it with light, objects, consequences); no caste or political angle.

## 2. Script (`script.json`, copy the shape of `examples/ganga/script.json`)
- Hindi, conversational, like telling a friend. Hook question → escalation → surprise → twist → loop-back last line.
- 20-26 lines, ~45-55 s at voice speed 1.1. One line = one CUT (1.5-3.5 s). Sentences end in "." "?" (not "।").
- Last 2 lines always: "ऐसी ही अनकही कहानियों के लिए," / "फ़ॉलो करें, अनटोल्ड स्टोरीज़." with caps "ऐसी ही *अनकही कहानियाँ" / "फ़ॉलो करें | *Untold Stories".
- Captions: 2-4 words, exactly one `*`red word each. Numbers written as said.
- `voice`: "hm_omega", `speed`: 1.1, `music`: "devotional", `music_db`: -23, and the deeper-voice setting the user chose:
  `"voice_fx": "rubberband=pitch=0.89:formant=shifted,bass=g=3:f=130,equalizer=f=3500:t=q:w=1:g=1.5"`. List `sources`.

## 3. Visuals (original every time: this is what keeps the channel monetizable)
- `bash` copy `engine/` to `~/work/<slug>/`, replace `src/shots.js` with today's shots (one per line).
- Build on `src/atmos.js` (skies, stars, glow, god rays, mist, ranges, clouds, water, diyas, skyline, palms) and
  `src/cast.js` (raja, warrior, kapila (sage), shiva, horse). Add NEW characters/scenes the story needs to `cast.js`
  / `atmos.js` (e.g. vishnu, krishna, hanuman, devi, ganesha, rishi, asura-silhouette, temple interior, forest,
  battlefield-without-violence, ocean, cosmos) and COPY them back into `engine/src/` so the library grows.
- Vary the look from the last 3 entries in `logs/topics.json`: palette (dusk/night/dawn/forest/fire/ocean/cosmic),
  scene types, camera moves. Never re-use a whole shot list.
- Faces: closed-eye serene for deities; limbs use `limb()` with angles 0 = down, + = toward +x (outward on the right).

## 4. Build + QA (from the faceless-shorts skill, section 3-4)
```
cd ~/work/<slug>
~/.faceless-shorts/venv/bin/python tools/voice.py .
~/.faceless-shorts/venv/bin/python tools/words.py .
node tools/capture.mjs check && node tools/capture.mjs cues && ~/.faceless-shorts/venv/bin/python tools/mix.py .
node tools/capture.mjs sheet review/all.jpg 0.5 10      # READ the whole sheet, then key frames full size
```
QA every frame: makes sense, matches the narration, no collisions with the caption strip (y 1570-1710) or the
watermark (top-left 44-480 × 74-136), one red word, readable Hindi, arms not crossing faces. Fix and re-check.
Then `node tools/capture.mjs video renders/<slug>.mp4` and a share copy under 35 MB:
`ffmpeg -i renders/<slug>.mp4 -vf hqdn3d=2:2:4:4 -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart renders/<slug>-yt.mp4`
Cover: the strongest frame (`capture.mjs frames`).

## 5. Metadata
- Title: Hindi hook + short English, under 70 chars, e.g. `गंगा धरती पर कैसे आईं? | The Untold Story of Bhagirath`.
- Description: 2-3 Hindi lines + 1 English line, then "Sources:" (the texts), then 5-8 hashtags drawn from this
  week's trend research (mix: 2 broad #IndianMythology #HinduMythology, 3-4 story-specific, 1-2 trending/festival),
  ending with `#shorts`.

## 6. Publish: private preview ~30 min before, public at the slot (no approval needed)
Slots (IST): 08:00, 15:00, 20:00 (`logs/settings.json`). The run starts 75 min early.
1. **Private upload as soon as the video is ready (target: 30 min before the slot).** GitHub releases are blocked in
   these sessions, so: in a clone of Sujalkumar123/Youtube_shorts_automation, `git fetch --depth 1 origin media`,
   check out branch `media`, copy the `-yt.mp4` to `media/<slug>.mp4`, commit and push. The file URL is
   https://raw.githubusercontent.com/Sujalkumar123/youtube_shorts_automation/media/media/<slug>.mp4
   — verify it (`curl -sSIL` → 200 and the right content-length),
   then Zapier YouTube "Upload Video" (`youtube_upload_video`) with `privacy_status` "private", category 27,
   made_for_kids false, notify_subscribers true, default_language/default_audio_language "hi", title (end it with #shorts)/description/tags.
   Afterwards `git rm` the mp4 from the media branch, commit and push (branch deletion is blocked; removing the file is enough).
2. **Preview alert.** Zapier Telegram "Send Message" to `telegram_chat`:
   "🔒 Untold Stories preview (private): <title>\n<topic>\nGoes PUBLIC at <slot> IST. Reply STOP to this bot to keep it private."
   with a button "Watch preview" → https://www.youtube.com/watch?v=<id> (the user is signed in, so it plays for them).
3. **Wait until the slot time** (sleep in short intervals).
4. **Stop check.** Zapier Telegram "New Message" (`telegram_new_message`, chat `telegram_chat`): if the user sent
   "stop"/"STOP"/"रोको" after the preview alert, do NOT publish; send "⏸ Kept private: <title>" and log it.
   Also read the video (YouTube "Make API GET Request" on /youtube/v3/videos?part=status&id=<id>): if it is gone or the
   user already changed it, leave it alone.
5. **Go public.** YouTube "Make API Mutating Request" (`youtube_make_api_mutating_request`): PUT
   https://www.googleapis.com/youtube/v3/videos?part=status with body
   `{"id":"<id>","status":{"privacyStatus":"public","embeddable":true,"license":"youtube","publicStatsViewable":true,"selfDeclaredMadeForKids":false}}`
   and fail_on_errors true. Verify with a GET that privacyStatus is "public".
6. **Live alert.** Telegram: "✅ LIVE now: <title>" with button "Watch on YouTube".
- If any step fails, send "⚠️ Untold Stories <slot> failed at <step>: <reason>" to Telegram and log it.
- If Zapier is not available in the session: send the MP4 + cover + metadata to the user in the session instead.
## 7. Log (always, even if something failed)
Append to `logs/topics.json`: date, slot, slug, topic, story, palette, scene types, new kit pieces, title, hashtags,
youtube id/status, and problems. Add lessons to `logs/notes.md`. Commit + push to the studio repo (never the video).
