/* História do personagem. RASCUNHO: troque o texto aqui quando quiser.
   {nome} é substituído pelo nome escolhido pelo jogador. */
export const NOME_PADRAO = 'Helena Varga'

export const LORE = {
  paragrafos: [
    '{nome} cresceu num bairro onde todo mundo sabia da vida de todo mundo, e ninguém falava do que sabia. Foi ali que aprendeu a observar antes de perguntar.',
    'Entrou para a polícia aos vinte e poucos anos, depois de um caso de família que a marcou: a verdade apareceu, mas tarde demais para salvar a casa. Desde então, não aceita a versão mais fácil.',
    'Hoje trabalha por conta própria, com um caderno, uma lanterna e memória para pequenos detalhes. Os dossiês do arquivo são os casos que decidiu não deixar esquecidos.',
    'Ninguém sabe ao certo quantos casos já resolveu. Diz que a conta não importa. Importa o próximo.',
  ],
}

export const textoLore = (nome: string) => LORE.paragrafos.map((p) => p.replace('{nome}', nome))

/* C4: capítulos desbloqueados pelo número de casos resolvidos. */
export const CAPITULOS: { n: number; titulo: string; precisa: number; paragrafos: string[] }[] = [
  {
    n: 1,
    titulo: 'Primeira pista',
    precisa: 1,
    paragrafos: [
      '{nome} lembra da primeira vez que viu um dossiê. Não era um caso grande, só um furto numa casa de família, mas a resposta estava onde ninguém tinha olhado.',
    ],
  },
  {
    n: 2,
    titulo: 'Rumores no porto',
    precisa: 3,
    paragrafos: [
      '{nome} passou a ser chamado para casos que nenhuma delegacia queria. Ninguém pagava bem, mas as histórias começavam a se cruzar: barcos sem nota, herdeiros com pressa, cofres abertos sem arrombamento.',
    ],
  },
  {
    n: 3,
    titulo: 'A luz que se apaga',
    precisa: 5,
    paragrafos: [
      '{nome} aprendeu que a verdade quase nunca aparece sozinha. Ela sempre deixa uma luz acesa em algum lugar, e cabe a quem investiga perceber qual delas foi apagada de propósito.',
    ],
  },
  {
    n: 4,
    titulo: 'O silêncio',
    precisa: 7,
    paragrafos: [
      '{nome} chegou a uma casa onde a música parou de tocar. Foi ali que entendeu o que a investigação realmente exige: ouvir o que não é dito e confiar no que sobra depois do silêncio.',
    ],
  },
]
