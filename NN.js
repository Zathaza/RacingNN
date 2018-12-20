var USE_TRAINED_POP = 0;
var genome;
var genome1;
//var myNetwork = neataptic.architect.Perceptron(3, 5, 2);

/*function NNact(dS, dL, dR, cNr) 
{
     // NNoutput[0]: turn, NNoutput[1]: accelerate
     //myNetwork.mutate(neataptic.methods.mutation.MOD_WEIGHT);
    tdistStraight = dS/450;
    tdistLeft = dL/450;
    tdistRight = dR/450;

    if (tdistStraight > tdistLeft && tdistStraight > tdistRight)
    {
      tdistStraight = 1;
      if (tdistLeft > tdistRight)
      {
        tdistLeft = 0.5;
        tdistRight = 0;
      }
      else
      {
        tdistLeft = 0;
        tdistRight = 0.5;
      }
    }
    else if (tdistLeft > tdistStraight && tdistLeft > tdistRight)
    {
      tdistLeft = 1;
      if (tdistStraight > tdistRight)
      {
        tdistStraight = 0.5;
        tdistRight = 0;
      }
      else
      {
        tdistStraight = 0;
        tdistRight = 0.5;
      }
    }
    else
    {
      tdistRight = 1;
      if (tdistStraight > tdistLeft)
      {
        tdistStraight = 0.5;
        tdistLeft = 0;
      }
      else
      {
        tdistStraight = 0;
        tdistLeft = 0.5;
      }
    }

    var tempOutput;
    tempOutput = genomes[cNr].activate([tdistStraight, tdistLeft, tdistRight]);
    tempOutput[0] = (tempOutput[0] - 0.5) * 2; //turn from -1 to 1
    tempOutput[1] = (tempOutput[1] + 0.24) * 0.83; // accelerate from ~0.2 to ~1
    NNoutput[cNr][0] = tempOutput[0];
    NNoutput[cNr][1] = tempOutput[1];

    return NNoutput;
}*/

function NNact(dS, dL, dR, cNr) 
{
     // NNoutput[0]: turn, NNoutput[1]: accelerate
     //myNetwork.mutate(neataptic.methods.mutation.MOD_WEIGHT);
    tdistStraight = dS/450;
    tdistLeft = dL/450;
    tdistRight = dR/450;

    if (tdistStraight > tdistLeft && tdistStraight > tdistRight)
    {
      tdistStraight = 1;
      if (tdistLeft > tdistRight)
      {
        tdistLeft = 0.5;
        tdistRight = 0;
      }
      else
      {
        tdistLeft = 0;
        tdistRight = 0.5;
      }
    }
    else if (tdistLeft > tdistStraight && tdistLeft > tdistRight)
    {
      tdistLeft = 1;
      if (tdistStraight > tdistRight)
      {
        tdistStraight = 0.5;
        tdistRight = 0;
      }
      else
      {
        tdistStraight = 0;
        tdistRight = 0.5;
      }
    }
    else
    {
      tdistRight = 1;
      if (tdistStraight > tdistLeft)
      {
        tdistStraight = 0.5;
        tdistLeft = 0;
      }
      else
      {
        tdistStraight = 0;
        tdistLeft = 0.5;
      }
    }

    if (cNr == 0)
    {
      var tempOutput;
      tempOutput = genome.activate([tdistStraight, tdistLeft, tdistRight]);
      tempOutput[0] = (tempOutput[0] - 0.5) * 2; //turn from -1 to 1
      tempOutput[1] = (tempOutput[1] + 0.24) * 0.83; // accelerate from ~0.2 to ~1
      NNoutput[cNr][0] = tempOutput[0];
      NNoutput[cNr][1] = tempOutput[1];
    } else {
      var tempOutput;
      tempOutput = genome1.activate([tdistStraight, tdistLeft, tdistRight]);
      tempOutput[0] = (tempOutput[0] - 0.5) * 2; //turn from -1 to 1
      tempOutput[1] = (tempOutput[1] + 0.24) * 0.83; // accelerate from ~0.2 to ~1
      NNoutput[cNr][0] = tempOutput[0];
      NNoutput[cNr][1] = tempOutput[1];
    }

    return NNoutput;
}






/** Construct the genetic algorithm */
function initNeat(){
  neat = new neataptic.Neat(
    3,
    2,
    null,
    {
      mutation: neataptic.methods.mutation.ALL,
      popsize: 10,
      mutationRate: 0.3,
      elitism: 3,
      network: new neataptic.architect.Random(3, 15, 2)
    }
  );

  for (var x=0; x<100; x++){
    neat.mutate();
  }

  if(USE_TRAINED_POP) neat.population = population;
}

/*function nextGenome(o){
  genomes[o] = neat.population[counter];
}*/

function nextGenome(){
  genome = neat.population[counter];
}

function nextGenome1(){
  genome1 = neat.population[counter];
}
  
function evolution(){
  console.log('Generation:', neat.generation);

  var newPopulation = [];
  var tempPop = []
  //sort pop
  /*for(var i = 0; i < neat.popsize; i++){
    tempPop[i] = neat.population[sorted[i]];
  }
  neat.population = tempPop;*/

  // Elitism
  for(var i = 0; i < neat.elitism; i++){
    newPopulation.push(neat.population[sorted[i]]);
  }

  // Breed the next individuals
  for(var i = 0; i < neat.popsize - neat.elitism; i++){
    newPopulation.push(neat.getOffspring());
  }

  // Replace the old population with the new population
  neat.population = newPopulation;
  neat.mutate();

  neat.generation++;
}

  