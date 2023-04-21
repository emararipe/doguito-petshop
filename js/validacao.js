export function valida(input) {
  const tipoInput = input.dataset.tipo;

  if (validadores[tipoInput]) {
    validadores[tipoInput](input);
  }

  if (!input.validity.valid) {
    input.parentElement.classList.add("input-container--invalido")
  } else {
    input.parentElement.classList.remove("input-container--invalido")
  }
}

const validadores = {
  dataNascimento: input => validaNascimento(input), 
};

function validaNascimento(input) {
  if (!input) return false;
  const dataRecebida = new Date(input);
  let mensagem = "";

  if (!maiorDeIdade(dataRecebida)) {
    mensagem = "Você precisa ter mais de 18 anos para se cadastrar.";
  }

  maiorDeIdade(dataRecebida);

  input.setCustomValidity(mensagem);
}

function maiorDeIdade(data) {
  const dataHoje = new Date();
  const idadeMs = Math.abs(dataHoje.getTime() - data.getTime());
  const idade18AnosMs = 567648e6;
  return idadeMs >= idade18AnosMs; // que vai ser true ou false
}
