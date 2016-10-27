function novoNodo(relId, rotulo, posX, posY){
    var _relId  = relId,
        _rotulo = rotulo,
        _posX   = posX,
        _posY   = posY,
        _filhos = [];
        _pais   = [];

      var nodoObj = {
        relIdObj  : _relId,
        rotuloObj : _rotulo,
        posXObj   : _posX,
        posYObj   : _posY,
        filhosObj : _filhos,
        paisObj   : _pais,
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

function novoPai(nodoObj, vertice1, vertice2, pesoIn){
  var paisObj = {
      idVertice1 : vertice1,
      idVertice2 : vertice2,
      peso       : pesoIn
  };
  nodoObj.paisObj.push(paisObj)
  return nodoObj;
}
