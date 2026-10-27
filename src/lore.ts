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
