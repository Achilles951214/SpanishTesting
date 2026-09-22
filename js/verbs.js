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
  // "be" is the one English verb where the you/we/they present form (are)
  // and the I-form (am) both differ from the bare infinitive (be) used
  // after will/would/used to — presentBase/presentFirst cover that.
  { infinitive: 'ser', type: 'ar', irregular: true,
    en: { base: 'be', presentBase: 'are', presentFirst: 'am', thirdPerson: 'is', past: 'was' },
    complements: [
      { es: 'estudiante', esPlural: 'estudiantes', en: 'a student', enPlural: 'students' },
      { es: 'de aquí', en: 'from here' },
    ] },
  { infinitive: 'estar', type: 'ar', irregular: true,
    en: { base: 'be', presentBase: 'are', presentFirst: 'am', thirdPerson: 'is', past: 'was' },
    complements: [{ es: 'en casa', en: 'at home' }, { es: 'aquí', en: 'here' }] },
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
  { infinitive: 'dar', type: 'ar', irregular: true, en: { base: 'give', thirdPerson: 'gives', past: 'gave' },
    complements: [{ es: 'un regalo', en: 'a gift' }, { es: 'las gracias', en: 'thanks' }] },
  { infinitive: 'salir', type: 'ir', irregular: true, en: { base: 'leave', thirdPerson: 'leaves', past: 'left' },
    complements: [{ es: 'temprano', en: 'early' }, { es: 'los fines de semana', en: 'on weekends' }] },
  { infinitive: 'venir', type: 'ir', irregular: true, en: { base: 'come', thirdPerson: 'comes', past: 'came' },
    complements: [{ es: 'a la fiesta', en: 'to the party' }, { es: 'tarde', en: 'late' }] },
  { infinitive: 'poner', type: 'er', irregular: true, en: { base: 'put', thirdPerson: 'puts', past: 'put' },
    complements: [{ es: 'el libro aquí', en: 'the book here' }, { es: 'la ropa allí', en: 'the clothes there' }] },
  { infinitive: 'saber', type: 'er', irregular: true, en: { base: 'know', thirdPerson: 'knows', past: 'knew' },
    complements: [{ es: 'la respuesta', en: 'the answer' }, { es: 'nadar', en: 'how to swim' }] },
  { infinitive: 'decir', type: 'ir', irregular: true, en: { base: 'say', thirdPerson: 'says', past: 'said' },
    complements: [{ es: 'la verdad', en: 'the truth' }, { es: 'adiós', en: 'goodbye' }] },
];

// Reflexive verbs (conjugated as their non-reflexive infinitive; the app
// prepends the reflexive pronoun that matches the subject).
export const REFLEXIVE_VERBS = [
  { infinitive: 'levantar', type: 'ar', irregular: false,
    en: { base: 'get up', thirdPerson: 'gets up', past: 'got up' },
    complements: [{ es: 'temprano', en: 'early' }, { es: 'a las siete', en: 'at seven' }] },
  { infinitive: 'despertar', type: 'ar', irregular: true, // e -> ie
    en: { base: 'wake up', thirdPerson: 'wakes up', past: 'woke up' },
    complements: [{ es: 'tarde', en: 'late' }, { es: 'a las seis', en: 'at six' }] },
  { infinitive: 'acostar', type: 'ar', irregular: true, // o -> ue
    en: { base: 'go to bed', thirdPerson: 'goes to bed', past: 'went to bed' },
    complements: [{ es: 'temprano', en: 'early' }, { es: 'tarde', en: 'late' }] },
  { infinitive: 'vestir', type: 'ir', irregular: true, // e -> i
    en: { base: 'get dressed', thirdPerson: 'gets dressed', past: 'got dressed' },
    complements: [{ es: 'rápido', en: 'quickly' }, { es: 'bien', en: 'nicely' }] },
  { infinitive: 'duchar', type: 'ar', irregular: false,
    en: { base: 'shower', thirdPerson: 'showers', past: 'showered' },
    complements: [{ es: 'por la mañana', en: 'in the morning' }, { es: 'rápido', en: 'quickly' }] },
  { infinitive: 'sentir', type: 'ir', irregular: true, // e -> ie (e -> i in preterite/subj. nosotros)
    en: { base: 'feel', thirdPerson: 'feels', past: 'felt' },
    complements: [{ es: 'bien', en: 'well' }, { es: 'mal', en: 'sick' }] },
];

// gustar-type verbs: grammatically the SUBJECT is the thing liked (so the
// verb only ever conjugates in 3rd person), and the "liker" appears as an
// indirect object pronoun (me/te/le/nos/les), typically clarified with
// "a mí / a ti / a él ...". English flips this back to person-as-subject.
export const GUSTAR_VERBS = [
  { infinitive: 'gustar', type: 'ar', irregular: false, en: { base: 'like', thirdPerson: 'likes', past: 'liked' },
    items: [
      { es: 'el café', en: 'coffee', plural: false },
      { es: 'los libros', en: 'books', plural: true },
      { es: 'bailar', en: 'to dance', plural: false },
    ] },
  { infinitive: 'encantar', type: 'ar', irregular: false, en: { base: 'love', thirdPerson: 'loves', past: 'loved' },
    items: [
      { es: 'la música', en: 'music', plural: false },
      { es: 'las películas', en: 'movies', plural: true },
      { es: 'viajar', en: 'to travel', plural: false },
    ] },
  { infinitive: 'faltar', type: 'ar', irregular: false, en: { base: 'need', thirdPerson: 'needs', past: 'needed' },
    items: [
      { es: 'tiempo', en: 'time', plural: false },
      { es: 'dinero', en: 'money', plural: false },
      { es: 'las llaves', en: 'the keys', plural: true },
    ] },
];

export function verbByInfinitive(infinitive) {
  return VERBS.find((v) => v.infinitive === infinitive);
}

export function reflexiveByInfinitive(infinitive) {
  return REFLEXIVE_VERBS.find((v) => v.infinitive === infinitive);
}

export function gustarByInfinitive(infinitive) {
  return GUSTAR_VERBS.find((v) => v.infinitive === infinitive);
}
