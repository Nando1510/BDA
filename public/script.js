const botao_Calcular = document.getElementById('calcular');

botao_Calcular.addEventListener('click', calcular_IMC);

function calcular_IMC(){

  const nome = document.getElementById('nome').value;
  const altura = parseFloat(document.getElementById('altura').value);
  const peso = parseFloat(document.getElementById('peso').value);


  if (!nome || Number.isNaN(altura) || Number.isNaN(peso)) {
    alert('Preencha todos os campos!');
    return;
  }


  if ( altura <= 0 || peso <= 0){
     document.getElementById('resultado').textContent = `IMC:Zero - IMC deve ser acima de zero!!! `;
     return;
  }


   const imc = peso / (altura * altura);
   let classificacao = '';

 
  
  if(imc > 0 && imc < 18.5) classificacao = 'Abaixo do peso';
  else if (imc < 25) classificacao = 'Normal';
  else if (imc < 30) classificacao = 'Sobrepeso';
  
  else classificacao = 'Obesidade';

  document.getElementById('resultado').textContent = `IMC: ${imc.toFixed(2)} - ${classificacao}`;

}

const botao_Salvar = document.getElementById('salvar');

botao_Salvar.addEventListener('click', salvar_Banco);

async function salvar_Banco() {

  

  const nome = document.getElementById('nome').value;
  const altura = parseFloat(document.getElementById('altura').value);
  const peso = parseFloat(document.getElementById('peso').value);
  const resultado = document.getElementById('resultado').textContent;

  if (!nome || Number.isNaN(altura) || Number.isNaN(peso)) {
    alert('Preencha todos os campos!');
    return;
  }


  if ( altura <= 0 || peso <= 0){
    document.getElementById('resultado').textContent = `IMC:Zero - IMC deve ser acima de zero!!! `;
    return;
  }




  

  

  try {
                          //Faz a requisição para rota salvar no servidor
    const resposta = await fetch('/salvar', {

      //Indica que eu estou enviando dados, não apenas buscando.
      method: 'POST',

      //Ei, o que eu estou te enviando aqui é JSON, beleza??
      headers: { 'Content-Type': 'application/json' },

      //Aqui estou convertento o objeto Javascript em texto JSON
      body: JSON.stringify({ nome, altura, peso, resultado })
    });

    //Faz  o código esperar resposta da requisição que eu fiz ao  do servidor
    const data = await resposta.json();


    //Servidor respondeu corretamente
    if (resposta.ok) {
      //Mostra para o usuário a mensagem enviada ao servidor
      alert(data.message);
      document.getElementById('nome').value = '';
      document.getElementById('altura').value = '';
      document.getElementById('peso').value = '';
      document.getElementById('resultado').textContent = '';

      //Servidor não respondeu
    } else {
      alert('Erro ao salvar: ' + data.message);
    }

    //Servidor fora do ar
  } catch (error) {
    alert('Erro na comunicação com o servidor.');
    console.error(error);
  }
 
}



  

  



