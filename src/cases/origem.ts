import type { Case, Clue, SceneData, Suspect } from '../types'

/* Caso 000 · Onde tudo começou: caso de treino que ensina as mecânicas. */

const SUS: Suspect[] = [
  {
    id: 'pe',
    name: 'Pedro Lima',
    role: 'Mordomo, 50 anos',
    ini: 'P',
    qs: [
      ['Onde estava quando a joia sumiu?', 'Na cozinha, fechando a louça. Fui dormir cedo.'],
      ['Quem tem acesso à caixa de joias?', 'Só a dona Clara e eu, com a chave reserva.'],
      ['Viu alguém no corredor à noite?', 'Ninguém. A casa estava silenciosa demais.'],
    ],
    re: {
      c1: ['Essa caixa sempre ficou fechada à chave. Comigo.'],
      c4: ['Não bebo na cozinha durante o serviço.', 'contra'],
      c6: ['A chave reserva fica no gancho. Devolvi ontem à noite.', 'clear'],
      c7: ['Esse pacote não é meu.'],
    },
  },
  {
    id: 'va',
    name: 'Vânia Lima',
    role: 'Sobrinha da anfitriã, 27 anos',
    ini: 'V',
    qs: [
      ['Onde estava às 22h?', 'No quarto de hóspedes, no celular com um amigo.'],
      ['Você tinha dívidas?', 'Um pouco. Nada que justifique isso.'],
      ['Quem sabia da joia?', 'A família inteira. Minha tia sempre mostrava.'],
    ],
    re: {
      c2: ['Esse táxi me levou para casa, não para a mansão.', 'clear'],
      c5: ['Esse encontro era com um credor. Sim, menti.', 'adm'],
      c7: ['O pacote de veludo é meu. Escondi lá por medo de ser revistada.', 'adm'],
      c8: ['Meu relógio parou porque deixei na pia. Só isso.'],
    },
  },
  {
    id: 'te',
    name: 'Teodoro Ramos',
    role: 'Amigo da família, 60 anos',
    ini: 'T',
    qs: [
      ['Onde estava às 22h?', 'Na biblioteca, lendo o jornal perto da lareira.'],
      ['Você conhecia bem a casa?', 'Vinte anos de jantares. Conheço cada gaveta.'],
      ['Algo estranho nesta noite?', 'Só a chuva e a discussão sobre o seguro.'],
    ],
    re: {
      c3: ['Essa lama é do jardim. Todo mundo andou lá fora.', 'crack'],
      c5: ['Vi a agenda aberta, mas não toquei em nada.'],
      c6: ['Eu não pego chaves. Pergunte ao mordomo.'],
    },
  },
]

const CLUES: Clue[] = [
  { id: 'c1', sc: 'of_esc', t: 'Caixa de joias vazia', x: 'A tampa foi forçada, sem sinal de chave. Quem a abriu conhecia o mecanismo.' },
  { id: 'c2', sc: 'of_hal', t: 'Recibo de táxi', x: 'Um táxi chegou à mansão às 21h50 e saiu logo em seguida, segundo o recibo amassado.' },
  { id: 'c3', sc: 'of_hal', t: 'Pegadas de lama', x: 'Marcas de lama fresca levam do jardim até a porta da cozinha.' },
  { id: 'c4', sc: 'of_jan', t: 'Copo com batom', x: 'Um copo de água, com marca de batom, usado depois do jantar.' },
  { id: 'c5', sc: 'of_esc', t: 'Agenda com encontro', x: 'Uma agenda marca um encontro às 23h com alguém que não está na lista de convidados.' },
  { id: 'c6', sc: 'of_jan', t: 'Chave reserva fora do lugar', x: 'O gancho da chave reserva está vazio, algo que não deveria acontecer.' },
  { id: 'c7', sc: 'of_qua', t: 'Pacote de veludo', x: 'Um pacote de veludo, do tamanho de uma joia, escondido sob a roupa da mala.' },
  { id: 'c8', sc: 'of_qua', t: 'Relógio parado', x: 'Um relógio de pulso parado às 22h10, com a pulseira aberta.' },
]

const SC: Record<string, SceneData> = {
  of_hal: { n: 'Hall de entrada', d: 'Piso de tacos gastos e o lustre apagado. A porta da frente ainda tem lama presa na soleira.', h: [['c2', 60, 120], ['c3', 200, 150]] },
  of_jan: { n: 'Sala de jantar', d: 'A mesa foi posta para cinco e o vinho já estava aberto. Alguém saiu no meio do jantar.', h: [['c4', 120, 110], ['c6', 260, 120]] },
  of_esc: { n: 'Escritório', d: 'Uma caixa de joias sobre a escrivaninha, com a tampa encostada. Nada mais parece ter sido mexido.', h: [['c1', 160, 120], ['c5', 300, 100]] },
  of_qua: { n: 'Quarto de hóspedes', d: 'A mala de Vânia está aberta sobre a cama. Alguém mexeu nas roupas.', h: [['c7', 90, 150], ['c8', 230, 120]] },
}

export const origem: Case = {
  id: 'origem',
  key: 'cases-stories-origem-v1',
  theme: 'origem',
  no: '000',
  title: 'Onde Tudo Começou',
  titleLines: ['Onde Tudo', 'Começou'],
  kind: 'Caso de treino · Furto',
  tagline: 'Uma joia some. Três pessoas estavam em casa.',
  synopsis:
    'Seu primeiro caso. Na mansão Lima, uma joia de família desaparece durante a noite. Só uma das três pessoas da casa mentiu.',
  place: 'Mansão Lima',
  bg: 'of_hal',
  suspectsLabel: 'Três pessoas estavam em casa naquela noite',
  suspects: SUS,
  clues: CLUES,
  scenes: SC,
  tutorial: {
    cenas: 'Toque nos pontos dourados para examinar cada objeto. Cada um vira uma evidência no quadro.',
    susp: 'Escolha uma pessoa, faça perguntas e apresente evidências. Respostas com etiqueta vermelha são contradições.',
    quadro: 'Ligue cada evidência às letras de um suspeito. Assim você organiza o raciocínio antes de acusar.',
    acusar: 'Escolha culpado, método e motivo. O resumo do caso mostra o que você já descobriu.',
  },
  met: [
    'Abriu a caixa com a chave reserva enquanto a tia dormia',
    'Trocou a joia por uma réplica de vidro na madrugada',
    'Saiu pela porta da cozinha sem ser vista',
  ],
  mot: ['Pagar dívidas com a joia', 'Vingar-se da tia por um testamento', 'Fugir da cidade com a família'],
  win: {
    s: 'va',
    m: 0,
    r: 0,
    text: [
      'Era Vânia Lima. Ela tinha dívidas com um credor e conhecia a caixa de joias desde criança. A chave reserva, que sumiu do gancho, foi o que a entregou.',
      'O recibo de táxi, a agenda e o pacote de veludo fecharam o caso. Você fez o seu primeiro: é o começo de todos os outros.',
    ],
  },
  ranks: [
    [8, 'Primeiro caso, primeira medalha: você nunca se perdeu.'],
    [6, 'Bom começo. Quase nada escapou.'],
    [0, 'Caso resolvido. Toda carreira começa assim.'],
  ],
}
