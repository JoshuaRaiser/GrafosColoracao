
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
             data: {id: nodos[i].relIdObj,
                    name: nodos[i].rotuloObj},
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
        maxArray.push((nodos[i].filhosObj.length + nodos[i].paisObj.length))
      }
      var caminho = BFS(nodos, maxArray.indexOf(Math.max.apply(Math,maxArray)));
      coloracao(nodos, caminho, cy);
  }

  function coloracao(nodos, caminho, cy) {
    var cores = [
                 "#009a93","#e0a4c7","#2958d6","#5e7beb","#f2d72c","#d4c767",
                 "#6f3062","#d60286","#5897d0","#6561ce","#f96f15","#e94432",
                 "#b5a40c","#fe0f09","#cd82f7","#f0bea3","#166509","#5a782f"
                ]
    for (var i = 0; i < nodos.length; i++) {
      if (!nodos[i].cor) {
        var existeCorVizinho = false;

        //Checa se os filhos possuem cor
        if (!existeCorVizinho) {
          for (var j = 0; j < nodos[i].filhosObj.length; j++) {
            var id = nodos[i].filhosObj[j].idVertice2;
            if (nodos[id].cor) {
              existeCorVizinho = true;
              break;
            }
          }
        }

        //Checa se os pais possuem cor
        if (!existeCorVizinho) {
          for (var j = 0; j < nodos[i].paisObj.length; j++) {
            var id = nodos[i].paisObj[j].idVertice1;
            if (nodos[id].cor) {
              existeCorVizinho = true;
              break;
            }
          }
        }

        if (!existeCorVizinho) {
          nodos[i].cor = cores[0];
          cy.style().selector('node[id = "' + nodos[i].relIdObj + '"]').style({
              'background-color' : cores[0],
              'label': nodos[i].rotuloObj
          }).update();
        }else{
          // Percorre o vetor de cores e verifica se os vizinhos possuem tal cor
          var j = 0;
          for (j = 0; j < cores.length; j++) {
            var corEspecificaVizinho = false;

            for (var h = 0; h < nodos[i].filhosObj.length; h++) {
              var id = nodos[i].filhosObj[h].idVertice2;
              if (nodos[id].cor == cores[j]) {
                corEspecificaVizinho = true;
                break;
              }
            }

            if (!corEspecificaVizinho) {
              for (var h = 0; h < nodos[i].paisObj.length; h++) {
                var id = nodos[i].paisObj[h].idVertice1;
                if (nodos[id].cor == cores[j]) {
                  corEspecificaVizinho = true;
                  break;
                }
              }
            }

            if (!corEspecificaVizinho) {
              break;
            }
          }
          nodos[i].cor = cores[j];
          cy.style().selector('node[id = "' + nodos[i].relIdObj + '"]').style({
              'background-color' : cores[j],
              'label': nodos[i].rotuloObj
          }).update();
        }
      }
    }


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
            nodos[$(this).attr('idVertice2')] = novoPai(nodos[$(this).attr('idVertice2')],
                                                      $(this).attr('idVertice1'),
                                                      $(this).attr('idVertice2'),
                                                      $(this).attr('peso'));
          };
        };
      };
    });

    return nodos;
  };


  function BFS(nodos, inicio){
      var fila = new Array();
      var resultado = [];
      try {
        nodos[inicio].visita = 2;
      } catch (e) {
        return "INÍCIO INEXISTENTE";
      };

      fila.push(nodos[inicio]);
      resultado.push(nodos[inicio].relIdObj);

          while (fila.length > 0) {
              nodo = fila[0];
              fila.shift();
              for (var i = 0; i < nodo.filhosObj.length; i++) {
                      vertice = nodo.filhosObj[i].idVertice2;
                  if (nodos[vertice].visita != 2) {
                      nodos[vertice].visita = 2;
                      fila.push(nodos[vertice]);
                      resultado.push(nodos[vertice].relIdObj);// = resultado + " - " +
                  }else if(fila.indexOf(nodos[vertice])){
                      nodos[vertice].visita = 2;
                      resultado.push(nodos[vertice].relIdObj);// = resultado + " - " + ;
                  };
              };
          };
      return resultado;
  };
