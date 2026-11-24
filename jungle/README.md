# Second channel: animal cartoon moral stories (name TBD, placeholder "Jungle Ki Kahaniyan")
User 2026-11-24: animal cartoons with moral stories, for everyone (NOT "made for kids"), 2 videos a day, Omega (Kokoro hm_omega) voice.
- Engine: same `engine/` as Untold Stories. Kit: `engine/src/animals.js` (lion, rabbit, deer, monkey, elephant, well, jungle background, bubble, burst, flap).
- Brand watermark comes from script.json `"brand"`.
- Pilot: `examples/sher-aur-khargosh` (Panchatantra, lion and the clever rabbit), 80 s, music "bed", voice_fx = Omega natural.
- Encode with `-crf 26 -maxrate 3M -bufsize 6M` (bright flat colours make big files; gate max 35 MB).
- Ending: moral card ("सीख"), then "आपको ये कहानी कैसी लगी? कमेंट में बताइए." + "और ऐसी ही कहानियों के लिए, फ़ॉलो करें."
- Not set up yet: the YouTube channel, its Zapier connection, the scheduled task.
