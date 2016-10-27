
  function arestaGraph(nodeIni, nodeFim, peso){
    var arestaGraph = {
          _nodeIni: nodeIni,
          _nodeFim: nodeFim,
          _peso: peso
        };
        return arestaGraph;
  };

  function nodeGraph(idNode, rotulo, posX, posY, aresta){
    var nodeGraph = {
          _idNode: idNode,
          _rotulo: rotulo,
          _posX: posX,
          _posY: posY,
          _aresta: aresta
        };
        return nodeGraph;
  };

  function init() {
      var cy = cytoscape({container: document.getElementById('cy')});

      var nodos = lerXML();
      var cores = [
                   "#009a93","#e0a4c7","#2958d6","#5e7beb","#f2d72c","#d4c767",
                   "#6f3062","#d60286","#5897d0","#6561ce","#f96f15","#e94432",
                   "#b5a40c","#fe0f09","#cd82f7","#f0bea3","#166509","#5a782f"
                  ]

      var maxArray = new Array();
      var nodoTelas = new Array();
      for (var i = 0; i < nodos.length; i++) {
          cy.add({
             group: "nodes",
             data: {id: nodos[i].relIdObj},
             renderedPosition: {x: nodos[i].posXObj, y: nodos[i].posYObj}
          });
      }
      for (var i = 0; i < nodos.length; i++) {
          for (var j = 0; j < nodos[i].filhosObj.length; j++) {
              cy.add({
                  group: "edges",
                  data : {id: Math.random(),
                      source: nodos[i].filhosObj[j].idVertice1,
                      target: nodos[i].filhosObj[j].idVertice2
                  }
              })
          }
      }
      for (var i = 0; i < nodos.length; i++) {
          maxArray.push(nodos[i].filhosObj.length);
      }

      poolprideparty(nodos, maxArray.indexOf(Math.max.apply(Math,maxArray)),cy);
  }

  function poolprideparty(nodos, inicial, cy) {
      console.log(nodos);
      console.log(cy.json())

      // cy.style() pra trocar a cor, no selector, coloca ('node[id = "idDoCara"]') pra acessar o nodo ou
      // ('edge[id = "idDaEdge"]') pra aresta
      var _nodos = BFS(0, nodos.length);
      cy.style().selector('node[id = "0"]').style({
          'background-color' : 'red',
      }).update();
  }

  function lerXML(){
    var xmlLido = $.parseXML($('#xmlInput').val());
    var $xml = $(xmlLido);
    var nodos = new Array();
    $xml.find('Grafo').children().children().each(function(){
      if ($(this).attr('relId')) {
        nodos.push(novoNodo($(this).attr('relId'),
                            $(this).attr('rotulo'),
                            $(this).attr('posX'),
                            $(this).attr('posY')));
      }else if($(this).attr('idVertice1')){
        for (var i = 0; i < nodos.length; i++) {
          if (nodos[i].relIdObj == $(this).attr('idVertice1')) {
            nodos[i] = novoFilho(nodos[i],
                                $(this).attr('idVertice1'),
                                $(this).attr('idVertice2'),
                                $(this).attr('peso'));
          };
        };
      };
    });

    return nodos;
  };
