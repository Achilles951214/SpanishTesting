import { conjugate, reflexivePronoun } from './conjugate.js';
import {
  VERBS, REFLEXIVE_VERBS, GUSTAR_VERBS, SUBJECTS,
  verbByInfinitive, reflexiveByInfinitive, gustarByInfinitive,
} from './verbs.js';

const SIMPLE_TENSES = ['present', 'preterite', 'imperfect', 'future'];
const SIMPLE_TEMPLATES = ['plain', 'modal', 'reflexive', 'object', 'gustar'];
const MODALS = ['querer', 'poder', 'ir'];

// poder/querer read oddly as the thing being practiced on their own or as a
// modal's infinitive complement ("podré querer", "puedo hoy") — they only
// appear in this app as the modal itself (data-driven from MODALS).
const MAIN_VERB_POOL = VERBS.filter((v) => v.infinitive !== 'poder' && v.infinitive !== 'querer');

const OBJECT_PRONOUNS = [
  { es: 'lo', en: 'him' },
  { es: 'la', en: 'her' },
  { es: 'los', en: 'them' },
];
const OBJECT_COMPLEMENTS = [
  { es: 'todos los días', en: 'every day' },
  { es: 'los fines de semana', en: 'on weekends' },
];

const TRIGGERS = [
  { infinitive: 'esperar', type: 'ar', irregular: false, en: { base: 'hope', thirdPerson: 'hopes' } },
  { infinitive: 'querer', type: 'er', irregular: true, en: { base: 'want', thirdPerson: 'wants' } },
  { infinitive: 'dudar', type: 'ar', irregular: false, en: { base: 'doubt', thirdPerson: 'doubts' } },
  { infinitive: null, en: { impersonal: "it's important" } }, // "es importante que"
];

// 'aunque' (although) is the connector where mood is a meaning choice, not a
// fixed rule: indicative states a known fact, subjunctive frames it as
// hypothetical/not-yet-confirmed. 'porque' (because) is always indicative —
// a plain two-clause connector with no subjunctive at all, for contrast.
// 'para que' (so that) is always subjunctive, like the trigger verbs, but
// via a purpose connector instead of a triggering verb.
const COMPLEX_TEMPLATES = ['trigger', 'cuando', 'si', 'aunque', 'porque', 'paraQue'];
const AUNQUE_MOODS = ['indicative', 'subjunctive'];

// poder/querer read oddly as a subordinate clause's only verb (they want an
// infinitive complement, not just an adverb) — keep them to the modal/trigger
// roles they already play and pick complex-clause verbs from the rest.
const COMPLEX_VERB_POOL = MAIN_VERB_POOL;

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickOtherIndex(arr, avoidIndex, rng) {
  if (arr.length <= 1) return avoidIndex;
  let i = avoidIndex;
  while (i === avoidIndex) i = Math.floor(rng() * arr.length);
  return i;
}

// English rendering for a verb form given a tense/mood. `base` doubles as
// both the infinitive (after will/would/used to) and the you/we/they
// present-tense form, which is correct for every regular English verb
// ("speak") but wrong for "be" (am/are, not bare "be") — those verbs set
// `presentBase`/`presentFirst` overrides that this function prefers.
function englishForm(verbEn, tense, personIndex) {
  switch (tense) {
    case 'present':
    case 'subjunctive':
      if (personIndex === 2) return verbEn.thirdPerson;
      if (personIndex === 0) return verbEn.presentFirst || verbEn.presentBase || verbEn.base;
      return verbEn.presentBase || verbEn.base;
    case 'preterite':
      return verbEn.past;
    case 'imperfect':
      return `used to ${verbEn.base}`;
    case 'future':
      return `will ${verbEn.base}`;
    case 'conditional':
      return `would ${verbEn.base}`;
    default:
      return verbEn.base;
  }
}

function beForm(subject) {
  if (subject.en === 'I') return 'am';
  if (subject.en === 'he' || subject.en === 'she') return 'is';
  return 'are';
}

function wasForm(subject) {
  return subject.en === 'I' || subject.en === 'he' || subject.en === 'she' ? 'was' : 'were';
}

// gustar-type verbs use an indirect-object pronoun (me/te/le/nos/les) for
// the "liker", usually clarified with "a mí / a ti / a él / a ella / ...".
function ioPronoun(personIndex) {
  return ['me', 'te', 'le', 'nos', 'les'][personIndex];
}

function gustarPrefix(subject) {
  if (subject.pron === 'yo') return 'mí';
  if (subject.pron === 'tú') return 'ti';
  return subject.pron;
}

// English object-pronoun form of a subject, for constructions like "want
// HIM to go" where Spanish "querer que" takes a that-clause but English
// "want" instead takes an object + infinitive.
const EN_OBJECT = { I: 'me', you: 'you', he: 'him', she: 'her', we: 'us', they: 'them' };
function enObjectPronoun(subject) {
  return EN_OBJECT[subject.en];
}

// plain/modal/object share one verb pool; reflexive and gustar-type verbs
// are lexically distinct sets, so template switches must repick from theirs.
function poolForTemplate(template) {
  if (template === 'reflexive') return REFLEXIVE_VERBS;
  if (template === 'gustar') return GUSTAR_VERBS;
  return MAIN_VERB_POOL;
}

// A handful of noun complements (e.g. ser's "estudiante") need a plural
// form when the subject is nosotros/ellos; most complements don't change.
function pickComplement(verb, complementIndex, personIndex) {
  const c = verb.complements[complementIndex % verb.complements.length];
  const isPlural = personIndex === 3 || personIndex === 4;
  if (isPlural && c.esPlural) {
    return { es: c.esPlural, en: c.enPlural || c.en };
  }
  return c;
}

function modalEnglishPhrase(modalName, tense, subject) {
  const third = subject.personIndex === 2;
  if (modalName === 'querer') {
    return {
      present: third ? 'wants to ' : 'want to ',
      preterite: 'wanted to ',
      imperfect: 'used to want to ',
      future: 'will want to ',
      conditional: 'would want to ',
    }[tense];
  }
  if (modalName === 'poder') {
    return {
      present: 'can ',
      preterite: 'could ',
      imperfect: 'used to be able to ',
      future: 'will be able to ',
      conditional: 'would be able to ',
    }[tense];
  }
  // ir a + infinitive
  return {
    present: `${beForm(subject)} going to `,
    preterite: 'went to ',
    imperfect: `${wasForm(subject)} going to `,
    future: 'will go to ',
    conditional: 'would go to ',
  }[tense];
}

// ---------- Simple mode ----------

function randomSimpleState(rng, keep = {}) {
  const template = keep.template || pick(SIMPLE_TEMPLATES, rng);
  const modal = template === 'modal' ? (keep.modal || pick(MODALS, rng)) : null;
  // Avoid picking the modal itself as its own infinitive complement (e.g. "voy a ir").
  let verbPool = poolForTemplate(template);
  if (modal) verbPool = verbPool.filter((v) => v.infinitive !== modal);
  const verb = keep.verb || pick(verbPool, rng);
  return {
    verbInfinitive: verb.infinitive,
    template,
    modal,
    tenseIndex: keep.tenseIndex ?? Math.floor(rng() * SIMPLE_TENSES.length),
    subjectIndex: keep.subjectIndex ?? Math.floor(rng() * SUBJECTS.length),
    complementIndex: keep.complementIndex ?? Math.floor(rng() * 3),
    objectIndex: keep.objectIndex ?? Math.floor(rng() * OBJECT_PRONOUNS.length),
    setCount: 0,
  };
}

export function startSimple(rng) {
  return randomSimpleState(rng);
}

// Advance within a set of 5: keep the same verb + template, change ONE of
// {subject, tense} so only a single grammatical element shifts each step.
export function advanceSimple(state, rng) {
  const next = { ...state, setCount: state.setCount + 1 };
  const changeSubject = rng() < 0.65;
  if (changeSubject) {
    next.subjectIndex = pickOtherIndex(SUBJECTS, state.subjectIndex, rng);
  } else {
    next.tenseIndex = pickOtherIndex(SIMPLE_TENSES, state.tenseIndex, rng);
  }
  if (next.template === 'object') {
    next.objectIndex = pickOtherIndex(OBJECT_PRONOUNS, state.objectIndex, rng);
  }
  return next;
}

// "Keep going, same verb": cycle to a different construction (template) for
// variety while sticking to the same verb — but only when the new template
// draws from the same verb pool (reflexive/gustar are lexically separate).
export function continueSameVerb(state, rng) {
  const otherTemplates = SIMPLE_TEMPLATES.filter((t) => t !== state.template);
  const nextTemplate = pick(otherTemplates, rng);
  const samePool = poolForTemplate(state.template) === poolForTemplate(nextTemplate);
  const verb = samePool ? poolForTemplate(nextTemplate).find((v) => v.infinitive === state.verbInfinitive) : undefined;
  return randomSimpleState(rng, { verb, template: nextTemplate });
}

// "Fresh verb": pick a new verb within the same template's pool and start a new set of 5.
export function freshVerbSimple(state, rng) {
  const pool = poolForTemplate(state.template);
  const otherVerbs = pool.filter((v) => v.infinitive !== state.verbInfinitive);
  return randomSimpleState(rng, { template: state.template, verb: pick(otherVerbs, rng) });
}

export function buildSimpleSentence(state) {
  const subject = SUBJECTS[state.subjectIndex];
  const tense = SIMPLE_TENSES[state.tenseIndex];

  if (state.template === 'gustar') {
    const gVerb = gustarByInfinitive(state.verbInfinitive);
    const item = gVerb.items[state.complementIndex % gVerb.items.length];
    // The grammatical subject is the thing liked, so the verb agrees with
    // IT (singular -> él/ella slot, plural -> ellos slot), not the "liker".
    const itemPersonIndex = item.plural ? 4 : 2;
    const conjugated = conjugate(gVerb, tense, itemPersonIndex);
    const es = `A ${gustarPrefix(subject)} ${ioPronoun(subject.personIndex)} ${conjugated} ${item.es}.`;
    const en = `${cap(subject.en)} ${englishForm(gVerb.en, tense, subject.personIndex)} ${item.en}.`;
    return { es, en, tag: `${gVerb.infinitive} (gustar-type) · ${tense} · a ${subject.pron}` };
  }

  if (state.template === 'reflexive') {
    const rVerb = reflexiveByInfinitive(state.verbInfinitive);
    const rc = pickComplement(rVerb, state.complementIndex, subject.personIndex);
    const es = `${cap(subject.pron)} ${reflexivePronoun(subject.personIndex)} ${conjugate(rVerb, tense, subject.personIndex)} ${rc.es}.`;
    const en = `${cap(subject.en)} ${englishForm(rVerb.en, tense, subject.personIndex)} ${rc.en}.`;
    return { es, en, tag: `${rVerb.infinitive}se (reflexive) · ${tense} · ${subject.pron}` };
  }

  if (state.template === 'object') {
    const verVerb = verbByInfinitive('ver');
    const obj = OBJECT_PRONOUNS[state.objectIndex % OBJECT_PRONOUNS.length];
    const oc = OBJECT_COMPLEMENTS[state.complementIndex % OBJECT_COMPLEMENTS.length];
    const es = `${cap(subject.pron)} ${obj.es} ${conjugate(verVerb, tense, subject.personIndex)} ${oc.es}.`;
    const en = `${cap(subject.en)} ${englishForm(verVerb.en, tense, subject.personIndex)} ${obj.en} ${oc.en}.`;
    return { es, en, tag: `ver + obj. pronoun (${obj.es}) · ${tense} · ${subject.pron}` };
  }

  const verb = verbByInfinitive(state.verbInfinitive);
  const complement = pickComplement(verb, state.complementIndex, subject.personIndex);

  if (state.template === 'plain') {
    const es = `${cap(subject.pron)} ${conjugate(verb, tense, subject.personIndex)} ${complement.es}.`;
    const en = `${cap(subject.en)} ${englishForm(verb.en, tense, subject.personIndex)} ${complement.en}.`;
    return { es, en, tag: `${verb.infinitive} · ${tense} · ${subject.pron}` };
  }

  // 'modal' — querer/poder/ir a + infinitive
  const modalVerb = verbByInfinitive(state.modal);
  const connector = state.modal === 'ir' ? 'a ' : '';
  const es = `${cap(subject.pron)} ${conjugate(modalVerb, tense, subject.personIndex)} ${connector}${verb.infinitive} ${complement.es}.`;
  const enModal = modalEnglishPhrase(state.modal, tense, subject);
  const en = `${cap(subject.en)} ${enModal}${verb.en.base} ${complement.en}.`;
  return { es, en, tag: `${state.modal} + ${verb.infinitive} (inf.) · ${tense} · ${subject.pron}` };
}

// ---------- Complex mode ----------

// Which state fields each template's sentence actually reads — drives both
// the initial randomization and which field(s) advanceComplex may vary.
const COMPLEX_TEMPLATE_FIELDS = {
  trigger: ['subject1', 'subject2', 'verb2'],
  cuando: ['subject1', 'subject2', 'verb1', 'verb2'],
  aunque: ['subject1', 'subject2', 'verb1', 'verb2'],
  porque: ['subject1', 'subject2', 'verb1', 'verb2'],
  paraQue: ['subject1', 'subject2', 'verb1', 'verb2'],
  si: ['subject1', 'verb2'],
};

function randomComplexState(rng, keep = {}) {
  const templateName = keep.templateName || pick(COMPLEX_TEMPLATES, rng);
  const subject1Index = keep.subject1Index ?? Math.floor(rng() * SUBJECTS.length);
  const verb2 = keep.verb2 || pick(COMPLEX_VERB_POOL, rng);
  const otherVerbs = COMPLEX_VERB_POOL.filter((v) => v.infinitive !== verb2.infinitive);
  return {
    templateName,
    triggerIndex: keep.triggerIndex ?? Math.floor(rng() * TRIGGERS.length),
    mood: keep.mood || pick(AUNQUE_MOODS, rng),
    subject1Index,
    subject2Index: keep.subject2Index ?? pickOtherIndex(SUBJECTS, subject1Index, rng),
    // Two-verb templates (cuando/aunque/porque/paraQue) use verb1 for the
    // connector clause and verb2 for the other; single-verb templates only
    // render verb2.
    verb1Infinitive: (keep.verb1 || pick(otherVerbs, rng)).infinitive,
    verb2Infinitive: verb2.infinitive,
    complementIndex: keep.complementIndex ?? Math.floor(rng() * 2),
    setCount: 0,
  };
}

export function startComplex(rng) {
  return randomComplexState(rng);
}

// Advance within a set of 5: keep the template (and, for 'aunque', the
// mood) fixed, and change ONE field the current template actually uses —
// one or two grammatical elements shifting at a time.
export function advanceComplex(state, rng) {
  const next = { ...state, setCount: state.setCount + 1 };
  const fields = COMPLEX_TEMPLATE_FIELDS[state.templateName] || ['subject2', 'verb2'];
  const field = pick(fields, rng);
  if (field === 'subject1') {
    // Must stay distinct from subject2, not just from its own old value.
    next.subject1Index = pickOtherIndex(SUBJECTS, state.subject2Index, rng);
  } else if (field === 'subject2') {
    next.subject2Index = pickOtherIndex(SUBJECTS, state.subject1Index, rng);
  } else if (field === 'verb1') {
    const otherVerbs = COMPLEX_VERB_POOL.filter((v) => v.infinitive !== state.verb1Infinitive);
    next.verb1Infinitive = pick(otherVerbs, rng).infinitive;
  } else {
    const otherVerbs = COMPLEX_VERB_POOL.filter((v) => v.infinitive !== state.verb2Infinitive);
    next.verb2Infinitive = pick(otherVerbs, rng).infinitive;
  }
  return next;
}

export function continueSameVerbComplex(state, rng) {
  const otherTemplates = COMPLEX_TEMPLATES.filter((t) => t !== state.templateName);
  return randomComplexState(rng, {
    templateName: pick(otherTemplates, rng),
    verb2: verbByInfinitive(state.verb2Infinitive),
    verb1: verbByInfinitive(state.verb1Infinitive),
  });
}

export function freshVerbComplex(state, rng) {
  const otherVerbs = COMPLEX_VERB_POOL.filter((v) => v.infinitive !== state.verb2Infinitive);
  return randomComplexState(rng, { verb2: pick(otherVerbs, rng) });
}

export function buildComplexSentence(state) {
  const subject1 = SUBJECTS[state.subject1Index];
  const subject2 = SUBJECTS[state.subject2Index];
  const verb2 = verbByInfinitive(state.verb2Infinitive);
  // Only cuando/aunque/porque/paraQue read verb1; harmless to look it up regardless.
  const verb1 = verbByInfinitive(state.verb1Infinitive);

  if (state.templateName === 'trigger') {
    const complement = pickComplement(verb2, state.complementIndex, subject2.personIndex);
    const trigger = TRIGGERS[state.triggerIndex % TRIGGERS.length];
    const verb2Subj = conjugate(verb2, 'subjunctive', subject2.personIndex);
    const verb2SubjEn = englishForm(verb2.en, 'subjunctive', subject2.personIndex);

    if (trigger.infinitive === null) {
      const es = `Es importante que ${subject2.pron} ${verb2Subj} ${complement.es}.`;
      const en = `It's important that ${subject2.en} ${verb2SubjEn} ${complement.en}.`;
      return { es, en, tag: `es importante + subj. · ${subject2.pron}` };
    }

    const triggerConj = conjugate(trigger, 'present', subject1.personIndex);
    const es = `${cap(subject1.pron)} ${triggerConj} que ${subject2.pron} ${verb2Subj} ${complement.es}.`;

    // English "want" doesn't take a that-clause the way hope/doubt do:
    // "quiere que él venga" -> "wants HIM to come", not "wants that he comes".
    if (trigger.infinitive === 'querer') {
      const wants = subject1.personIndex === 2 ? 'wants' : 'want';
      const en = `${cap(subject1.en)} ${wants} ${enObjectPronoun(subject2)} to ${verb2.en.base} ${complement.en}.`;
      return { es, en, tag: `${trigger.infinitive} + subj. · ${subject1.pron} → ${subject2.pron}` };
    }

    const triggerEn = englishForm(trigger.en, 'present', subject1.personIndex);
    const en = `${cap(subject1.en)} ${triggerEn} that ${subject2.en} ${verb2SubjEn} ${complement.en}.`;
    return { es, en, tag: `${trigger.infinitive} + subj. · ${subject1.pron} → ${subject2.pron}` };
  }

  if (state.templateName === 'cuando') {
    const complement1 = pickComplement(verb1, state.complementIndex, subject2.personIndex);
    const complement2 = pickComplement(verb2, state.complementIndex, subject1.personIndex);
    const verb1Subj = conjugate(verb1, 'subjunctive', subject2.personIndex);
    const verb1SubjEn = englishForm(verb1.en, 'subjunctive', subject2.personIndex);
    const verb2Fut = conjugate(verb2, 'future', subject1.personIndex);
    const es = `Cuando ${subject2.pron} ${verb1Subj} ${complement1.es}, ${subject1.pron} ${verb2Fut} ${complement2.es}.`;
    const en = `When ${subject2.en} ${verb1SubjEn} ${complement1.en}, ${subject1.en} will ${verb2.en.base} ${complement2.en}.`;
    return { es, en, tag: `cuando (${verb1.infinitive}) + subj., ${verb2.infinitive} futuro · ${subject2.pron} → ${subject1.pron}` };
  }

  // 'aunque' (although): the ONE connector in this app whose mood is a
  // meaning choice rather than a fixed rule. Indicative states a fact the
  // speaker accepts as true; subjunctive frames the same idea as
  // hypothetical/not yet confirmed — same word, different implication.
  if (state.templateName === 'aunque') {
    const complement1 = pickComplement(verb1, state.complementIndex, subject2.personIndex);
    const complement2 = pickComplement(verb2, state.complementIndex, subject1.personIndex);
    if (state.mood === 'indicative') {
      const subForm = conjugate(verb1, 'present', subject2.personIndex);
      const subEn = englishForm(verb1.en, 'present', subject2.personIndex);
      const mainForm = conjugate(verb2, 'present', subject1.personIndex);
      const mainEn = englishForm(verb2.en, 'present', subject1.personIndex);
      const es = `Aunque ${subject2.pron} ${subForm} ${complement1.es}, ${subject1.pron} ${mainForm} ${complement2.es}.`;
      const en = `Although ${subject2.en} ${subEn} ${complement1.en}, ${subject1.en} ${mainEn} ${complement2.en}.`;
      return { es, en, tag: `aunque + indicativo (hecho conocido) · ${subject2.pron} → ${subject1.pron}` };
    }
    const subForm = conjugate(verb1, 'subjunctive', subject2.personIndex);
    const mainForm = conjugate(verb2, 'future', subject1.personIndex);
    const es = `Aunque ${subject2.pron} ${subForm} ${complement1.es}, ${subject1.pron} ${mainForm} ${complement2.es}.`;
    const en = `Although ${subject2.en} may ${verb1.en.base} ${complement1.en}, ${subject1.en} will ${verb2.en.base} ${complement2.en}.`;
    return { es, en, tag: `aunque + subjuntivo (hipotético / no confirmado) · ${subject2.pron} → ${subject1.pron}` };
  }

  // 'porque' (because): a plain causal connector — always indicative, no
  // subjunctive at all, to contrast with the trigger/purpose templates.
  if (state.templateName === 'porque') {
    const complement1 = pickComplement(verb2, state.complementIndex, subject1.personIndex);
    const complement2 = pickComplement(verb1, state.complementIndex, subject2.personIndex);
    const mainForm = conjugate(verb2, 'present', subject1.personIndex);
    const mainEn = englishForm(verb2.en, 'present', subject1.personIndex);
    const reasonForm = conjugate(verb1, 'present', subject2.personIndex);
    const reasonEn = englishForm(verb1.en, 'present', subject2.personIndex);
    const es = `${cap(subject1.pron)} ${mainForm} ${complement1.es}, porque ${subject2.pron} ${reasonForm} ${complement2.es}.`;
    const en = `${cap(subject1.en)} ${mainEn} ${complement1.en}, because ${subject2.en} ${reasonEn} ${complement2.en}.`;
    return { es, en, tag: `porque + indicativo (causa) · ${subject1.pron} ← ${subject2.pron}` };
  }

  // 'para que' (so that): a purpose connector that, like a trigger verb,
  // is ALWAYS subjunctive and needs two different subjects.
  if (state.templateName === 'paraQue') {
    const complement1 = pickComplement(verb2, state.complementIndex, subject1.personIndex);
    const complement2 = pickComplement(verb1, state.complementIndex, subject2.personIndex);
    const mainForm = conjugate(verb2, 'present', subject1.personIndex);
    const mainEn = englishForm(verb2.en, 'present', subject1.personIndex);
    const purposeForm = conjugate(verb1, 'subjunctive', subject2.personIndex);
    const purposeEn = englishForm(verb1.en, 'subjunctive', subject2.personIndex);
    const es = `${cap(subject1.pron)} ${mainForm} ${complement1.es} para que ${subject2.pron} ${purposeForm} ${complement2.es}.`;
    const en = `${cap(subject1.en)} ${mainEn} ${complement1.en} so that ${subject2.en} ${purposeEn} ${complement2.en}.`;
    return { es, en, tag: `para que + subjuntivo (propósito) · ${subject1.pron} → ${subject2.pron}` };
  }

  // 'si' — hypothetical with tener (imperfect subjunctive) + conditional.
  // Spanish drops the repeated subject pronoun in the second clause.
  const complement = pickComplement(verb2, state.complementIndex, subject1.personIndex);
  const tenerVerb = verbByInfinitive('tener');
  const siForm = conjugate(tenerVerb, 'imperfectSubjunctive', subject1.personIndex);
  const verb2Cond = conjugate(verb2, 'conditional', subject1.personIndex);
  const es = `Si ${subject1.pron} ${siForm} tiempo, ${verb2Cond} ${complement.es}.`;
  const en = `If ${subject1.en} had time, ${subject1.en} would ${verb2.en.base} ${complement.en}.`;
  return { es, en, tag: `si + imperf. subj., condicional · ${subject1.pron}` };
}
