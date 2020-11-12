const { NlpManager } = require('node-nlp');
const fs = require('fs');
const threshold = 0.5;
const nlpManager = new NlpManager({ languages: ['pt'], forceNER: true  });

const trainNLP = async function trainnlp(trainedModelDir) {
  if (fs.existsSync(`${trainedModelDir}/model.nlp`)) {
    nlpManager.load(`${trainedModelDir}/model.nlp`);
    return;
  }

  fs.readdirSync(`${trainedModelDir}/corpus`).map(async (fname) => {
    await nlpManager.addCorpus(`${trainedModelDir}/corpus/${fname}`);
  });

  const hrstart = process.hrtime();
  await nlpManager.train();
  const hrend = process.hrtime(hrstart);

  console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
  nlpManager.save(`${trainedModelDir}/model.nlp`);
};

module.exports = async (trainedModelDir, message) => {
  await trainNLP(trainedModelDir);
  if (message){
    const result = await nlpManager.process(message);
    const answer =
      result.score > threshold && result.answer
        ? result.answer
        : "Desculpa, não entendi";
    return {
      'msg': answer,
      'action': result.intent.startsWith('action') ? result.intent.replace(/action\./, "") : null,
    }
  }
};
