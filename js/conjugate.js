// Spanish verb conjugation engine.
// Person order used everywhere in this app (index 0-4):
//   0 yo | 1 tú | 2 él/ella/usted | 3 nosotros | 4 ellos/ellas/ustedes

export const PERSONS = ['yo', 'tú', 'él/ella', 'nosotros', 'ellos'];

const REGULAR_ENDINGS = {
  present: {
    ar: ['o', 'as', 'a', 'amos', 'an'],
    er: ['o', 'es', 'e', 'emos', 'en'],
    ir: ['o', 'es', 'e', 'imos', 'en'],
  },
  preterite: {
    ar: ['é', 'aste', 'ó', 'amos', 'aron'],
    er: ['í', 'iste', 'ió', 'imos', 'ieron'],
    ir: ['í', 'iste', 'ió', 'imos', 'ieron'],
  },
  imperfect: {
    ar: ['aba', 'abas', 'aba', 'ábamos', 'aban'],
    er: ['ía', 'ías', 'ía', 'íamos', 'ían'],
    ir: ['ía', 'ías', 'ía', 'íamos', 'ían'],
  },
  future: {
    // applied to the full infinitive (or an irregular future stem)
    ar: ['é', 'ás', 'á', 'emos', 'án'],
    er: ['é', 'ás', 'á', 'emos', 'án'],
    ir: ['é', 'ás', 'á', 'emos', 'án'],
  },
  conditional: {
    ar: ['ía', 'ías', 'ía', 'íamos', 'ían'],
    er: ['ía', 'ías', 'ía', 'íamos', 'ían'],
    ir: ['ía', 'ías', 'ía', 'íamos', 'ían'],
  },
  subjunctive: {
    // -ar verbs borrow -er/-ir endings and vice versa
    ar: ['e', 'es', 'e', 'emos', 'en'],
    er: ['a', 'as', 'a', 'amos', 'an'],
    ir: ['a', 'as', 'a', 'amos', 'an'],
  },
};

function stripEnding(infinitive) {
  return infinitive.slice(0, -2);
}

// -ar verbs whose stem ends g/c/z need an orthographic tweak (llegar ->
// llegué/llegue, not llegé/llege) whenever the ending that follows starts
// with a front vowel (e), so the hard consonant sound is preserved.
function adjustStemForFrontVowel(stem) {
  if (stem.endsWith('g')) return stem.slice(0, -1) + 'gu';
  if (stem.endsWith('c')) return stem.slice(0, -1) + 'qu';
  if (stem.endsWith('z')) return stem.slice(0, -1) + 'c';
  return stem;
}

function conjugateRegular(infinitive, type, tense, personIndex) {
  const stem = stripEnding(infinitive);
  if (tense === 'future' || tense === 'conditional') {
    return infinitive + REGULAR_ENDINGS[tense][type][personIndex];
  }
  let effectiveStem = stem;
  if (type === 'ar') {
    const endingStartsWithE = (tense === 'preterite' && personIndex === 0) || tense === 'subjunctive';
    if (endingStartsWithE) effectiveStem = adjustStemForFrontVowel(stem);
  }
  return effectiveStem + REGULAR_ENDINGS[tense][type][personIndex];
}

// Full hand-checked paradigms for irregular verbs used in this app.
// Only the tenses/moods the app actually uses are included.
const IRREGULAR = {
  ser: {
    present: ['soy', 'eres', 'es', 'somos', 'son'],
    preterite: ['fui', 'fuiste', 'fue', 'fuimos', 'fueron'],
    imperfect: ['era', 'eras', 'era', 'éramos', 'eran'],
    future: ['seré', 'serás', 'será', 'seremos', 'serán'],
    conditional: ['sería', 'serías', 'sería', 'seríamos', 'serían'],
    subjunctive: ['sea', 'seas', 'sea', 'seamos', 'sean'],
  },
  estar: {
    present: ['estoy', 'estás', 'está', 'estamos', 'están'],
    preterite: ['estuve', 'estuviste', 'estuvo', 'estuvimos', 'estuvieron'],
    imperfect: ['estaba', 'estabas', 'estaba', 'estábamos', 'estaban'],
    future: ['estaré', 'estarás', 'estará', 'estaremos', 'estarán'],
    conditional: ['estaría', 'estarías', 'estaría', 'estaríamos', 'estarían'],
    subjunctive: ['esté', 'estés', 'esté', 'estemos', 'estén'],
  },
  tener: {
    present: ['tengo', 'tienes', 'tiene', 'tenemos', 'tienen'],
    preterite: ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvieron'],
    imperfect: ['tenía', 'tenías', 'tenía', 'teníamos', 'tenían'],
    future: ['tendré', 'tendrás', 'tendrá', 'tendremos', 'tendrán'],
    conditional: ['tendría', 'tendrías', 'tendría', 'tendríamos', 'tendrían'],
    subjunctive: ['tenga', 'tengas', 'tenga', 'tengamos', 'tengan'],
    imperfectSubjunctive: ['tuviera', 'tuvieras', 'tuviera', 'tuviéramos', 'tuvieran'],
  },
  ir: {
    present: ['voy', 'vas', 'va', 'vamos', 'van'],
    preterite: ['fui', 'fuiste', 'fue', 'fuimos', 'fueron'],
    imperfect: ['iba', 'ibas', 'iba', 'íbamos', 'iban'],
    future: ['iré', 'irás', 'irá', 'iremos', 'irán'],
    conditional: ['iría', 'irías', 'iría', 'iríamos', 'irían'],
    subjunctive: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayan'],
  },
  hacer: {
    present: ['hago', 'haces', 'hace', 'hacemos', 'hacen'],
    preterite: ['hice', 'hiciste', 'hizo', 'hicimos', 'hicieron'],
    imperfect: ['hacía', 'hacías', 'hacía', 'hacíamos', 'hacían'],
    future: ['haré', 'harás', 'hará', 'haremos', 'harán'],
    conditional: ['haría', 'harías', 'haría', 'haríamos', 'harían'],
    subjunctive: ['haga', 'hagas', 'haga', 'hagamos', 'hagan'],
  },
  poder: {
    present: ['puedo', 'puedes', 'puede', 'podemos', 'pueden'],
    preterite: ['pude', 'pudiste', 'pudo', 'pudimos', 'pudieron'],
    imperfect: ['podía', 'podías', 'podía', 'podíamos', 'podían'],
    future: ['podré', 'podrás', 'podrá', 'podremos', 'podrán'],
    conditional: ['podría', 'podrías', 'podría', 'podríamos', 'podrían'],
    subjunctive: ['pueda', 'puedas', 'pueda', 'podamos', 'puedan'],
  },
  querer: {
    present: ['quiero', 'quieres', 'quiere', 'queremos', 'quieren'],
    preterite: ['quise', 'quisiste', 'quiso', 'quisimos', 'quisieron'],
    imperfect: ['quería', 'querías', 'quería', 'queríamos', 'querían'],
    future: ['querré', 'querrás', 'querrá', 'querremos', 'querrán'],
    conditional: ['querría', 'querrías', 'querría', 'querríamos', 'querrían'],
    subjunctive: ['quiera', 'quieras', 'quiera', 'queramos', 'quieran'],
  },
  ver: {
    present: ['veo', 'ves', 've', 'vemos', 'ven'],
    preterite: ['vi', 'viste', 'vio', 'vimos', 'vieron'],
    imperfect: ['veía', 'veías', 'veía', 'veíamos', 'veían'],
    future: ['veré', 'verás', 'verá', 'veremos', 'verán'],
    conditional: ['vería', 'verías', 'vería', 'veríamos', 'verían'],
    subjunctive: ['vea', 'veas', 'vea', 'veamos', 'vean'],
  },
};

// tense: 'present' | 'preterite' | 'imperfect' | 'future' | 'conditional' | 'subjunctive' | 'imperfectSubjunctive'
export function conjugate(verb, tense, personIndex) {
  if (verb.irregular) {
    const table = IRREGULAR[verb.infinitive];
    const forms = table && table[tense];
    if (forms) return forms[personIndex];
  }
  if (tense === 'imperfectSubjunctive') {
    throw new Error(`No imperfect subjunctive available for ${verb.infinitive}`);
  }
  return conjugateRegular(verb.infinitive, verb.type, tense, personIndex);
}

export function reflexivePronoun(personIndex) {
  return ['me', 'te', 'se', 'nos', 'se'][personIndex];
}
