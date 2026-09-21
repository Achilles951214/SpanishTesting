// Verb bank + English-side data for sentence generation.
// `type` is only meaningful for regular verbs (drives the ending table);
// irregular verbs are looked up by infinitive in conjugate.js instead.

export const SUBJECTS = [
  { personIndex: 0, pron: 'yo', en: 'I' },
  { personIndex: 1, pron: 'tú', en: 'you' },
  { personIndex: 2, pron: 'él', en: 'he' },
  { personIndex: 2, pron: 'ella', en: 'she' },
  { personIndex: 3, pron: 'nosotros', en: 'we' },
  { personIndex: 4, pron: 'ellos', en: 'they' },
];

// English present tense needs a 3rd-person-singular form ("speaks"); every
// other tense used in this app renders the same regardless of subject.
export const VERBS = [
  { infinitive: 'hablar', type: 'ar', irregular: false, en: { base: 'speak', thirdPerson: 'speaks', past: 'spoke' },
    complements: [{ es: 'español', en: 'Spanish' }, { es: 'por teléfono', en: 'on the phone' }] },
  { infinitive: 'trabajar', type: 'ar', irregular: false, en: { base: 'work', thirdPerson: 'works', past: 'worked' },
    complements: [{ es: 'mucho', en: 'a lot' }, { es: 'aquí', en: 'here' }] },
  { infinitive: 'llegar', type: 'ar', irregular: false, en: { base: 'arrive', thirdPerson: 'arrives', past: 'arrived' },
    complements: [{ es: 'tarde', en: 'late' }, { es: 'a tiempo', en: 'on time' }] },
  { infinitive: 'estudiar', type: 'ar', irregular: false, en: { base: 'study', thirdPerson: 'studies', past: 'studied' },
    complements: [{ es: 'para el examen', en: 'for the exam' }, { es: 'español', en: 'Spanish' }] },
  { infinitive: 'comer', type: 'er', irregular: false, en: { base: 'eat', thirdPerson: 'eats', past: 'ate' },
    complements: [{ es: 'pizza', en: 'pizza' }, { es: 'en casa', en: 'at home' }] },
  { infinitive: 'beber', type: 'er', irregular: false, en: { base: 'drink', thirdPerson: 'drinks', past: 'drank' },
    complements: [{ es: 'café', en: 'coffee' }, { es: 'agua', en: 'water' }] },
  { infinitive: 'vivir', type: 'ir', irregular: false, en: { base: 'live', thirdPerson: 'lives', past: 'lived' },
    complements: [{ es: 'en Madrid', en: 'in Madrid' }, { es: 'cerca', en: 'nearby' }] },
  { infinitive: 'escribir', type: 'ir', irregular: false, en: { base: 'write', thirdPerson: 'writes', past: 'wrote' },
    complements: [{ es: 'una carta', en: 'a letter' }, { es: 'un mensaje', en: 'a message' }] },
  { infinitive: 'ser', type: 'ar', irregular: true, en: { base: 'be', thirdPerson: 'is', past: 'was' },
    complements: [
      { es: 'estudiante', esPlural: 'estudiantes', en: 'a student', enPlural: 'students' },
      { es: 'de aquí', en: 'from here' },
    ] },
  { infinitive: 'estar', type: 'ar', irregular: true, en: { base: 'be', thirdPerson: 'is', past: 'was' },
    complements: [{ es: 'en casa', en: 'at home' }, { es: 'listo', en: 'ready' }] },
  { infinitive: 'tener', type: 'er', irregular: true, en: { base: 'have', thirdPerson: 'has', past: 'had' },
    complements: [{ es: 'tiempo', en: 'time' }, { es: 'hambre', en: 'hunger' }] },
  { infinitive: 'ir', type: 'ir', irregular: true, en: { base: 'go', thirdPerson: 'goes', past: 'went' },
    complements: [{ es: 'a la tienda', en: 'to the store' }, { es: 'al cine', en: 'to the movies' }] },
  { infinitive: 'hacer', type: 'er', irregular: true, en: { base: 'do', thirdPerson: 'does', past: 'did' },
    complements: [{ es: 'la tarea', en: 'homework' }, { es: 'ejercicio', en: 'exercise' }] },
  { infinitive: 'poder', type: 'er', irregular: true, en: { base: 'can', thirdPerson: 'can', past: 'could' },
    complements: [{ es: 'hoy', en: 'today' }] },
  { infinitive: 'querer', type: 'er', irregular: true, en: { base: 'want', thirdPerson: 'wants', past: 'wanted' },
    complements: [{ es: 'ahora', en: 'now' }] },
  { infinitive: 'ver', type: 'er', irregular: true, en: { base: 'see', thirdPerson: 'sees', past: 'saw' },
    complements: [{ es: 'la película', en: 'the movie' }, { es: 'las noticias', en: 'the news' }] },
];

export const REFLEXIVE_VERB = {
  infinitive: 'levantar', type: 'ar', irregular: false,
  en: { base: 'get up', thirdPerson: 'gets up', past: 'got up' },
  complements: [{ es: 'temprano', en: 'early' }, { es: 'a las siete', en: 'at seven' }],
};

export function verbByInfinitive(infinitive) {
  return VERBS.find((v) => v.infinitive === infinitive);
}
