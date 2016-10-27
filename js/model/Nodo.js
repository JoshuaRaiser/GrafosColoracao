function novoNodo(relId, rotulo, posX, posY){
    var _relId  = relId,
        _rotulo = rotulo,
        _posX   = posX,
        _posY   = posY,
        _filhos = [];

      var nodoObj = {
        relIdObj  : _relId,
        rotuloObj : _rotulo,
        posXObj   : _posX,
        posYObj   : _posY,
        filhosObj : _filhos,
        visita    : 0,
        cor       : ""
      };
      // visita
      // 0 - Não visitado
      // 1 - Em visitação
      // 2 - visitado

      return nodoObj;
    //};
  };

function novoFilho(nodoObj, vertice1, vertice2, pesoIn){
  var filhoObj = {
      idVertice1 : vertice1,
      idVertice2 : vertice2,
      peso       : pesoIn
  };
  nodoObj.filhosObj.push(filhoObj)
  return nodoObj;
};
