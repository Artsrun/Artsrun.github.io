const PROBLEMS = [
  {
    id: "encoding",
    q: "Is ¯\\_(ツ)_/¯ an emoji?",
    steps: [
      { act:"question", hy:"հարց", face:"(・・？)", thought:"Receive the string. Do not translate it yet.", ex:"question already here", ch:"hold the turn", ti:"not yet" },
      { act:"side", hy:"կողային հայացք", face:"(￢_￢)", thought:"Look sideways. ‘Emoji’ is doing too much work.", ex:"withheld agreement", ch:"glance off-axis", ti:"before join" },
      { act:"wait", hy:"սպասում", face:"(´-`).｡oO", thought:"UTS #51: emoticon = composed characters. Emoji = listed pictograph.", ex:"a face that stays", ch:"almost none", ti:"thought-bubble" },
      { act:"mask", hy:"դիմակ", face:"( ͡° ͜ʖ ͡°)✧", thought:"Chat maps the shrug to 🤷 because both ‘mean shrug’.", ex:"a second face", ch:"costume of newness", ti:"sparkle" },
      { act:"force", hy:"ուժ", face:"(ง'̀-'́)ง", thought:"Slot test: who encoded the arms? Who encoded the face?", ex:"will that stands", ch:"fist the split", ti:"now" },
      { act:"walk", hy:"քայլ", face:"ᕕ( ᐜ )ᕗ", thought:"No code point for the shrug sentence. Stolen letters only.", ex:"motion as proof", ch:"carry it to the spec", ti:"a walk" },
      { act:"ack", hy:"ընդունում", face:"(；一_一)", thought:"The Emoticons block is eighty emoji pictographs. Not this string.", ex:"received, not agreed", ch:"mark the room wrong", ti:"sweat" },
      { act:"hail", hy:"ողջույն", face:"ヽ(•‿•)ノ", thought:"Publish: emoticon_string. Mapping to 🤷 is translation, not identity.", ex:"a speaker available", ch:"wave the result", ti:"release" }
    ]
  },
  {
    id: "plan",
    q: "Why did the brilliant plan fail?",
    steps: [
      { act:"shrug", hy:"ուսի թոթվում", face:"┐(￣ヘ￣)┌", thought:"A warning is already here. The face will not take the address.", ex:"warning in the room", ch:"refuse the address", ti:"reentry" },
      { act:"mask", hy:"դիմակ", face:"( ͡° ͜ʖ ͡°)✧", thought:"Brilliant only inside the face. Invented, not tested.", ex:"scheme as costume", ch:"sparkle for evidence", ti:"irregular" },
      { act:"walk", hy:"քայլ", face:"ᕕ( ᐜ )ᕗ", thought:"The walk is treated as the argument.", ex:"forward motion", ch:"carry the untested plan", ti:"self-yes" },
      { act:"force", hy:"ուժ", face:"( -_•)╦̵̵ͯ╤─", thought:"The table already held a gun. Walking pulled it.", ex:"prop already here", ch:"the walk names the threat", ti:"break" },
      { act:"collapse", hy:"փլուզում", face:"(╯°□°)╯︵ ┻━┻", thought:"Blame moves onto furniture. The organization broke, not the wood.", ex:"table as culprit", ch:"externalize the cause", ti:"flip" },
      { act:"ack", hy:"ընդունում", face:"( T_T)", thought:"Grief names the damage as his. Time can no longer be denied.", ex:"chaos owned", ch:"leak, do not flip", ti:"fall" },
      { act:"repair", hy:"վերականգնում", face:"┬─┬ノ( º _ ºノ)", thought:"Restore the table. Form returns. Habit does not.", ex:"world repairable", ch:"set upright, mouth small", ti:"temp norm" },
      { act:"mask", hy:"դիմակ", face:"( ͡° ͜ʖ ͡°)", thought:"Same face, sparkle gone. New use that looks like the old one.", ex:"scheme without particle", ch:"reuse, archive only", ti:"return" }
    ]
  },
  {
    id: "repair",
    q: "The sentence broke. What does repair say?",
    steps: [
      { act:"ack", hy:"ընդունում", face:"(＠_＠;)", thought:"The room is wrong. Stay in the turn.", ex:"polite under stress", ch:"mark, do not exit", ti:";" },
      { act:"collapse", hy:"փլուզում", face:"ʕノ•ᴥ•ʔノ ︵ ┻━┻", thought:"A bear can take the same verb. Flip is a sentence, not a glyph.", ex:"new agent + table", ch:"same change, new who", ti:"flip" },
      { act:"wait", hy:"սպասում", face:"(－_－) zzZ", thought:"Do not rebuild in the same breath as the flip.", ex:"a face that stays", ch:"almost none", ti:"sleep" },
      { act:"side", hy:"կողային հայացք", face:"(ಠ_ಠ)", thought:"Inspect the wreck. Who named the table guilty?", ex:"withheld agreement", ch:"look, do not join", ti:"hold" },
      { act:"repair", hy:"վերականգնում", face:"┬─┬ノ( º _ ºノ)", thought:"Upright wood is not upright habit.", ex:"world repairable", ch:"restore form", ti:"after" },
      { act:"alliance", hy:"դաշինք", face:"(っ⌒‿⌒)っ", thought:"Hand the repaired form to another mouth.", ex:"closeness assumed", ch:"give the sentence away", ti:"shared" },
      { act:"shrug", hy:"ուսի թոթվում", face:"¯\\_(ツ)_/¯", thought:"Refuse to call the new form finished.", ex:"residual warning", ch:"do not close the case", ti:"open" },
      { act:"hail", hy:"ողջույն", face:"(ノ◕ヮ◕)ノ*:ï½¥ﾟ✧", thought:"Publish the clause. Sparkle optional; arms are not.", ex:"speaker available", ch:"wave", ti:"optional sparkle" }
    ]
  }
];
let pi = 0, si = 0, timer = null;
const $ = (id) => document.getElementById(id);
function renderTape() {
  const steps = PROBLEMS[pi].steps;
  $("tape").innerHTML = steps.map((s, i) => {
    if (i > si) return "";
    const line = String(i + 1).padStart(2, "0") + "  " + s.face + "  " + s.thought;
    return i === si ? '<span class="now">' + line + "</span>" : line;
  }).filter(Boolean).join("\n") || "—";
}
function renderRail() {
  const steps = PROBLEMS[pi].steps;
  $("rail").innerHTML = steps.map((_, i) => {
    const cls = i === si ? "dot on" : (i < si ? "dot done" : "dot");
    return '<button class="' + cls + '" data-i="' + i + '" type="button">' + (i + 1) + "</button>";
  }).join("");
  $("rail").querySelectorAll("button").forEach((b) => {
    b.onclick = () => { stop(); si = +b.dataset.i; paint(); };
  });
}
function paint() {
  const P = PROBLEMS[pi];
  const s = P.steps[si];
  $("q").textContent = P.q;
  $("beatno").textContent = String(si + 1).padStart(2, "0") + " / " + String(P.steps.length).padStart(2, "0");
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
  }, 1800);
}
$("prev").onclick = () => { stop(); if (si > 0) si -= 1; paint(); };
$("next").onclick = () => { stop(); if (si < PROBLEMS[pi].steps.length - 1) si += 1; paint(); };
$("reset").onclick = () => { stop(); si = 0; paint(); };
$("play").onclick = play;
["p0", "p1", "p2"].forEach((id, i) => {
  $(id).onclick = () => { stop(); pi = i; si = 0; paint(); };
});
paint();
