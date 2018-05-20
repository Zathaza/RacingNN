var myNetwork = neataptic.architect.Perceptron(3, 5, 2);

var USE_TRAINED_POP = 0;

function NNact() 
{
     // NNoutput[0]: turn, NNoutput[1]: accelerate
     myNetwork.mutate(neataptic.methods.mutation.MOD_WEIGHT);
    tdistStraight = distStraight/450;
    tdistLeft = distLeft/450;
    tdistRight = distRight/450;
    NNoutput = myNetwork.activate([tdistStraight, tdistLeft, tdistRight]);

    NNoutput[0] = (NNoutput[0] - 0.5) * 2; //turn

    return NNoutput;
}

function evolution(scores)
{
    
}







/** Construct the genetic algorithm */
function initNeat(){
    neat = new Neat(
      1 + PLAYER_DETECTION * 3 + FOOD_DETECTION * 2,
      2,
      null,
      {
        mutation: neataptic.methods.mutation.MOD_WEIGHT,
        popsize: 10,
        mutationRate: 1,
        elitism: 3,
        network: new neataptic.architect.Perceptron(3, 5, 2)
      }
    );
  
    if(USE_TRAINED_POP) neat.population = population;
  }
  
  /** Start the evaluation of the current generation */
  function startEvaluation(){
    players = [];
    highestScore = 0;
  
    for(var genome in neat.population){
      genome = neat.population[genome];
      new Player(genome);
    }
  }
  
  /** End the evaluation of the current generation */
  function endEvaluation(){
    console.log('Generation:', neat.generation, '- average score:', neat.getAverage());
  
    neat.sort();
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
    startEvaluation();
  }

  