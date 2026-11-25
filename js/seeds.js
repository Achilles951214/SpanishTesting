// Curated seed sentences from the user's tracked recurring errors (tutor
// feedback, not random). Fed in as literal, hand-checked sentences rather
// than procedurally generated, since several of these deliberately hinge on
// an exact contrast (real vs. hypothetical "si", an accent that carries the
// whole meaning, a noun whose gender never matches its referent) that a
// template can't reliably recreate.
//
// This is the "Active" focused deck (built 25 Nov 2026) — only the 9 tiers
// currently causing the most errors, not the full master list. The master
// list (36 tiers) lives outside the app in the user's own notes; tiers get
// swapped in/out of this file as some get mastered and new ones emerge, per
// their own workflow ("Practice only these tiers until most sentences come
// out right... swap a tier out when it is mostly correct").
//
// engine.js round-robins through every tier at least once per cycle (plus
// one procedural slot), so a session always sees the full spread rather
// than leaning on whichever tiers chance favors. A handful of tiers get
// extra tickets in that same bag, by explicit current priority — see
// engine.js's TIER_TICKETS for the exact counts and what they're based on.
// The `weight` field itself is purely descriptive of priority and isn't
// read by the engine. `note`, where present, is the specific thing to
// notice — shown after the Spanish is revealed, alongside which
// tier/pattern this was.

export const SEED_TIERS = [
  {
    id: 27, weight: 10, name: 'Third-person verb for "I", and subject switches',
    sentences: [
      { es: 'Hace dos días visité Las Vegas para una conferencia.', en: 'Two days ago I visited Las Vegas for a conference.', note: 'visité, NOT visitó' },
      { es: 'Mi hija toca el violonchelo desde hace cinco años, y yo toco la guitarra desde hace muchos años.', en: "My daughter has played cello for five years, and I've played guitar for many years." },
      { es: 'Empecé a tocar la guitarra cuando tenía catorce años.', en: 'I started playing guitar when I was fourteen.', note: 'empecé... tenía, NOT empezó... tiene' },
      { es: 'Al principio tenía un profesor de guitarra, y después de tres años aprendí solo.', en: 'At first I had a guitar teacher, and after three years I learned on my own.' },
      { es: 'Fui solo a Harvard en bicicleta.', en: 'I went to Harvard alone by bike.', note: 'fui solo, NOT fue solo' },
      { es: 'Mi hija cantó una canción famosa, y yo toqué la guitarra.', en: 'My daughter sang a famous song, and I played the guitar.' },
      { es: 'Ella se levantó tarde, pero yo me levanté temprano.', en: 'She got up late, but I got up early.' },
      { es: 'Tim comió un sándwich de langosta y yo comí un taco.', en: 'Tim ate a lobster sandwich and I ate a taco.' },
      { es: 'Mi esposa vino a la charla, pero yo fui en bicicleta.', en: 'My wife came to the talk, but I went by bike.' },
      { es: 'Mi hija aprendió el violín, y yo aprendí la guitarra.', en: 'My daughter learned violin, and I learned guitar.' },
    ],
  },
  {
    id: 22, weight: 10, name: 'The verb follows the right subject',
    sentences: [
      { es: 'Nosotros fuimos a Nantucket en julio.', en: 'We went to Nantucket in July.', note: 'nosotros → fuimos; no article with the month after en' },
      { es: 'Mi familia y yo cantamos en un coro familiar.', en: 'My family and I sing in a family choir.', note: 'compound subject (mi familia y yo) still takes the nosotros form (cantamos)' },
      { es: 'Tim y yo fuimos a Nantucket y tomamos el ferry.', en: 'Tim and I went to Nantucket and took the ferry.' },
      { es: 'Teníamos hambre y sed.', en: 'We were hungry and thirsty.', note: 'tener hambre/sed is a fixed pair — NOT tenía for nosotros' },
      { es: 'Los camiones ofrecían comida.', en: 'The food trucks offered food.', note: 'camiones (plural subject) → ofrecían, not ofrecí' },
      { es: 'Yo comí un taco y Tim comió un sándwich de langosta.', en: 'I ate a taco and Tim ate a lobster sandwich.', note: 'each subject keeps its own ending — comí vs. comió' },
      { es: 'A veces yo toco la guitarra y mi hija canta.', en: 'Sometimes I play the guitar and my daughter sings.', note: 'habitual action = present tense — NOT yo toqué' },
      { es: 'Muchas personas vinieron a hablar conmigo y me dieron las gracias.', en: 'Many people came to talk with me and thanked me.', note: 'dar → dieron (they gave); NOT di mi las gracias' },
      { es: 'Les di las gracias y ellos me dieron un abrazo.', en: 'I thanked them and they gave me a hug.', note: 'dar: di (I gave) / dieron (they gave)' },
      { es: 'Mis hijas y yo nos acostumbramos pronto.', en: 'My daughters and I got used to it quickly.' },
      { es: 'Mi amigo vive en Madrid.', en: 'My friend lives in Madrid.', note: 'mi amigo (he) → vive, NOT vivo' },
      { es: 'Volvimos en bicicleta a la terminal del ferry.', en: 'We rode bikes back to the ferry terminal.', note: 'volvimos, not volvieron; la terminal is feminine' },
    ],
  },
  {
    id: 21, weight: 10, name: 'Preterite endings vs. subjunctive endings',
    sentences: [
      { es: 'Milo se acostumbró a nosotros en unas pocas semanas.', en: 'Milo got used to us within a few weeks.', note: 'a past event in a story = preterite indicative, not subjunctive' },
      { es: 'Espero que Milo se acostumbre a nosotros.', en: 'I hope Milo gets used to us.', note: 'esperar que triggers the subjunctive (se acostumbre)' },
      { es: 'Me gustó mucho la comida.', en: 'I really liked the food.', note: 'a one-time reaction = preterite (gustó)' },
      { es: 'Quiero que te guste la comida.', en: 'I want you to like the food.', note: 'querer que triggers the subjunctive (guste)' },
      { es: 'Nadamos en el mar, pero las olas eran muy fuertes.', en: 'We swam in the sea, but the waves were very strong.' },
      { es: 'Ojalá pudiéramos nadar más.', en: 'I wish we could swim more.', note: 'ojalá triggers the subjunctive (pudiéramos)' },
      { es: 'Asistieron doscientas o trescientas personas.', en: 'Two or three hundred people attended.', note: 'a past fact = preterite (asistieron)' },
      { es: 'Dudo que asistan tantas personas.', en: 'I doubt that many people will attend.', note: 'dudar que triggers the subjunctive (asistan)' },
      { es: 'Mi hija cantó una canción muy famosa.', en: 'My daughter sang a very famous song.' },
      { es: 'Quiero que mi hija cante otra canción.', en: 'I want my daughter to sing another song.', note: 'querer que triggers the subjunctive (cante)' },
      { es: 'Los camiones ofrecían tacos y pizzas.', en: 'The food trucks offered tacos and pizzas.', note: 'habitual background = imperfect (ofrecían)' },
      { es: 'Es posible que ofrezcan más comida mañana.', en: "It's possible they'll offer more food tomorrow.", note: 'es posible que triggers the subjunctive (ofrezcan)' },
      { es: 'Llegamos a las cinco y cenamos.', en: 'We arrived at five and had dinner.' },
      { es: 'Llama a Tim antes de que lleguemos.', en: 'Call Tim before we arrive.', note: 'antes de que triggers the subjunctive (lleguemos)' },
      { es: 'La cervecería invitaba muchos camiones de comida.', en: 'The brewery used to invite a lot of food trucks.', note: 'imperfect for what was usual; NOT invitará/invitaría' },
      { es: 'Se acostumbró, se enojó, se aburrió, se sintió.', en: 'He got used to it, got angry, got bored, felt it.', note: 'say the -ó ending firmly each time — all four are 3rd-person singular preterite' },
    ],
  },
  {
    id: 33, weight: 10, name: 'Future vs. conditional',
    sentences: [
      { es: 'El miércoles tendré una reunión de inversiones.', en: "On Wednesday I'll have an investment meeting.", note: 'future' },
      { es: 'Mañana iré a Harvard en bicicleta.', en: "Tomorrow I'll go to Harvard by bike." },
      { es: 'Si hace frío mañana, llevaré abrigo.', en: "If it's cold tomorrow, I'll wear a coat." },
      { es: 'Creo que llegaré tarde.', en: "I think I'll arrive late." },
      { es: 'Seguramente estará en casa.', en: "He's probably home.", note: 'future of probability' },
      { es: 'Dijo que llegaría tarde.', en: 'She said she would arrive late.', note: 'future in the past' },
      { es: 'Me dijo que vendría a las seis.', en: 'She told me she would come at six.' },
      { es: 'Me gustaría aprender más.', en: 'I would like to learn more.', note: 'polite or hypothetical' },
      { es: 'Podrían hacer nuevos descubrimientos.', en: 'They might make new discoveries.' },
      { es: 'Si tuviera más tiempo, viajaría más.', en: 'If I had more time, I would travel more.', note: 'hypothetical' },
      { es: 'Asistieron casi doscientas personas.', en: 'Almost two hundred people attended.', note: 'NOT asistirían; the event happened, so preterite' },
      { es: 'La cervecería tenía muchos camiones.', en: 'The brewery had a lot of trucks.', note: 'NOT invitaría' },
      { es: 'El año que viene tendrá que elegir una escuela.', en: "Next year she'll have to choose a school." },
      { es: '¿Qué harás el sábado?', en: 'What will you do on Saturday?' },
      { es: '¿Qué harías si ganaras la lotería?', en: 'What would you do if you won the lottery?' },
      { es: 'Saldremos a las ocho y volveremos temprano.', en: "We'll leave at eight and come back early." },
      { es: 'Dijeron que saldrían a las ocho.', en: 'They said they would leave at eight.' },
      { es: 'Habrá mucha gente en la charla.', en: 'There will be a lot of people at the talk.' },
      { es: 'Dijeron que habría mucha gente.', en: 'They said there would be a lot of people.', note: 'haber: hay → habrá, había → habría' },
    ],
  },
  {
    id: 19, weight: 10, name: 'Reflexive pronoun by person, plus "de" after prepositions',
    sentences: [
      { es: 'Esta mañana me levanté a las seis y media.', en: 'This morning I got up at six thirty.', note: 'me levanté, NOT se levanté' },
      { es: 'Me vestí rápido para la reunión.', en: 'I got dressed quickly for the meeting.', note: 'me vestí, NOT se me vestí' },
      { es: 'Me enojé y me aburrí un poco.', en: 'I got angry and got a little bored.', note: 'me enojé, NOT me enojó' },
      { es: 'No me relajaba por la noche porque tenía que prepararme para las reuniones.', en: "I wouldn't relax at night because I had to get ready for the meetings.", note: 'no me relajaba, NOT no me relajabas — habitual imperfect, yo' },
      { es: 'Cuando llegué a casa, me sentí muy relajado.', en: 'When I got home, I felt very relaxed.', note: 'me sentí (preterite), NOT me siento' },
      { es: 'No me acostaba tarde porque todos los días me despertaba temprano.', en: "I wouldn't go to bed late because every day I woke up early.", note: 'habitual past = imperfect (me acostaba, me despertaba)' },
      { es: 'Ella se levantó tarde, pero nosotros nos levantamos temprano.', en: 'She got up late, but we got up early.' },
      { es: 'Tú te vestiste rápido, y yo me vestí despacio.', en: 'You got dressed quickly, and I got dressed slowly.' },
      { es: 'Después de un viaje largo, me acosté temprano.', en: 'After a long trip, I went to bed early.', note: 'después de, NOT después [noun] directly' },
      { es: 'Hay muchos árboles alrededor de nuestra casa.', en: 'There are a lot of trees around our house.', note: 'alrededor de, NOT alrededor nuestra casa' },
      { es: 'La farmacia está cerca de mi casa.', en: 'The pharmacy is close to my house.', note: 'cerca de, NOT cerca mi casa' },
      { es: 'Antes de cenar, me duché.', en: 'Before having dinner, I showered.' },
      { es: 'Vivimos lejos de la ciudad, pero cerca de la playa.', en: 'We live far from the city, but close to the beach.' },
      { es: 'Llegué a casa a las seis y media.', en: 'I got home at six thirty.', note: 'a las seis y media — NOT a medio y seis' },
    ],
  },
  {
    id: 15,
    weight: 10,
    name: 'Reflexive & object pronouns — when to add, when to drop, which person',
    sentences: [
      { es: 'Por la mañana me puse las vacunas contra la gripe.', en: 'In the morning I got my flu shots.',
        note: 'ponerse + vacuna = "to get a shot" (also: vacunarme contra la gripe)' },
      { es: 'Me desperté temprano y me vestí rápido.', en: 'I woke up early and got dressed quickly.',
        note: 'try other persons: te despertaste, se despertó, nos despertamos' },
      { es: 'Nos enojamos porque el restaurante estaba cerrado, pero después nos calmamos.', en: 'We got angry because the restaurant was closed, but afterward we calmed down.' },
      { es: 'Se durmieron en el coche.', en: 'They fell asleep in the car.', note: 'dormirse = "to fall asleep"' },
      { es: 'Me acuerdo de que cuando era profesor, yo también aprendía mucho.', en: 'I remember that when I was a teacher, I also used to learn a lot.',
        note: 'acordarse de que + clause' },
      { es: 'Se mudó a nuestra ciudad el año pasado.', en: 'He moved to our city last year.',
        note: 'try other persons: me mudé, te mudaste, nos mudamos' },
      { es: 'Me puse nervioso antes de la reunión.', en: 'I got nervous before the meeting.' },
      { es: 'Siempre me había considerado bien vestido.', en: 'I had always considered myself well dressed.',
        note: 'pluperfect + reflexive together: me había considerado' },
      { es: 'Las hojas de los árboles cambiaban de color.', en: 'The leaves on the trees were changing color.',
        note: 'NOT se cambiaban — cambiar isn’t reflexive here' },
      { es: 'Tenía miedo de que llegáramos tarde.', en: 'I was afraid that we would arrive late.',
        note: 'NOT me tenía miedo — tener miedo isn’t reflexive' },
      { es: 'Soñé con viajar a Japón.', en: 'I dreamed of traveling to Japan.', note: 'NOT me soñé — soñar isn’t reflexive' },
      { es: 'Salimos temprano y llegamos a las cinco.', en: 'We left early and arrived at five.', note: 'salir and llegar aren’t reflexive' },
      { es: 'Necesito descansar un momento.', en: 'I need to rest for a moment.', note: 'same subject for both verbs → infinitive, no "que"' },
      { es: 'Corrí casi seis millas por la reserva.', en: 'I ran almost six miles through the reserve.',
        note: 'no preposition before the distance itself (casi seis millas); por la reserva separately marks the path' },
      { es: 'Mi perro no me acompañó.', en: 'My dog didn’t go with me.', note: 'NOT no había acompañado; try: te acompañó, nos acompañó' },
      { es: 'Mis amigos me acompañaron hasta el coche.', en: 'My friends walked with me to the car.' },
      { es: 'Los consejos me han venido muy bien.', en: 'The advice has done me a lot of good.',
        note: 'NOT just han venido muy bien; try: te han venido, nos han venido' },
      { es: 'Me dijo que debería llevar ropa formal.', en: 'He told me that I should wear formal clothes.' },
      { es: 'Le pregunté a mi jefe, y él me respondió enseguida.', en: 'I asked my boss, and he answered me right away.' },
      { es: 'A mi hija le gustó mucho la escuela.', en: 'My daughter liked the school a lot.',
        note: 'full noun (mi hija) + le — the same gustar-type pattern as Tier 4' },
      { es: 'Mi jefe me recomendó ver a una asesora de imagen.', en: 'My boss recommended that I see an image consultant.' },
    ],
  },
  {
    id: 28, weight: 10, name: 'Por vs. para',
    sentences: [
      { es: 'El primer día fue difícil para Milo.', en: 'The first day was hard for Milo.', note: 'para Milo, NOT por Milo' },
      { es: 'Quiero una mesa para cuatro personas.', en: 'I want a table for four people.', note: 'para, NOT por' },
      { es: 'Para las otras dos personas, dos cervezas, por favor.', en: 'For the other two people, two beers, please.' },
      { es: 'No tengo mucho tiempo para la música.', en: "I don't have much time for music.", note: 'para la música, NOT por la música' },
      { es: 'Necesitamos dos minutos para ver el menú.', en: 'We need two minutes to look at the menu.' },
      { es: 'La ciudad es muy famosa por el juego.', en: 'The city is very famous for gambling.', note: 'cause/reason = por' },
      { es: 'Ese día hacía mucho calor, y por eso teníamos sed.', en: "That day it was very hot, and that's why we were thirsty." },
      { es: 'Gracias por la actuación maravillosa.', en: 'Thanks for the wonderful performance.' },
      { es: 'Esto es para ti.', en: 'This is for you.' },
      { es: 'Corrí por el parque.', en: 'I ran through the park.', note: 'through a place = por' },
      { es: 'Corrí cuatro millas.', en: 'I ran four miles.', note: 'no preposition for distance' },
    ],
  },
  {
    id: 29, weight: 10, name: '"No" before the verb, "de" after prepositions, contractions, ser/estar',
    sentences: [
      { es: 'Harvard no está muy lejos de mi casa.', en: "Harvard isn't very far from my house.", note: 'no está, NOT es no' },
      { es: 'No tengo mucho tiempo.', en: "I don't have much time.", note: 'no tengo, NOT tengo no' },
      { es: 'La inteligencia artificial no reemplaza la creatividad humana.', en: "Artificial intelligence doesn't replace human creativity." },
      { es: 'No me dormí en el avión, pero practiqué español.', en: "I didn't fall asleep on the plane, but I practiced Spanish." },
      { es: 'Después de tres años, aprendí solo.', en: 'After three years, I learned on my own.', note: 'después de, NOT después tres años' },
      { es: 'Está a unas tres millas de mi casa.', en: "It's about three miles from my house.", note: 'a... de, NOT cerca tres millas' },
      { es: 'Me vestí para ir al aeropuerto.', en: 'I got dressed to go to the airport.', note: 'al aeropuerto, NOT a el aeropuerto' },
      { es: 'Después del café, me duché.', en: 'After coffee, I showered.' },
      { es: 'Voy al hotel.', en: "I'm going to the hotel.", note: 'al, del — contractions of a/de + el' },
      { es: 'La comida está muy sabrosa.', en: 'The food is very tasty.', note: 'taste = estar, NOT es' },
      { es: 'Practiqué español durante el viaje.', en: 'I practiced Spanish during the trip.' },
      { es: 'Practiqué mientras viajaba.', en: 'I practiced while I was traveling.', note: 'durante + noun, mientras + verb' },
      { es: 'Elijamos hablar en pasado y usemos los reflexivos.', en: "Let's choose to speak in the past and use reflexives." },
      { es: 'Practiquemos español.', en: "Let's practice Spanish.", note: 'nosotros commands' },
    ],
  },
  {
    id: 34, weight: 10, name: 'Hay / había (existence) and intentar / tratar',
    sentences: [
      { es: 'Hay muchas bailarinas en el espectáculo.', en: 'There are many dancers in the show.', note: 'hay, NOT es muchas bailarinas' },
      { es: 'Había una fila muy larga.', en: 'There was a very long line.', note: 'había, NOT no está una línea' },
      { es: 'En este coro hay niños y personas mayores.', en: 'In this choir there are children and older people.', note: 'hay, NOT son hijas, son niños' },
      { es: 'No había espacio para asientos.', en: 'There was no room for seats.' },
      { es: 'Había cinco edificios en el campus.', en: 'There were five buildings on campus.' },
      { es: 'Hay un restaurante cerca de mi casa.', en: "There's a restaurant near my house." },
      { es: 'Va a haber mucha gente mañana.', en: "There's going to be a lot of people tomorrow." },
      { es: 'Intento / Trato de entender la situación.', en: 'I try to understand the situation.', note: "both mean 'try to'; tratar needs de" },
      { es: 'Se trata de un libro sobre las matemáticas.', en: "It's about a book on mathematics.", note: "it's about" },
      { es: 'Trato bien a mis colegas.', en: 'I treat my colleagues well.', note: 'I treat' },
      { es: 'Probé el flan.', en: 'I tried/tasted the flan.', note: 'for food and things, probar' },
    ],
  },
];
