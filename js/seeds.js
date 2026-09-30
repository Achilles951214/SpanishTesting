// Curated seed sentences from the user's tracked recurring errors (tutor
// feedback, not random). Tiers are ordered — and weighted — by how much
// trouble each has actually caused; Tier 1 (preterite person-agreement) is
// the single most-flagged issue, so it shows up most often. Fed in as
// literal, hand-checked sentences rather than procedurally generated, since
// several of these deliberately hinge on an exact contrast (real vs.
// hypothetical "si", an accent that carries the whole meaning, a noun whose
// gender never matches its referent) that a template can't reliably recreate.
//
// `weight` sets how often this tier is picked relative to the others (and to
// the procedural generator) within its mode. `note`, where present, is the
// specific thing to notice — shown after the Spanish is revealed.

export const SEED_TIERS = [
  {
    id: 1,
    mode: 'simple',
    weight: 12,
    name: 'Preterite, person-agreement under pressure',
    sentences: [
      { es: 'Yo fui al banco, pero mi hermano no fue.', en: 'I went to the bank, but my brother didn’t.' },
      { es: 'Nosotros tuvimos suerte, pero ellos no tuvieron ninguna.', en: 'We had luck, but they didn’t have any.' },
      { es: 'Ayer hice la tarea, pero mis hijas no hicieron la suya.', en: 'Yesterday I did the homework, but my daughters didn’t do theirs.' },
      { es: 'Tú dijiste una cosa, y yo dije otra.', en: 'You said one thing, and I said another.' },
      { es: 'Ella estuvo en Madrid, pero nosotros estuvimos en Barcelona.', en: 'She was in Madrid, but we were in Barcelona.' },
      { es: 'Todos estábamos cansados después del viaje.', en: 'We were all tired after the trip.',
        note: 'imperfect here, not preterite — an ongoing state ("todos" includes you, so it’s nosotros, not ellos)' },
      { es: 'Más tarde fui a muchos lugares, pero mi amigo fue a pocos.', en: 'Later I went to many places, but my friend went to few.' },
      { es: 'No tuvimos tiempo, pero ellos sí tuvieron.', en: 'We didn’t have time, but they did.' },
      { es: 'Vine temprano, pero tú viniste tarde.', en: 'I came early, but you came late.' },
      { es: 'Pudimos terminar el proyecto, pero él no pudo.', en: 'We were able to finish the project, but he wasn’t.' },
    ],
  },
  {
    id: 2,
    mode: 'simple',
    weight: 9,
    name: 'Preterite vs. imperfect, blended in one narrative',
    sentences: [
      { es: 'Hacía mucho frío cuando llegamos a la montaña.', en: 'It was very cold when we arrived at the mountain.',
        note: 'background weather = imperfect; the arrival itself = preterite' },
      { es: 'Mientras ella cocinaba, yo puse la mesa.', en: 'While she was cooking, I set the table.',
        note: 'ongoing action = imperfect; the one-time act of setting the table = preterite' },
      { es: 'Estábamos muy cansados, así que decidimos descansar.', en: 'We were very tired, so we decided to rest.' },
      { es: 'El cielo estaba gris cuando empezó a llover.', en: 'The sky was gray when it started to rain.' },
      { es: 'Mi abuela vivió en Chile por ocho años.', en: 'My grandmother lived in Chile for eight years.',
        note: 'a bounded, completed span of time still takes preterite, even though it feels "ongoing"' },
      { es: 'Tenía miedo, pero al final hablé con él.', en: 'I was afraid, but in the end I talked to him.' },
      { es: 'Eran las nueve cuando salimos de casa.', en: 'It was nine o’clock when we left the house.',
        note: 'telling time is always imperfect' },
      { es: 'La fiesta era aburrida, así que nos fuimos temprano.', en: 'The party was boring, so we left early.' },
    ],
  },
  {
    id: 3,
    mode: 'simple',
    weight: 8,
    name: 'Gender & number agreement',
    sentences: [
      { es: 'La semana pasada trabajé mucho.', en: 'Last week I worked a lot.', note: 'semana is feminine' },
      { es: 'Él tiene la cabeza grande.', en: 'He has a big head.', note: 'cabeza is feminine; body parts take the definite article, not a possessive' },
      { es: 'Gestiono las inversiones de la empresa.', en: 'I manage the company’s investments.', note: 'inversiones is feminine plural' },
      { es: 'Mi hermana está casada con un médico.', en: 'My sister is married to a doctor.' },
      { es: 'No conseguirás eso en otras partes.', en: 'You won’t get that anywhere else.' },
      { es: 'Compré muchas verduras y una milla de tela.', en: 'I bought a lot of vegetables and a mile of fabric.',
        note: 'verdura and milla are both feminine' },
      { es: 'El concierto ya no tiene entradas disponibles.', en: 'The concert no longer has tickets available.', note: 'concierto is masculine' },
      { es: 'Esa actriz es un verdadero genio.', en: 'That actress is a true genius.' },
      { es: 'La víctima era un hombre joven.', en: 'The victim was a young man.' },
      { es: 'Esa historia es toda una leyenda.', en: 'That story is quite a legend.' },
    ],
  },
  {
    id: 4,
    mode: 'simple',
    weight: 7,
    name: 'Gustar-family with a full noun, not a pronoun',
    sentences: [
      { es: 'A mi perro le preocupan los ruidos fuertes.', en: 'Loud noises worry my dog.' },
      { es: 'A la gente le da miedo ese lugar.', en: 'That place scares people.' },
      { es: 'A mis hijas les gusta mucho leer.', en: 'My daughters like reading a lot.' },
      { es: 'Al profesor le molesta el ruido en clase.', en: 'The noise in class bothers the teacher.', note: 'a + el = al' },
      { es: 'A los estudiantes les interesa el tema.', en: 'The students are interested in the topic.' },
      { es: 'A mi hermano no le importa el resultado.', en: 'My brother doesn’t care about the result.' },
    ],
  },
  {
    id: 5,
    mode: 'simple',
    weight: 6,
    name: 'Accent homophones — the mark carries the meaning',
    sentences: [
      { es: 'Él llegó tarde, pero el autobús llegó antes.', en: 'He arrived late, but the bus arrived earlier.', note: 'él (he) vs. el (the)' },
      { es: 'Si vienes conmigo, te diré si es verdad.', en: 'If you come with me, I’ll tell you if it’s true.', note: 'both "si" here are "if" — no accent either time' },
      { es: 'A mí no me gusta, pero mi amigo dice que es bueno.', en: 'I don’t like it, but my friend says it’s good.', note: 'mí (me) vs. mi (my)' },
      { es: 'No sé cuándo llega, pero cuando llega, siempre trae comida.', en: 'I don’t know when he arrives, but when he arrives, he always brings food.', note: 'cuándo (question word) vs. cuando (conjunction)' },
      { es: 'Tú tienes tu propia opinión.', en: 'You have your own opinion.', note: 'tú (you) vs. tu (your)' },
      { es: 'Sé que él se preocupa mucho.', en: 'I know that he worries a lot.', note: 'sé (I know) vs. se (reflexive pronoun)' },
    ],
  },
  {
    id: 6,
    mode: 'complex',
    weight: 14,
    name: 'Subjunctive: triggers, sequencing, real vs. hypothetical',
    sentences: [
      { es: 'Tenía miedo de que llegáramos tarde.', en: 'I was afraid that we would arrive late.', note: 'past trigger → imperfect subjunctive, not present' },
      { es: 'Espero que tengas un buen viaje.', en: 'I hope you have a good trip.' },
      { es: 'Si llueve mañana, cancelaremos el plan.', en: 'If it rains tomorrow, we’ll cancel the plan.', note: 'real condition — present indicative, not subjunctive' },
      { es: 'Si fuera rico, viajaría por el mundo.', en: 'If I were rich, I would travel the world.', note: 'hypothetical — imperfect subjunctive + conditional' },
      { es: 'No te preocupes por la reunión.', en: 'Don’t worry about the meeting.', note: 'negative commands use the subjunctive form' },
      { es: 'Me alegra que pudieras venir.', en: 'I’m glad you could come.' },
      { es: 'Como estábamos cansados, decidimos no salir.', en: 'Since we were tired, we decided not to go out.', note: 'como = "since/because" here — not a subjunctive trigger' },
      { es: 'No todos los estudiantes aprobaron el examen.', en: 'Not all the students passed the exam.', note: 'plain indicative — the "no" doesn’t trigger subjunctive here' },
    ],
  },
  {
    id: 7,
    mode: 'simple',
    weight: 5,
    name: 'Verb + preposition pairs',
    sentences: [
      { es: 'Me preocupo por mi trabajo.', en: 'I worry about my work.' },
      { es: 'Sueño con viajar a Japón.', en: 'I dream of traveling to Japan.' },
      { es: 'Trato de entender la situación.', en: 'I try to understand the situation.' },
      { es: 'Depende de ti.', en: 'It depends on you.' },
      { es: 'Me casé con mi mejor amiga.', en: 'I married my best friend.' },
      { es: 'Cuento contigo para esto.', en: 'I count on you for this.' },
      { es: 'El año pasado le gané a mi hermano en una carrera.', en: 'Last year I beat my brother in a race.' },
    ],
  },
  {
    id: 8,
    mode: 'simple',
    weight: 4,
    name: 'Fixed-gender nouns — don’t flex with the referent',
    sentences: [
      { es: 'Mi abuela era todo un personaje.', en: 'My grandmother was quite a character.', note: 'personaje stays masculine even for a woman' },
      { es: 'Ese actor es una leyenda.', en: 'That actor is a legend.', note: 'leyenda stays feminine even for a man' },
      { es: 'La víctima fue un hombre.', en: 'The victim was a man.', note: 'víctima stays feminine even for a man' },
      { es: 'Mi hermana es un genio.', en: 'My sister is a genius.', note: 'genio stays masculine even for a woman' },
      { es: 'Ese cantante es una estrella internacional.', en: 'That singer is an international star.', note: 'estrella stays feminine even for a man' },
    ],
  },
];
