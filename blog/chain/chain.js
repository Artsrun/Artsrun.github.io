const PROBLEMS = [
  {
    id: "encoding",
    q: "Is ¯\\_(ツ)_/¯ an emoji?",
    steps: [
      { act:"question", hy:"հարց · the face opens a slot, not an answer", face:"(・・？)", thought:"Receive the string. Do not translate it yet.", ex:"a question already in the room", ch:"hold the turn open", ti:"？ — not yet" },
      { act:"side", hy:"կողային հայացք · attention that will not join", face:"(￢_￢)", thought:"Look at the claim sideways. 'Emoji' is doing too much work.", ex:"withheld agreement", ch:"glance off-axis", ti:"pause before join" },
      { act:"wait", hy:"սպասում · time held; also thought", face:"(´-`).｡oO", thought:"UTS #51: emoticon = composed characters. Emoji = listed pictograph.", ex:"a face that stays", ch:"almost none; time is the message", ti:"｡oO thought-bubble" },
      { act:"mask", hy:"դիմակ · a second face, then a costume clause", face:"( ͡° ͜ʖ ͡°)✧", thought:"Hypothesis: chat collapses the shrug into 🤷 because both 'mean shrug'.", ex:"a second face behind the first", ch:"cast a sparkle of newness", ti:"✧ claim of novelty" },
      { act:"force", hy:"ուժ · the room must move", face:"(ง'̀-'́)ง", thought:"Force the slot test. Who encoded the arms? Who encoded the face?", ex:"a will that will not stay seated", ch:"fist the distinction", ti:"now" },
      { act:"walk", hy:"քայլ · motion treated as proof", face:"ᕕ( ᐛ )ᕗ", thought:"Walk the spec: no code point for the shrug sentence. Stolen letters only.", ex:"forward motion as proof", ch:"carry the claim into the archive", ti:"duration of a walk" },
      { act:"ack", hy:"ընդունում · received, not agreed", face:"(；一_一)", thought:"Ack: the Unicode block named Emoticons is eighty emoji pictographs. Not this string.", ex:"polite presence", ch:"mark the room as wrong without leaving", ti:"; sweat particle" },
      { act:"hail", hy:"ողջույն · an available speaker waves", face:"ヽ(•‿•)ノ", thought:"Publish: encoding=emoticon_string. Mapping to 🤷 is translation, not identity.", ex:"an available speaker", ch:"wave the result into the room", ti:"ノ release" }
    ]
  },
  {
    id: "plan",
    q: "Why did the brilliant plan fail?",
    steps: [
      { act:"shrug", hy:"ուսի թոթվում · refuse the address", face:"┐(￣ヘ￣)┌", thought:"A warning is already here. The face refuses the address.", ex:"a warning that already exists", ch:"refuse to take it as yours", ti:"reentry" },
      { act:"mask", hy:"դիմակ · scheme as costume", face:"( ͡° ͜ʖ ͡°)✧", thought:"A plan that is only brilliant inside the face. Invent without test.", ex:"scheme as costume", ch:"sparkle stands in for evidence", ti:"✧ irregular use" },
      { act:"walk", hy:"քայլ · the walk is the argument", face:"ᕕ( ᐛ )ᕗ", thought:"Motion treated as proof. The walk is the argument.", ex:"forward motion", ch:"carry the untested plan", ti:"self-acceptance" },
      { act:"force", hy:"ուժ · a prop already on the table", face:"( -_•)╦̵̵̿╤─", thought:"The table already held a gun. Walking pulled the trigger.", ex:"a prop already in the room", ch:"the walk names the threat", ti:"stability breaks" },
      { act:"collapse", hy:"փլուզում · blame moved onto an object", face:"(╯°□°)╯︵ ┻━┻", thought:"Blame moves onto furniture. The organization broke, not the wood.", ex:"the table as guilty party", ch:"externalize the cause", ti:"︵ inversion" },
      { act:"ack", hy:"ընդունում · chaos admitted as owned", face:"( T_T)", thought:"Grief names the damage as his. Time can no longer be denied.", ex:"chaos admitted as owned", ch:"leak instead of flip", ti:"fall" },
      { act:"repair", hy:"վերականգնում · form restored, habit not", face:"┬─┬ノ( º _ ºノ)", thought:"Restore the table. Form returns. Habit does not.", ex:"the table as repairable world", ch:"set upright, keep the mouth small", ti:"temp norm" },
      { act:"mask", hy:"դիմակ · sparkle deleted", face:"( ͡° ͜ʖ ͡°)", thought:"Same face, sparkle deleted. New use that looks like the old one.", ex:"the scheme without its particle", ch:"reuse visible only with archive", ti:"return" }
    ]
  },
  {
    id: "repair",
    q: "The sentence broke. What does repair say?",
    steps: [
      { act:"ack", hy:"ընդունում · stay in the turn", face:"(＠_＠;)", thought:"The room is wrong. Stay in the turn.", ex:"polite presence under stress", ch:"mark without exit", ti:"; " },
      { act:"collapse", hy:"փլուզում · same verb, new agent", face:"ʕノ•ᴥ•ʔノ ︵ ┻━┻", thought:"Even a bear can take the same verb. Flip is a sentence, not a glyph.", ex:"species-shift + table", ch:"same change, new agent", ti:"︵" },
      { act:"wait", hy:"սպասում · do not rebuild in the same breath", face:"(－_－) zzZ", thought:"Do not rebuild in the same breath as the flip. Time has to show.", ex:"a face that stays", ch:"almost none", ti:"zzZ" },
      { act:"side", hy:"կողային հայացք · inspect the wreck", face:"(ಠ_ಠ)", thought:"Inspect the wreck. Who named the table guilty?", ex:"withheld agreement", ch:"look, do not join the blame", ti:"hold" },
      { act:"repair", hy:"վերականգնում · upright wood is not upright habit", face:"┬─┬ノ( º _ ºノ)", thought:"Upright wood is not upright habit. Syntax restored; speaker unchanged.", ex:"repairable world", ch:"restore form", ti:"after" },
      { act:"alliance", hy:"դաշինք · hand the form to another mouth", face:"(っ⌒‿⌒)っ", thought:"Hand the repaired form to another mouth. Repetition starts here.", ex:"closeness assumed", ch:"give the sentence away", ti:"now shared" },
      { act:"shrug", hy:"ուսի թոթվում · refuse to call it finished", face:"¯\\_(ツ)_/¯", thought:"Refuse to call the new form finished. Stability is temporary organization.", ex:"residual warning", ch:"do not close the case", ti:"open again" },
      { act:"hail", hy:"ողջույն · publish the clause", face:"(ノ◕ヮ◕)ノ*:･ﾟ✧", thought:"Publish the repaired clause. Sparkle is optional; the arms are not.", ex:"available speaker", ch:"wave", ti:"✧ if you must" }
    ]
  }
];
let pi = 0, si = 0, timer = null;
const $ = (id) => document.getElementById(id);
function renderTape() {
  const steps = PROBLEMS[pi].steps;
  $("tape").innerHTML = steps.map((s, i) => {
    const line = String(i+1).padStart(2,"0") + "  " + s.face + "  " + s.thought;
    if (i < si) return line;
    if (i === si) return '<span class="now">' + line + "</span>";
    return "";
  }).filter(Boolean).join("\n") || "—";
}
function renderRail() {
  const steps = PROBLEMS[pi].steps;
  $("rail").innerHTML = steps.map((_, i) => {
    const cls = i === si ? "dot on" : (i < si ? "dot done" : "dot");
    return '<button class="' + cls + '" data-i="' + i + '" type="button">' + (i+1) + "</button>";
  }).join("");
  $("rail").querySelectorAll("button").forEach(b => {
    b.onclick = () => { stop(); si = +b.dataset.i; paint(); };
  });
}
function paint() {
  const P = PROBLEMS[pi];
  const s = P.steps[si];
  $("q").textContent = P.q;
  $("beatno").textContent = String(si+1).padStart(2,"0") + " / " + String(P.steps.length).padStart(2,"0");
  $("face").textContent = s.face;
  $("act").textContent = s.act;
  $("hy").textContent = s.hy;
  $("thought").textContent = s.thought;
  $("ex").textContent = s.ex;
  $("ch").textContent = s.ch;
  $("ti").textContent = s.ti;
  $("prev").disabled = si === 0;
  $("next").disabled = si === P.steps.length - 1;
  document.querySelectorAll(".chip").forEach((c, i) => c.setAttribute("aria-pressed", i === pi ? "true" : "false"));
  renderTape();
  renderRail();
}
function stop() {
  if (timer) { clearInterval(timer); timer = null; }
  $("play").textContent = "play";
}
function play() {
  if (timer) { stop(); return; }
  $("play").textContent = "pause";
  timer = setInterval(() => {
    if (si >= PROBLEMS[pi].steps.length - 1) { stop(); return; }
    si += 1;
    paint();
  }, 1600);
}
$("prev").onclick = () => { stop(); if (si > 0) si -= 1; paint(); };
$("next").onclick = () => { stop(); if (si < PROBLEMS[pi].steps.length - 1) si += 1; paint(); };
$("reset").onclick = () => { stop(); si = 0; paint(); };
$("play").onclick = play;
["p0","p1","p2"].forEach((id, i) => { $(id).onclick = () => { stop(); pi = i; si = 0; paint(); }; });
paint();
