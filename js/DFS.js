function existeCaminho(nodos, raiz)
{
  var visitados = [],
      listaVisitados = [],
      stack = [];

  for (var i in nodos)
  {
    visitados[nodos[i].relIdObj] = false;
  }

  nodoAtual = raiz;
  while (true)
  {
    if (false === visitados[nodoAtual.relIdObj])
    {
      visitados[nodoAtual.relIdObj] = true;
      listaVisitados.push(nodoAtual);
      stack.push(nodoAtual);
    }

    var proximoEscolhido = false;
    var adjacentes = nodoAtual.filhosObj;
    for (var p in nodoAtual.paisObj)
    {
      adjacentes.push(createChild(nodoAtual.paisObj[p].idVertice2, nodoAtual.paisObj[p].idVertice1, nodoAtual.paisObj[p].peso));
    }

    adjacentes.sort(function(a, b)
    {
        return a.idVertice2 > b.idVertice2;
    });

    for (var i in adjacentes)
    {
      for (var n in nodos)
      {
        if (nodos[n].relIdObj === adjacentes[i].idVertice2)
        {
          nodoAtual = nodos[n];
          break;
        }
      }

      if (false === visitados[nodoAtual.relIdObj])
      {
        proximoEscolhido = true;
        break;
      }
    }

    if (!proximoEscolhido)
    {
      stack.pop();
      if (stack.length === 0)
      {
        break;
      }

      nodoAtual = stack[stack.length - 1];
    }
  }

  if (listaVisitados.length !== nodos.length)
  {
    return false;
  }

  return true;
}
