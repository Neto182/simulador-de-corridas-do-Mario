/*
  Este é um simples motor de corrida entre dois jogadores, Mario e Luigi.
  A cada rodada, é sorteado um tipo de bloco (reta, curva ou confronto),
  rolado um dado para cada jogador e calculados os resultados baseado em atributos.
  Agora, no bloco de CONFRONTO adicionamos:
    - Sorteio de item de confronto: CASCO (-1 ponto) ou BOMBA (-2 pontos)
    - O perdedor do confronto perde pontos conforme o item
    - O vencedor do confronto tem chance de ganhar um TURBO (+1 ponto)
*/

const player1 = {
  NOME: "Mario",
  VELOCIDADE: 4,
  MANOBRABILIDADE: 3,
  PODER: 3,
  PONTOS: 0,
};

const player2 = {
  NOME: "Luigi",
  VELOCIDADE: 3,
  MANOBRABILIDADE: 4,
  PODER: 4,
  PONTOS: 0,
};

// Rola um dado de 6 lados
async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Sorteia tipo de bloco
async function getRandomBlock() {
  let random = Math.random();
  if (random < 0.33) return "RETA";
  if (random < 0.66) return "CURVA";
  return "CONFRONTO";
}

// Função de log de resultado de dado + atributo
async function logRollResult(name, type, dice, attr) {
  console.log(`${name} 🎲 rolou ${type}: ${dice} + ${attr} = ${dice + attr}`);
}

// Sorteia item de confronto (CASCO ou BOMBA)
function getConfrontItem() {
  if (Math.random() < 0.5) return { tipo: "CASCO", penalidade: 1 };
  return { tipo: "BOMBA", penalidade: 2 };
}

// Estrutura principal de jogo
async function playRaceEngine(c1, c2) {
  for (let round = 1; round <= 5; round++) {
    console.log(`🏁 Rodada ${round}`);
    const block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    const d1 = await rollDice();
    const d2 = await rollDice();
    let t1 = 0, t2 = 0;

    if (block === "RETA") {
      t1 = d1 + c1.VELOCIDADE;
      t2 = d2 + c2.VELOCIDADE;
      await logRollResult(c1.NOME, "velocidade", d1, c1.VELOCIDADE);
      await logRollResult(c2.NOME, "velocidade", d2, c2.VELOCIDADE);
    }

    if (block === "CURVA") {
      t1 = d1 + c1.MANOBRABILIDADE;
      t2 = d2 + c2.MANOBRABILIDADE;
      await logRollResult(c1.NOME, "manobrabilidade", d1, c1.MANOBRABILIDADE);
      await logRollResult(c2.NOME, "manobrabilidade", d2, c2.MANOBRABILIDADE);
    }

    if (block === "CONFRONTO") {
      // Sorteio de item
      const item = getConfrontItem();
      console.log(`Item de confronto: ${item.tipo} (perde ${item.penalidade} ponto(s))`);

      const p1 = d1 + c1.PODER;
      const p2 = d2 + c2.PODER;
      console.log(`${c1.NOME} confrontou ${c2.NOME}! 🥊`);
      await logRollResult(c1.NOME, "poder", d1, c1.PODER);
      await logRollResult(c2.NOME, "poder", d2, c2.PODER);

      if (p1 > p2) {
        // c2 perde pontos pela penalidade
        if (c2.PONTOS > 0) {
          c2.PONTOS -= item.penalidade;
          console.log(`${c1.NOME} venceu! ${c2.NOME} perdeu ${item.penalidade} ponto(s)`);
        }
        // chance de turbo ao vencedor
        if (Math.random() < 0.5) {
          c1.PONTOS++;
          console.log(`${c1.NOME} ganhou um TURBO! +1 ponto 🏎️`);
        }
      } else if (p2 > p1) {
        if (c1.PONTOS > 0) {
          c1.PONTOS -= item.penalidade;
          console.log(`${c2.NOME} venceu! ${c1.NOME} perdeu ${item.penalidade} ponto(s)`);
        }
        if (Math.random() < 0.5) {
          c2.PONTOS++;
          console.log(`${c2.NOME} ganhou um TURBO! +1 ponto 🏎️`);
        }
      } else {
        console.log("Confronto empatado! Nenhum ponto foi alterado.");
      }

      console.log("-----------------------------");
      continue; // pula para próxima rodada, não pontua por skill normal
    }

    // Pontuação normal em reta ou curva
    if (t1 > t2) {
      c1.PONTOS++;
      console.log(`${c1.NOME} marcou um ponto!`);
    } else if (t2 > t1) {
      c2.PONTOS++;
      console.log(`${c2.NOME} marcou um ponto!`);
    } else {
      console.log("Empate! Nenhum ponto marcado.");
    }

    console.log("-----------------------------");
  }
}

// Declara o vencedor
async function declareWinner(c1, c2) {
  console.log("Resultado final:");
  console.log(`${c1.NOME}: ${c1.PONTOS} ponto(s)`);
  console.log(`${c2.NOME}: ${c2.PONTOS} ponto(s)`);
  if (c1.PONTOS > c2.PONTOS) console.log(`\n${c1.NOME} venceu! 🏆`);
  else if (c2.PONTOS > c1.PONTOS) console.log(`\n${c2.NOME} venceu! 🏆`);
  else console.log("Empate geral! 😅");
}

// Execução principal
(async function main() {
  console.log(`🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`);
  await playRaceEngine(player1, player2);
  await declareWinner(player1, player2);
})();
