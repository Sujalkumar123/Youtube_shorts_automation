# Untold Stories studio: the daily run

Each scheduled run makes ONE new Hindi mythology Short for the YouTube channel **Untold Stories** and follows this file
top to bottom. Work in `~/work/<slug>/`. The look is "cinematic cut paper" (see `examples/ganga`). The channel watermark
is drawn by `engine/src/main.js` (`drawBrand`), on every frame.

## 0. Setup (fresh workspace, every run)
- The repo is cloned at `~/untold-stories-studio`. The skill's scripts are in `engine/skill-scripts/`.
- `bash engine/skill-scripts/setup.sh` until the Python env + Kokoro voice are OK (Whisper may fail: that is fine, the
  word timing falls back to the exact line times). Chrome, ffmpeg and Node 22 must be present.
- Read `logs/topics.json` (every topic already made, with its palette and scene types) and `logs/notes.md` (lessons).

## 1. Pick today's topic from what is trending ON YOUTUBE (do this every run)
**Zapier budget: every Zapier call costs 2 tasks of the user's monthly plan. Use as few as possible.**
**a. YouTube trend scan (Zapier YouTube connector) ONLY in the morning run,** and only if `logs/trends.md` has no
scan from today. Afternoon/evening runs reuse today's scan (pick a different story/concept). Use at most 2 searches with `youtube_find_video`
(`order: viewCount`, `published_after`: 7 days ago, `region_code: IN`, `relevance_language: hi`, `video_duration: short`,
`max_results: 25`), queries such as (pick the 2 best for this week): "पौराणिक कथा shorts", "mahadev story shorts", "hanuman ji katha shorts",
"krishna leela rahasya shorts", "mahabharat unknown facts shorts", "ramayan rahasya shorts", plus this week's festival.
Then rank them by real numbers with one `youtube_make_api_get_request` GET /youtube/v3/videos
`part=statistics&id=<up to 50 ids>&fields=items(id,statistics(viewCount,likeCount,commentCount))` (1 quota unit).
Score = views ÷ days since publish. Write the top 10 (title, views, views/day, concept) to `logs/trends.md`
(newest scan on top, keep the last 7 days).
**b. Read the pattern, not the video.** Note which DEITIES, STORIES and HOOK STYLES are winning (e.g. "क्यों/रहस्य"
mystery questions about something familiar, a festival this week, a curse, a hidden origin, "X ने Y क्यों किया?").
**c. Choose.** Pick ONE story in a winning concept/deity/festival that is NOT in `logs/topics.json`, with our own
untold angle. Never copy another creator's script, title, structure or frames: same concept, our original story,
facts from the scriptures. Prefer what is rising this week (high views/day) and a festival in the next 7 days
(also search the web for this week's festivals/Panchang).
**d. Title in the winning style:** a Hindi mystery question/hook + short English, ending with #shorts,
e.g. `गोवर्धन पर्वत हर दिन धरती में क्यों समा रहा है? | The Curse of Govardhan #shorts`.
**e. Sources:** the story must be documented (Ramayana, Mahabharata, Puranas via wisdomlib.org/sacred-texts.com,
Britannica, temple/government sites). Keep the sources for the description.
Never mock or distort a deity; no violence shown; no caste or political angle.

## 2. Script (`script.json`, copy the shape of `examples/ganga/script.json`)
- Hindi, conversational, like telling a friend. Hook question → escalation → surprise → twist → loop-back last line.
- 20-26 lines, ~45-55 s at voice speed 1.1. One line = one CUT (1.5-3.5 s). Sentences end in "." "?" (not "।").
- Last 2 lines always: "ऐसी ही अनकही कहानियों के लिए," / "फ़ॉलो करें, अनटोल्ड स्टोरीज़." with caps "Aisi hi *ankahi kahaniyon ke liye" / "Follow karein | *Untold Stories".
- Captions are in **Hinglish (Roman script)**, the user's choice: e.g. `"caps": "Aasmaan mein *teen shahar"`,
  `"Ek *sone ka | ek *chaandi ka | aur ek *lohe ka"`, last line `"Follow karein | *Untold Stories"`.
  Simple everyday spelling (mein, hai, aur, ka/ki/ke, nahi, Mahadev, Brahma ji, Vishnu, Shiv). 2-4 words, exactly one
  `*`red word. Keep each caption chunk to the same words, in the same order, as the Hindi it shows, so the timing
  (placed by word count inside the line) lands on the right words. The `text` (what the voice reads) stays in Hindi.
- Numbers written as said.
- `voice`: "hm_omega", `speed`: 1.12-1.17, `music`: "devotional", and the sound the user chose (deep voice, low quiet bass-heavy music):
  `"voice_fx": "rubberband=pitch=0.85:formant=shifted,bass=g=5:f=120,equalizer=f=3200:t=q:w=1:g=1.5,aecho=0.85:0.75:45|90:0.16|0.08,acompressor=threshold=-20dB:ratio=3:attack=8:release=200"`, `"music_db": -26`, `"music_sa": 110`, `"music_lp": 2000`, `"music_sub": 0.65`. Target: voice >= 11 dB above the music. List `sources`.

### Script craft: every script must pass this before voicing (the user wants "achi achi" stories)
1. **Trend-led angle.** From today's `logs/trends.md` top 10, write down the 2-3 HOOK PATTERNS winning this week
   (e.g. "X ने Y क्यों किया?", "रहस्य जो कोई नहीं जानता", a curse, a forbidden act, a festival this week). Our hook uses
   one of those patterns on OUR story (never their wording).
2. **Write 3 hooks, keep the best.** Line 1 (<= 2.5 s) must create a question the viewer NEEDS answered: a paradox,
   a shocking fact or a direct challenge ("भगवान विष्णु ने अपनी ही आँख क्यों अर्पित कर दी?"). No greetings, no "आज हम...".
3. **Arc (20-26 lines):** hook (1-2) → the world + the person we feel for (3-6) → the problem/curse grows (7-12) →
   the darkest moment, short lines, slower (13-16) → the reveal/twist the hook promised (17-20) → why it still
   matters today (a festival, a temple, a ritual, a sunrise) (21-22) → loop line that echoes the hook → follow lines.
4. **Feel, not facts.** Every 3-4 lines give one human emotion (a mother's fear, a son's anger, a god's devotion).
   Concrete images over adjectives ("एक हज़ार कमल... और एक कम"), one surprising detail the viewer can repeat to a friend.
5. **Open loops:** at line ~8 and ~15 tease what's coming ("पर असली मोड़ अभी बाक़ी था...") so they stay to the end.
6. **Self-score 1-5** on hook, emotion, twist, clarity, loop. Anything < 4 → rewrite that part before voicing.
   Write the scores and the 3 hooks you considered in `logs/notes.md` under the run.
7. Facts stay true to the source; drama comes from HOW it's told, never by inventing events.

### Emotional, natural narration (the user asked for it)
- Write like a storyteller at a temple, not a newsreader: talk to the viewer ("सोचिए...", "पर क्या आप जानते हैं?"),
  short punchy lines at the climax, a question before each reveal ("और बाण?" → "स्वयं भगवान विष्णु.").
- Use "..." for held breaths, "!" for awe, "?" for questions; Kokoro reads punctuation.
- Pace per sentence with a `speed` on the sentence's line: 0.95-1.0 for reveals, sacred names and the twist;
  1.12-1.2 for build-ups and lists; default 1.12.
- Breaths: voice.py adds a soft inhale in pauses >= 0.25 s (script.json `"breaths": true`, the default).
- Pauses: `gap` 0.5-0.8 after a reveal or before the twist, 0.2-0.3 elsewhere. Do not exceed ~60 s total.

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

**Quality gate (mandatory, nothing is uploaded without PASS):**
`~/.faceless-shorts/venv/bin/python tools/quality_gate.py . renders/<slug>-yt.mp4`
It checks 1080x1920, 30-75 s, audio present, voice >= 9 dB above the music (from data/levels.json written by mix.py),
the video contains the current mix, every line has captions and word timing, no black screen, no frozen picture, < 35 MB.
On FAIL: fix the cause (re-voice / re-mix / fix the shot / re-render) and run it again. If it still fails after one
fix, do NOT upload: send the Telegram problem alert (section 6b) with the reasons from review/quality.json.

## 5. Metadata
- Title: Hindi hook + short English, under 70 chars, e.g. `गंगा धरती पर कैसे आईं? | The Untold Story of Bhagirath`.
- Description: 2-3 Hindi lines + 1 English line, then "Sources:" (the texts), then 5-8 hashtags drawn from this
  week's trend research (mix: 2 broad #IndianMythology #HinduMythology, 3-4 story-specific, 1-2 trending/festival),
  ending with `#shorts`.

## 6.0 Which uploader
If `~/.untold/secrets.json` (or YT_* env vars) exists AND `logs/settings.json` has `"uploader": "direct"`, use
`tools/yt_direct.py` (upload private → wait → publish; problems via `yt_direct.py telegram`). Otherwise use Zapier as below.
Setup and the free YouTube audit: docs/youtube-api-setup.md.

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
2. **No preview alert** (the user wants Telegram ONLY for problems). Skip this message unless `logs/settings.json`
   has `"preview_alerts": true`:
   "🔒 Untold Stories preview (private): <title>\n<topic>\nGoes PUBLIC at <slot> IST. Reply STOP to this bot to keep it private."
   with a button "Watch preview" → https://www.youtube.com/watch?v=<id> (the user is signed in, so it plays for them).
3. **Wait until the slot time** (sleep in short intervals). (No STOP check and no extra GET: save Zapier tasks.)
5. **Go public.** YouTube "Make API Mutating Request" (`youtube_make_api_mutating_request`): PUT
   https://www.googleapis.com/youtube/v3/videos?part=status with body
   `{"id":"<id>","status":{"privacyStatus":"public","embeddable":true,"license":"youtube","publicStatsViewable":true,"selfDeclaredMadeForKids":false}}`
   and fail_on_errors true. Its response shows the new privacyStatus: that is the verification (no extra GET).
6. **No success message.** When everything worked, send nothing (only problems go to Telegram).
- If any step fails, send "⚠️ Untold Stories <slot> failed at <step>: <reason>" to Telegram and log it.
- If Zapier is not available in the session: send the MP4 + cover + metadata to the user in the session instead.
## 6b. Problems → Telegram, always (the user watches Telegram, not this session)
Wrap every step. If ANY step fails or looks wrong, send to Telegram (Zapier Telegram "Send Message", chat 1289292985):
"⚠️ Untold Stories <slot> problem
Step: <research / script / visuals / voice / render / upload / public / log>
What happened: <one plain sentence>
Done so far: <e.g. video rendered, not uploaded>
What I did: <retried / used fallback / skipped>
Needs you: <nothing | what the user should do, in one line>"
Retry a failed step once before alerting. Fallbacks: trend scan fails → use web search + logs/trends.md; a scene fails QA →
simplify it rather than skip the video; upload fails → retry once, then alert with the file kept on branch media.
If the video is late, still publish it as soon as it's ready and say so. If Zapier itself is unreachable (so Telegram
can't be sent), tell the user in this session: the app's push notification is the fallback.

## 7. Log (always, even if something failed)
Append to `logs/topics.json`: date, slot, slug, topic, story, palette, scene types, new kit pieces, title, hashtags,
youtube id/status, and problems. Add lessons to `logs/notes.md`. Commit + push to the studio repo (never the video).
