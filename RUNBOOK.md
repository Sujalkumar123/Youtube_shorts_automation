# Untold Stories studio: the daily run

Each scheduled run makes ONE new Hindi mythology Short for the YouTube channel **Untold Stories** and follows this file
top to bottom. Work in `~/work/<slug>/`. The look is "cinematic cut paper" (see `examples/ganga`). The channel watermark
is drawn by `engine/src/main.js` (`drawBrand`), on every frame.

## 0. Setup (fresh workspace, every run)
- The repo is cloned at `~/untold-stories-studio`. The skill's scripts are in `engine/skill-scripts/`.
- `bash engine/skill-scripts/setup.sh` until the Python env + Kokoro voice are OK (Whisper may fail: that is fine, the
  word timing falls back to the exact line times). Chrome, ffmpeg and Node 22 must be present.
- **Prepared slot check (first thing):** if `logs/settings.json` → `prepared_slots` has an entry for today's slot
  (e.g. "2026-11-22 morning"), a video for this slot is already uploaded with a scheduled publish time. Do NOT make
  another video. At the slot time, only if it is still private, do the go-public PUT (section 6 step 5) for that id. Then log and stop.
- **ElevenLabs key:** the scheduled-task prompt gives the key; write it to `~/.untold/secrets.json`
  as {"ELEVENLABS_API_KEY": "..."} (chmod 600). NEVER write it to the repo, a log, a commit or Telegram.
- Read `logs/topics.json` (every topic already made, with its palette and scene types) and `logs/notes.md` (lessons).

## 1. Pick today's topic from what is trending ON YOUTUBE (do this every run)
**0. THE MAYA EFFECTS PLAYBOOK (user 2026-11-25: "implement the same thing"). It overrides older rules below where they differ.**
Studied @maya_effects.official (300k subs, 24.3M views, 41 videos, Hindi mythology): its median short gets ~130k views,
its best get 2-4M. What it does, and what we now do:
- **Schedule: KEEP our three slots, 08:00 / 15:00 / 20:00 IST** (user 2026-11-25). Maya posts its main short at
  ~16:15-16:45 IST; a scheduled review on 2026-12-25 switches us to 16:30 + 20:30 only if views stay low for a month.
  The 20:00 short gets the strongest topic of the day.
- **Topics: famous epic characters, told from the scripture, correcting the popular version.** Their hits are all
  Ramayana / Vishnu-family stories everyone half-knows: Lakshmana's sleep (3.0M), Hanuman at Rama's door (3.7M),
  Sheshnag & Vasuki (3.9M), Gajendra (1.9M), Rahu-Ketu (2.3M), the bow that burned three cities (588k). Pick a famous
  character (Rama, Sita, Lakshmana, Hanuman, Ravana, Krishna, Arjuna, Karna, Bhishma, Shiva, Parvati, Vishnu, Garuda)
  and ONE detail from the text that most people don't know or get wrong. Ramayana first, then Mahabharata, then Puranas.
  Their numbered series (Shiva-Shakti Ep 1-6) did far worse (20-130k): do NOT make series, every short stands alone.
- **Title = ONE English sentence that states a paradox or a surprising claim** (no question-word clickbait, no Hindi
  title, max 1 emoji, ≤ 95 characters, no hashtags in the title). Shape: "<famous character> <did/never did X>. <twist>."
  Our own wording always, e.g. "Ravana's ten heads were not his own. Shiva gave them back.",
  "Karna knew he was a Pandava before the war. He fought for Duryodhana anyway."
- **The hook line (narration line 1) says the same paradox in Hindi**, in the first 2 s, then line 2 promises the
  answer from the source text ("पर वाल्मीकि रामायण कुछ और कहती है...").
- **Length 80-150 s, sweet spot ~90-110 s** (28-40 lines). Their 80-110 s shorts are the biggest hits.
- **Hindi narration + ENGLISH subtitles** (they reach viewers beyond Hindi). This replaces the Hinglish captions:
  `"caps"` = natural English translation of the line, 2-5 words per chunk, one `*` key word, e.g.
  `"Lakshmana *never slept | for *fourteen years"`.
- **Description, their format:** line 1 = one-sentence summary that names the source ("..., as the Valmiki Ramayana
  tells it."); a blank line; 2 short lines on what most retellings get wrong and what the text says ("In Hindi, with
  English subtitles."); a blank line; "Script & adaptation based on <text, book, chapter>."; then 2-3 hashtags only:
  `#shorts #<Character> #<Epic>`. Tags: the character, the epic, "<character> story in Hindi", "<epic> unknown facts".
- **Credibility is the brand:** every short cites the exact text (book/kanda/parva, chapter). When the popular story
  differs from the text, say so: "ज़्यादातर कहानियों में... पर शिव पुराण में...".
- **Their look (from their own store page, janimea.com): painted 2.5D scenes drawn in code with Claude Code (no AI
  images, no stock footage), parallax layers, slow camera pushes, smoke / dust / firelight, a cinematic score of brass,
  choir, strings and taiko, mixed at -14 LUFS.** Same method as ours, so match it: every shot gets 3+ parallax layers,
  a slow push or drift, at least one atmosphere effect (smoke, dust motes, embers, mist, god rays, firelight flicker),
  and the music bed swells at the reveal.
- **Keep** our comment ask at the end (it lifted comments on the other channel) and the Sahir voice.

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
**c0. Topic mix (user 2026-11-24, from studying @sanatantoons21: 3.6M views in 23 days, mostly from Hanuman/Mahadev/Vishnu videos):**
- **Morning (8 AM) and evening (8 PM, prime time) = BIG DEITY videos:** Hanuman, Mahadev/Shiva, Krishna, Shri Ram,
  Vishnu avatars, Ganesh, Maa Durga/Kali. Pick a famous deity with a surprising angle people search for: secret powers
  ("हनुमान जी की 8 शक्तियाँ"), why-names ("शिव को महाकाल क्यों कहते हैं?"), hidden meanings, little-known episodes.
  Mass appeal first, our untold twist second.
- **Afternoon (3 PM) = an untold/niche story** (curses, lesser-known characters, temple legends), still linked to a
  big deity whenever possible (e.g. "महादेव" in the title).
**c. Choose.** Pick ONE story in a winning concept/deity/festival that is NOT in `logs/topics.json`, with our own
untold angle. Never copy another creator's script, title, structure or frames: same concept, our original story,
facts from the scriptures. Prefer what is rising this week (high views/day) and a festival in the next 7 days
(also search the web for this week's festivals/Panchang).
**d. Title in the winning style:** DEITY NAME FIRST, a Hindi mystery question, 1-2 emoji (😱🔱🚩🙏), short English, #shorts,
e.g. `हनुमान जी की 8 शक्तियाँ, जिनका रहस्य आज भी 😱🚩 | Hanuman's Ashta Siddhi #shorts`,
`महादेव को भूतनाथ क्यों कहते हैं? 🔱 | Why Shiva Is Bhootnath #shorts`.
**e. Sources:** the story must be documented (Ramayana, Mahabharata, Puranas via wisdomlib.org/sacred-texts.com,
Britannica, temple/government sites). Keep the sources for the description.
Never mock or distort a deity; no violence shown; no caste or political angle.

## 2. Script (`script.json`, copy the shape of `examples/ganga/script.json`)
- Hindi, conversational, like telling a friend. Hook question → escalation → surprise → twist → loop-back last line.
- Length (Maya playbook): 28-40 lines, 80-150 s, aim ~90-110 s, with open loops at ~1/3 and ~2/3 so people stay. Max 150 s.
- One line = one CUT (1.5-3.5 s). One line = one CUT (1.5-3.5 s). Sentences end in "." "?" (not "।").
- **Last 2 lines always = comment ask + follow** (comments are what pushed the competitor's videos; devotees love to write the chant):
  "अगर आप भी <deity> के भक्त हैं, तो कमेंट में लिखिए... <CHANT>." / "और ऐसी कहानियों के लिए, फ़ॉलो करें अनटोल्ड स्टोरीज़."
  caps "Comment mein likhiye | *<Chant in Roman>" / "Follow karein | *Untold Stories".
  CHANT by deity: Hanuman/Ram → "जय श्री राम" (Jai Shri Ram), Shiva → "हर हर महादेव" (Har Har Mahadev), Krishna →
  "जय श्री कृष्ण" (Jai Shri Krishna), Vishnu → "जय श्री हरि" (Jai Shri Hari), Devi → "जय माता दी" (Jai Mata Di),
  Ganesh → "गणपति बप्पा मोरया" (Ganpati Bappa Morya), Surya → "जय सूर्य देव". The end card shows the chant big in
  Devanagari with 🚩/🔱 and a "👇 Comment" slip.
- (OLD, replaced 2026-11-25 by English subtitles, see the Maya playbook) Captions were in **Hinglish (Roman script)**: e.g. `"caps": "Aasmaan mein *teen shahar"`,
  `"Ek *sone ka | ek *chaandi ka | aur ek *lohe ka"`, last line `"Follow karein | *Untold Stories"`.
  Simple everyday spelling (mein, hai, aur, ka/ki/ke, nahi, Mahadev, Brahma ji, Vishnu, Shiv). 2-4 words, exactly one
  `*`red word. Keep each caption chunk to the same words, in the same order, as the Hindi it shows, so the timing
  (placed by word count inside the line) lands on the right words. The `text` (what the voice reads) stays in Hindi.
- Numbers written as said.
- **Voice = ElevenLabs "Sahir" (the user's choice from 2026-11-22, for EVERY video).** script.json:
  `"voice": "eleven:Sahir"`, `"eleven_voice": "4LIpEnnggPcuL2KuRQIO"`, `"eleven_model": "eleven_multilingual_v2"`,
  `"eleven_stability": 0.42`, `"eleven_style": 0.4`, `"eleven_speed": 1.16`, `"breaths": false`, `"lead": 0.3`, `"outro": 1.1`,
  `"gap": 0.2` (line gaps 0.25-0.5 after reveals), per-line `speed` 1.05-1.2 (ElevenLabs range 0.7-1.2; Sahir is slow),
  `"music": "devotional"`, `"music_db": -25`, `"music_sa": 110`, `"music_lp": 2000`, `"music_sub": 0.9` (the user wants bass),
  `"voice_fx": "highpass=f=60,equalizer=f=130:t=q:w=1:g=3,equalizer=f=6500:t=q:w=1.5:g=-1.5,aecho=0.7:0.5:14|23:0.05|0.03,acompressor=threshold=-24dB:ratio=2.5:attack=10:release=250,alimiter=limit=0.9"`.
  Length: ~23 lines of 5-9 Hindi words ≈ 73 s. Re-timing (gaps/pauses) reuses the cached lines in data/eleven (no credits).
- **Fallback:** if ElevenLabs fails (no key, HTTP error, out of credits, blocked), voice with Kokoro instead
  (`"voice": "hm_omega"`, `speed` 1.03, `"breaths": true`, `"voice_fx": "<logs/settings.json kokoro_voice_fx>"`, music_sub 0.65)
  so the slot still posts, and send this Telegram message (the user's wording):
  "⚠️ ElevenLabs (Sahir) se voice nahi aa rahi (<reason: credits khatam / key error / blocked>). Ab Omega voice use kar rahe hain. Video <slot> pe time se post hoga."
  Send it once per day at most (note it in logs/notes.md with the date; later runs that day stay quiet about it).
  Every next run still tries ElevenLabs first, so Sahir comes back by itself once credits renew or a new key is added;
  when it works again after a fallback day, send one message: "✅ ElevenLabs (Sahir) voice wapas chal rahi hai." 
- **Credits:** run `tools/voice_eleven.py --test` first; it prints credits_left. If < 2500, still make this video
  with Sahir if it fits (~1000 per short), and send a Telegram alert "ElevenLabs credits low: <n> left (~<n/1000> shorts)".

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
- Pace per sentence with a `speed` on the sentence's line, and VARY it line to line (same speed every line sounds AI):
  0.9-0.97 for reveals, sacred names and the twist; 1.0-1.08 for normal telling; 1.08-1.12 only for quick build-ups.
  Default 1.03. (User 2026-11-21: voice felt "AI", wants natural human.) Never use 1.15+.
- Human rhythm: short sentences (4-10 words), commas where a person takes a mini-breath ("एक माँ, जिसने अपने ही बेटे को,
  समय से पहले जगा दिया."), split a long sentence into two, sometimes a 1-2 word line ("सोचिए..." / "पर क्यों?").
  Mix question, statement, whisper-like short line. Avoid bookish words; use spoken Hindi.
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

### Visual quality bar (user 2026-11-22: "more effects, better background, amazing and trendy")
The engine now adds to EVERY video by itself: transitions between shots (fade / gold flash on drum-slam cues /
whip on whoosh / zoom on swell-conch; override per shot with `trans`), camera shake + flash on impact cues, handheld
sway, a film grade, a drifting light leak and floating dust. Use the sound cues generously: they also drive the visuals.
On top of that, every script's shots must have:
- **Depth in every background:** at least 3 layers (sky/far, mid, near foreground silhouette) moving at different
  speeds (parallax with `lt`), plus atmosphere: mist, god rays, motes/embers/petals, glows. No flat single-colour backdrops.
- **One WOW shot every ~5 lines:** a big reveal with scale and light (a god appearing in a blaze, a weapon forming
  from swirling particles, a shockwave ring, a cosmic zoom-out, fire/lightning, a giant silhouette against the sun).
- **Motion in every shot:** something always moves (characters rise/turn, particles, light pulses, cloth/hair sway,
  camera targets that change); no static frame longer than 1.5 s.
- **Kinetic text:** name slips and a ribbon for the key word of the twist; a big "?" before the reveal.
- **Colour journey:** each act its own palette (e.g. night indigo → fire orange → dawn gold); the hook shot is the
  most striking frame (it is also the thumbnail).
- **Trendy pacing:** a cut every 2-3.5 s, the hook visual in the first 0.5 s, the reveal with a flash + drum + bell.
- Check `review/all.jpg` against this list; fix any flat, empty or static shot before rendering.

## 4. Build + QA (from the faceless-shorts skill, section 3-4)
```
cd ~/work/<slug>
~/.faceless-shorts/venv/bin/python tools/voice_eleven.py .     # Sahir (fallback: tools/voice.py . with Kokoro)
~/.faceless-shorts/venv/bin/python tools/words.py .
node tools/capture.mjs check && node tools/capture.mjs cues && ~/.faceless-shorts/venv/bin/python tools/mix.py .
node tools/capture.mjs sheet review/all.jpg 0.5 10      # READ the whole sheet, then key frames full size
```
QA every frame: makes sense, matches the narration, no collisions with the caption strip (y 1570-1710) or the
watermark (top-left 44-480 × 74-136), one red word, readable Hindi, arms not crossing faces. Fix and re-check.
Then `node tools/capture.mjs video renders/<slug>.mp4` and a share copy under 35 MB:
`ffmpeg -i renders/<slug>.mp4 -vf hqdn3d=2:2:4:4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -ar 48000 -movflags +faststart renders/<slug>-yt.mp4`
(loudness -14 LUFS, the Shorts/Reels standard Maya Effects mixes to: our shorts were quieter than the feed around them)
Cover: the strongest frame (`capture.mjs frames`).

**Quality gate (mandatory, nothing is uploaded without PASS):**
`~/.faceless-shorts/venv/bin/python tools/quality_gate.py . renders/<slug>-yt.mp4`
It checks 1080x1920, 30-75 s, audio present, voice >= 9 dB above the music (from data/levels.json written by mix.py),
the video contains the current mix, every line has captions and word timing, no black screen, no frozen picture, < 35 MB.
On FAIL: fix the cause (re-voice / re-mix / fix the shot / re-render) and run it again. If it still fails after one
fix, do NOT upload: send the Telegram problem alert (section 6b) with the reasons from review/quality.json.

## 5. Metadata
- Title: Hindi hook + short English, under 70 chars, e.g. `गंगा धरती पर कैसे आईं? | The Untold Story of Bhagirath`.
- (OLD, replaced by the Maya playbook description format) Description: line 1 = the hook question with emoji; 2-3 Hindi lines of the story (bhakti tone, no spoilers of the twist);
  then "क्या आप ये कथा पहले जानते थे? कमेंट में लिखिए <CHANT> 👇" and "<CHANT> 🙏🚩"; then 1 English line;
  then "Sources:" (the texts) lower down; then 8-12 hashtags: 3-4 devotional ones devotees follow (#jaishreeram
  #hanumanji #bajrangbali / #harharmahadev #mahadev #mahakal / #jaishreekrishna #radhekrishna / #jaimatadi), 3-4
  story-specific, 1-2 trending/festival, #hindumythology #sanatandharma, ending with `#shorts`.
- Tags: also add the deity's popular Hindi and Roman search terms (e.g. "hanuman ji", "हनुमान जी", "bajrangbali").

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
