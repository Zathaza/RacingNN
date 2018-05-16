var myNetwork = new Network(3, 5, 2);

function NN(distStraight, distLeft, distRight, counter) 
{
    var NNoutput = [0, 0]; // NNoutput[0]: turn, NNoutput[1]: accelerate
    
    NNoutput = myNetwork.activate([distStraight, distLeft, distRight]);

    return NNoutput;
}

function evolution(scores)
{

}