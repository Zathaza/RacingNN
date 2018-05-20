var USE_TRAINED_POP = 0;
var genome;
//var myNetwork = neataptic.architect.Perceptron(3, 5, 2);

function NNact() 
{
     // NNoutput[0]: turn, NNoutput[1]: accelerate
     //myNetwork.mutate(neataptic.methods.mutation.MOD_WEIGHT);
    tdistStraight = distStraight/450;
    tdistLeft = distLeft/450;
    tdistRight = distRight/450;
    NNoutput = genome.activate([tdistStraight, tdistLeft, tdistRight]);

    NNoutput[0] = (NNoutput[0] - 0.5) * 2; //turn

    return NNoutput;
}

function evolution(scores)
{
    
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
        network: new neataptic.architect.Perceptron(3, 5, 2)
      }
    );
  
    if(USE_TRAINED_POP) neat.population = population;
  }
  
  /** Start the evaluation of the current generation */
  function nextGenome(){
  
    genome = neat.population[counter];
  }
  
  /** End the evaluation of the current generation */
  function endEvaluation(){
    console.log('Generation:', neat.generation);

    var newPopulation = [];
  
    // Elitism
    for(var i = 0; i < neat.elitism; i++){
      newPopulation.push(neat.population[i]);
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

  