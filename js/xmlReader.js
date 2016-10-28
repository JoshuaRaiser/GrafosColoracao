
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

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

  function init() {
      var cy = cytoscape({
        container:  document.getElementById('cy'),
        style:      cytoscape.stylesheet()
                      .selector('edge').css({'width': 1})
                      .selector('edge:selected').css({'line-color': 'red', 'width': 3})
      });

      var nodos = lerXML();
      var cores = [];

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
      var caminhoString = '';
      for (var i = 0; i < caminho.length; i++) {
        caminhoString += nodos[caminho[i]].rotuloObj + ' -> '
      }

      qtdCores = coloracao(nodos, caminho, cy);
      var coresUsadas = [];

      for (var i = 0; i < nodos.length; i++) {
        coresUsadas.push(nodos[i].cor);
      }
      coresUsadas = coresUsadas.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
      })

      console.log(coresUsadas);
      if(conexo(nodos))
      {
        toastr.success('É conexo', 'Conectividade', {"showDuration": "300",
                                                    "hideDuration": "1000",
                                                    "timeOut": "0",
                                                    "extendedTimeOut": "0",
                                                    "positionClass": "toast-top-left"});

        toastr.warning(coresUsadas.length + ' cores !', 'Foram Utilizadas', {"showDuration": "300",
                                                                  "hideDuration": "1000",
                                                                  "timeOut": "0",
                                                                  "extendedTimeOut": "0",
                                                                  "positionClass": "toast-top-left"});
        $("#caminho").val(caminhoString);
        $("#divcaminho").show();
      }
      else
      {
        toastr.error('Não é conexo', 'Conectividade', {timeOut: 0, "positionClass": "toast-top-left"});
      }
  }

  // função de espera
  function sleep() {

  }

  // create a gay boy band
  function coloracao(nodos, caminho, cy) {
    /*var cores = [
                 "#009a93","#e0a4c7","#2958d6","#5e7beb","#f2d72c","#d4c767",
                 "#6f3062","#d60286","#5897d0","#6561ce","#f96f15","#e94432",
                 "#b5a40c","#fe0f09","#cd82f7","#f0bea3","#166509","#5a782f"
               ]*/
    var qtdCores = 0;
    var cores = [];
    for (var i = 0; i < 255; ++i)
    {
        var cor = getRandomColor();
        while (-1 !== cores.indexOf(cor))
        {
          cor = getRandomColor();

          
        }

        cores.push(cor);
    }

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
          qtdCores++;
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

          colore(nodos[i].relIdObj, cores[j], nodos[i].rotuloObj, nodos[i].posX, nodos[i].posY, cy);
          qtdCores++;
        }
      }
    }

    return qtdCores;
  }

  function colore(id, cor, label, x, y, cy){
    cy.style().selector('node[id = "' + id + '"]').style({
        'background-color' : cor,
        'label': label
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
      var fila = [];
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

  function conexo(nodos)
  {
    var isConexo = true;
    for (var i in nodos)
    {
      if (!existeCaminho(nodos, nodos[i]))
      {
        isConexo = false;
        break;
      }
    }

    return isConexo;
  }
